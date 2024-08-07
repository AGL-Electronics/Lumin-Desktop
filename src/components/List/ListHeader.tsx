import type { Component } from 'solid-js'

const ListHeader: Component = () => {
    return (
        <div class="grid grid-flow-col auto-cols-fr pr-[12px] pl-[12px] pt-[12px] pb-[12px] rounded-[10px] mb-[20px] text-white s">
            <div>
                <p class="text-ellipsis overflow-hidden whitespace-nowrap text-left text-base">
                    Lumin
                </p>
            </div>
            <div>
                <p class="text-ellipsis overflow-hidden whitespace-nowrap max-md:text-right text-left m-auto text-base">
                    Lumin Label
                </p>
            </div>
            <div>
                <p class="text-ellipsis overflow-hidden whitespace-nowrap max-md:text-right text-left m-auto text-base">
                    Status
                </p>
            </div>
            <div class="max-sm:hidden">
                <div>
                    <p class="text-ellipsis overflow-hidden whitespace-nowrap max-md:text-right text-left m-auto text-base">
                        Network
                    </p>
                </div>
            </div>
            <div class="max-sm:hidden">
                <div>
                    <p class="text-ellipsis overflow-hidden whitespace-nowrap max-md:text-right text-left m-auto text-base">
                        Lumin Type
                    </p>
                </div>
            </div>
            <div class="max-md:hidden">
                <p class="text-ellipsis overflow-hidden whitespace-nowrap text-left text-base">
                    Lumin Address
                </p>
            </div>
        </div>
    )
}

export default ListHeader
