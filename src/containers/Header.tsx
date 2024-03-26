import { useLocation } from '@solidjs/router'
import { createMemo } from 'solid-js'
import MainHeader from '@components/Header'
import { stepStatus, usb } from '@src/static'
import { DIRECTION } from '@static/enums'
import { useAppAPIContext } from '@store/context/api'

const Header = () => {
    const location = useLocation()

    const { activeBoard } = useAppAPIContext()

    /* const isUSBBoard = createMemo(() => {
        return activeBoard().includes(usb) ? 1 : 0
    }) */

    const step = createMemo(() => {
        if (location.pathname === '/deviceSettings/false') return 1
        return stepStatus[DIRECTION[location.pathname]].index /* - isUSBBoard() */
    })

    return (
        <MainHeader
            step={stepStatus[DIRECTION[location.pathname]]}
            currentStep={`${step() <= 0 ? 1 : step()}/${
                Object.values(stepStatus).length /*  - isUSBBoard() */
            } `}
        />
    )
}

export default Header
