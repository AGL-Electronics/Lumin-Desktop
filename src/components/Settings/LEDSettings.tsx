import { For, Show, createSignal, type Component } from 'solid-js'
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
import { ledSettings } from '@src/static'

interface LEDSettingsProps extends DeviceSettingsContentProps {}

const LEDSettings: Component<LEDSettingsProps> = (props) => {
    const ledSelections = ledSettings.filter((setting) => setting.type === 'select')

    // create a signal store for each ledSelections item
    const selectionSignals: {
        [key: string]: {
            selectedValue: () => string
            setSelectedValue: (value: string) => void
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

    const handleInputChange = (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => {
        // TODO: handle input change via the context store
        // grab the data-label attribute from the input field
        // e.currentTarget.dataset.label
    }

    /* LED Device Setup */
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
                                            data-label={deviceSetting.dataLabel}
                                            placeholder={deviceSetting.placeholder}
                                            id={deviceSetting.dataLabel}
                                            required={true}
                                            type="number"
                                            min={1}
                                            max={23}
                                            onChange={handleInputChange}
                                        />
                                    }>
                                    <Select
                                        value={selectionSignals[
                                            deviceSetting.dataLabel
                                        ].selectedValue()}
                                        onChange={(value) =>
                                            handleSelectionChange(deviceSetting.dataLabel, value)
                                        }
                                        defaultValue={'dark'}
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
