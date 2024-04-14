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
import { ANIMATION_MODE, DEVICE_STATUS, ENotificationType, POPOVER_ID } from '@static/enums'
import { Device } from '@static/types'
import { UniqueArray } from '@static/uniqueArray'

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
    devices: UniqueArray<Device>
    firmwareVersion: string
}

const Dashboard: Component<DashboardProps> = (props) => {
    const { useRequestHook } = useAppAPIContext()
    const { setDeviceStatus } = useAppDeviceContext()
    const { addNotification } = useAppNotificationsContext()

    const [displayMode, setDisplayMode] = createSignal(POPOVER_ID.LIST)

    const handleDeviceCheck = () => {
        if (props.devices.size === 0) {
            return
        }

        props.devices.allItems.forEach((device) => {
            useRequestHook('ping', device.id)
                .then((res) => {
                    if (res.status === 'error') {
                        addNotification({
                            title: 'Error',
                            message: `${device.name} is not reachable.`,
                            type: ENotificationType.ERROR,
                        })

                        setDeviceStatus(device.id, DEVICE_STATUS.FAILED)

                        return
                    }

                    setDeviceStatus(device.id, DEVICE_STATUS.ACTIVE)
                })
                .catch((err) => {
                    console.error(err)
                    setDeviceStatus(device.id, DEVICE_STATUS.FAILED)
                })
        })
    }

    createEffect(() => {
        const interval = setInterval(() => {
            handleDeviceCheck()
        }, 65000)
        onCleanup(() => {
            clearInterval(interval)
        })
    })

    onMount(() => {
        handleDeviceCheck()
    })

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
                            <For each={props.devices.allItems}>
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
                        <Show when={props.devices.size > 0}>
                            <ListHeader />
                            <For each={props.devices.allItems}>
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
