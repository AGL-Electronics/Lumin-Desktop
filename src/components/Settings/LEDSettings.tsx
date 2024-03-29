import { FormHandler } from 'solid-form-handler'
import { For, Show, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Flex } from '@components/ui/flex'
import { Input } from '@components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { DeviceSettingsObj, SelectionSignals, dataLabels, ledSettings } from '@src/static'

interface LEDSettingsProps extends DeviceSettingsContentProps {
    selectionSignals: SelectionSignals
    handleInputChange: (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => void
    handleSelectionChange: (dataLabel: string, value: string) => void
    handleValueChange: (dataLabel: string) => string
    formHandler?: FormHandler | undefined
}

const LEDSettings: Component<LEDSettingsProps> = (props) => {
    const handleLEDSettings = (): DeviceSettingsObj[] => {
        // if led-type is LedBar, remove the led-bars-connected from the list of setting.
        // if led-type is not LedBar, remove the Molex option from the led-connection-point from the list of settings options.

        const ledType = props.selectionSignals[dataLabels.ledType]?.value()

        const ledSettingsCopy = ledSettings.map((setting) => ({
            ...setting,
            options: setting.options ? [...setting.options] : [],
        }))

        if (ledType === 'LedBar') {
            return ledSettingsCopy
        }

        return ledSettingsCopy.filter((setting) => {
            if (setting.dataLabel === dataLabels.ledBarsConnected) {
                return false
            }

            if (setting.dataLabel === dataLabels.ledConnectionPoint) {
                setting.options = setting.options?.filter((option) => option !== 'Molex')
            }
            return true
        })
    }

    return (
        <DeviceSettingContainer label="LED Configuration" layout="col">
            {/* Set LED Type - WLED, RGB, RGBWW/RGBCCT, LedBar */}
            {/* Set LED bars connected - max 23 */}
            {/* Set LEDs connection point - molex, screw terminal, screw terminal RGBW, screw terminal RGB, screw terminal RGBWW/RGBCCT */}

            <Flex
                class="gap-2 p-2 pt-4"
                flexDirection="row"
                justifyContent="start"
                alignItems="start">
                <For each={handleLEDSettings()}>
                    {(deviceSetting) => (
                        <DeviceSettingItemWrapper
                            label={deviceSetting.label}
                            popoverDescription={deviceSetting.popoverDescription}>
                            <div class="flex-col">
                                <Show
                                    when={deviceSetting.type === 'select'}
                                    fallback={
                                        <Input
                                            autocomplete="off"
                                            class="border border-accent"
                                            data-label={deviceSetting.dataLabel}
                                            name={deviceSetting.dataLabel}
                                            placeholder={deviceSetting.placeholder}
                                            id={deviceSetting.dataLabel}
                                            required={true}
                                            type="number"
                                            minLength={deviceSetting.minLen}
                                            maxLength={deviceSetting.maxLen}
                                            onChange={props.handleInputChange}
                                            value={props.handleValueChange(deviceSetting.dataLabel)}
                                            formHandler={props.formHandler}
                                        />
                                    }>
                                    <Select
                                        value={
                                            props.selectionSignals[
                                                deviceSetting.dataLabel
                                            ]!.value()!
                                        }
                                        onChange={(value) =>
                                            props.handleSelectionChange(
                                                deviceSetting.dataLabel,
                                                value,
                                            )
                                        }
                                        defaultValue={props.handleValueChange(
                                            deviceSetting.dataLabel,
                                        )}
                                        options={deviceSetting.options || []}
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
                                        <SelectContent class="bg-base-300/75 hover:bg-base-200 overflow-y-scroll h-[170px]" />
                                    </Select>
                                </Show>
                            </div>
                        </DeviceSettingItemWrapper>
                    )}
                </For>
            </Flex>
        </DeviceSettingContainer>
    )
}

export default LEDSettings
