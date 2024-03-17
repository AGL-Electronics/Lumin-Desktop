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
import { SelectionSignals, ledSettings } from '@src/static'

interface LEDSettingsProps extends DeviceSettingsContentProps {
    selectionSignals: SelectionSignals
    handleInputChange: (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => void
    handleSelectionChange: (dataLabel: string, value: string) => void
}

const LEDSettings: Component<LEDSettingsProps> = (props) => {
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
                <For each={ledSettings}>
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
                                            placeholder={deviceSetting.placeholder}
                                            id={deviceSetting.dataLabel}
                                            required={true}
                                            type="number"
                                            min={1}
                                            max={23}
                                            onChange={props.handleInputChange}
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
                                        defaultValue={deviceSetting.options?.[0]}
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
