import { JSXElement, Show, createEffect, createSignal } from 'solid-js'
import Popover from '@components/Popover'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'

interface CustomButtonProps {
    onClick: (isButtonActive: boolean) => void
    isButtonActive: boolean
    name?: string
    tooltip?: string
    path?: string
    icon?: JSXElement
}

const CustomButton = (props: CustomButtonProps) => {
    const [isActive, setIsActive] = createSignal(false)

    const handleOnClick = () => {
        setIsActive(props.isButtonActive)
        props.onClick(isActive())
    }

    createEffect(() => {
        setIsActive(props.isButtonActive)
    })

    return (
        <Flex
            flexDirection="col"
            justifyContent="center"
            alignItems="center"
            classList={{
                'bg-[#0071FE] hover:bg-[#0065E2]': isActive(),
                'bg-[#333742] hover:bg-[#0071FE]': !isActive(),
            }}
            class="w-full h-auto rounded-lg p-2 cursor-pointer m-2"
            onClick={handleOnClick}>
            <Flex justifyContent="center" alignItems="center" class="h-full w-full">
                <Show
                    when={props.icon}
                    fallback={
                        <img
                            src={props.path}
                            alt="img"
                            class="h-full m-auto max-w-[57px] max-md:max-w-[40px] max-xl:max-w-[50px]"
                        />
                    }>
                    <Show when={!props.name && props.tooltip} fallback={props.icon}>
                        <Popover
                            styles="h-full m-auto max-w-[57px] max-md:max-w-[40px] max-xl:max-w-[50px]"
                            popoverContent={props.tooltip}
                            trigger={props.icon}
                        />
                    </Show>
                </Show>
            </Flex>
            <Show when={props.name && !props.tooltip}>
                <Flex justifyContent="center" alignItems="end">
                    <Label
                        size="xl"
                        class="pt-2 h-full w-full text-white max-md:text-xs max-lg:text-sm max-xl:text-base">
                        {props.name}
                    </Label>
                </Flex>
            </Show>
        </Flex>
    )
}
export default CustomButton
