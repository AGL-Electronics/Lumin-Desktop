import { Component, createEffect, createSignal, Switch, Match } from 'solid-js'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { Device } from '@static/types'

// TODO: Grab the RSSI value from the device, pass the device object as a prop

export interface WiFiSignalProps extends Device {}

const WifiSignal: Component<WiFiSignalProps> = (props) => {
    // Signal strength state
    const [numFilled, setNumFilled] = createSignal(0)
    const [color, setColor] = createSignal('text-red-500') // Default to poor signal

    // Determine color and filled segments based on RSSI value
    createEffect(() => {
        if (props.network.wifi.rssi > -50) {
            setNumFilled(4)
            setColor('text-green-500') // Strong signal
        } else if (props.network.wifi.rssi <= -50 && props.network.wifi.rssi > -60) {
            setNumFilled(3)
            setColor('text-blue-500') // Good signal
        } else if (props.network.wifi.rssi <= -60 && props.network.wifi.rssi > -70) {
            setNumFilled(2)
            setColor('text-yellow-500') // Weak signal
        } else if (props.network.wifi.rssi >= -90 && props.network.wifi.rssi <= -70) {
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
