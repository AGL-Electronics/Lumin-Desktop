import type { ModalEvents } from '.'
import type { ParentComponent } from 'solid-js'
import FormActions from '@components/Modal/FormActions'
import { DialogAction } from '@components/ui/dialog'

const ModalContent: ParentComponent<ModalEvents> = (props) => {
    return (
        <DialogAction>
            <form class="p-2" method="dialog">
                {props.children}
                <FormActions
                    cancelLabel="Cancel"
                    submitLabel="Submit"
                    onCancel={props.onCancel}
                    onSubmit={props.onSubmit}
                />
            </form>
        </DialogAction>
    )
}

export default ModalContent
