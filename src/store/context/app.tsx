import { isEqual } from 'lodash'
import {
    createContext,
    useContext,
    createMemo,
    type ParentComponent,
    type Accessor,
    onMount,
    createEffect,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import type { AppStore, Device, PersistentSettings } from '@static/types'
import { DebugMode, ENotificationAction, ENotificationType } from '@static/enums'
import { useAppNotificationsContext } from '@store/context/notifications'
import { AppUIProvider } from '@store/context/ui'
import { usePersistentStore } from '@store/tauriStore'

interface AppContext {
    appState: Accessor<AppStore>
    setDebugMode: (mode: DebugMode | undefined) => void
    setEnableMDNS: (enable: boolean) => void
    setScanForDeviceOnStartup: (enable: boolean) => void
    setDevices: (devices: Device[]) => void
}

const AppContext = createContext<AppContext>()
export const AppProvider: ParentComponent = (props) => {
    //#region Store
    const defaultState: AppStore = {
        debugMode: DebugMode.OFF,
        enableMDNS: false,
        scanForDevicesOnStartup: false,
        devices: [],
    }

    const [state, setState] = createStore<AppStore>(defaultState)

    const setDebugMode = (mode: DebugMode | undefined) => {
        setState(
            produce((s) => {
                s.debugMode = mode || DebugMode.INFO
            }),
        )
    }

    const setDevices = (devices: Device[]) => {
        setState(
            produce((s) => {
                s.devices = devices
            }),
        )
    }

    const setEnableMDNS = (enable: boolean) => {
        setState(
            produce((s) => {
                s.enableMDNS = enable
            }),
        )
    }

    const setScanForDeviceOnStartup = (enable: boolean) => {
        setState(
            produce((s) => {
                s.scanForDevicesOnStartup = enable
            }),
        )
    }

    const appState = createMemo(() => state)
    //#endregion

    //#region App Boot
    const { get, set } = usePersistentStore()

    const {
        setEnableNotifications,
        setEnableNotificationsSounds,
        setGlobalNotificationsType,
        getEnableNotificationsSounds,
        getEnableNotifications,
        getGlobalNotificationsType,
        checkPermission,
        addNotification,
    } = useAppNotificationsContext()

    onMount(() => {
        // load the app settings from the persistent store and assign to the global state
        get('settings').then((settings) => {
            if (!settings) {
                debug('No settings file found')
                return
            }

            console.debug('Loading Settings Config File from Disk:', settings)
            debug(`Loading Settings Config File from Disk: ${JSON.stringify(settings)}`)

            setEnableNotifications(settings.enableNotifications)
            setEnableNotificationsSounds(settings.enableNotificationsSounds)
            setGlobalNotificationsType(settings.globalNotificationsType ?? ENotificationAction.APP)

            setEnableMDNS(settings.enableMDNS)
            setDebugMode(settings.debugMode)
            setScanForDeviceOnStartup(settings.scanForDevicesOnStartup)
            if (settings.devices.length === 0) {
                debug('No devices found in settings file')

                addNotification({
                    title: 'No Devices Found',
                    message: 'No devices were found in the settings file',
                    type: ENotificationType.INFO,
                })
            }
            setDevices(settings.devices)
        })
        checkPermission()
    })

    const createSettingsObject = () => {
        const settings: PersistentSettings = {
            enableNotifications: getEnableNotifications(),
            enableNotificationsSounds: getEnableNotificationsSounds(),
            globalNotificationsType: getGlobalNotificationsType(),
            enableMDNS: appState().enableMDNS,
            debugMode: appState().debugMode,
            scanForDevicesOnStartup: appState().scanForDevicesOnStartup,
            devices: appState().devices,
        }
        return settings
    }

    const handleSaveSettings = async () => {
        // check if the settings have changed and save to the store if they have
        const storedSettings = await get('settings')
        if (!isEqual(storedSettings, createSettingsObject())) {
            debug(`[Routes]: Saving Settings - ${JSON.stringify(createSettingsObject())}`)
            addNotification({
                title: 'Settings Saved',
                message: 'Settings have been saved successfully',
                type: ENotificationType.INFO,
            })
            await set('settings', createSettingsObject())
        }
    }

    createEffect(() => {
        const { resume, pause } = useInterval(30000, {
            controls: true,
            callback: handleSaveSettings,
        })

        useEventListener(window, 'blur', () => {
            pause()
            debug(`[Routes]: Saving Settings - ${JSON.stringify(createSettingsObject())}`)
            handleSaveSettings()
            resume()
        })
    })

    //#endregion

    return (
        <AppContext.Provider
            value={{
                appState,
                setDebugMode,
                setEnableMDNS,
                setDevices,
                setScanForDeviceOnStartup,
            }}>
            <AppUIProvider>{props.children}</AppUIProvider>
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useAppContext must be used within a AppProvider')
    }
    return context
}
