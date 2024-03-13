import { createSignal, type Component } from 'solid-js'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { POPOVER_ID } from '@static/enums'

const CreateDevice: Component<{
    onPointerDown: (e: PointerEvent) => void
    type: POPOVER_ID
}> = (props) => {
    const [isHovered, setIsHovered] = createSignal(false)
    return (
        <Flex
            justifyContent="center"
            alignItems="center"
            class="m-auto pr-3 pl-3 py-3 h-full pb-3 rounded-xl bg-[#333742] border-2 border-[#333742] hover:border-[#817DF7] cursor-pointer"
            classList={{
                'min-h-[222px]': props.type === POPOVER_ID.GRIP,
            }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onPointerDown={(e) => props.onPointerDown(e)}>
            <Icons.plus
                color={isHovered() ? '#817DF7' : '#A9B6BF'}
                classList={{
                    'max-h-[60px] aspect-square': props.type === POPOVER_ID.LIST,
                }}
                size={60}
            />
        </Flex>
    )
}

export default CreateDevice
