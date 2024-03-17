import { Show, type Component } from 'solid-js'
import { ModalEvents } from './index'
import { Button } from '@components/ui/button'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'

interface FormActionsProps extends ModalEvents {
    cancelLabel: string
    submitLabel: string
    onDelete?: (e: PointerEvent) => void
}

const FormActions: Component<FormActionsProps> = (props) => {
    const handleSubmit = (e: PointerEvent) => {
        e.stopPropagation()
        props.onSubmit(e)
    }

    const handleCancel = (e: PointerEvent) => {
        e.stopPropagation()
        props.onCancel(e)
    }

    const handleDelete = (e: PointerEvent) => {
        e.stopPropagation()
        if (!props.onDelete) return
        props.onDelete(e)
    }

    return (
        <Flex class="gap-6 w-full p-2" alignItems="end" justifyContent="end" flexDirection="row">
            <Show
                when={props.onDelete}
                fallback={
                    <Button
                        class="border-none outline-none mt-5 hover:bg-reddit/75 bg-reddit/50"
                        variant="ghost"
                        type="reset"
                        onPointerDown={handleCancel}>
                        <Label
                            class="text-pretty text-secondary-content"
                            size="lg"
                            weight="bold"
                            styles="pointer">
                            {props.cancelLabel}
                        </Label>
                    </Button>
                }>
                <Button
                    class="border-none outline-none mt-5 hover:bg-reddit/75 bg-reddit/50"
                    variant="ghost"
                    type="reset"
                    onPointerDown={handleDelete}>
                    <Label
                        class="text-pretty text-secondary-content"
                        size="lg"
                        weight="bold"
                        styles="pointer">
                        Delete
                    </Label>
                </Button>
            </Show>

            <Button
                class="border-none outline-none mt-5 hover:bg-accent/75 bg-accent/50"
                variant="accent"
                type="submit"
                onPointerDown={handleSubmit}>
                <Label
                    class="text-pretty text-secondary-content"
                    size="lg"
                    weight="bold"
                    styles="pointer">
                    {props.submitLabel}
                </Label>
            </Button>
        </Flex>
    )
}

export default FormActions
