import { For, Switch, Match, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Input } from '@components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { Switch as ToggleSwitch } from '@components/ui/switch'
import { useAppDeviceContext } from '@store/context/device'
import {
    useDeviceSettingsContext,
    deviceSettings,
    DeviceSettingsStore,
} from '@store/context/deviceSettings'

interface GeneralSettingsProps extends DeviceSettingsContentProps {}

const GeneralSettings: Component<GeneralSettingsProps> = () => {
    const { settings, setSettingWithoutSubcategory } = useDeviceSettingsContext()
    const { getSelectedDevice } = useAppDeviceContext()

    const handleDefaultValue = (key: keyof DeviceSettingsStore['generalSettings']) => {
        return settings.generalSettings[key] as string
    }

    const handleDeviceSelectedValues = (key: keyof DeviceSettingsStore['generalSettings']) => {
        // Get the selected device
        const selectedDevice = getSelectedDevice()
        if (!selectedDevice || typeof selectedDevice.status !== 'string') {
            return settings.generalSettings[
                key as keyof DeviceSettingsStore['generalSettings']
            ] as string
        }

        console.debug('Found Selected Device:', selectedDevice)

        switch (key) {
            case 'deviceLabel':
                return selectedDevice.name
            case 'deviceType':
                return selectedDevice.type
            case 'printerSerialNumber':
                return selectedDevice.serialNumber
            case 'lanCode':
                return selectedDevice.network.lanCode
            default:
                return ''
        }
    }

    return (
        <DeviceSettingContainer label="General Setup" layout="col">
            {/* Set Name */}
            {/* Set Bound Printer - from MDNS dropdown list*/}
            {/* Set Printer Serial number */}
            {/* Set Printer LAN Code */}
            <For each={deviceSettings.generalSettings}>
                {(deviceSetting) => (
                    <DeviceSettingItemWrapper
                        label={deviceSetting.label}
                        popoverDescription={deviceSetting.popoverDescription}>
                        <Switch>
                            <Match when={deviceSetting.type === 'input'}>
                                <Input
                                    class="border border-accent"
                                    autocomplete="off"
                                    data-label={deviceSetting.dataLabel}
                                    name={deviceSetting.dataLabel}
                                    placeholder={deviceSetting.placeholder}
                                    id={deviceSetting.dataLabel}
                                    minLength={deviceSetting.minLen}
                                    maxLength={deviceSetting.maxLen}
                                    required={deviceSetting.required}
                                    type={deviceSetting.inputType}
                                    value={handleDeviceSelectedValues(
                                        deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
                                    )}
                                    onInput={(e) =>
                                        setSettingWithoutSubcategory(
                                            'generalSettings',
                                            deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
                                            (e.target as HTMLInputElement).value,
                                        )
                                    }
                                />
                            </Match>
                            <Match when={deviceSetting.type === 'select'}>
                                <Select
                                    value={handleDeviceSelectedValues(
                                        deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
                                    )}
                                    onChange={(value) =>
                                        setSettingWithoutSubcategory(
                                            'generalSettings',
                                            deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
                                            value,
                                        )
                                    }
                                    defaultValue={
                                        handleDefaultValue(
                                            deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
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
                            <Match when={deviceSetting.type === 'toggle'}>
                                <ToggleSwitch
                                    id="firmware-flashing-toggle"
                                    aria-label={deviceSetting.ariaLabel}
                                    label={deviceSetting.label}
                                    onChange={(value) => {
                                        setSettingWithoutSubcategory(
                                            'generalSettings',
                                            deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
                                            value,
                                        )
                                    }}
                                />
                            </Match>
                        </Switch>
                    </DeviceSettingItemWrapper>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default GeneralSettings
