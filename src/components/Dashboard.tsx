import { createSignal, For, Switch, Match, Show, createEffect, onCleanup, onMount } from 'solid-js'
import { createAsyncMemo } from 'solidjs-use'
import type { Component } from 'solid-js'
import CustomSlideAnimation from '@components/CustomSlideAnimation'
import DeviceComponent from '@components/Device'
import CreateDevice from '@components/Device/CreateDevice'
import List from '@components/List/List'
import ListHeader from '@components/List/ListHeader'
import Popover from '@components/Popover'
import { Flex } from '@components/ui/flex'
import { Col, Grid } from '@components/ui/grid'
import { Icons } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { useAppAPIContext } from '@src/store/context/api'
import { useAppDeviceContext } from '@src/store/context/device'
import { useAppNotificationsContext } from '@src/store/context/notifications'
import {
    ANIMATION_MODE,
    DEVICE_MODIFY_EVENT,
    DEVICE_STATUS,
    ENotificationType,
    POPOVER_ID,
    RESTStatus,
} from '@static/enums'
import { Device } from '@static/types'

/**
 * Dashboard component:
 *
 * Will iterate over discovered devices and display them in cards
 * Clicking on a card will take the user to the device's page
 * Each card will have basic information about the device, and buttons for turning off and on the device
 * The cards can be displayed in grid view or list view
 * The cards will have an indicator for the device's status
 * The a button for adding a new device will be accessible from the dashboard
 */

interface DashboardProps {
    onClickNavigateDevice: (device: Device) => void
    onClickNavigateCreateDevice: () => void
    firmwareVersion: string
}

