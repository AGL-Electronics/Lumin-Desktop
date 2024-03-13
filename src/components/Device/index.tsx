import type { Component } from 'solid-js'
import WebSocketHandler from '@components/WebSocketHandler'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'
import { ActiveStatus } from '@src/lib/utils'
import { Device } from '@static/types'
import './index.css'

export interface DeviceComponentProps extends Device {
    onPointerDown: (e: PointerEvent) => void
    firmwareVersion: string
}

// FIXME: move all media queries to tailwinsdcss

const DeviceComponent: Component<DeviceComponentProps> = (props) => {
    return (
        <Flex
            justifyContent="between"
            alignItems="center"
            flexDirection="row"
            class="responsive-container max-w-[454px] w-full h-full m-auto pr-3 pl-3 py-3 min-h-[222px] pb-3 rounded-xl bg-[#333742] border-2 border-[#333742] hover:border-[#817DF7] hover:cursor-pointer"
            onPointerDown={(e) => props.onPointerDown(e)}>
            <Flex
                flexDirection="row"
                alignItems="center"
                class="responsive-flex-container w-full h-full">
                <Flex alignItems="center" class="responsive-iframe-container h-full w-full ">
                    <div class="h-full w-full ">
                        <WebSocketHandler status={props.status} />
                    </div>
                </Flex>
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    class="responsive-spacer-container bg-[#292D36] rounded-b-xl min-[1749px]:rounded-xl max-w-[209px] h-full w-full p-3">
                    <Label size="lg" class="text-center pb-3 text-white">
                        {props.activeDeviceSection}
                    </Label>
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
                        <div class="overflow-hidden pl-2">
                            <Label
                                class={`text-[${ActiveStatus(props.status)}] pl-2 overflow-hidden`}>
                                {props.status.toLocaleLowerCase()}
                            </Label>
                        </div>
                    </Flex>
                    <Flex flexDirection="row" justifyContent="end">
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
