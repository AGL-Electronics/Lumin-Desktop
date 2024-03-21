import { useNavigate } from '@solidjs/router'
import { type Component } from 'solid-js'
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
import { selectionSignals, inputSignals, dataLabels } from '@src/static'
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

    const handleBackButton = (e: PointerEvent) => {
        e.preventDefault()
        navigate('/')
    }

    const handleSubmit = (e: PointerEvent) => {
        e.preventDefault()

        // if we are not in create mode, then we are in edit mode, in edit mode we take the selected device and update it
        if (!props.createNewDevice) {
            const selectedDevice = getSelectedDevice()
            if (!selectedDevice) return

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

        navigate('/')

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
                        class="flex flex-col w-full pb-4 pr-2 overflow-y-scroll"
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                        <div class="flex justify-center flex-col items-center lg:items-start lg:flex-row gap-5">
                            <div class="w-full">
                                <GeneralSettings
                                    createNewDevice={props.createNewDevice}
                                    deviceStatus={props.deviceStatus}
                                    handleInputChange={handleInputChange}
                                    handleSelectionChange={handleSelectionChange}
                                />
                                <NetworkSettings
                                    createNewDevice={props.createNewDevice}
                                    enableMDNS={appState().enableMDNS}
                                    deviceStatus={props.deviceStatus}
                                    handleInputChange={handleInputChange}
                                />
                                <LEDSettings
                                    createNewDevice={props.createNewDevice}
                                    deviceStatus={props.deviceStatus}
                                    selectionSignals={selectionSignals}
                                    handleInputChange={handleInputChange}
                                    handleSelectionChange={handleSelectionChange}
                                />
                            </div>
                        </div>
                        <FormActions
                            submitLabel={props.createNewDevice ? 'Create Device' : 'Save'}
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

/* 
<div class="lg:mt-5 max-w-[700px] w-full">
    <DevicesModal devicesUrl={props.devicesUrl} />
</div>
*/
