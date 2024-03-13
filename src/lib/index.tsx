import { AiOutlineCheckCircle } from 'solid-icons/ai'
import { FaSolidArrowDown, FaSolidXmark } from 'solid-icons/fa'
import { FiAlertOctagon } from 'solid-icons/fi'
import { Switch, Match, Component } from 'solid-js'
import { ACTIVE_COLOR, DISABLED_COLOR, FAILED_COLOR, LOADING_COLOR } from './utils'
import { DEVICE_STATUS } from '@static/enums'

export const DeviceStatusIcon: Component<{
    status: DEVICE_STATUS
}> = (props) => {
    return (
        <Switch>
            <Match when={props.status === DEVICE_STATUS.ACTIVE}>
                <AiOutlineCheckCircle size={25} color={ACTIVE_COLOR} />
            </Match>
            <Match when={props.status === DEVICE_STATUS.DISABLED}>
                <FiAlertOctagon size={25} color={DISABLED_COLOR} />
            </Match>
            <Match when={props.status === DEVICE_STATUS.FAILED}>
                <FaSolidXmark size={25} color={FAILED_COLOR} />
            </Match>
            <Match when={props.status === DEVICE_STATUS.LOADING}>
                <FaSolidArrowDown size={25} color={LOADING_COLOR} />
            </Match>
        </Switch>
    )
}
