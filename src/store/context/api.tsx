import { removeFile, readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'
import { getClient, ResponseType } from '@tauri-apps/api/http'
import { appConfigDir, join } from '@tauri-apps/api/path'
import { invoke, convertFileSrc } from '@tauri-apps/api/tauri'
import { createContext, useContext, createMemo, Accessor, type ParentComponent } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { debug, error, trace, warn } from 'tauri-plugin-log-api'
import { download, upload } from 'tauri-plugin-upload-api'
import { useAppDeviceContext } from './device'
import { useAppNotificationsContext } from './notifications'
import { isEmpty } from '@src/lib/utils'
import { ENotificationType, RESTStatus, RESTType, ESPEndpoints } from '@static/enums'
import {
    AppStoreAPI,
    IEndpoint,
    IEndpointKey,
    IGHAsset,
    IGHRelease,
    IPOSTCommand,
    IRest,
} from '@static/types'
import { makeRequest } from 'tauri-plugin-request-client'

//type __Result__<T, E> = { status: 'ok'; data: T } | { status: 'error'; error: E }

interface IAppAPIContext {
    //********************************* gh rest *************************************/
    getGHRestStatus: Accessor<RESTStatus>
    getFirmware: Accessor<{
        assets: IGHAsset[]
        type: string
        version: string
    }>
    getGHEndpoint: Accessor<string>
    setGHRestStatus: (status: RESTStatus) => void
    setFirmware: (assets?: IGHAsset[], version?: string, type?: string) => void
    //********************************* endpoints *************************************/
    getEndpoints: Accessor<Map<IEndpointKey, IEndpoint>>
    getEndpoint: (key: IEndpointKey) => IEndpoint | undefined
    //********************************* hooks *************************************/
    downloadAsset: (firmware: string) => Promise<void>
    doGHRequest: () => Promise<void>
    useRequestHook: (
        endpointName: IEndpointKey,
        deviceID?: string,
        args?: string,
        body?: IPOSTCommand,
    ) => Promise<IRest>
    useOTA: (firmwareName: string, device: string) => Promise<void>
}

const AppAPIContext = createContext<IAppAPIContext>()
export const AppAPIProvider: ParentComponent = (props) => {
    const { addNotification } = useAppNotificationsContext()
    const { getDeviceState } = useAppDeviceContext()

    // TODO: change to firmware release repo
    const ghEndpoint = 'https://api.github.com/repos/Lumin/OpenIris/releases/latest'

    // TODO: Use backend api schema to generate endpoints map and use that instead of hardcoding the endpoints
    const endpointsMap: Map<IEndpointKey, IEndpoint> = new Map<IEndpointKey, IEndpoint>([
        //* ESP Specific Endpoints */
        ['ota', { url: `:81${ESPEndpoints.OTA}`, type: RESTType.POST }],
        ['ping', { url: `:81${ESPEndpoints.PING}`, type: RESTType.GET }],
        ['save', { url: `:81${ESPEndpoints.SAVE}`, type: RESTType.GET }],
        ['wifi', { url: `:81${ESPEndpoints.WIFI}`, type: RESTType.POST }],
        ['setDevice', { url: `:81${ESPEndpoints.SET_DEVICE}`, type: RESTType.POST }],
        ['setTxPower', { url: `:81${ESPEndpoints.SET_TX_POWER}`, type: RESTType.POST }],
        ['resetConfig', { url: `:81${ESPEndpoints.RESET_CONFIG}`, type: RESTType.GET }],
        ['rebootDevice', { url: `:81${ESPEndpoints.REBOOT_DEVICE}`, type: RESTType.GET }],
        ['wifiStrength', { url: `:81${ESPEndpoints.WIFI_STRENGTH}`, type: RESTType.POST }],
        ['restartCamera', { url: `:81${ESPEndpoints.RESTART_CAMERA}`, type: RESTType.GET }],
        ['getStoredConfig', { url: `:81${ESPEndpoints.GET_STORED_CONFIG}`, type: RESTType.GET }],
        ['jsonHandler', { url: `:81${ESPEndpoints.JSON_HANDLER}`, type: RESTType.POST }],
    ])

    const defaultState: AppStoreAPI = {
        ghAPI: {
            status: RESTStatus.COMPLETE,
            firmware: {
                assets: [],
                version: '',
                type: '',
            },
        },
    }

    const [state, setState] = createStore<AppStoreAPI>(defaultState)
    const apiState = createMemo(() => state)

    /********************************* gh rest *************************************/
    //#region gh rest
    const setGHRestStatus = (status: RESTStatus) => {
        setState(
            produce((s) => {
                s.ghAPI.status = status
            }),
        )
    }
    const setFirmware = (assets?: IGHAsset[], version?: string, type?: string) => {
        setState(
            produce((s) => {
                s.ghAPI.firmware = {
                    assets: assets ? [...assets] : s.ghAPI.firmware.assets,
                    version: version ? version : s.ghAPI.firmware.version,
                    type: type ? type : s.ghAPI.firmware.type,
                }
            }),
        )
    }

    const getGHRestStatus = createMemo(() => apiState().ghAPI.status)
    const getFirmware = createMemo(() => apiState().ghAPI.firmware)
    const getGHEndpoint = createMemo(() => ghEndpoint)
    //#endregion
    /********************************* rest *************************************/
    //#region rest
    const getEndpoints = createMemo(() => endpointsMap)
    const getEndpoint = (key: IEndpointKey) => endpointsMap.get(key)
    //#endregion

    //#region hooks
    const getRelease = async (firmware: string) => {
        const appConfigDirPath = await appConfigDir()
        if (isEmpty(firmware)) {
            addNotification({
                title: 'Please Select a Firmware',
                message: 'A firmware must be selected before downloading',
                type: ENotificationType.WARNING,
            })
            debug('[Github Release]: No firmware selected')
            return
        }

        debug(`[Github Release]: App Config Dir: ${appConfigDirPath}`)

        // check if the firmware chosen matches the one names in the firmwareAssets array of objects
        const firmwareAsset = getFirmware().assets.find((asset) => asset.name === firmware)

        debug(`[Github Release]: Firmware Asset: ${firmwareAsset}`)

        if (!firmwareAsset) return

        debug(`[Github Release]: Downloading firmware: ${firmware}`)
        debug(`[Github Release]: Firmware URL: ${firmwareAsset}`)

        // parse out the file name from the firmwareAsset.url and append it to the appConfigDirPath
        const fileName =
            firmwareAsset.browser_download_url.split('/')[
                firmwareAsset.browser_download_url.split('/').length - 1
            ]
        //debug('[Github Release]: File Name: ', fileName)
        // ${appConfigDirPath}${fileName}
        const path = await join(appConfigDirPath, fileName)
        debug(`[Github Release]: Path: ${path}`)
        // get the latest release
        const response = await download(
            firmwareAsset.browser_download_url,
            path,
            (progress, total) => {
                debug(`[Github Release]: Downloaded ${progress} of ${total} bytes`)
            },
        )
        debug(`[Github Release]: Download Response: ${response}`)

        addNotification({
            title: 'Lumin Firmware Downloaded',
            message: `Downloaded Firmware ${firmware}`,
            type: ENotificationType.INFO,
        })

        const res = await invoke('unzip_archive', {
            archivePath: path,
            targetDir: appConfigDirPath,
        })
        await removeFile(path)

        debug(`[Github Release]: Unzip Response: ${res}`)

        const manifest = await readTextFile('manifest.json', { dir: BaseDirectory.AppConfig })

        const config_json = JSON.parse(manifest)

        if (isEmpty(manifest)) {
            error('[Manifest Error]: Manifest does not exist')
            addNotification({
                title: 'Error',
                message: 'Firmware Manifest does not exist',
                type: ENotificationType.ERROR,
            })
            return
        }
        // modify the version property
        config_json['version'] = getFirmware().version
        // loop through the builds array and the parts array and update the path property
        for (let i = 0; i < config_json['builds'].length; i++) {
            for (let j = 0; j < config_json['builds'][i]['parts'].length; j++) {
                const firmwarePath = await join(
                    appConfigDirPath,
                    config_json['builds'][i]['parts'][j]['path'],
                )
                debug(`[Github Release]: Firmware Path: ${firmwarePath}`)
                const firmwareSrc = convertFileSrc(firmwarePath)
                debug(`[Github Release]: Firmware Src: ${firmwareSrc}`)
                config_json['builds'][i]['parts'][j]['path'] = firmwareSrc
            }
        }

        // write the config file
        writeTextFile('manifest.json', JSON.stringify(config_json), {
            dir: BaseDirectory.AppConfig,
        })
            .then(() => {
                debug('[Manifest Updated]: Manifest Updated Successfully')
            })
            .finally(() => {
                debug('[Manifest Updated]: Finished')
            })
            .catch((err) => {
                error(`[Manifest Update Error]: ${err}`)
            })

        debug('[Github Release]: Manifest: ', config_json)
    }

    /**
     * @description A hook that will return the data from the github release endpoint and a function that will download the asset from the github release endpoint
     * @returns  {Promise<void>} data - The data returned from the github release endpoint
     * @returns  {function} downloadAsset - The function that will download the asset from the github release endpoint
     */
    const downloadAsset = async (firmware: string): Promise<void> => {
        const response = await getRelease(firmware)
        debug(`[Github Release]: Download Response: ${response}`)
    }

    // TODO: Implement a way to read if the merged-firmware.bin file and manifest.json file exists in the app config directory and if it does, then use that instead of downloading the firmware from github
    // Note: If both files are present, we should early return and set a UI store value that will be used to display a message to the user that they can use the firmware that is already downloaded and show an optional button to erase the firmware

    //TODO: Add notifications to all the debug statements

    const setGHData = (data: IGHRelease, update: boolean) => {
        if (data['name'] === undefined) {
            setFirmware(undefined, data['version'], undefined)
        } else {
            setFirmware(undefined, data['name'], undefined)
        }
        debug(JSON.stringify(data))
        const assets: Array<{
            browser_download_url: string
            name: string
        }> = data['assets']
        const download_urls = assets.map(
            (asset: { browser_download_url: string }) => asset.browser_download_url,
        )

        const firmware_assets = assets.map((asset: { name: string }) => asset.name)

        // split the firmware_assets array of strings on the first dash and return the first element of the array
        const boardName = firmware_assets.map((asset: string) => asset.split('-')[0])

        // set the board name in the store
        const assetsBuffer: IGHAsset[] = []
        for (let i = 0; i < boardName.length; i++) {
            debug(`[Github Release]: Board Name: ', ${boardName[i]}`)
            debug(`[Github Release]: URLs:, ${download_urls[i]}`)
            assetsBuffer.push({ name: boardName[i], browser_download_url: download_urls[i] })
        }

        setFirmware(assetsBuffer)

        if (update) {
            writeTextFile(
                'config.json',
                JSON.stringify({
                    version: getFirmware().version,
                    assets: getFirmware().assets,
                }),
                {
                    dir: BaseDirectory.AppConfig,
                },
            )
                .then(() => {
                    debug(
                        update
                            ? '[Config Updated]: Config Updated Successfully'
                            : '[Config Created]: Config Created Successfully',
                    )
                })
                .catch((err) => {
                    error('[Config Creation Error]:', err)
                })
        }
    }

    /**
     * @description Invoke the do_gh_request command
     * @function doGHRequest
     * @async
     * @export
     * @note This function will call the github repo REST API release endpoint and update/create a config.json file with the latest release data
     * @note This function will write the file to the app config directory C:\Users\<User>\AppData\Roaming\com.Lumin.dev\config.json
     * @note Should be called on app start
     * @example
     * import { doGHRequest } from './github'
     * doGHRequest()
     * .then(() => debug('Request sent'))
     * .catch((err) => error(err))
     */
    const doGHRequest = async () => {
        try {
            const client = await getClient()

            setGHRestStatus(RESTStatus.ACTIVE)
            setGHRestStatus(RESTStatus.LOADING)

            debug(`[Github Release]: Github Endpoint ${getGHEndpoint()}`)

            try {
                const response = await client.get<IGHRelease>(getGHEndpoint(), {
                    timeout: 30,
                    // the expected response type
                    headers: {
                        'User-Agent': 'Lumin',
                    },
                    responseType: ResponseType.JSON,
                })

                trace(`[Github Response]: ${JSON.stringify(response)}`)

                if (!response.ok) {
                    debug('[Github Release Error]: Cannot Access Github API Endpoint')
                    return
                }
                debug(`[OpenIris Version]: ${response.data['name']}`)

                try {
                    const config = await readTextFile('config.json', {
                        dir: BaseDirectory.AppConfig,
                    })
                    const config_json = JSON.parse(config)
                    trace(`[Config]: ${JSON.stringify(config_json)}`)
                    if ((!response.ok || !(response instanceof Object)) && config === '') {
                        warn('[Config Exists]: Most likely rate limited')
                        setGHData(config_json, false)
                        setGHRestStatus(RESTStatus.COMPLETE)
                        return
                    }
                    if (response.data['name'] === config_json.version) {
                        debug('[Config Exists]: Config Exists and is up to date')
                        setGHData(response.data, false)
                        return
                    }

                    // update config
                    setGHData(response.data, true)
                    debug('[Config Exists]: Config Exists and is out of date - Updating')
                    setGHRestStatus(RESTStatus.COMPLETE)
                    return
                } catch (err) {
                    setGHRestStatus(RESTStatus.NO_CONFIG)
                    if (response.ok) {
                        error(`[Config Read Error]: ${err} Creating config.json`)
                        setGHData(response.data, true)
                        setGHRestStatus(RESTStatus.COMPLETE)
                    }
                }
            } catch (err) {
                setGHRestStatus(RESTStatus.FAILED)
                error(`[Github Release Error]: ${err}`)
                const config = await readTextFile('config.json', {
                    dir: BaseDirectory.AppConfig,
                })
                if (!config) {
                    setGHRestStatus(RESTStatus.NO_CONFIG)
                    error(`[Config Read Error]: Config does not exist ${err}`)
                }
                const config_json = JSON.parse(config)
                debug(`[OpenIris Version]: ${config_json.version}`)
                trace(`[Config.JSON Contents]:${config_json}`)
                if (config !== '') {
                    debug('[Config Exists]: Config Exists and is up to date')
                    setGHData(config_json, false)
                    return
                }
                setGHRestStatus(RESTStatus.NO_CONFIG)
                // check if the error is a rate limit error
                /* if (err instanceof Object) {
                            if (err.response instanceof Object) {
                                if (err.response.status === 403) {
                                    // rate limit error
                                    // check if the rate limit reset time is in the future
                                    // if it is, set the rate limit reset time
                                    // if it isn't, set the rate limit reset time to 0
                                    const rate_limit_reset = err.response.headers['x-ratelimit-reset']
                                    const rate_limit_reset_time = new Date(rate_limit_reset * 1000)
                                    const now = new Date()
                                    if (rate_limit_reset_time > now) {
                                        setRateLimitReset(rate_limit_reset_time)
                                        return
                                    }
                                    setRateLimitReset(new Date(0))
                                }
                            }
                        } */
            }
        } catch (err) {
            setGHRestStatus(RESTStatus.FAILED)
            error(`[Tauri Runtime Error - http client]: ${err}`)
            return
        }
    }

    const useRequestHook = async (
        endpointName: IEndpointKey,
        deviceID?: string,
        args?: string,
        body?: IPOSTCommand,
    ): Promise<IRest> => {
        const method: RESTType = getEndpoint(endpointName)!.type
        const devices = getDeviceState().devices
        const deviceExists = devices.find((d) => d.id === deviceID)
        let endpoint: string = getEndpoint(endpointName)!.url
        let deviceURL: string = ''
        let jsonBody: string = ''

        console.debug(
            '[RequestHook]: Device: ',
            deviceExists,
            ' Endpoint: ',
            endpoint,
            ' Method: ',
            method,
        )

        if (body) {
            jsonBody = JSON.stringify(body)
            console.debug('[RequestHook]: JSON Body: ', jsonBody)
        }

        if (deviceExists && typeof deviceExists?.network.address != 'undefined') {
            deviceURL = 'http://' + deviceExists?.network.address
        } else {
            deviceURL = 'http://localhost'
        }

        console.debug('[RequestHook]: Device URL: ', deviceURL + endpoint)

        if (!deviceExists || !deviceURL || deviceURL.length === 0) {
            throw new Error(`No Device found at that address ${deviceURL}`)
        }

        if (deviceExists.network.wifi.apModeStatus) {
            addNotification({
                title: 'REST Request',
                message: `Sending request to ${deviceExists.name} at ${deviceURL + endpoint}`,
                type: ENotificationType.INFO,
            })
        }

        if (args) {
            endpoint += args
        }

        let restStatus: RESTStatus = RESTStatus.LOADING
        try {
            console.log(
                `Handling request for device ${deviceExists.name} at ${new Date().toISOString()}`,
            )

            const response = await makeRequest(endpoint, deviceURL, method, jsonBody)
            console.debug('[REST Response]: ', response)

            if (response.status === 'error') {
                console.debug('[REST Request]: ', response.error)
                throw new Error(`${deviceExists.name} is not reachable. ${response.error}`)
            }

            console.debug('[REST Request]: ', response)

            restStatus = RESTStatus.COMPLETE
            const data = JSON.parse(response.data)

            return {
                status: restStatus,
                response: data,
            }
        } catch (err) {
            restStatus = RESTStatus.FAILED

            error(`[REST Request]: ${err}`)
            addNotification({
                title: 'REST Request Error',
                message: `${deviceExists.name} is not reachable.`,
                type: ENotificationType.ERROR,
            })

            return {
                status: restStatus,
                response: { error: err },
            }
        }
    }

    /**
     * @description Uploads a firmware to a device
     * @param firmwareName The name of the firmware file
     * @param device The device to upload the firmware to
     *
     */
    const useOTA = async (firmwareName: string, deviceID: string) => {
        try {
            const res = await useRequestHook('ping', deviceID)

            const devices = getDeviceState().devices
            const device = devices.find((d) => d.id === deviceID)
            const endpoint: string = getEndpoint('ota')!.url

            if (!device) {
                throw new Error('No device found that matches the device ID')
            }

            if (res.status === RESTStatus.FAILED) {
                throw new Error('No response from device')
            }

            const firmwarePath = await join(await appConfigDir(), firmwareName + '.bin')

            const deviceURL = 'http://' + device.network.address + endpoint

            await upload(deviceURL, firmwarePath)
        } catch (err) {
            error(`[OTA Error]: ${err}`)
            addNotification({
                title: 'OTA Upload Error',
                message: `Failed to upload firmware ${err}`,
                type: ENotificationType.ERROR,
            })
        }
    }
    //#endregion

    //#region API Provider
    return (
        <AppAPIContext.Provider
            value={{
                getGHRestStatus,
                getFirmware,
                getGHEndpoint,
                getEndpoints,
                getEndpoint,
                setGHRestStatus,
                setFirmware,
                downloadAsset,
                doGHRequest,
                useRequestHook,
                useOTA,
            }}>
            {props.children}
        </AppAPIContext.Provider>
    )
    //#endregion
}

export const useAppAPIContext = () => {
    const context = useContext(AppAPIContext)
    if (context === undefined) {
        throw new Error(
            'useAppAPIContext must be used within an AppAPIProvider. Make sure the component is wrapped in the provider component to access the context',
        )
    }
    return context
}
