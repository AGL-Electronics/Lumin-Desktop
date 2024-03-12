import { ModalEvents } from './index'
import type { Component } from 'solid-js'
import { Button } from '@components/ui/button'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'

interface FormActionsProps extends ModalEvents {
    cancelLabel: string
    submitLabel: string
}

const FormActions: Component<FormActionsProps> = (props) => {
    const handleSubmit = (e: PointerEvent) => {
        console.log('submitting')
        props.onSubmit(e)
    }

    const handleCancel = (e: PointerEvent) => {
        e.stopPropagation()
        props.onCancel(e)
    }

    return (
        <Flex class="gap-4" alignItems="end" justifyContent="end" flexDirection="row">
            <Button variant="ghost" type="button" onPointerDown={handleCancel}>
                <Label styles="pointer">{props.cancelLabel}</Label>
            </Button>
            <Button variant="accent" type="submit" onPointerDown={handleSubmit}>
                <Label styles="pointer">{props.submitLabel}</Label>
            </Button>
        </Flex>
    )
}

export default FormActions
