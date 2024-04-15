import { createSignal, For, Switch, Match, Show, createEffect, onCleanup, onMount } from 'solid-js'
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

    //#region Handling Device Detection

    const handleDeviceCheck = () => {
        if (getDevices().size === 0) {
            return
        }

        getDevices().allItems.forEach(async (device) => {
            const resPing = await useRequestHook('ping', device.id)

            if (resPing.status === 'error') {
                addNotification({
                    title: 'Error',
                    message: `${device.name} is not reachable.`,
                    type: ENotificationType.ERROR,
                })

                setDeviceStatus(device.id, DEVICE_STATUS.FAILED)

                return
            }

            setDeviceStatus(device.id, DEVICE_STATUS.ACTIVE)

            if (
                device.status === DEVICE_STATUS.FAILED ||
                device.status === DEVICE_STATUS.DISABLED ||
                device.status === DEVICE_STATUS.NONE ||
                device.status === DEVICE_STATUS.LOADING
            ) {
                return
            }

            const resRSSI = await useRequestHook('wifiStrength', device.id, undefined, '?points=10')

            if (resRSSI.status === 'error') {
                addNotification({
                    title: 'Error',
                    message: 'Device is not reachable.',
                    type: ENotificationType.ERROR,
                })

                setDeviceStatus(device.id, DEVICE_STATUS.FAILED)

                return
            }

            const data = resRSSI.data as { rssi: number }

            if (data.rssi < -80) {
                addNotification({
                    title: 'Warning',
                    message: 'Device signal is weak.',
                    type: ENotificationType.WARNING,
                })
            }

            setDeviceStatus(device.id, DEVICE_STATUS.ACTIVE)

            const _device: Device = {
                ...device,
                network: {
                    ...device.network,
                    wifi: {
                        ...device.network.wifi,
                        rssi: data.rssi,
                    },
                },
            }

            setDevice(_device, DEVICE_MODIFY_EVENT.UPDATE)
        })
    }

    createEffect(() => {
        const interval = setInterval(() => {
            handleDeviceCheck()
        }, 30000)

        onCleanup(() => {
            clearInterval(interval)
        })
    })

    onMount(() => {
        handleDeviceCheck()
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
