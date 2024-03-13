import { Component } from 'solid-js'
import { Icons } from '@components/ui/icon'

export interface CreateListCameraProps {
    onPointerDown: (e: PointerEvent) => void
}

const CreateListCamera: Component<CreateListCameraProps> = (props) => {
    return (
        <div
            class="m-auto justify-center items-center pr-3 pl-3 py-3 h-full pb-3 rounded-xl bg-[#333742] flex border-2 border-[#333742] hover:border-[#817DF7] cursor-pointer"
            onPointerDown={(e) => props.onPointerDown(e)}>
            <Icons.plus size={60} class="max-h-[60px] aspect-square" />
        </div>
    )
}

export default CreateListCamera
