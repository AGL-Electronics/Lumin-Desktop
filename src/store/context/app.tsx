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
import type { AppStore, DebugMode, Device, PersistentSettings } from '@static/types'
import { ENotificationAction } from '@static/enums'
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
        debugMode: 'off',
        enableMDNS: false,
        scanForDevicesOnStartup: false,
        devices: [],
    }

    const [state, setState] = createStore<AppStore>(defaultState)

    const setDebugMode = (mode: DebugMode | undefined) => {
        setState(
            produce((s) => {
                s.debugMode = mode || 'info'
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
            if (settings) {
                debug('loading settings')
                const activeUserName =
                    typeof settings.user === 'string' ? settings.user : 'stranger'

                //setConnectedUser(activeUserName)
                setEnableNotifications(settings.enableNotifications)
                setEnableNotificationsSounds(settings.enableNotificationsSounds)
                setGlobalNotificationsType(
                    settings.globalNotificationsType ?? ENotificationAction.APP,
                )

                setEnableMDNS(settings.enableMDNS)
                setDebugMode(settings.debugMode)
                setScanForDeviceOnStartup(settings.scanForDevicesOnStartup)
            }
        })
        checkPermission()
    })

    const createSettingsObject = () => {
        const settings: PersistentSettings = {
            //user: connectedUserName(),
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
        get('settings').then((storedSettings) => {
            /* if (!isEqual(storedSettings, createSettingsObject())) {
                debug(`[Routes]: Saving Settings - ${JSON.stringify(createSettingsObject())}`)
                set('settings', createSettingsObject())
            } */
        })
    }

    createEffect(() => {
        const { resume, pause } = useInterval(30000, {
            controls: true,
            callback: handleSaveSettings,
        })

        useEventListener(window, 'blur', () => {
            pause()
            debug(`[Routes]: Saving Settings - ${JSON.stringify(createSettingsObject())}`)
            set('settings', createSettingsObject())
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
