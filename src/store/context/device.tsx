import {
    createContext,
    useContext,
    createMemo,
    type ParentComponent,
    Accessor,
    onMount,
    createEffect,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { useAppContext } from './app'
import type { Device, AppStoreDevice } from '@static/types'
import { UniqueArray } from '@src/static/uniqueArray'
import { DEVICE_MODIFY_EVENT, DEVICE_STATUS, DEVICE_TYPE, RESTStatus } from '@static/enums'

interface AppDeviceContext {
    getDevices: Accessor<UniqueArray<Device>>
    getSelectedDevice: Accessor<Device | undefined>
    getSelectedDeviceAddress: Accessor<string | undefined>
    getSelectedDeviceStatus: Accessor<DEVICE_STATUS | undefined>
    getSelectedDeviceType: Accessor<DEVICE_TYPE | undefined>
    getSelectedDeviceSocket: Accessor<object | undefined>
    setDevice: (device: Device, event: DEVICE_MODIFY_EVENT) => void
    setDeviceMDNS: (deviceID: string, address: string) => void
    setDeviceStatus: (deviceID: string, status: DEVICE_STATUS) => void
    setDeviceWS: (deviceID: string, ws: object) => void
    setSelectedDevice: (device: Device) => void
    setDeviceRestResponse: (deviceID: string, response: object) => void
    setDeviceRestStatus: (deviceID: string, status: RESTStatus) => void
    resetSelectedDevice: () => void
}

const AppDeviceContext = createContext<AppDeviceContext>()
export const AppDeviceProvider: ParentComponent = (props) => {
    const { handleDeviceChange, devices } = useAppContext()

    const defaultState: AppStoreDevice = {
        devices: UniqueArray.from([]),
        selectedDevice: undefined,
    }

    const [state, setState] = createStore<AppStoreDevice>(defaultState)

    const setDevice = (device: Device, event: DEVICE_MODIFY_EVENT) => {
        setState(
            produce((s) => {
                switch (event) {
                    case DEVICE_MODIFY_EVENT.PUSH: {
                        s.devices.add(device)
                        handleDeviceChange(s.devices.allItems)
                        return s
                    }
                    case DEVICE_MODIFY_EVENT.UPDATE: {
                        const newItems = s.devices.map((dvc) => {
                            if (dvc.id === device.id) {
                                return device
                            }
                            return dvc
                        })

                        s.devices = UniqueArray.from(newItems)

                        handleDeviceChange(s.devices.allItems)
                        return s
                    }
                    case DEVICE_MODIFY_EVENT.DELETE: {
                        const newItems = s.devices.filter((dvc) => dvc.id !== device.id)
                        s.devices = UniqueArray.from(newItems)
                        handleDeviceChange(s.devices.allItems)
                        return s
                    }
                    default:
                        return s
                }
            }),
        )
    }

    const setDeviceMDNS = (deviceID: string, mdns: string) => {
        setState(
            produce((s) => {
                const newItems = s.devices.map((dvc) => {
                    if (dvc.id === deviceID) {
                        return { ...dvc, network: { ...dvc.network, mdns } }
                    }
                    return dvc
                })

                s.devices = UniqueArray.from(newItems)
            }),
        )
    }

    const setDeviceStatus = (deviceID: string, status: DEVICE_STATUS) => {
        setState(
            produce((s) => {
                const newItems = s.devices.map((dvc) => {
                    if (dvc.id === deviceID) {
                        return { ...dvc, status }
                    }
                    return dvc
                })

                s.devices = UniqueArray.from(newItems)
            }),
        )
    }

    const setDeviceWS = (deviceID: string, ws: object) => {
        setState(
            produce((s) => {
                const newItems = s.devices.map((dvc) => {
                    if (dvc.id === deviceID) {
                        return { ...dvc, ws }
                    }
                    return dvc
                })

                s.devices = UniqueArray.from(newItems)
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

    const setDeviceRestStatus = (deviceID: string, status: RESTStatus) => {
        setState(
            produce((s) => {
                const newItems = s.devices.map((dvc) => {
                    if (dvc.id === deviceID) {
                        return {
                            ...dvc,
                            network: {
                                ...dvc.network,
                                restAPI: { ...dvc.network.restAPI, status },
                            },
                        }
                    }
                    return dvc
                })

                s.devices = UniqueArray.from(newItems)
            }),
        )
    }

    const setDeviceRestResponse = (deviceID: string, response: object) => {
        setState(
            produce((s) => {
                // grab the device and push the response to the restAPI.response array
                const newItems = s.devices.map((dvc) => {
                    if (dvc.id === deviceID) {
                        if (!Array.isArray(dvc.network.restAPI.response)) {
                            console.error(
                                'restAPI.response is not an array:',
                                dvc.network.restAPI.response,
                            )
                        }
                        const currentResponses = Array.isArray(dvc.network.restAPI.response)
                            ? dvc.network.restAPI.response
                            : []
                        return {
                            ...dvc,
                            network: {
                                ...dvc.network,
                                restAPI: {
                                    ...dvc.network.restAPI,
                                    response: [...currentResponses, response],
                                },
                            },
                        }
                    }
                    return dvc
                })

                s.devices = UniqueArray.from(newItems)
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

    onMount(() => {
        /*  doGHRequest()
        useMDNSScanner('_lumin._tcp', 5).then(() => {
            // TODO: handle devices found
        }) */
    })

    createEffect(() => {
        if (devices()) {
            setState(
                produce((s) => {
                    s.devices = UniqueArray.from(devices())
                }),
            )
        }
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
                setDeviceRestResponse,
                setDeviceRestStatus,
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
