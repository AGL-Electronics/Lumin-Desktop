import { Image } from '@kobalte/core'
import { useLocation, useNavigate } from '@solidjs/router'
import { Show, createEffect, createSignal, type Component } from 'solid-js'
import CustomSlideAnimation from '@components/CustomSlideAnimation'
import Popover from '@components/Popover'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'

const Header: Component = () => {
    const [deviceSettingsActive, setDeviceSettingsActive] = createSignal(false)
    const params = useLocation()
    const navigate = useNavigate()

    createEffect(() => {
        setDeviceSettingsActive(params.pathname.match('deviceSettings') !== null)
    })

    return (
        <header class="w-full pr-4 pl-4 content-center">
            <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                class="w-full mt-4 pt-8 gap-4">
                <div class="text-left content-start">
                    <a
                        title="Go to home page"
                        href="/"
                        class="no-underline"
                        onPointerDown={() => navigate('/')}>
                        <Image.Root>
                            <Image.Img src="/images/logo.png" alt="logo" width="51px" />
                        </Image.Root>
                    </a>
                </div>
                <div class="mx-auto">
                    <Show when={!deviceSettingsActive()}>
                        <CustomSlideAnimation
                            firstChild={
                                <a title="Device Manager" href="/" class="no-underline flex p-2">
                                    <Popover
                                        styles="h-full"
                                        popoverContent="Device Manager"
                                        trigger={<Icons.led color="#ffffff" size={20} />}
                                    />
                                </a>
                            }
                            secondChild={
                                <a title="Settings" href="/settings" class="no-underline flex p-2">
                                    <Popover
                                        styles="h-full"
                                        popoverContent="Settings"
                                        trigger={<Icons.gear color="#ffffff" size={20} />}
                                    />
                                </a>
                            }
                        />
                    </Show>
                </div>
            </Flex>
        </header>
    )
}

export default Header
