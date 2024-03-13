import { Image } from '@kobalte/core'
import { Show, type Component } from 'solid-js'
import CustomPopover from './CustomPopover'
import CustomSlideAnimation from '@components/CustomSlideAnimation'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import './index.css'

interface HeaderProps {
    hideButtons: boolean
    onPointerDown: () => void
}

const Header: Component<HeaderProps> = (props) => {
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
                        onPointerDown={() => props.onPointerDown()}>
                        <Image.Root>
                            <Image.Img src="/images/logo.png" alt="logo" width="51px" />
                        </Image.Root>
                    </a>
                </div>
                <div class="mx-auto">
                    <Show when={!props.hideButtons}>
                        <CustomSlideAnimation
                            firstChild={
                                <a title="Device Manager" href="/" class="no-underline flex p-2">
                                    <CustomPopover
                                        styles="h-full"
                                        popoverContent="Device Manager"
                                        icon={<Icons.led color="#ffffff" size={20} />}
                                    />
                                </a>
                            }
                            secondChild={
                                <a title="Settings" href="/settings" class="no-underline flex p-2">
                                    <CustomPopover
                                        styles="h-full"
                                        popoverContent="Settings"
                                        icon={<Icons.gear color="#ffffff" size={20} />}
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
