import { Image } from '@kobalte/core'
import { Switch, Match, Show } from 'solid-js'
import { OrangeLoader, MagentaLoader } from '@components/Loader'
import { Flex } from '@components/ui/flex'
import { cn } from '@src/lib/utils'
import { DEVICE_STATUS } from '@static/enums'
import { useAppUIContext } from '@store/context/ui'

// TODO: Grab selected Device from store, connect if not connected, and display video stream on component mounted
type IWsProps = {
    status: DEVICE_STATUS
    styles?: string
    hasCamera: boolean
}

// TODO: Make other loader components for other statuses
export const LoaderHandler = (props: IWsProps) => {
    return (
        <Show
            when={props.hasCamera}
            fallback={
                <Image.Root>
                    <Image.Img class='rounded-t-md' src="/images/pcb.png" alt="lumin pcb" />
                </Image.Root>
            }>
            <Switch>
                <Match when={props.status == DEVICE_STATUS.LOADING}>
                    <OrangeLoader width={100} height={100} unit={'%'} />
                </Match>
                <Match when={props.status == DEVICE_STATUS.ACTIVE}>
                    <OrangeLoader width={100} height={100} unit={'%'} />
                </Match>
                <Match
                    when={
                        props.status == DEVICE_STATUS.DISABLED ||
                        props.status == DEVICE_STATUS.FAILED
                    }>
                    <MagentaLoader width={100} height={100} unit={'%'} id="magenta" />
                </Match>
                <Match when={props.status == DEVICE_STATUS.NONE}>
                    <OrangeLoader width={100} height={100} unit={'%'} />
                </Match>
            </Switch>
        </Show>
    )
}

const WebSocketHandler = (props: IWsProps) => {
    const { showDeviceView } = useAppUIContext()

    return (
        <div class="w-full h-full">
            <Show
                when={showDeviceView()}
                fallback={
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        class={cn(
                            'bg-[#2b2f38] rounded-t-xl min-[1750px]:rounded-xl w-full h-full',
                            props.styles,
                        )}>
                        <LoaderHandler hasCamera={props.hasCamera} status={props.status} />
                    </Flex>
                }>
                <video class="bg-black rounded-t-xl w-full h-full" autoplay>
                    <source src="" type="video/mp4" />
                </video>
            </Show>
        </div>
    )
}

export default WebSocketHandler
