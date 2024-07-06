import { useNavigate } from '@solidjs/router'
import { confirm } from '@tauri-apps/api/dialog'
import { createMemo, Show, type Component } from 'solid-js'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'
import { DeviceSettingsContentProps } from './DeviceSettingUtil'
import GeneralSettings from './GeneralSettings'
import LEDControl from './LEDControl'
import LEDSettings from './LEDSettings'
import NetworkSettings from './NetworkSettings'
import FormActions from '@components/Modal/FormActions'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { capitalizeFirstLetter } from '@src/lib/utils'
import { useAppAPIContext } from '@src/store/context/api'
import { useAppNotificationsContext } from '@src/store/context/notifications'
import {
    DEVICE_MODIFY_EVENT,
    DEVICE_STATUS,
    ENotificationType,
    REST_CMDS,
    RESTStatus,
} from '@static/enums'
import { Device, IPOSTCommand, Notifications } from '@static/types'
import { useAppDeviceContext } from '@store/context/device'
import { wiredFormHandler, useDeviceSettingsContext } from '@store/context/deviceSettings'

interface DeviceSettingsMainProps extends DeviceSettingsContentProps {
    handleBackButton: (e: PointerEvent) => void
}

const DeviceSettingsMain: Component<DeviceSettingsMainProps> = (props) => {
    const { setDevice, getSelectedDevice, setDeviceStatus } = useAppDeviceContext()
    const { addNotification } = useAppNotificationsContext()
    const { useRequestHook } = useAppAPIContext()
    const { settings, clearStore } = useDeviceSettingsContext()
    const navigate = useNavigate()

    const handleDeviceRequest = async (device: Device, command: IPOSTCommand) => {
        try {
            const response = await useRequestHook('jsonHandler', device.id, undefined, command)

            console.debug('Response:', response)

            if (response.status === RESTStatus.FAILED) {
                throw new Error(`Failed to update ${device.name} LEDs. ${response.response}`)
            }

            addNotification({
                title: 'Device Config Update',
                message: `${device.name} device config has been updated.`,
                type: ENotificationType.SUCCESS,
            })

            const res = await useRequestHook('save', device.id)

            if (res.status === RESTStatus.FAILED) {
                throw new Error(`Failed to save ${device.name} device config. ${res.response}`)
            }

            console.debug('Device saved:', res.response)

            addNotification({
                title: 'Device Config Saved',
                message: `${device.name} device config has been saved. Device has been rebooted.`,
                type: ENotificationType.SUCCESS,
            })
        } catch (error) {
            console.error('Error:', error)
            addNotification({
                title: 'Error',
                message: `Failed to update device. ${error}`,
                type: ENotificationType.ERROR,
            })
            setDeviceStatus(device.id, DEVICE_STATUS.FAILED)
        }
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault()

        try {
            //await wiredFormHandler.validateForm()
            let device: Device

            if (!props.createNewDevice) {
                const selectedDevice = getSelectedDevice()
                if (!selectedDevice) return

                device = {
                    ...selectedDevice,
                    name: settings.generalSettings.deviceLabel,
                    type: settings.generalSettings.deviceType,
                    serialNumber: settings.generalSettings.printerSerialNumber,
                    lastUpdate: Date.now(),
                    network: {
                        ...selectedDevice.network,
                        lanCode: settings.generalSettings.lanCode,
                        // TODO: Add mDNS scanning support
                        address:
                            settings.networkSettings.luminDeviceAddress === 'auto'
                                ? ''
                                : settings.networkSettings.luminDeviceAddress,
                        wifi: {
                            ...selectedDevice.network.wifi,
                            ssid: settings.networkSettings.wifiSSID,
                            password: settings.networkSettings.wifiPassword,
                            apModeStatus: false,
                        },
                    },
                    led: {
                        settings: {
                            ledBarsConnected: settings.ledSettings.ledBarsConnected,
                            ledType: settings.ledSettings.ledType,
                            ledConnectionPoint: settings.ledSettings.ledConnectionPoint,
                        },
                        ledControlSettings: {
                            behavior: {
                                maintenanceModeToggle:
                                    settings.ledControlSettings.behavior.maintenanceModeToggle,
                                replicateLedStateToggle:
                                    settings.ledControlSettings.behavior.replicateLedStateToggle,
                                rgbCycleToggle: settings.ledControlSettings.behavior.rgbCycleToggle,
                                showWifiStrengthToggle:
                                    settings.ledControlSettings.behavior.showWifiStrengthToggle,
                                testLedsToggle: settings.ledControlSettings.behavior.testLedsToggle,
                                disableLEDSToggle:
                                    settings.ledControlSettings.behavior.disableLEDSToggle,
                            },
                            options: {
                                finishIndicationToggle:
                                    settings.ledControlSettings.options.finishIndicationToggle,
                                finishIndicationColor:
                                    settings.ledControlSettings.options.finishIndicationColor,
                                exitFinishAfterToggle:
                                    settings.ledControlSettings.options.exitFinishAfterToggle,
                                exitFinishAfterTime:
                                    settings.ledControlSettings.options.exitFinishAfterTime,
                                inactivityTimeout:
                                    settings.ledControlSettings.options.inactivityTimeout,
                                debuggingToggle:
                                    settings.ledControlSettings.options.debuggingToggle,
                                debuggingOnchangeEventsToggle:
                                    settings.ledControlSettings.options
                                        .debuggingOnchangeEventsToggle,
                                mqttLoggingToggle:
                                    settings.ledControlSettings.options.mqttLoggingToggle,
                                inactivityTimeoutToggle:
                                    settings.ledControlSettings.options.inactivityTimeoutToggle,
                            },
                            printer: {
                                p1PrinterToggle:
                                    settings.ledControlSettings.printer.p1PrinterToggle,
                                doorSwitchToggle:
                                    settings.ledControlSettings.printer.doorSwitchToggle,
                                lidarStageCleaningNozzleColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageCleaningNozzleColor,
                                lidarStageBedLevelingColor:
                                    settings.ledControlSettings.printer.lidarStageBedLevelingColor,
                                lidarStageCalibratingExtrusionColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageCalibratingExtrusionColor,
                                lidarStageScanningBedSurfaceColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageScanningBedSurfaceColor,
                                lidarStageFirstLayerInspectionColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageFirstLayerInspectionColor,
                            },
                            customizeColors: {
                                errorDetectionToggle:
                                    settings.ledControlSettings.customizeColors
                                        .errorDetectionToggle,
                                wifiSetupColor:
                                    settings.ledControlSettings.customizeColors.wifiSetupColor,
                                pauseColor: settings.ledControlSettings.customizeColors.pauseColor,
                                firstLayerErrorColor:
                                    settings.ledControlSettings.customizeColors
                                        .firstLayerErrorColor,
                                nozzleCloggedColor:
                                    settings.ledControlSettings.customizeColors.nozzleCloggedColor,
                                hmsSeveritySeriousColor:
                                    settings.ledControlSettings.customizeColors
                                        .hmsSeveritySeriousColor,
                                hmsSeverityFatalColor:
                                    settings.ledControlSettings.customizeColors
                                        .hmsSeverityFatalColor,
                                filamentRunoutColor:
                                    settings.ledControlSettings.customizeColors.filamentRunoutColor,
                                frontCoverRemovedColor:
                                    settings.ledControlSettings.customizeColors
                                        .frontCoverRemovedColor,
                                nozzleTempFailColor:
                                    settings.ledControlSettings.customizeColors.nozzleTempFailColor,
                                bedTempFailColor:
                                    settings.ledControlSettings.customizeColors.bedTempFailColor,
                            },
                        },
                    },
                }

                setDevice(device, DEVICE_MODIFY_EVENT.UPDATE)
                console.debug('Updating device')
            } else {
                device = {
                    id: uuidv4(),
                    lastUpdate: Date.now(),
                    name: settings.generalSettings.deviceLabel,
                    type: settings.generalSettings.deviceType,
                    status: DEVICE_STATUS.LOADING,
                    serialNumber: settings.generalSettings.printerSerialNumber,
                    network: {
                        lanCode: settings.generalSettings.lanCode,
                        address:
                            settings.networkSettings.luminDeviceAddress === 'auto'
                                ? ''
                                : settings.networkSettings.luminDeviceAddress,
                        wifi: {
                            ssid: settings.networkSettings.wifiSSID,
                            password: settings.networkSettings.wifiPassword,
                            apModeStatus: false,
                            rssi: -95,
                        },
                    },
                    led: {
                        settings: {
                            ledBarsConnected: settings.ledSettings.ledBarsConnected,
                            ledType: settings.ledSettings.ledType,
                            ledConnectionPoint: settings.ledSettings.ledConnectionPoint,
                        },
                        ledControlSettings: {
                            behavior: {
                                maintenanceModeToggle:
                                    settings.ledControlSettings.behavior.maintenanceModeToggle,
                                replicateLedStateToggle:
                                    settings.ledControlSettings.behavior.replicateLedStateToggle,
                                rgbCycleToggle: settings.ledControlSettings.behavior.rgbCycleToggle,
                                showWifiStrengthToggle:
                                    settings.ledControlSettings.behavior.showWifiStrengthToggle,
                                testLedsToggle: settings.ledControlSettings.behavior.testLedsToggle,
                                disableLEDSToggle:
                                    settings.ledControlSettings.behavior.disableLEDSToggle,
                            },
                            options: {
                                finishIndicationToggle:
                                    settings.ledControlSettings.options.finishIndicationToggle,
                                finishIndicationColor:
                                    settings.ledControlSettings.options.finishIndicationColor,
                                exitFinishAfterToggle:
                                    settings.ledControlSettings.options.exitFinishAfterToggle,
                                exitFinishAfterTime:
                                    settings.ledControlSettings.options.exitFinishAfterTime,
                                inactivityTimeout:
                                    settings.ledControlSettings.options.inactivityTimeout,
                                debuggingToggle:
                                    settings.ledControlSettings.options.debuggingToggle,
                                debuggingOnchangeEventsToggle:
                                    settings.ledControlSettings.options
                                        .debuggingOnchangeEventsToggle,
                                mqttLoggingToggle:
                                    settings.ledControlSettings.options.mqttLoggingToggle,
                                inactivityTimeoutToggle:
                                    settings.ledControlSettings.options.inactivityTimeoutToggle,
                            },
                            printer: {
                                p1PrinterToggle:
                                    settings.ledControlSettings.printer.p1PrinterToggle,
                                doorSwitchToggle:
                                    settings.ledControlSettings.printer.doorSwitchToggle,
                                lidarStageCleaningNozzleColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageCleaningNozzleColor,
                                lidarStageBedLevelingColor:
                                    settings.ledControlSettings.printer.lidarStageBedLevelingColor,
                                lidarStageCalibratingExtrusionColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageCalibratingExtrusionColor,
                                lidarStageScanningBedSurfaceColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageScanningBedSurfaceColor,
                                lidarStageFirstLayerInspectionColor:
                                    settings.ledControlSettings.printer
                                        .lidarStageFirstLayerInspectionColor,
                            },
                            customizeColors: {
                                errorDetectionToggle:
                                    settings.ledControlSettings.customizeColors
                                        .errorDetectionToggle,
                                wifiSetupColor:
                                    settings.ledControlSettings.customizeColors.wifiSetupColor,
                                pauseColor: settings.ledControlSettings.customizeColors.pauseColor,
                                firstLayerErrorColor:
                                    settings.ledControlSettings.customizeColors
                                        .firstLayerErrorColor,
                                nozzleCloggedColor:
                                    settings.ledControlSettings.customizeColors.nozzleCloggedColor,
                                hmsSeveritySeriousColor:
                                    settings.ledControlSettings.customizeColors
                                        .hmsSeveritySeriousColor,
                                hmsSeverityFatalColor:
                                    settings.ledControlSettings.customizeColors
                                        .hmsSeverityFatalColor,
                                filamentRunoutColor:
                                    settings.ledControlSettings.customizeColors.filamentRunoutColor,
                                frontCoverRemovedColor:
                                    settings.ledControlSettings.customizeColors
                                        .frontCoverRemovedColor,
                                nozzleTempFailColor:
                                    settings.ledControlSettings.customizeColors.nozzleTempFailColor,
                                bedTempFailColor:
                                    settings.ledControlSettings.customizeColors.bedTempFailColor,
                            },
                        },
                    },
                    // TODO: Add camera support
                    hasCamera: false,
                }
                setDevice(device, DEVICE_MODIFY_EVENT.PUSH)
            }

            const command: IPOSTCommand = {
                commands: [
                    {
                        command: REST_CMDS.SET_MQTT,
                        data: {
                            broker: settings.generalSettings.printerIP,
                            password: settings.generalSettings.lanCode,
                            printerSerialNumber: settings.generalSettings.printerSerialNumber,
                        },
                    },
                    {
                        command: REST_CMDS.SET_WIFI,
                        data: {
                            ssid: settings.networkSettings.wifiSSID,
                            password: settings.networkSettings.wifiPassword,
                            channel: 1,
                            power: 52,
                            adhoc: false,
                        },
                    },
                ],
            }

            if (settings.generalSettings.reboot) {
                await handleDeviceRequest(device, command)
            }

            clearStore()

            let notification: Notifications

            if (props.createNewDevice) {
                notification = {
                    title: 'Device Created',
                    message: `${device.name} has been created.`,
                    type: ENotificationType.SUCCESS,
                }
            } else {
                notification = {
                    title: 'Device Updated',
                    message: `${device.name} has been updated.`,
                    type: ENotificationType.SUCCESS,
                }
            }

            addNotification(notification)

            //wiredFormHandler.resetForm()

            if (settings.generalSettings.flashFirmware) navigate('/flashFirmware')
            else navigate('/')
        } catch (error) {
            // loop through the errors and create a notification for each
            const errors = (error as object)['validationResult'] as Array<object>

            for (let i = errors.length - 1; i >= 0; i--) {
                const error = errors[i]

                const message = capitalizeFirstLetter(error['message'].replace(/-/g, ' '))

                addNotification({
                    title: 'Error',
                    message: message,
                    type: ENotificationType.ERROR,
                })
            }
            console.error('Error:', error)
            //reset()
        }
    }

    const handleDelete = async (e: PointerEvent) => {
        e.preventDefault()
        const selectedDevice = getSelectedDevice()
        if (!selectedDevice) return

        const confirmOptions = {
            title: `Delete ${selectedDevice.name}`,
            type: 'warning',
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const confirmed = await confirm('Are you sure?', confirmOptions as any)
        const confirmed2 = await confirm(
            'This action cannot be reverted. Are you sure?',
            confirmOptions as any,
        )

        if (!confirmed || !confirmed2) {
            addNotification({
                title: 'Delete Cancelled',
                message: `${selectedDevice.name} has not been deleted.`,
                type: ENotificationType.INFO,
            })
            return
        }

        console.debug('Delete', selectedDevice.id, selectedDevice.name)
        setDevice(selectedDevice, DEVICE_MODIFY_EVENT.DELETE)

        navigate('/')

        addNotification({
            title: 'Device Deleted',
            message: `${selectedDevice.name} has been deleted.`,
            type: ENotificationType.SUCCESS,
        })
    }

    const submitLabel = createMemo(() => {
        if (props.createNewDevice) {
            if (settings.generalSettings.flashFirmware) {
                return 'Flash Firmware'
            }
            return 'Create Device'
        }
        return 'Update Device'
    })

    const defaultAccordionValue = createMemo(() => {
        if (props.createNewDevice) return ['item-1']
        return ['']
    })

    return (
        <Accordion
            multiple={false}
            defaultValue={defaultAccordionValue()}
            collapsible
            class="w-full">
            <AccordionItem value="item-1" class="p-2 pr-6">
                <AccordionTrigger fill="#fff" stroke="#fff">
                    <CardHeader>
                        <CardTitle>
                            <Label class="text-white" size="xl" weight="extraBold">
                                Device Settings
                            </Label>
                        </CardTitle>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                    <div class="flex flex-col w-full pb-4 pr-2 overflow-y-scroll">
                        <div class="flex justify-center flex-col items-center lg:items-start lg:flex-row gap-5">
                            <div class="w-full">
                                <GeneralSettings createNewDevice={props.createNewDevice} />
                                <NetworkSettings createNewDevice={props.createNewDevice} />
                                <LEDSettings createNewDevice={props.createNewDevice} />
                            </div>
                        </div>
                        <FormActions
                            submitLabel={submitLabel()}
                            cancelLabel="Cancel"
                            onSubmit={handleSubmit}
                            onCancel={props.handleBackButton}
                            onDelete={props.createNewDevice ? undefined : handleDelete}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    const { getSelectedDevice } = useAppDeviceContext()
    const navigate = useNavigate()

    const reset = () => {
        wiredFormHandler.resetForm()
    }

    const handleBackButton = (e: PointerEvent) => {
        e.preventDefault()
        reset()
        navigate('/')
    }

    return (
        <Card class="h-full w-full overflow-y-scroll">
            <Flex
                class="w-full overflow-y-scroll"
                flexDirection="col"
                justifyContent="around"
                alignItems="center">
                <Flex
                    flexDirection="row"
                    justifyContent="start"
                    alignItems="center"
                    class="p-2 cursor-pointer text-white"
                    onPointerDown={handleBackButton}>
                    <Icons.arrowLeft class="mr-3" size={20} />
                    <Label size="lg" class="text-left text-lg text-upper uppercase max-lg:text-sm ">
                        go back to home
                    </Label>
                </Flex>
                <CardHeader>
                    <Flex flexDirection="col" justifyContent="between" alignItems="center">
                        <CardTitle>
                            <Label class="text-white" size="3xl" weight="extraBold">
                                {props.createNewDevice
                                    ? 'Add a Lumin Device'
                                    : getSelectedDevice()?.name}
                            </Label>
                        </CardTitle>
                    </Flex>
                </CardHeader>
                <CardContent class="w-full overflow-y-scroll">
                    <Show when={!props.createNewDevice}>
                        <LEDControl createNewDevice={props.createNewDevice} />
                    </Show>
                    <DeviceSettingsMain {...props} handleBackButton={handleBackButton} />
                </CardContent>
            </Flex>
        </Card>
    )
}

export default DeviceSettingsContent

// TODO: Setup device camera modal - only if device has camera
// TODO: Setup device config viewer - only in selectedDevice mode

/* 
<div class="lg:mt-5 max-w-[700px] w-full">
    <DevicesModal devicesUrl={props.devicesUrl} />
</div>
*/
/* 
<div class="w-full pb-12">
    <DeviceConfig />
</div> */
