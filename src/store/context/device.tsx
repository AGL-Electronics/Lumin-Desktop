import { createContext, useContext, createMemo, type ParentComponent, Accessor } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'
import type { Device, AppStoreDevice } from '@static/types'
import { DEVICE_STATUS, DEVICE_TYPE } from '@static/enums'

interface AppDeviceContext {
    getDevices: Accessor<Device[]>
    getDeviceAddresses: Accessor<string[]>
    getDeviceStatus: Accessor<DEVICE_STATUS[]>
    getSelectedDevice: Accessor<Device>
    getSelectedDeviceAddress: Accessor<string>
    getSelectedDeviceStatus: Accessor<DEVICE_STATUS>
    getSelectedDeviceType: Accessor<DEVICE_TYPE>
    getSelectedDeviceSection: Accessor<string>
    getSelectedDeviceSocket: Accessor<object>
    setDevice: (device: Device) => void
    setAddDevice: (Device: Device) => void
    setAddDeviceMDNS: (device: Device, address: string) => void
    setRemoveDevice: (Device: Device) => void
    setDeviceStatus: (Device: Device, status: DEVICE_STATUS) => void
    setDeviceWS: (Device: Device, ws: object) => void
    setSelectedDevice: (Device: Device) => void
    resetSelectedDevice: () => void
}

const AppDeviceContext = createContext<AppDeviceContext>()
export const AppDeviceProvider: ParentComponent = (props) => {
    const defaultState: AppStoreDevice = {
        devices: [],
        selectedDevice: {
            id: uuidv4(),
            name: '',
            status: DEVICE_STATUS.NONE,
            type: DEVICE_TYPE.NONE,
            address: '',
            activeDeviceSection: '',
            ws: {},
        },
    }

    const [state, setState] = createStore<AppStoreDevice>(defaultState)

    const setAddDevice = (device: Device) => {
        setState(
            produce((s) => {
                s.devices.push(device)
            }),
        )
    }

    const setDevice = (device: Device) => {
        setState(
            produce((s) => {
                s.devices = s.devices.filter((c: { id: string }) => c.id !== device.id)
                s.devices.push(device)
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

    const DeviceState = createMemo(() => state)

    const getDevices = createMemo(() => DeviceState().devices)
    const getDeviceAddresses = createMemo(() => DeviceState().devices.map(({ address }) => address))
    const getDeviceStatus = createMemo(() => DeviceState().devices.map(({ status }) => status))
    const getSelectedDevice = createMemo(() => DeviceState().selectedDevice)
    const getSelectedDeviceAddress = createMemo(() => DeviceState().selectedDevice.address)
    const getSelectedDeviceStatus = createMemo(() => DeviceState().selectedDevice.status)
    const getSelectedDeviceType = createMemo(() => DeviceState().selectedDevice.type)
    const getSelectedDeviceSection = createMemo(
        () => DeviceState().selectedDevice.activeDeviceSection,
    )
    const getSelectedDeviceSocket = createMemo(() => DeviceState().selectedDevice.ws)

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
                getSelectedDeviceSection,
                getSelectedDeviceSocket,
                setDevice,
                setAddDevice,
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
