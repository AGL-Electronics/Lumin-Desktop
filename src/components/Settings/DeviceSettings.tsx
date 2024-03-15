import { useNavigate } from '@solidjs/router'
import { createEffect, createSignal, type Component } from 'solid-js'
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
import { ledSettings } from '@src/static'
import { DEVICE_STATUS, DEVICE_TYPE } from '@src/static/enums'
import { Device } from '@static/types'
import { useAppContext } from '@store/context/app'
import { useAppDeviceContext } from '@store/context/device'

// TODO: Setup as stepper, with each section as a step - maybe?

const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    const { appState } = useAppContext()
    const { setDevice, getSelectedDevice } = useAppDeviceContext()
    const navigate = useNavigate()

    const [newDevice, setNewDevice] = createSignal<Device | null>(null)

    const ledSelections = ledSettings.filter((setting) => setting.type === 'select')

    // create a signal store for each ledSelections item
    const selectionSignals: {
        [key: string]: {
            selectedValue: () => string
            setSelectedValue: (value: string) => void
        }
    } = {}

    const inputSignals: {
        [key: string]: {
            inputValue: () => string
            setInputValue: (value: string) => void
        }
    } = {}

    ledSelections.forEach((setting) => {
        const [selectedValue, setSelectedValue] = createSignal<string>('')
        selectionSignals[setting.dataLabel] = { selectedValue, setSelectedValue }
    })

    const handleSelectionChange = (dataLabel: string, value: string) => {
        if (!selectionSignals[dataLabel]) return
        selectionSignals[dataLabel].setSelectedValue(value)
    }

    const handleBackButton = (e: PointerEvent) => {
        e.preventDefault()
        navigate('/')
    }

    const handleInputChange = (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => {
        console.debug(e.currentTarget.dataset.label, e.currentTarget.value)

        const dataLabel = e.currentTarget.dataset.label as string
        const value = e.currentTarget.value

        if (!inputSignals[dataLabel]) {
            const [inputValue, setInputValue] = createSignal<string>(value)
            inputSignals[dataLabel] = { inputValue, setInputValue }
        } else {
            inputSignals[dataLabel].setInputValue(value)
        }
    }

    createEffect(() => {
        // grab the values from the selectionSignals and set them to the newDevice

        // if we are not in create mode, then we are in edit mode, in edit mode we take the selected device and update it
        if (!props.createNewDevice) {
            const selectedDevice = getSelectedDevice()
            if (!selectedDevice) return

            const device = {
                ledType: selectionSignals['led-type'].selectedValue(),
                ledCount: selectionSignals['led-bars-connected'].selectedValue(),
                ledConnection: selectionSignals['led-connection-point'].selectedValue(),
            }

            setDevice({ ...selectedDevice, ...device })
            return
        }

        const device: Device = {
            id: uuidv4(),
            name: inputSignals['device-label'].inputValue(),
            status: DEVICE_STATUS.NONE,
            type: DEVICE_TYPE.NONE,
            address: inputSignals['device-label'].inputValue(),
            led: {
                ledCount: selectionSignals.ledCount.selectedValue(),
                ledType: selectionSignals.ledType.selectedValue(),

                ledConnection: selectionSignals.ledConnection.selectedValue(),
            },
            ws: {},
        }

        setDevice(device)
    })

    return (
        <Card class="h-full w-full">
            <Flex class="w-full" flexDirection="col" justifyContent="around" alignItems="center">
                <Flex
                    flexDirection="row"
                    justifyContent="start"
                    alignItems="center"
                    class="p-2 cursor-pointer"
                    onPointerDown={handleBackButton}>
                    <Icons.arrowLeft class="mr-3 text-white" size={20} />
                    <div class="text-white">
                        <Label
                            size="lg"
                            class="text-left text-lg text-upper uppercase max-lg:text-sm ">
                            go back to home
                        </Label>
                    </div>
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
                    <div class="flex justify-center flex-col items-center lg:items-start lg:flex-row gap-5">
                        <div class="w-full">
                            <GeneralSettings
                                createNewDevice={props.createNewDevice}
                                deviceStatus={props.deviceStatus}
                                handleInputChange={handleInputChange}
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
                        onSubmit={() => console.log('submit')}
                        onCancel={handleBackButton}
                    />
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
