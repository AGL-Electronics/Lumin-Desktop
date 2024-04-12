import {
    createContext,
    useContext,
    createMemo,
    type ParentComponent,
    Accessor,
    createEffect,
    onMount,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { debug } from 'tauri-plugin-log-api'
// eslint-disable-next-line import/named
import { usePersistentStore } from '../tauriStore'
import { useAppContext } from './app'
import type { Device, AppStoreDevice } from '@static/types'
import { UniqueArray } from '@src/static/uniqueArray'
import { DEVICE_MODIFY_EVENT, DEVICE_STATUS, DEVICE_TYPE } from '@static/enums'

interface AppDeviceContext {
    getDevices: Accessor<UniqueArray<Device>>
    getSelectedDevice: Accessor<Device | undefined>
    getSelectedDeviceAddress: Accessor<string | undefined>
    getSelectedDeviceStatus: Accessor<DEVICE_STATUS | undefined>
    getSelectedDeviceType: Accessor<DEVICE_TYPE | undefined>
    getSelectedDeviceSocket: Accessor<object | undefined>
    setDevice: (device: Device, event: DEVICE_MODIFY_EVENT) => void
    setDeviceMDNS: (device: Device, address: string) => void
    setDeviceStatus: (Device: Device, status: DEVICE_STATUS) => void
    setDeviceWS: (Device: Device, ws: object) => void
    setSelectedDevice: (Device: Device) => void
    resetSelectedDevice: () => void
}

const AppDeviceContext = createContext<AppDeviceContext>()
export const AppDeviceProvider: ParentComponent = (props) => {
    const { setDevices } = useAppContext()

    const defaultState: AppStoreDevice = {
        devices: UniqueArray.from([]),
        selectedDevice: undefined,
    }

    const [state, setState] = createStore<AppStoreDevice>(defaultState)

    const setDevice = (device: Device, event: DEVICE_MODIFY_EVENT) => {
        setState(
            produce((s) => {
                switch (event) {
                    case DEVICE_MODIFY_EVENT.PUSH:
                        return s.devices.add(device)
                    case DEVICE_MODIFY_EVENT.UPDATE: {
                        const newItems = s.devices.map((dvc) => {
                            if (dvc.id === device.id) {
                                return device
                            }
                            return dvc
                        })

                        s.devices = UniqueArray.from(newItems)
                        return s
                    }
                    case DEVICE_MODIFY_EVENT.DELETE: {
                        const newItems = s.devices.filter((dvc) => dvc.id !== device.id)
                        s.devices = UniqueArray.from(newItems)
                        return s
                    }
                    default:
                        return s
                }
            }),
        )
    }

    const setDeviceMDNS = (device: Device, mdns: string) => {
        setState(
            produce((s) => {
                s.devices = UniqueArray.from(
                    s.devices.filter((c: { id: string }) => c.id !== device.id),
                )
                s.devices.add({ ...device, network: { ...device.network, mdns } })
            }),
        )
    }

    const setDeviceStatus = (device: Device, status: DEVICE_STATUS) => {
        setState(
            produce((s) => {
                s.devices = UniqueArray.from(
                    s.devices.filter((c: { id: string }) => c.id !== device.id),
                )
                s.devices.add({ ...device, status })
            }),
        )
    }

    const setDeviceWS = (device: Device, ws: object) => {
        setState(
            produce((s) => {
                s.devices = UniqueArray.from(
                    s.devices.filter((c: { id: string }) => c.id !== device.id),
                )
                s.devices.add({ ...device, ws })
            }),
        )
    }

    const setSelectedDevice = (device: Device) => {
        setState(
            produce((s) => {
                s.selectedDevice = device
            }),
        )
    }

    const resetSelectedDevice = () => {
        setState(
            produce((s) => {
                s.selectedDevice = defaultState.selectedDevice
            }),
        )
    }

    const deviceState = createMemo(() => state)

    const getDevices = createMemo(() => deviceState().devices)
    const getSelectedDevice = createMemo(() => deviceState().selectedDevice)
    const getSelectedDeviceAddress = createMemo(() => deviceState().selectedDevice?.network.address)
    const getSelectedDeviceStatus = createMemo(() => deviceState().selectedDevice?.status)
    const getSelectedDeviceType = createMemo(() => deviceState().selectedDevice?.type)
    const getSelectedDeviceSocket = createMemo(() => deviceState().selectedDevice?.ws)

    const { get } = usePersistentStore()

    onMount(() => {
        get('settings').then((settings) => {
            if (!settings) {
                console.debug('No settings file found')
                return
            }

            console.debug(`Loading Settings Config File from Disk: ${settings}`)
            debug(`Loading Settings Config File from Disk: ${settings}`)

            if (settings.devices.size === 0) {
                console.debug('No devices found in settings file')
                return
            }

            settings.devices.forEach((device: Device) => {
                setDevice(device, DEVICE_MODIFY_EVENT.PUSH)
            })
        })

        /* doGHRequest()
        useMDNSScanner('_lumin._tcp', 5).then(() => {
            // TODO: handle devices found
        }) */
    })

    createEffect(() => {
        setDevices(getDevices())
    })

    return (
        <AppDeviceContext.Provider
            value={{
                getDevices,
                getSelectedDevice,
                getSelectedDeviceAddress,
                getSelectedDeviceStatus,
                getSelectedDeviceType,
                getSelectedDeviceSocket,
                setDevice,
                setDeviceMDNS,
                setDeviceStatus,
                setDeviceWS,
                setSelectedDevice,
                resetSelectedDevice,
            }}>
            {props.children}
        </AppDeviceContext.Provider>
    )
}

export const useAppDeviceContext = () => {
    const context = useContext(AppDeviceContext)
    if (context === undefined) {
        throw new Error('useAppDeviceContext must be used within an AppDeviceProvider')
    }
    return context
}
