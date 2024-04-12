import { Component, createEffect, createSignal, Show } from 'solid-js'
import WifiSignal from '@components/Device/WIFIStrength'
import WebSocketHandler from '@components/WebSocketHandler'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'
import { ActiveStatus, DEFAULT_COLOR, capitalizeFirstLetter } from '@src/lib/utils'
import { DEVICE_TYPE } from '@src/static/enums'
import { Device } from '@static/types'

interface ListProps extends Device {
    onPointerDown: () => void
}

const List: Component<ListProps> = (props) => {
    const [status, setStatus] = createSignal(DEFAULT_COLOR)

    createEffect(() => {
        setStatus(ActiveStatus(props.status))
    })

    return (
        <div
            class="h-full border-2 border-[#333742] cursor-pointer hover:border-[#817DF7] grid grid-flow-col auto-cols-fr pl-[12px] pr-[12px] pt-[12px] pb-[12px] rounded-[10px] mb-[20px] bg-[#333742] text-white"
            onPointerDown={() => props.onPointerDown()}>
            <Flex
                justifyContent="center"
                alignItems="center"
                class="w-[60px] h-[60px] rounded-md content-center">
                <div class="h-full w-full">
                    <WebSocketHandler
                        hasCamera={props.hasCamera}
                        status={props.status}
                        styles="rounded-b-lg rounded-t-lg"
                    />
                </div>
            </Flex>
            <div class="text-[#FFFF] max-sm:hidden flex max-md:justify-end justify-start content-center items-center">
                <Label class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {capitalizeFirstLetter(props.name.toLocaleLowerCase())}
                </Label>
            </div>
            <div class="text-[#FFFF] max-sm:justify-end flex justify-start content-center items-center">
                <div
                    style={{ 'background-color': status() }}
                    class="ml-[6px] h-[10px] rounded-full mr-[10px] w-[10px]"
                />
                <Label class="text-ellipsis overflow-hidden text-[#FFFF] whitespace-nowrap text-base">
                    {capitalizeFirstLetter(props.status.toLocaleLowerCase())}
                </Label>
            </div>
            <Show when={props.type === DEVICE_TYPE.WIRELESS}>
                <Flex
                    justifyContent="start"
                    flexDirection="row"
                    alignItems="center"
                    class="text-[#FFFF] max-sm:hidden max-md:justify-end content-center">
                    <div class="overflow-hidden pl-2">
                        <Label size="lg" class="text-white text-ellipsis overflow-hidden">
                            <WifiSignal rssi={-25} />
                        </Label>
                    </div>
                </Flex>
            </Show>
            <div class="text-[#FFFF] max-sm:hidden flex max-md:justify-end justify-start content-center items-center">
                <Label class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {capitalizeFirstLetter(props.type.toLocaleLowerCase())}
                </Label>
            </div>
            <Flex
                justifyContent="end"
                alignItems="center"
                class="max-md:hidden text-left content-center">
                <Label class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {props.network.address}
                </Label>
            </Flex>
        </div>
    )
}

export default List
