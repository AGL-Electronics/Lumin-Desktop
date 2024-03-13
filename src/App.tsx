import { useLocation, useNavigate } from '@solidjs/router'
import { appWindow } from '@tauri-apps/api/window'
import { ParentComponent, createEffect, createSignal, lazy, onMount /* , Show */ } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { useEventListener, useInterval } from 'solidjs-use'
import { debug } from 'tauri-plugin-log-api'
import Header from '@components/Header'
import { Titlebar } from '@components/Titlebar'
import { ENotificationAction, TITLEBAR_ACTION } from '@static/enums'
import { PersistentSettings } from '@static/types'
import { useAppContext } from '@store/context/app'
import { useAppContextMain } from '@store/context/main'
import { useAppNotificationsContext } from '@store/context/notifications'
import { useAppUIContext } from '@store/context/ui'
import { usePersistentStore } from '@store/tauriStore'

const ToastNotificationWindow = lazy(() => import('@components/Notifications'))

const App: ParentComponent = (props) => {
    const { handleTitlebar, handleAppBoot } = useAppContextMain()
    const navigate = useNavigate()

    onMount(() => {
        handleTitlebar(true)
        handleAppBoot()
    })

    const [userIsInSettings, setUserIsInSettings] = createSignal(false)
    const params = useLocation()
    const { get, set } = usePersistentStore()
    /* const { doGHRequest } = useAppAPIContext()
    const { useMDNSScanner } = useAppMDNSContext() */
    /* const { setDeviceWS, setDeviceStatus, getDevice } = useAppDeviceContext() */

    /* const {
        setEnableMDNS,
        setDebugMode,
        setScanForDeviceOnStartup,
        getEnableMDNS,
        getScanForDeviceOnStartup,
        getDebugMode,
    } = useAppContext() */
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
    /* const { connectedUserName, setConnectedUser } = useAppUIContext() */

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

                /* setEnableMDNS(settings.enableMDNS)
                setDebugMode(settings.debugMode)
                setScanForDeviceOnStartup(settings.scanForDeviceOnStartup) */
            }
        })
        checkPermission()
        /* doGHRequest()
        useMDNSScanner('_lumin._tcp', 5).then(() => {
            // TODO: handle devices found
        }) */
    })

    const createSettingsObject = () => {
        const settings: PersistentSettings = {
            //user: connectedUserName(),
            enableNotifications: getEnableNotifications(),
            enableNotificationsSounds: getEnableNotificationsSounds(),
            globalNotificationsType: getGlobalNotificationsType(),
            /*  enableMDNS: getEnableMDNS(),
            debugMode: getDebugMode(), 
            scanForDevicesOnStartup: getScanForDeviceOnStartup(),*/
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

    createEffect(() => {
        setUserIsInSettings(params.pathname.match('settings') !== null)
    })

    return (
        <div class="main-div">
            <Titlebar
                onPointerDownHeader={(action) => {
                    switch (action) {
                        case TITLEBAR_ACTION.MINIMIZE:
                            appWindow.minimize()
                            return
                        case TITLEBAR_ACTION.MAXIMIZE:
                            appWindow.toggleMaximize()
                            return
                        case TITLEBAR_ACTION.CLOSE:
                            appWindow.close()
                            return
                    }
                }}
            />

            <div id="header-wrapper" class="header-wrapper overflow-hidden">
                <Header
                    hideButtons={userIsInSettings()}
                    name="" /* {connectedUserName() ? `Welcome ${connectedUserName()}` : 'Welcome!'} */
                    onPointerDown={() => navigate('/')}
                />
            </div>
            <main class="w-full overflow-y-auto">
                <Transition
                    mode="outin"
                    onBeforeEnter={(el) => {
                        if (el instanceof HTMLElement) el.style.opacity = '0'
                    }}
                    onEnter={(el, done) => {
                        el.animate(
                            [
                                { opacity: 0, transform: 'translate(100px)' },
                                { opacity: 1, transform: 'translate(0)' },
                            ],
                            { duration: 600, fill: 'both' },
                        )
                            .finished.then(done)
                            .catch(done)
                    }}
                    onExit={(el, done) => {
                        el.animate(
                            [
                                { opacity: 1, transform: 'translate(0)' },
                                { opacity: 0, transform: 'translate(-100px)' },
                            ],
                            { duration: 600 },
                        )
                            .finished.then(done)
                            .catch(done)
                    }}>
                    {props.children}
                </Transition>
                <ToastNotificationWindow />
            </main>
        </div>
    )
}

export default App
