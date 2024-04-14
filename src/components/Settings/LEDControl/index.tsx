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
    ESPLEDPatterns,
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

    const handleSubmit = async (e: Event) => {
        e.preventDefault()

        try {
            const device = getSelectedDevice()
            if (!device) return

            // TODO: Implement addressable LEDs, and implement custom colors with the state object
            //{ "state": { "member": 'indicatorErrorColor', "color": { "r": 0, "g": 0, "b": 0 } }
            // TODO: Implement brightness control

            // parse the pattern here
            // take the value of the behavior toggles and set the pattern according to the toggle that is true
            // if none are true, set the pattern to the default pattern

            let pattern: ESPLEDPatterns = ESPLEDPatterns.RGB_CYCLE
            const { behavior } = settings.ledControlSettings
            Object.keys(behavior).forEach((key) => {
                // switch over the keys and set the pattern to the key that is true
                switch (key) {
                    case 'maintenanceModeToggle':
                        if (behavior[key]) {
                            pattern = ESPLEDPatterns.WARM_COLD
                        }
                        break
                    case 'rgbCycleToggle':
                        if (behavior[key]) {
                            pattern = ESPLEDPatterns.RGB_CYCLE
                        }
                        break
                    case 'replicateLedStateToggle':
                        if (behavior[key]) {
                            pattern = ESPLEDPatterns.UPDATE
                        }
                        break
                    case 'testLedsToggle':
                        if (behavior[key]) {
                            pattern = ESPLEDPatterns.RGB
                        }
                        break
                    case 'showWifiStrengthToggle':
                        if (behavior[key]) {
                            pattern = ESPLEDPatterns.WIFI_STRENGTH
                        }
                        break
                    case 'disableLEDSToggle':
                        if (behavior[key]) {
                            pattern = ESPLEDPatterns.NONE
                        }
                        break

                    default:
                        break
                }
            })

            const command: IPOSTCommand = {
                commands: [
                    {
                        command: 'set_leds',
                        data: {
                            enabled: true,
                            num_leds: settings.ledSettings.ledBarsConnected,
                            brightness: 255,
                            pattern: pattern,
                            type: settings.ledSettings.ledType,
                            connectionPoint: settings.ledSettings.ledConnectionPoint,
                        },
                    },
                ],
            }

            // Check if the device is reachable with a ping request

            const pingResponse = await useRequestHook('ping', device.id)
            setDeviceStatus(device.id, DEVICE_STATUS.LOADING)

            if (pingResponse.status === 'error') {
                addNotification({
                    title: 'Error',
                    message: 'Device is not reachable.',
                    type: ENotificationType.ERROR,
                })

                setDeviceStatus(device.id, DEVICE_STATUS.FAILED)

                return
            }

            console.debug('Response:', pingResponse)
            setDeviceStatus(device.id, DEVICE_STATUS.ACTIVE)

            const response = await useRequestHook('jsonHandler', device.id, command)

            console.debug('Response:', response)

            if (response.status === 'error') {
                addNotification({
                    title: 'Error',
                    message: `Failed to update device. ${response.data}`,
                    type: ENotificationType.ERROR,
                })

                setDeviceStatus(device.id, DEVICE_STATUS.FAILED)

                return
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
