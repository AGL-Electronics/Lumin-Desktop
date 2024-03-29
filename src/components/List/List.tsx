import { Component, createEffect, createSignal } from 'solid-js'
import WebSocketHandler from '@components/WebSocketHandler'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'
import { ActiveStatus, DEFAULT_COLOR, capitalizeFirstLetter } from '@src/lib/utils'
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
                <Label class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {props.address}
                </Label>
            </div>
            <div class="text-[#FFFF] max-sm:hidden flex max-md:justify-end justify-start content-center items-center">
                <Label class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {capitalizeFirstLetter(props.type.toLocaleLowerCase())}
                </Label>
            </div>
            <div class="max-md:hidden text-left flex justify-end content-center items-center ">
                <div
                    style={{ 'background-color': status() }}
                    class="ml-[6px] h-[10px] rounded-full mr-[10px] w-[10px]"
                />
                <Label class="text-ellipsis overflow-hidden text-[#FFFF] whitespace-nowrap text-base">
                    {capitalizeFirstLetter(props.status.toLocaleLowerCase())}
                </Label>
            </div>
        </div>
    )
}

export default List
