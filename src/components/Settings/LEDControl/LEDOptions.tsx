import { For, Switch, Match, type Component, createEffect, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from '../DeviceSettingUtil'
import { Flex } from '@components/ui/flex'
import { Switch as ToggleSwitch } from '@components/ui/switch'
import { useAppDeviceContext } from '@store/context/device'
import {
    useDeviceSettingsContext,
    deviceSettings,
    DeviceSettingsObj,
} from '@store/context/deviceSettings'

interface LEDOptionsProps extends DeviceSettingsContentProps {}

type LEDOptionsKey =
    | 'finishIndicationToggle'
    | 'finishIndicationColor'
    | 'exitFinishAfterToggle'
    | 'exitFinishAfterTime'
    | 'inactivityTimeout'
    | 'debuggingToggle'
    | 'debuggingOnchangeEventsToggle'
    | 'mqttLoggingToggle'

const LEDOptions: Component<LEDOptionsProps> = () => {
    const { settings, setSettingWithSubcategory } = useDeviceSettingsContext()
    const { getSelectedDevice } = useAppDeviceContext()

    const enrichSettingsWithDisabled = () => {
        return deviceSettings.ledControlSettings.options.map((setting) => ({
            ...setting,
            disabled: true,
        }))
    }

    const [_deviceSettings, setDeviceSettings] = createStore({
        options: [...enrichSettingsWithDisabled()],
        settings: {},
    })

    // Simplify updates to just directly use the store functions
    const updateDisabledState = (selectedKey, value) => {
        const index = _deviceSettings.options.findIndex((s) => s['key'] === selectedKey)
        if (index !== -1) {
            console.debug('Updating disabled state:', selectedKey, value)
            setDeviceSettings(
                'options',
                index,
                'disabled' as keyof DeviceSettingsObj<'ledControlSettings', 'options'>,
                value,
            )
        }
    }

    const handleUpdate = () => {
        const selectedDevice = getSelectedDevice()
        if (!selectedDevice) return

        const { options } = selectedDevice.led.ledControlSettings
        Object.keys(options).forEach((key) => {
            setSettingWithSubcategory(
                'ledControlSettings',
                'options',
                key as LEDOptionsKey,
                options[key],
            )

            // update disabled state
            updateDisabledState(key, !options[key])
        })
    }

    const handleToggle = (selectedKey: string, value: boolean) => {
        setSettingWithSubcategory(
            'ledControlSettings',
            'options',
            selectedKey as LEDOptionsKey,
            value,
        )

        // update disabled state
        updateDisabledState(selectedKey, !value)
    }

    onMount(() => {
        handleUpdate()
        handleSettings()
    })

    createEffect(() => {
        handleUpdate()
    })

    const handleSettings = () => {
        const settingsGroups = _deviceSettings.options.reduce((acc, setting) => {
            const baseKey = (setting['key'] as string).replace(/(Toggle|Color|Time)$/, '')
            if (!acc[baseKey]) {
                acc[baseKey] = []
            }
            acc[baseKey].push(setting)
            return acc
        }, {})

        console.debug('Grouped settings:', settingsGroups)
        setDeviceSettings('settings', settingsGroups)
    }

    return (
        <DeviceSettingContainer label="LED Options" layout="col">
            <For each={Object.entries(_deviceSettings.settings)}>
                {([, group]) => (
                    <Flex
                        flexDirection={
                            (group as DeviceSettingsObj<'ledControlSettings', 'options'>[]).length >
                            1
                                ? 'col'
                                : 'row'
                        }
                        justifyContent="start"
                        alignItems="center"
                        class="content-center gap-2">
                        <For each={group as DeviceSettingsObj<'ledControlSettings', 'options'>[]}>
                            {(deviceSetting) => (
                                <Switch>
                                    <Match when={deviceSetting.type === 'toggle'}>
                                        <DeviceSettingItemWrapper
                                            label={deviceSetting.label}
                                            popoverDescription={deviceSetting.popoverDescription}>
                                            <ToggleSwitch
                                                id={deviceSetting.dataLabel}
                                                aria-label={deviceSetting.ariaLabel}
                                                label=""
                                                checked={
                                                    settings.ledControlSettings.options[
                                                        deviceSetting.key
                                                    ] as boolean
                                                }
                                                onChange={(value) => {
                                                    handleToggle(deviceSetting.key, value)
                                                }}
                                            />
                                        </DeviceSettingItemWrapper>
                                    </Match>
                                    <Match when={deviceSetting.type === 'color'}>
                                        <Flex
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            class="pb-8">
                                            TODO
                                        </Flex>
                                    </Match>
                                    <Match when={deviceSetting.type === 'input'}>
                                        <Flex
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                            class="pb-8">
                                            TODO
                                        </Flex>
                                    </Match>
                                </Switch>
                            )}
                        </For>
                    </Flex>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default LEDOptions
/* deviceSetting.disabled
                                                    ? 'bg-inherit disabled input-disabled select-disabled pb-8'
                                                    : 'pb-8' */
