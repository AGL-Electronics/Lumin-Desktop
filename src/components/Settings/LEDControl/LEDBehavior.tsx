import { For, Switch, Match, type Component, createEffect, createSignal } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from '../DeviceSettingUtil'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { Switch as ToggleSwitch } from '@components/ui/switch'
import { LED_Pattern_e } from '@src/static/enums'
import { useAppDeviceContext } from '@store/context/device'
import { useDeviceSettingsContext, deviceSettings } from '@store/context/deviceSettings'

interface LEDBehaviorProps extends DeviceSettingsContentProps {}

type LEDBehaviorKey =
    | 'maintenanceModeToggle'
    | 'rgbCycleToggle'
    | 'replicateLedStateToggle'
    | 'testLedsToggle'
    | 'showWifiStrengthToggle'
    | 'disableLEDSToggle'
    | 'pattern'

const LEDBehavior: Component<LEDBehaviorProps> = () => {
    const { settings, setSettingWithSubcategory } = useDeviceSettingsContext()
    const { getSelectedDevice } = useAppDeviceContext()

    const [lastUpdate, setLastUpdate] = createSignal(0)

    const handleDefaultValue = (key: LEDBehaviorKey) => {
        return settings.generalSettings[key] as string
    }

    const makeExclusive = (selectedKey: string) => {
        const behaviorKeys = Object.keys(settings.ledControlSettings.behavior)
        behaviorKeys.forEach((key) => {
            setSettingWithSubcategory(
                'ledControlSettings',
                'behavior',
                key as LEDBehaviorKey,
                key === selectedKey,
            )
        })
    }

    createEffect(() => {
        const selectedDevice = getSelectedDevice()
        if (!selectedDevice || lastUpdate() === selectedDevice.lastUpdate) return

        const { behavior } = selectedDevice.led.ledControlSettings
        Object.keys(behavior).forEach((key) => {
            setSettingWithSubcategory(
                'ledControlSettings',
                'behavior',
                key as LEDBehaviorKey,
                behavior[key],
            )
        })

        setLastUpdate(selectedDevice.lastUpdate)
    })

    return (
        <DeviceSettingContainer label="LED Behavior" layout="col">
            <For each={deviceSettings.ledControlSettings.behavior}>
                {(deviceSetting) => (
                    <DeviceSettingItemWrapper
                        label={deviceSetting.label}
                        popoverDescription={deviceSetting.popoverDescription}>
                        <Switch>
                            <Match when={deviceSetting.type === 'toggle'}>
                                <ToggleSwitch
                                    id={deviceSetting.dataLabel}
                                    aria-label={deviceSetting.ariaLabel}
                                    label=""
                                    checked={
                                        settings.ledControlSettings.behavior[
                                            deviceSetting.key
                                        ] as boolean
                                    }
                                    onChange={() => {
                                        makeExclusive(deviceSetting.key)
                                    }}
                                />
                            </Match>
                            {/* Implement a selection for LED Patterns */}
                            <Match when={deviceSetting.type === 'select'}>
                                <Select
                                    value={
                                        settings.generalSettings[
                                            deviceSetting.key as LEDBehaviorKey
                                        ] as string
                                    }
                                    onChange={(value) =>
                                        setSettingWithSubcategory(
                                            'ledControlSettings',
                                            'behavior',
                                            deviceSetting.key as LEDBehaviorKey,
                                            value as LED_Pattern_e,
                                        )
                                    }
                                    defaultValue={
                                        handleDefaultValue(
                                            deviceSetting.key as LEDBehaviorKey,
                                        ) as string
                                    }
                                    options={deviceSetting.options!}
                                    placeholder={deviceSetting.placeholder}
                                    itemComponent={(props) => (
                                        <SelectItem class="" item={props.item}>
                                            {props.item.rawValue}
                                        </SelectItem>
                                    )}>
                                    <SelectTrigger
                                        aria-label={deviceSetting.ariaLabel}
                                        class="w-[150px]">
                                        <SelectValue<string>>
                                            {(state) => state.selectedOption()}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent class="bg-base-300/75 hover:bg-base-200 overflow-y-scroll h-[70px]" />
                                </Select>
                            </Match>
                        </Switch>
                    </DeviceSettingItemWrapper>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default LEDBehavior
