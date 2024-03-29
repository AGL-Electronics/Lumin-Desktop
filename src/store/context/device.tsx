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
import { DEVICE_STATUS, DEVICE_TYPE } from '@static/enums'

interface AppDeviceContext {
    getDevices: Accessor<Device[]>
    getDeviceAddresses: Accessor<string[]>
    getDeviceStatus: Accessor<DEVICE_STATUS[]>
    getSelectedDevice: Accessor<Device | undefined>
    getSelectedDeviceAddress: Accessor<string | undefined>
    getSelectedDeviceStatus: Accessor<DEVICE_STATUS | undefined>
    getSelectedDeviceType: Accessor<DEVICE_TYPE | undefined>
    getSelectedDeviceSocket: Accessor<object | undefined>
    setDevice: (device: Device) => void
    setAddDeviceMDNS: (device: Device, address: string) => void
    setRemoveDevice: (Device: Device) => void
    setDeviceStatus: (Device: Device, status: DEVICE_STATUS) => void
    setDeviceWS: (Device: Device, ws: object) => void
    setSelectedDevice: (Device: Device) => void
    resetSelectedDevice: () => void
}

const AppDeviceContext = createContext<AppDeviceContext>()
export const AppDeviceProvider: ParentComponent = (props) => {
    const { setDevices } = useAppContext()

    const defaultState: AppStoreDevice = {
        devices: [],
        selectedDevice: undefined,
    }

    const [state, setState] = createStore<AppStoreDevice>(defaultState)

    const setDevice = (device: Device) => {
        setState(
            produce((s) => {
                const index = s.devices.findIndex(
                    (c: { address: string }) => c.address === device.address,
                )
                if (index !== -1) {
                    s.devices[index] = device
                } else {
                    s.devices.push(device)
                }
            }),
        )
    }

    const setAddDeviceMDNS = (device: Device, address: string) => {
        setState(
            produce((s) => {
                s.devices = s.devices.filter((c: { address: string }) => c.address !== address)
                s.devices.push({ ...device, address })
            }),
        )
    }

    const setRemoveDevice = (Device: Device) => {
        setState(
            produce((s) => {
                s.devices = s.devices.filter(
                    (c: { address: string }) => c.address !== Device.address,
                )
            }),
        )
    }

    const setDeviceStatus = (device: Device, status: DEVICE_STATUS) => {
        setState(
            produce((s) => {
                s.devices = s.devices.filter(
                    (c: { address: string }) => c.address !== device.address,
                )
                s.devices.push({ ...device, status })
            }),
        )
    }

    const setDeviceWS = (device: Device, ws: object) => {
        setState(
            produce((s) => {
                s.devices = s.devices.filter(
                    (c: { address: string }) => c.address !== device.address,
                )
                s.devices.push({ ...device, ws })
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
    const getDeviceAddresses = createMemo(() => deviceState().devices.map(({ address }) => address))
    const getDeviceStatus = createMemo(() => deviceState().devices.map(({ status }) => status))
    const getSelectedDevice = createMemo(() => deviceState().selectedDevice)
    const getSelectedDeviceAddress = createMemo(() => deviceState().selectedDevice?.address)
    const getSelectedDeviceStatus = createMemo(() => deviceState().selectedDevice?.status)
    const getSelectedDeviceType = createMemo(() => deviceState().selectedDevice?.type)
    const getSelectedDeviceSocket = createMemo(() => deviceState().selectedDevice?.ws)

    const { get } = usePersistentStore()

    onMount(() => {
        get('settings').then((settings) => {
            if (settings) {
                debug('loading settings')
                settings.devices.forEach((device: Device) => {
                    setDevice(device)
                })
            }
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
                getDeviceAddresses,
                getDeviceStatus,
                getSelectedDevice,
                getSelectedDeviceAddress,
                getSelectedDeviceStatus,
                getSelectedDeviceType,
                getSelectedDeviceSocket,
                setDevice,
                setAddDeviceMDNS,
                setRemoveDevice,
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
