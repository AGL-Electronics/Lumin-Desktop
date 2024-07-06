import { appWindow } from '@tauri-apps/api/window'
import { ParentComponent, lazy, onMount } from 'solid-js'
import { Transition } from 'solid-transition-group'
import MainHeader from '@components/Header'
import { Titlebar } from '@components/Titlebar'
import { TITLEBAR_ACTION } from '@static/enums'
import { useAppContextMain } from '@store/context/main'

// TODO: Implement LED control via device preview
// TODO: Implement LED color control in device settings
// TODO: Device Settings has camera view, and led controls
// FIXME: Remove stepper

const ToastNotificationWindow = lazy(() => import('@components/Notifications'))

const App: ParentComponent = (props) => {
    const { handleTitlebar, handleAppBoot } = useAppContextMain()

    onMount(() => {
        handleTitlebar(true)
        handleAppBoot()
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
                <MainHeader />
            </div>
            <main class="w-full overflow-y-scroll">
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
                            { duration: 300, fill: 'both' },
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
                            { duration: 300 },
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
