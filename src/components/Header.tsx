import { Image } from '@kobalte/core'
import { useLocation, useNavigate } from '@solidjs/router'
import { Show, createEffect, createSignal, type Component } from 'solid-js'
import { ProgressBar } from './ProgressBar/ProgressBar'
import CustomSlideAnimation from '@components/CustomSlideAnimation'
import Popover from '@components/Popover'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { ANIMATION_MODE, POPOVER_ID } from '@src/static/enums'

interface HeaderProps {
    step?: { step: string; description: string; dashoffset: string; index: string }
    currentStep?: string
}

const StepperProgress: Component<HeaderProps> = (props) => {
    const location = useLocation()
    return (
        <Show when={location.pathname !== '/deviceSettings/false'}>
            <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                class="gap-[6px] min-w-[210px]">
                <ProgressBar currentStep={props.currentStep!} dashoffset={props.step!.dashoffset} />
                <Flex flexDirection="col" justifyContent="end" alignItems="start" class="w-full">
                    <Label size="sm" weight="bold" class="text-white leading-normal">
                        {props.step!.step}
                    </Label>
                    <Label size="xs" weight="normal" class="text-white font-sans leading-normal">
                        {props.step!.description}
                    </Label>
                </Flex>
            </Flex>
        </Show>
    )
}

const Header: Component<HeaderProps> = (props) => {
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
                <Label size="3xl" weight="bold" class="text-white pb-2 leading-10">
                    Lumin
                </Label>
                <div class="mx-auto">
                    <Show
                        when={!deviceSettingsActive()}
                        fallback={
                            <StepperProgress step={props.step} currentStep={props.currentStep} />
                        }>
                        <CustomSlideAnimation
                            defaultAnimationMode={ANIMATION_MODE.GRIP}
                            defaultDisplayMode={POPOVER_ID.GRIP}
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
