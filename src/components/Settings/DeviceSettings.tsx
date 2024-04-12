import { useNavigate } from '@solidjs/router'
import { createMemo, type Component } from 'solid-js'
// eslint-disable-next-line import/named
import { v4 as uuidv4 } from 'uuid'
import { DeviceSettingsContentProps } from './DeviceSettingUtil'
import GeneralSettings from './GeneralSettings'
import LEDSettings from './LEDSettings'
import NetworkSettings from './NetworkSettings'
import FormActions from '@components/Modal/FormActions'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { capitalizeFirstLetter } from '@src/lib/utils'
import { useAppNotificationsContext } from '@src/store/context/notifications'
import { DEVICE_MODIFY_EVENT, DEVICE_STATUS, ENotificationType } from '@static/enums'
import { Device, Notifications } from '@static/types'
import { useAppDeviceContext } from '@store/context/device'
import { wiredFormHandler, useDeviceSettingsContext } from '@store/context/deviceSettings'

const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    const { setDevice, getSelectedDevice } = useAppDeviceContext()
    const { addNotification } = useAppNotificationsContext()
    const { settings } = useDeviceSettingsContext()
    const navigate = useNavigate()

    const reset = () => {
        wiredFormHandler.resetForm()
    }

    const handleBackButton = (e: PointerEvent) => {
        e.preventDefault()
        reset()
        navigate('/')
    }

    const handleSubmit = async (e: Event) => {
        e.preventDefault()

        try {
            //await wiredFormHandler.validateForm()
            let device: Device

            if (!props.createNewDevice) {
                console.debug('Updating device')
                const selectedDevice = getSelectedDevice()
                if (!selectedDevice) return

                // generate a new device object with the updated values from the form
                device = {
                    ...selectedDevice,
                    name: settings.generalSettings.deviceLabel,
                    type: settings.generalSettings.deviceType,
                    serialNumber: settings.generalSettings.printerSerialNumber,
                    network: {
                        lanCode: settings.generalSettings.lanCode,
                        // TODO: Add mDNS scanning support
                        address:
                            settings.networkSettings.luminDeviceAddress === 'auto'
                                ? ''
                                : settings.networkSettings.luminDeviceAddress,
                        wifi: {
                            ssid: settings.networkSettings.wifiSSID,
                            password: settings.networkSettings.wifiPassword,
                        },
                    },
                    led: {
                        ledCount: settings.ledSettings.ledBarsConnected,
                        ledType: settings.ledSettings.ledType,
                        ledConnection: settings.ledSettings.ledConnectionPoint,
                    },
                }

                setDevice(device, DEVICE_MODIFY_EVENT.UPDATE)
            } else {
                device = {
                    id: uuidv4(),
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
                        },
                    },
                    led: {
                        ledCount: settings.ledSettings.ledBarsConnected,
                        ledType: settings.ledSettings.ledType,
                        ledConnection: settings.ledSettings.ledConnectionPoint,
                    },
                    // TODO: Add camera support
                    hasCamera: false,
                }
                setDevice(device, DEVICE_MODIFY_EVENT.PUSH)
            }

            console.debug('Device:', device)

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

            wiredFormHandler.resetForm()

            console.debug('Submit', device)

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

    const handleDelete = (e: PointerEvent) => {
        e.preventDefault()
        const selectedDevice = getSelectedDevice()
        if (!selectedDevice) return
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
                                Device Settings
                            </Label>
                        </CardTitle>
                    </Flex>
                </CardHeader>
                <CardContent class="w-full overflow-y-scroll">
                    {/* <Show when={!props.createNewDevice}>
                        // TODO: LEDController settings, conditionally render
                    </Show> */}
                    <form
                        autocomplete="off"
                        class="flex flex-col w-full pb-4 pr-2 overflow-y-scroll"
                        onSubmit={handleSubmit}>
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
                            onCancel={handleBackButton}
                            onDelete={props.createNewDevice ? undefined : handleDelete}
                        />
                    </form>
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
