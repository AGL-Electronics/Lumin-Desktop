import { FaSolidEye, FaSolidEyeLowVision } from 'solid-icons/fa'
import { For, Switch, Match, type Component, createEffect, Show, createSignal } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Button } from '@components/ui/button'
import { Flex } from '@components/ui/flex'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { Switch as ToggleSwitch } from '@components/ui/switch'
import { DeviceSettingsStore } from '@src/static/types'
import { useAppDeviceContext } from '@store/context/device'
import { useDeviceSettingsContext, deviceSettings } from '@store/context/deviceSettings'

interface GeneralSettingsProps extends DeviceSettingsContentProps {}

const GeneralSettings: Component<GeneralSettingsProps> = () => {
    const { settings, setSettingWithoutSubcategory } = useDeviceSettingsContext()
    const { getSelectedDevice } = useAppDeviceContext()

    const [inputType, setInputType] = createSignal('password')

    const togglePasswordVisibility = () => {
        setInputType(inputType() === 'password' ? 'text' : 'password')
    }

    const handleSetInputType = (key?: string): string => {
        return key === 'password' ? inputType() : key || 'text'
    }

    const handleDefaultValue = (key: keyof DeviceSettingsStore['generalSettings']) => {
        return settings.generalSettings[key] as string
    }

    createEffect(() => {
        const selectedDevice = getSelectedDevice()
        if (!selectedDevice) return

        setSettingWithoutSubcategory('generalSettings', 'deviceLabel', selectedDevice.name)
        setSettingWithoutSubcategory(
            'generalSettings',
            'printerSerialNumber',
            selectedDevice.serialNumber,
        )
        setSettingWithoutSubcategory('generalSettings', 'lanCode', selectedDevice.network.lanCode)
    })

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
                                <Flex
                                    flexDirection="row"
                                    justifyContent="end"
                                    alignItems="center"
                                    class="w-full">
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
                                        type={handleSetInputType(deviceSetting.inputType)}
                                        value={
                                            settings.generalSettings[
                                                deviceSetting.key as keyof DeviceSettingsStore['generalSettings']
                                            ] as string
                                        }
                                        onChange={(e) =>
                                            setSettingWithoutSubcategory(
                                                'generalSettings',
                                                deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
                                                (e.target as HTMLInputElement).value,
                                            )
                                        }
                                    />
                                    <Show when={deviceSetting.inputType === 'password'}>
                                        <Button
                                            styles="circle"
                                            size="xs"
                                            variant="ghost"
                                            class="ml-[12px]"
                                            onClick={togglePasswordVisibility}>
                                            <Label
                                                class="text-xs"
                                                aria-label="Toggle password visibility"
                                                size="xs"
                                                for={deviceSetting.dataLabel}>
                                                <Show
                                                    when={inputType() === 'password'}
                                                    aria-label="Show password"
                                                    fallback={
                                                        <FaSolidEyeLowVision size={18} class="" />
                                                    }>
                                                    <FaSolidEye size={18} class="" />
                                                </Show>
                                            </Label>
                                        </Button>
                                    </Show>
                                </Flex>
                            </Match>
                            <Match when={deviceSetting.type === 'select'}>
                                <Select
                                    value={
                                        settings.generalSettings[
                                            deviceSetting.key as keyof DeviceSettingsStore['generalSettings']
                                        ] as string
                                    }
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
                                    id={deviceSetting.dataLabel}
                                    aria-label={deviceSetting.ariaLabel}
                                    label=""
                                    onChange={(value) => {
                                        setSettingWithoutSubcategory(
                                            'generalSettings',
                                            deviceSetting.key as keyof DeviceSettingsStore['generalSettings'],
                                            value,
                                        )
                                    }}
                                    checked={
                                        settings.generalSettings[
                                            deviceSetting.key as keyof DeviceSettingsStore['generalSettings']
                                        ] as boolean
                                    }
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