const Dashboard: Component<DashboardProps> = (props) => {
    const { useRequestHook } = useAppAPIContext()
    const { setDeviceStatus, setDevice, getDevices } = useAppDeviceContext()
    const { addNotification } = useAppNotificationsContext()

    const [displayMode, setDisplayMode] = createSignal(POPOVER_ID.LIST)
    const [rssi, setRssi] = createSignal(-95)

    //#region Handling Device Detection

    const handleDeviceCheck = async (device: Device) => {
        if (getDevices().size === 0) {
            return
        }

        try {
            await useRequestHook('ping', device.id)

            const deviceRestStatus = device.network.restAPI.status
            console.debug('Checking device:', device.name)

            if (deviceRestStatus === RESTStatus.FAILED) {
                console.debug('Device not reachable:', device.name)
                throw new Error(`${device.name} is not reachable.`)
            }

            setDeviceStatus(device.id, DEVICE_STATUS.ACTIVE)
        } catch (error) {
            addNotification({
                title: 'Device Detection Error',
                message: `Failed to detect ${device.name} - ${error}.`,
                type: ENotificationType.ERROR,
            })
            setDeviceStatus(device.id, DEVICE_STATUS.FAILED)

            const _device: Device = {
                ...device,
                network: {
                    ...device.network,
                    wifi: {
                        ...device.network.wifi,
                        rssi: -95,
                    },
                },
            }

            setDevice(_device, DEVICE_MODIFY_EVENT.UPDATE)
        }
    }

    const handleDeviceRSSI = async (device: Device) => {
        if (getDevices().size === 0) {
            return
        }

        try {
            console.debug('Checking wifi strength:', device.name)

            if (
                [
                    DEVICE_STATUS.FAILED,
                    DEVICE_STATUS.DISABLED,
                    DEVICE_STATUS.NONE,
                    DEVICE_STATUS.LOADING,
                ].includes(device.status)
            ) {
                console.debug('Device status is not active:', device.name)
                throw new Error(`${device.name} is not reachable.`)
            }

            await useRequestHook('wifiStrength', device.id, undefined, '?points=10')

            const wifiStatus = device.network.restAPI.status

            if (wifiStatus === RESTStatus.FAILED) {
                console.error('Failed to get wifi strength:', device.name)
                throw new Error(`${device.name} is not reachable.`)
            }

            const wifiRes = device.network.restAPI.response

            if (!wifiRes) {
                throw new Error('Invalid RSSI response format')
            }

            // find the object in the data array that contains an rssi key
            const rssi = wifiRes.find((d: any) => d.rssi)?.rssi
            console.debug('RSSI:', rssi)
            setRssi(rssi)
        } catch (error) {
            addNotification({
                title: 'Device Detection Error',
                message: `Failed to detect ${device.name} - ${error}.`,
                type: ENotificationType.ERROR,
            })
            setDeviceStatus(device.id, DEVICE_STATUS.FAILED)

            const _device: Device = {
                ...device,
                network: {
                    ...device.network,
                    wifi: {
                        ...device.network.wifi,
                        rssi: -95,
                    },
                },
            }

            setDevice(_device, DEVICE_MODIFY_EVENT.UPDATE)
        }
    }

    createEffect(() => {
        const interval = setInterval(async () => {
            await Promise.all(
                getDevices().allItems.map(async (device) => {
                    // Handle each device independently
                    await handleDeviceCheck(device)
                }),
            )
            await Promise.all(
                getDevices().allItems.map(async (device) => {
                    // Handle each device independently
                    await handleDeviceRSSI(device)
                }),
            )
        }, 30000)

        onCleanup(() => {
            clearInterval(interval)
        })
    })

    createEffect(() => {
        const devices = getDevices().allItems
        for (const device of devices) {
            if (device.network.wifi.rssi !== rssi()) {
                const _device: Device = {
                    ...device,
                    network: {
                        ...device.network,
                        wifi: {
                            ...device.network.wifi,
                            rssi: rssi(),
                        },
                    },
                }
                console.debug('Updating device RSSI:', device.name, rssi())
                setDevice(_device, DEVICE_MODIFY_EVENT.UPDATE)
            }
        }
    })

    onMount(() => {
        addNotification({
            title: 'Welcome to the Lumin LED Controller',
            message: 'This is the dashboard where you can manage your devices.',
            type: ENotificationType.INFO,
        })
    })

    onMount(async () => {
        await Promise.all(
            getDevices().allItems.map(async (device) => {
                // Handle each device independently
                await handleDeviceCheck(device)
            }),
        )
        await Promise.all(
            getDevices().allItems.map(async (device) => {
                // Handle each device independently
                await handleDeviceRSSI(device)
            }),
        )
    })

    //#endregion

    onCleanup(() => {
        setDisplayMode(POPOVER_ID.LIST)
    })

    return (
        <div
            class="flex-grow w-full"
            style={{
                transition: 'width 0.3s ease-in-out',
            }}>
            <div class="py-4 px-2">
                <Flex
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="between"
                    class="w-full mt-4 gap-4">
                    <Flex class="items-center">
                        <Label size="3xl" weight="bold" class="tracking-[0.02em] text-white">
                            DEVICES
                        </Label>
                    </Flex>
                    <div class="mx-auto">
                        <CustomSlideAnimation
                            defaultAnimationMode={ANIMATION_MODE.LIST}
                            defaultDisplayMode={POPOVER_ID.LIST}
                            firstChild={
                                <div
                                    class="flex p-2"
                                    onPointerDown={() => setDisplayMode(POPOVER_ID.GRIP)}>
                                    <Popover
                                        styles="h-full"
                                        popoverContent={POPOVER_ID.GRIP}
                                        trigger={<Icons.grip color="#ffffff" size={20} />}
                                        disablePopover={true}
                                    />
                                </div>
                            }
                            secondChild={
                                <div
                                    class="flex p-2"
                                    onPointerDown={() => setDisplayMode(POPOVER_ID.LIST)}>
                                    <Popover
                                        styles="h-full"
                                        popoverContent={POPOVER_ID.GRIP}
                                        trigger={<Icons.list color="#ffffff" size={20} />}
                                        disablePopover={true}
                                    />
                                </div>
                            }
                        />
                    </div>
                </Flex>
                <Switch>
                    <Match when={displayMode() === POPOVER_ID.GRIP}>
                        <Grid cols={4} colsSm={2} colsMd={4} colsLg={4} class="gap-4">
                            <For each={getDevices().allItems}>
                                {(device) => (
                                    <Col span={4} spanSm={1} spanMd={2} spanLg={4}>
                                        <div class="pt-3">
                                            <DeviceComponent
                                                firmwareVersion={props.firmwareVersion}
                                                {...device}
                                                onPointerDown={() =>
                                                    props.onClickNavigateDevice(device)
                                                }
                                            />
                                        </div>
                                    </Col>
                                )}
                            </For>
                            <Col span={4} spanSm={1} spanMd={2} spanLg={4}>
                                <CreateDevice
                                    type={POPOVER_ID.GRIP}
                                    onPointerDown={() => props.onClickNavigateCreateDevice()}
                                />
                            </Col>
                        </Grid>
                    </Match>
                    <Match when={displayMode() === POPOVER_ID.LIST}>
                        <Show when={getDevices().size > 0}>
                            <ListHeader />
                            <For each={getDevices().allItems}>
                                {(device) => (
                                    <List
                                        {...device}
                                        onPointerDown={() => props.onClickNavigateDevice(device)}
                                    />
                                )}
                            </For>
                        </Show>
                        <CreateDevice
                            type={POPOVER_ID.LIST}
                            onPointerDown={() => props.onClickNavigateCreateDevice()}
                        />
                    </Match>
                </Switch>
            </div>
        </div>
    )
}

export default Dashboard
