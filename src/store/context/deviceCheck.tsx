import {
    createContext,
    useContext,
    type ParentComponent,
    onMount,
    createEffect,
    onCleanup,
} from 'solid-js'
import { useAppAPIContext } from './api'
import { useAppDeviceContext } from './device'
import { useAppNotificationsContext } from './notifications'
import type { Device } from '@static/types'
import { DEVICE_STATUS, ENotificationType, RESTStatus } from '@static/enums'

interface IAppDeviceDiscoveryContext {}

const AppDeviceDiscoveryContext = createContext<IAppDeviceDiscoveryContext>()
export const AppDeviceDiscoveryProvider: ParentComponent = (props) => {
    const { useRequestHook } = useAppAPIContext()
    const { setDeviceStatus, setDeviceRSSI, getDeviceState } = useAppDeviceContext()
    const { addNotification } = useAppNotificationsContext()

    const handleDeviceDetectionError = (device: Device, error: Error) => {
        addNotification({
            title: 'Device Detection Error',
            message: `Failed to detect ${device.name} - ${error}.`,
            type: ENotificationType.ERROR,
        })
        setDeviceStatus(device.id, DEVICE_STATUS.FAILED)
        setDeviceRSSI(device.id, -95)
    }

    const handleDeviceCheck = (device: Device) => {
        useRequestHook('ping', device.id)
            .then((res) => {
                console.debug('Checking device:', device.name, res.status, res.response)

                if (res.status === RESTStatus.FAILED) {
                    console.debug('Device not reachable:', device.name)
                    throw new Error(`${device.name} is not reachable.`)
                }

                useRequestHook('wifiStrength', device.id, undefined, '?points=10')
                    .then((res) => {
                        if (res.status === RESTStatus.FAILED) {
                            console.error('Failed to get wifi strength:', device.name)
                            throw new Error(`${device.name} is not reachable.`)
                        }

                        const rssi = res.response['rssi']
                        console.debug('RSSI:', rssi)

                        if (!rssi) {
                            throw new Error('Invalid RSSI response format')
                        }
                        setDeviceRSSI(device.id, rssi)
                        setDeviceStatus(device.id, DEVICE_STATUS.ACTIVE)
                    })
                    .catch((error) => {
                        console.error('Failed to get wifi strength:', device.name, error)
                        throw new Error(`${device.name} is not reachable.`)
                    })
            })
            .catch((error) => {
                console.error('Failed to ping device:', device.name, error)
                handleDeviceDetectionError(device, error as Error)
            })
    }

    onMount(() => {
        getDeviceState().devices.forEach((device) => {
            try {
                handleDeviceCheck(device)
            } catch (error) {
                console.error(`Failed to update device ${device.name}:`, error)
                setDeviceStatus(device.id, DEVICE_STATUS.FAILED)
                setDeviceRSSI(device.id, -95)
            }
        })
        addNotification({
            title: 'Welcome to the Lumin LED Controller',
            message: 'This is the dashboard where you can manage your devices.',
            type: ENotificationType.INFO,
        })
    })

    createEffect(() => {
        console.debug('Starting device check interval')
        const interval = setInterval(() => {
            getDeviceState().devices.forEach((device) => {
                try {
                    handleDeviceCheck(device)
                } catch (error) {
                    console.error(`Failed to update device ${device.name}:`, error)
                    setDeviceStatus(device.id, DEVICE_STATUS.FAILED)
                    setDeviceRSSI(device.id, -95)
                }
            })
        }, 30000)

        onCleanup(() => clearInterval(interval))
    })

    return (
        <AppDeviceDiscoveryContext.Provider value={{}}>
            {props.children}
        </AppDeviceDiscoveryContext.Provider>
    )
}

export const useAppDeviceDiscoveryContext = () => {
    const context = useContext(AppDeviceDiscoveryContext)
    if (context === undefined) {
        throw new Error(
            'useAppDeviceDiscoveryContext must be used within an AppDeviceDiscoveryProvider',
        )
    }
    return context
}
