import { useNavigate } from '@solidjs/router'
import { type Component } from 'solid-js'
import { DeviceSettingsContentProps } from '../DeviceSettingUtil'
import LEDBehavior from './LEDBehavior'
/* import LEDOptions from './LEDOptions' */
import FormActions from '@components/Modal/FormActions'
import { Flex } from '@components/ui/flex'
import { capitalizeFirstLetter } from '@src/lib/utils'
import { useAppAPIContext } from '@src/store/context/api'
import {
    DEVICE_MODIFY_EVENT,
    DEVICE_STATUS,
    ENotificationType,
    LED_Pattern_e,
    REST_CMDS,
    RESTStatus,
} from '@static/enums'
import { Device, IPOSTCommand } from '@static/types'
import { useAppDeviceContext } from '@store/context/device'
import { useDeviceSettingsContext } from '@store/context/deviceSettings'
import { useAppNotificationsContext } from '@store/context/notifications'

interface LEDControlProps extends DeviceSettingsContentProps {}

// P1 has no door switch, must disable door switch if P1 is selected
// P1 has no lidar, must disable lidar stages if P1 is selected
const LEDControl: Component<LEDControlProps> = (props) => {
    const { setDevice, getSelectedDevice, setDeviceStatus } = useAppDeviceContext()
    const { useRequestHook } = useAppAPIContext()
    const { addNotification } = useAppNotificationsContext()
    const { settings } = useDeviceSettingsContext()
    const navigate = useNavigate()

    const handleLEDRequest = async (device: Device, command: IPOSTCommand) => {
        try {
            const response = await useRequestHook('jsonHandler', device.id, undefined, command)

            console.debug('Response:', response)

            if (response.status === RESTStatus.FAILED) {
                throw new Error(`Failed to update ${device.name} LEDs. ${response.response}`)
            }

            addNotification({
                title: 'LED Update',
                message: `${device.name} LEDs have been updated.`,
                type: ENotificationType.SUCCESS,
            })

            // update the device in the store
            const updatedDevice: Device = {
                ...device,
                led: {
                    ...device.led,
                    ledControlSettings: {
                        ...device.led.ledControlSettings,
                        behavior: settings.ledControlSettings.behavior,
                    },
                },
            }

            setDevice(updatedDevice, DEVICE_MODIFY_EVENT.UPDATE)
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
            const device = getSelectedDevice()
            if (!device) return

            // TODO: Implement addressable LEDs, and implement custom colors with the state object
            //{ "state": { "member": 'indicatorErrorColor', "color": { "r": 0, "g": 0, "b": 0 } }
            // TODO: Implement brightness control

            if (device.status === DEVICE_STATUS.LOADING) {
                throw new Error(`${device.name} is not reachable.`)
            }

            // parse the pattern here
            // take the value of the behavior toggles and set the pattern according to the toggle that is true
            // if none are true, set the pattern to the default pattern

            let pattern: LED_Pattern_e = LED_Pattern_e.RGB_CYCLE
            const { behavior } = settings.ledControlSettings
            Object.keys(behavior).forEach((key) => {
                // switch over the keys and set the pattern to the key that is true
                switch (key) {
                    case 'maintenanceModeToggle':
                        if (behavior[key]) {
                            pattern = LED_Pattern_e.WARM_COLD
                        }
                        break
                    case 'rgbCycleToggle':
                        if (behavior[key]) {
                            pattern = LED_Pattern_e.RGB_CYCLE
                        }
                        break
                    case 'replicateLedStateToggle':
                        if (behavior[key]) {
                            pattern = LED_Pattern_e.UPDATE
                        }
                        break
                    case 'testLedsToggle':
                        if (behavior[key]) {
                            pattern = LED_Pattern_e.RGB
                        }
                        break
                    case 'showWifiStrengthToggle':
                        if (behavior[key]) {
                            pattern = LED_Pattern_e.WIFI_STRENGTH
                        }
                        break
                    case 'disableLEDSToggle':
                        if (behavior[key]) {
                            pattern = LED_Pattern_e.NONE
                        }
                        break

                    default:
                        break
                }
            })

            // convert the ledType to the correct format - LED_Type_e
            let ledType = settings.ledSettings.ledType
            let ledBar = false
            // if the ledType is WLED or LedBar, set the type to RGB - however if it is LedBar set the ledBar bool to true
            if (ledType === 'WLED' || ledType === 'LedBar') {
                if (ledType === 'LedBar') {
                    ledBar = true
                }

                ledType = 'RGB'
            } else {
                ledType = settings.ledSettings.ledType
            }

            const command: IPOSTCommand = {
                commands: [
                    {
                        command: REST_CMDS.SET_LEDS,
                        data: {
                            enabled: true,
                            num_leds: settings.ledSettings.ledBarsConnected,
                            brightness: 255,
                            pattern: pattern,
                            pinType: settings.ledSettings.ledConnectionPoint.toUpperCase(),
                            ledType: ledType,
                            ledBar: ledBar,
                        },
                    },
                ],
            }

            await handleLEDRequest(device, command)
        } catch (error) {
            const errors = ((error as object)['validationResult'] as Array<object>) ?? []

            if (errors.length === 0) {
                addNotification({
                    title: 'Error',
                    message: `Failed to update device. ${error}`,
                    type: ENotificationType.ERROR,
                })
            }

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
        }
    }

    const handleBackButton = (e: PointerEvent) => {
        e.preventDefault()
        navigate('/')
    }

    return (
        <Flex flexDirection="col" class=" w-full pb-4 pr-2 overflow-y-scroll">
            <Flex
                flexDirection="col"
                justifyContent="center"
                alignItems="center"
                class="lg:items-start lg:flex-row gap-5">
                <div class="w-full">
                    <LEDBehavior createNewDevice={props.createNewDevice} />
                    {/*  <LEDOptions createNewDevice={props.createNewDevice} /> */}
                </div>
            </Flex>
            <FormActions
                submitLabel="Update LEDS"
                cancelLabel="Cancel"
                onSubmit={handleSubmit}
                onCancel={handleBackButton}
                onDelete={undefined}
            />
        </Flex>
    )
}

export default LEDControl
