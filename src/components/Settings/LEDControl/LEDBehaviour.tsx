import { FormHandler } from 'solid-form-handler'
import { For, Switch, Match, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from '../DeviceSettingUtil'
import { Input } from '@components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { Switch as ToggleSwitch } from '@components/ui/switch'

interface LEDControlProps extends DeviceSettingsContentProps {
    handleSelectionChange: (dataLabel: string, value: string) => void
    handleInputChange: (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => void
    handleToggleChange: (isChecked: boolean) => void
    formHandler?: FormHandler | undefined
    handleValueChange: (dataLabel: string) => string
}

const LEDControl: Component<LEDControlProps> = (props) => {
    return (
        <DeviceSettingContainer label="General Setup" layout="col">
            <For each={generalSettings}>
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
                                    value={props.handleValueChange(deviceSetting.dataLabel)}
                                    onChange={props.handleInputChange}
                                    formHandler={props.formHandler}
                                />
                            </Match>
                            <Match when={deviceSetting.type === 'select'}>
                                <Select
                                    value={settingSelectionSignals[
                                        settingsDataLabels.deviceType
                                    ]?.value()}
                                    onChange={(value) =>
                                        props.handleSelectionChange(
                                            settingsDataLabels.deviceType,
                                            value,
                                        )
                                    }
                                    defaultValue={props.handleValueChange(
                                        settingsDataLabels.deviceType,
                                    )}
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
                                    onChange={props.handleToggleChange}
                                />
                            </Match>
                        </Switch>
                    </DeviceSettingItemWrapper>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default LEDControl
