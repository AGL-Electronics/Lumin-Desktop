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
import { DEVICE_STATUS, DEVICE_TYPE } from '@static/enums'
import { Device } from '@static/types'
import { useAppContext } from '@store/context/app'
import { useAppDeviceContext } from '@store/context/device'

const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    const { appState } = useAppContext()
    const { setDevice, getSelectedDevice } = useAppDeviceContext()
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
        // grab the values from the selectionSignals and inputSignals and set them to the newDevice

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
            status: DEVICE_STATUS.NONE,
            type: DEVICE_TYPE.NONE,
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
    }

    return (
        <Card class="h-full w-full">
            <Flex class="w-full" flexDirection="col" justifyContent="around" alignItems="center">
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
                <CardContent class="w-full">
                    <form
                        class="flex flex-col w-full"
                        onSubmit={(e) => {
                            e.preventDefault()
                        }}>
                        <div class="flex justify-center flex-col items-center lg:items-start lg:flex-row gap-5">
                            <div class="w-full">
                                <GeneralSettings
                                    createNewDevice={props.createNewDevice}
                                    selectionSignals={selectionSignals}
                                    deviceStatus={props.deviceStatus}
                                    handleInputChange={handleInputChange}
                                    handleSelectionChange={handleSelectionChange}
                                />
                                <NetworkSettings
                                    selectionSignals={selectionSignals}
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
