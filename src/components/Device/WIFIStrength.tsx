import { Component, createEffect, createSignal, Switch, Match, onCleanup, onMount } from 'solid-js'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { DEVICE_STATUS, ENotificationType } from '@static/enums'
import { Device } from '@static/types'
import { useAppAPIContext } from '@store/context/api'
import { useAppDeviceContext } from '@store/context/device'
import { useAppNotificationsContext } from '@store/context/notifications'

// TODO: Grab the RSSI value from the device, pass the device object as a prop

export interface WiFiSignalProps extends Device {}

const WifiSignal: Component<WiFiSignalProps> = (props) => {
    const { useRequestHook } = useAppAPIContext()
    const { setDeviceStatus } = useAppDeviceContext()
    const { addNotification } = useAppNotificationsContext()

    // Signal strength state
    const [numFilled, setNumFilled] = createSignal(0)
    const [rssi, setRSSI] = createSignal(-95)
    const [update, setUpdate] = createSignal(false)
    const [res, setRes] = createSignal({
        status: '',
        data: { rssi: -95 },
    })
    const [color, setColor] = createSignal('text-red-500') // Default to poor signal
    const rssiBuffer: number[] = []

    const handleRSSI = () => {
        if (
            props.status === DEVICE_STATUS.FAILED ||
            props.status === DEVICE_STATUS.DISABLED ||
            props.status === DEVICE_STATUS.NONE ||
            props.status === DEVICE_STATUS.LOADING
        ) {
            return
        }

        useRequestHook('wifiStrength', props.id, undefined, '?points=10')
            .then((res) => {
                setRes(res as any)
                setUpdate(true)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const handleUpdate = () => {
        if (!update()) return

        if (res().status === 'error') {
            addNotification({
                title: 'Error',
                message: 'Device is not reachable.',
                type: ENotificationType.ERROR,
            })

            setDeviceStatus(props.id, DEVICE_STATUS.FAILED)

            return
        }

        const data = res().data as { rssi: number }
        rssiBuffer.push(data.rssi)
    }

    createEffect(() => {
        const interval = setInterval(() => {
            handleRSSI()
            handleUpdate()
        }, 10000)

        // take the rssi values from the buffer and average them out
        if (rssiBuffer.length > 5) {
            const avg = rssiBuffer.reduce((a, b) => a + b) / rssiBuffer.length
            setRSSI(avg)
            rssiBuffer.length = 0
        }

        onCleanup(() => {
            clearInterval(interval)
        })
    })

    onMount(() => {
        handleRSSI()
        handleUpdate()

        console.debug('[WifiSignal]: mounted - ', props)
    })

    // Determine color and filled segments based on RSSI value
    createEffect(() => {
        if (rssi() > -50) {
            setNumFilled(4)
            setColor('text-green-500') // Strong signal
        } else if (rssi() <= -50 && rssi() > -60) {
            setNumFilled(3)
            setColor('text-blue-500') // Good signal
        } else if (rssi() <= -60 && rssi() > -70) {
            setNumFilled(2)
            setColor('text-yellow-500') // Weak signal
        } else if (rssi() >= -90 && rssi() <= -70) {
            setNumFilled(1)
            setColor('text-red-500') // Poor signal
        } else {
            setNumFilled(-1)
            setColor('text-red-500') // no signal
        }
    })

    return (
        <Flex flexDirection="col" justifyContent="center" alignItems="center" class="">
            <Switch fallback={<Icons.wifiNone size={24} fill={color()} class={color()} />}>
                <Match when={numFilled() === -1}>
                    <Icons.wifiProblem size={24} class={color()} fill={color()} />
                </Match>
                <Match when={numFilled() === 1}>
                    <Icons.wifiLow size={24} class={color()} fill={color()} />
                </Match>
                <Match when={numFilled() === 2}>
                    <Icons.wifiMedium size={24} class={color()} fill={color()} />
                </Match>
                <Match when={numFilled() === 3}>
                    <Icons.wifiHigh size={24} class={color()} fill={color()} />
                </Match>
                <Match when={numFilled() === 4}>
                    <Icons.wifiHigh size={24} class={color()} fill={color()} />
                </Match>
            </Switch>
        </Flex>
    )
}

export default WifiSignal
