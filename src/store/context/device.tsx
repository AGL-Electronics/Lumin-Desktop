import {
    createContext,
    useContext,
    createMemo,
    type ParentComponent,
    Accessor,
    onMount,
    createEffect,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { useAppContext } from './app'
import type { Device, AppStoreDevice, PersistentDevice } from '@static/types'
import { DEVICE_MODIFY_EVENT, DEVICE_STATUS, DEVICE_TYPE } from '@static/enums'

interface IAppDeviceContext {
    getDeviceState: Accessor<AppStoreDevice>
    getSelectedDevice: Accessor<Device | undefined>
    getSelectedDeviceAddress: Accessor<string | undefined>
    getSelectedDeviceStatus: Accessor<DEVICE_STATUS | undefined>
    getSelectedDeviceType: Accessor<DEVICE_TYPE | undefined>
    getSelectedDeviceSocket: Accessor<object | undefined>
    setDevice: (device: Device, event: DEVICE_MODIFY_EVENT) => void
    setDeviceMDNS: (deviceID: string, address: string) => void
    setDeviceStatus: (deviceID: string, status: DEVICE_STATUS) => void
    setDeviceWS: (deviceID: string, ws: object) => void
    setSelectedDevice: (device: Device) => void
    setDeviceRSSI: (deviceID: string, rssi: number) => void
    resetSelectedDevice: () => void
}

const AppDeviceContext = createContext<IAppDeviceContext>()
export const AppDeviceProvider: ParentComponent = (props) => {
    const { handleDeviceChange, devices } = useAppContext()

    const defaultState: AppStoreDevice = {
        devices: [],
        selectedDevice: undefined,
    }

    const [deviceState, setState] = createStore<AppStoreDevice>(defaultState)

    const setDevice = (device: Device, event: DEVICE_MODIFY_EVENT) => {
        setState(
            produce((s) => {
                switch (event) {
                    case DEVICE_MODIFY_EVENT.PUSH: {
                        s.devices.push(device)
                        handleDeviceChange(s.devices)
                        return s
                    }
                    case DEVICE_MODIFY_EVENT.UPDATE: {
                        const _device = s.devices.find((dvc) => dvc.id === device.id)
                        if (!_device) return

                        // pop the device and push the updated device
                        const newItems = s.devices.filter((dvc) => dvc.id !== device.id)
                        newItems.push(device)
                        s.devices = newItems
                        handleDeviceChange(s.devices)
                        return s
                    }
                    case DEVICE_MODIFY_EVENT.DELETE: {
                        const newItems = s.devices.filter((dvc) => dvc.id !== device.id)
                        s.devices = newItems
                        handleDeviceChange(s.devices)
                        return s
                    }
                    default:
                }
            }),
        )
    }

    const setDeviceMDNS = (deviceID: string, mdns: string) => {
        setState(
            produce((s) => {
                const device = s.devices.find((dvc) => dvc.id === deviceID)
                if (!device) return
                s.devices.forEach((dvc) => {
                    if (dvc.id === deviceID) {
                        dvc.network.mdns = mdns
                        return dvc
                    }
                })

                console.debug(
                    'Updated device:',
                    s.devices.find((dvc) => dvc.id === deviceID),
                )
            }),
        )
    }

    const setDeviceStatus = (deviceID: string, status: DEVICE_STATUS) => {
        setState(
            produce((s) => {
                const device = s.devices.find((dvc) => dvc.id === deviceID)
                if (!device) return
                s.devices.forEach((dvc) => {
                    if (dvc.id === deviceID) {
                        dvc.status = status
                        return dvc
                    }
                })
                console.debug(
                    'Updated device:',
                    s.devices.find((dvc) => dvc.id === deviceID),
                )
            }),
        )
    }

    const setDeviceRSSI = (deviceID: string, rssi: number) => {
        setState(
            produce((s) => {
                const device = s.devices.find((dvc) => dvc.id === deviceID)
                if (!device) return
                s.devices.forEach((dvc) => {
                    if (dvc.id === deviceID) {
                        dvc.network.wifi.rssi = rssi
                        return dvc
                    }
                })
                console.debug(
                    'Updated device:',
                    s.devices.find((dvc) => dvc.id === deviceID),
                )
            }),
        )
    }

    const setDeviceWS = (deviceID: string, ws: object) => {
        setState(
            produce((s) => {
                const device = s.devices.find((dvc) => dvc.id === deviceID)
                if (!device) return
                s.devices.forEach((dvc) => {
                    if (dvc.id === deviceID) {
                        dvc.ws = ws
                        return dvc
                    }
                })
                console.debug(
                    'Updated device:',
                    s.devices.find((dvc) => dvc.id === deviceID),
                )
            }),
        )
    }

    const setSelectedDevice = (device: Device) => {
        setState(
            produce((s) => {
                s.selectedDevice = device
            }),
        )
    }

    const resetSelectedDevice = () => {
        setState(
            produce((s) => {
                s.selectedDevice = defaultState.selectedDevice
            }),
        )
    }

    const getDeviceState = createMemo(() => deviceState)
    const getSelectedDevice = createMemo(() => getDeviceState().selectedDevice)
    const getSelectedDeviceAddress = createMemo(
        () => getDeviceState().selectedDevice?.network.address,
    )
    const getSelectedDeviceStatus = createMemo(() => getDeviceState().selectedDevice?.status)
    const getSelectedDeviceType = createMemo(() => getDeviceState().selectedDevice?.type)
    const getSelectedDeviceSocket = createMemo(() => getDeviceState().selectedDevice?.ws)

    const _handleDeviceChange = (updatedDevices: PersistentDevice[]) => {
        const devices: Device[] = updatedDevices.map((device) => {
            const _device: Device = {
                id: device.id,
                name: device.name,
                type: device.type,
                serialNumber: device.serialNumber,
                status: DEVICE_STATUS.LOADING,
                lastUpdate: Date.now(),
                network: {
                    lanCode: device.network.lanCode,
                    mdns: device.network.mdns,
                    address: device.network.address,
                    wifi: {
                        ssid: device.network.wifi.ssid,
                        password: device.network.wifi.password,
                        apModeStatus: false,
                        rssi: -95,
                    },
                },
                led: device.led,
                hasCamera: device.hasCamera,
                ws: device.ws ? device.ws : undefined,
            }
            return _device
        })

        // compare the equality of the devices to the getDeviceState().devices
        const _devices = getDeviceState().devices
        if (_devices.length === devices.length) {
            for (let i = 0; i < _devices.length; i++) {
                if (_devices[i].id !== devices[i].id) {
                    setDevice(devices[i], DEVICE_MODIFY_EVENT.UPDATE)
                }
            }
        } else {
            setDevice(devices[devices.length - 1], DEVICE_MODIFY_EVENT.PUSH)
        }
    }

    onMount(() => {
        /*  doGHRequest()
        useMDNSScanner('_lumin._tcp', 5).then(() => {
            // TODO: handle devices found
        }) */
    })

    createEffect(() => {
        if (devices()) {
            _handleDeviceChange(devices())
        }
    })

    return (
        <AppDeviceContext.Provider
            value={{
                getDeviceState,
                getSelectedDevice,
                getSelectedDeviceAddress,
                getSelectedDeviceStatus,
                getSelectedDeviceType,
                getSelectedDeviceSocket,
                setDevice,
                setDeviceMDNS,
                setDeviceStatus,
                setDeviceWS,
                setSelectedDevice,
                setDeviceRSSI,
                resetSelectedDevice,
            }}>
            {props.children}
        </AppDeviceContext.Provider>
    )
}

export const useAppDeviceContext = () => {
    const context = useContext(AppDeviceContext)
    if (context === undefined) {
        throw new Error('useAppDeviceContext must be used within an AppDeviceProvider')
    }
    return context
}
