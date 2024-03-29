import { createEffect, createSignal, type Component } from 'solid-js'
import WebSocketHandler from '@components/WebSocketHandler'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'
import { ActiveStatus, DEFAULT_COLOR, capitalizeFirstLetter } from '@src/lib/utils'
import { Device } from '@static/types'

export interface DeviceComponentProps extends Device {
    onPointerDown: (e: PointerEvent) => void
    firmwareVersion: string
}

// FIXME: move all media queries to tailwinsdcss

const DeviceComponent: Component<DeviceComponentProps> = (props) => {
    const [status, setStatus] = createSignal(DEFAULT_COLOR)

    createEffect(() => {
        console.debug('status', props.status)
        setStatus(ActiveStatus(props.status))
    })

    return (
        <Flex
            flexDirection="col"
            justifyContent="between"
            alignItems="center"
            class="max-w-[454px] w-full h-full m-auto pr-3 pl-3 py-3 min-h-[222px] pb-3 rounded-xl bg-[#333742] border-2 border-[#333742] hover:border-[#817DF7] hover:cursor-pointer"
            onPointerDown={(e) => props.onPointerDown(e)}>
            <Flex
                flexDirection="row"
                justifyContent="start"
                alignItems="center"
                class="md:flex-col w-full h-full">
                <div class="flex items-center mr-2.5 max-w-[208px] md:max-w-full md:mr-0 h-full w-full ">
                    <div class="h-full w-full">
                        <WebSocketHandler hasCamera={props.hasCamera} status={props.status} />
                    </div>
                </div>
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    class="gap-2 ml-2.5 rounded-xl md:rounded-t-none md:max-w-full md:h-full md:ml-0 lg:rounded-xl bg-[#292D36] rounded-b-xl min-[1749px]:rounded-xl max-w-[209px] h-full w-full p-3">
                    {/* If wifi, show RSSI value with wifi symbol filled in relative to strength */}
                    {/* 
                    <Label size="lg" class="text-center pb-3 text-white">
                        {props.activeDeviceSection}
                    </Label> */}
                    <Flex justifyContent="between" flexDirection="row" class="text-base 2xl:pb-3">
                        <Label class="text-[#A9B6BF] pr-2">Name</Label>
                        <div class="overflow-hidden pl-2">
                            <Label class="text-white text-ellipsis overflow-hidden">
                                {props.name}
                            </Label>
                        </div>
                    </Flex>
                    <Flex justifyContent="between" flexDirection="row" class="text-base 2xl:pb-3">
                        <Label class="text-[#A9B6BF] pr-2">Address</Label>
                        <div class="overflow-hidden pl-2">
                            <Label class="text-white text-ellipsis overflow-hidden">
                                {props.address}
                            </Label>
                        </div>
                    </Flex>
                    <Flex justifyContent="between" flexDirection="row" class="text-base 2xl:pb-3">
                        <Label class="text-[#A9B6BF] pr-2">Status</Label>
                        <div class="max-md:hidden text-left flex justify-end content-center items-center">
                            <div
                                class={`ml-[6px] h-[10px] rounded-full mr-[10px] w-[10px] bg-[${status()}]`}
                            />
                            <Label class="text-ellipsis overflow-hidden text-[#FFFF] whitespace-nowrap text-base">
                                {capitalizeFirstLetter(props.status.toLocaleLowerCase())}
                            </Label>
                        </div>
                    </Flex>
                    <Flex flexDirection="row" justifyContent="between" class="text-base 2xl:pb-3">
                        <Label class="text-[#A9B6BF] pr-2">Firmware</Label>
                        <Label size="xs" class="text-white">
                            {props.firmwareVersion || 'v0.0.0'}
                        </Label>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default DeviceComponent
