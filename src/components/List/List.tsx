import { Component } from 'solid-js'
import WebSocketHandler from '@components/WebSocketHandler'
import { ActiveStatus, capitalizeFirstLetter } from '@src/lib/utils'
import { Device } from '@static/types'

interface ListProps extends Device {
    onPointerDown: () => void
}

const List: Component<ListProps> = (props) => {
    return (
        <div
            class="h-full border-2 border-[#333742] cursor-pointer hover:border-[#817DF7] grid grid-flow-col auto-cols-fr pl-[12px] pr-[12px] pt-[12px] pb-[12px] rounded-[10px] mb-[20px] bg-[#333742] text-white"
            onPointerDown={() => props.onPointerDown()}>
            <div class="text-[#FFFF]  w-[60px] h-[60px] rounded-[5px] flex justify-center content-center items-center">
                <div class="h-full w-full">
                    <WebSocketHandler status={props.status} styles="rounded-b-lg rounded-t-lg" />
                </div>
            </div>
            <div class="text-[#FFFF] max-sm:justify-end flex justify-start content-center items-center">
                <p class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {props.address}
                </p>
            </div>
            <div class="text-[#FFFF] max-sm:hidden flex max-md:justify-end justify-start content-center items-center">
                <p class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {capitalizeFirstLetter(props.type.toLocaleLowerCase())}
                </p>
            </div>
            <div class="max-md:hidden text-[#FFFF] text-left flex justify-end content-center items-center ">
                <div
                    class={`ml-[6px] h-[10px] rounded-full mr-[10px] w-[10px] bg-[${ActiveStatus(
                        props.status,
                    )}]`}
                />
                <p class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                    {capitalizeFirstLetter(props.status.toLocaleLowerCase())}
                </p>
            </div>
        </div>
    )
}

export default List
