import type { Component } from 'solid-js'
import { Icons } from '@components/ui/icon'
import './index.css'

const CreateCamera: Component<{
    onPointerDown: (e: PointerEvent) => void
}> = (props) => {
    return (
        <div
            class=" m-auto justify-center items-center pr-3 pl-3 py-3 h-full min-h-[222px] pb-3 rounded-xl bg-[#333742] flex border-2 border-[#333742] hover:border-[#817DF7]  hover:cursor-pointer"
            onPointerDown={(e) => props.onPointerDown(e)}>
            <div class="responsive-create-camera-img mt-[70px] mb-[70px]">
                <Icons.plus
                    class="w-12 h-12 text-[#817DF7] hover:text-[#817DF7] m-auto"
                    fill="#817DF7"
                    size={24}
                />
            </div>
        </div>
    )
}

export default CreateCamera
