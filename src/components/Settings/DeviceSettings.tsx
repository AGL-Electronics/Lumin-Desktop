import { useNavigate } from '@solidjs/router'

import { useFormHandler } from 'solid-form-handler'
import { yupSchema } from 'solid-form-handler/yup'
import { createMemo, onMount, type Component } from 'solid-js'
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
import { selectionSignals, inputSignals, dataLabels, wiredSchema, wifiSchema } from '@src/static'
import { useAppNotificationsContext } from '@src/store/context/notifications'
import { DEVICE_STATUS, ENotificationType } from '@static/enums'
import { Device, Notifications } from '@static/types'
import { useAppContext } from '@store/context/app'
import { useAppDeviceContext } from '@store/context/device'
const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    const { appState } = useAppContext()
    const { setDevice, getSelectedDevice, setRemoveDevice } = useAppDeviceContext()
    const { addNotification } = useAppNotificationsContext()
    const navigate = useNavigate()

    const wiredFormHandler = useFormHandler(yupSchema(wiredSchema))
    //const wifiFormHandler = useFormHandler(yupSchema(wifiSchema))
    const { formData } = wiredFormHandler
    //const { formData: wifiFormData } = wifiFormHandler

    onMount(() => {
        //selectionSignals[dataLabels.deviceType]?.value() === DEVICE_TYPE.WIRELESS
    })

    const handleSelectionChange = (dataLabel: string, value: string) => {
        if (!selectionSignals[dataLabel]) return
        selectionSignals[dataLabel].setValue(value)
    }

    const handleInputChange = (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => {
        console.debug(e.currentTarget.dataset.label, e.currentTarget.value)

        const dataLabel = e.currentTarget.dataset.label as string
        if (!inputSignals[dataLabel]) return

        const value = e.currentTarget.value
        inputSignals[dataLabel].setValue(value)
    }

    const handleToggleChange = (isChecked: boolean) => {
        console.debug('Toggle:', isChecked)
        inputSignals[dataLabels.flashFirmware]?.setValue(isChecked)
    }

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
            await wiredFormHandler.validateForm()
            //alert('Data sent with success: ' + JSON.stringify(formData()))
            // if we are not in create mode, then we are in edit mode, in edit mode we take the selected device and update it
            if (!props.createNewDevice) {
                const selectedDevice = getSelectedDevice()
                if (!selectedDevice) return

                // TODO: Update the selected device with the new data

                /* const device = {
                ledType: selectionSignals['led-type'].selectedValue(),
                ledCount: selectionSignals['led-bars-connected'].selectedValue(),
                ledConnection: selectionSignals['led-connection-point'].selectedValue(),
            }

            setDevice({ ...selectedDevice, ...device }) */
                return
            }

            const device: Device = {
                id: uuidv4(),
                name: inputSignals[dataLabels.deviceLabel]?.value(),
                status: DEVICE_STATUS.LOADING,
                hasCamera: false,
                type: selectionSignals[dataLabels.deviceType]?.value(),
                serialNumber: inputSignals[dataLabels.printerSerialNumber]?.value(),
                lanCode: inputSignals[dataLabels.mqttPassword]?.value(),
                wifi: {
                    ssid: inputSignals[dataLabels.wifiSsid]?.value(),
                    password: inputSignals[dataLabels.wifiPassword]?.value(),
                },
                address: inputSignals[dataLabels.luminDeviceAddress]?.value(),
                led: {
                    ledCount: inputSignals[dataLabels.ledBarsConnected]?.value(),
                    ledType: selectionSignals[dataLabels.ledType]?.value(),
                    ledConnection: selectionSignals[dataLabels.ledConnectionPoint]?.value(),
                },
                ws: {},
            }

            console.debug('Device:', device)

            setDevice(device)

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

            if (inputSignals[dataLabels.flashFirmware]?.value()) navigate('/flashFirmware')
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
        setRemoveDevice(selectedDevice)

        navigate('/')

        addNotification({
            title: 'Device Deleted',
            message: `${selectedDevice.name} has been deleted.`,
            type: ENotificationType.SUCCESS,
        })

        console.debug('Delete', selectedDevice.id, selectedDevice.name)
    }

    const submitLabel = createMemo(() => {
        if (props.createNewDevice) {
            if (inputSignals[dataLabels.flashFirmware]?.value()) {
                return 'Flash Firmware'
            }
            return 'Create Device'
        }
        return 'Update Device'
    })

    const handleValueChange = (dataLabel: string): string => {
        // if we are NOT creating a new device, then we are editing an existing device, set the form data to the selected device data
        if (props.createNewDevice) return ''

        console.debug('Data Label:', dataLabel)

        const selectedDevice = getSelectedDevice()

        if (!selectedDevice) {
            console.error('No device selected')
            return ''
        }

        switch (dataLabel) {
            case dataLabels.deviceLabel:
                return selectedDevice.name
            case dataLabels.deviceType:
                return selectedDevice.type
            case dataLabels.printerSerialNumber:
                return selectedDevice.serialNumber
            case dataLabels.mqttPassword:
                return selectedDevice.lanCode
            case dataLabels.wifiSsid:
                return selectedDevice.wifi.ssid
            case dataLabels.wifiPassword:
                return selectedDevice.wifi.password
            case dataLabels.luminDeviceAddress:
                return selectedDevice.address
            case dataLabels.ledBarsConnected:
                return selectedDevice.led.ledCount
            case dataLabels.ledType:
                return selectedDevice.led.ledType
            case dataLabels.ledConnectionPoint:
                return selectedDevice.led.ledConnection
            default:
                return ''
        }
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
                                Device Settings
                            </Label>
                        </CardTitle>
                    </Flex>
                </CardHeader>
                <CardContent class="w-full overflow-y-scroll">
                    <form
                        autocomplete="off"
                        class="flex flex-col w-full pb-4 pr-2 overflow-y-scroll"
                        onSubmit={handleSubmit}>
                        <div class="flex justify-center flex-col items-center lg:items-start lg:flex-row gap-5">
                            <div class="w-full">
                                <GeneralSettings
                                    createNewDevice={props.createNewDevice}
                                    deviceStatus={props.deviceStatus}
                                    handleInputChange={handleInputChange}
                                    handleSelectionChange={handleSelectionChange}
                                    handleToggleChange={handleToggleChange}
                                    formHandler={wiredFormHandler}
                                    handleValueChange={handleValueChange}
                                />
                                <NetworkSettings
                                    createNewDevice={props.createNewDevice}
                                    enableMDNS={appState().enableMDNS}
                                    deviceStatus={props.deviceStatus}
                                    handleInputChange={handleInputChange}
                                    formHandler={wiredFormHandler}
                                    handleValueChange={handleValueChange}
                                />
                                <LEDSettings
                                    createNewDevice={props.createNewDevice}
                                    deviceStatus={props.deviceStatus}
                                    selectionSignals={selectionSignals}
                                    handleInputChange={handleInputChange}
                                    handleSelectionChange={handleSelectionChange}
                                    formHandler={wiredFormHandler}
                                    handleValueChange={handleValueChange}
                                />
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
