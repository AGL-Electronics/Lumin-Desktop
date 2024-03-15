import { For, type Component } from 'solid-js'
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
import { generalSettings } from '@src/static'

interface GeneralSettingsProps extends DeviceSettingsContentProps {
    handleInputChange: (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => void
    handleSelectionChange: (dataLabel: string, value: string) => void
}

const GeneralSettings: Component<GeneralSettingsProps> = (props) => {
    return (
        <DeviceSettingContainer label="General Setup" layout="col">
            {/* Set Name */}
            {/* Set Bound Printer - from MDNS dropdown list*/}
            {/* Set Printer Serial number */}
            {/* Set Printer LAN Code */}
            <For each={generalSettings}>
                {(deviceSetting) => (
                    <DeviceSettingItemWrapper
                        label={deviceSetting.label}
                        popoverDescription={deviceSetting.popoverDescription}>
                        <Input
                            class="border border-accent"
                            autocomplete="off"
                            data-label={deviceSetting.dataLabel}
                            placeholder={deviceSetting.placeholder}
                            id={deviceSetting.dataLabel}
                            required={deviceSetting.required}
                            type={deviceSetting.type}
                            onChange={props.handleInputChange}
                        />
                    </DeviceSettingItemWrapper>
                )}
            </For>
            {/* <Select
                value={props.selectionSignals[deviceSetting.dataLabel].selectedValue()}
                onChange={(value) => props.handleSelectionChange(deviceSetting.dataLabel, value)}
                defaultValue={'dark'}
                options={deviceSetting.options || []}
                placeholder={deviceSetting.placeholder}
                itemComponent={(props) => (
                    <SelectItem class="" item={props.item}>
                        {props.item.rawValue}
                    </SelectItem>
                )}>
                <SelectTrigger aria-label={deviceSetting.ariaLabel} class="w-[150px]">
                    <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
                </SelectTrigger>
                <SelectContent class="bg-base-300/75 hover:bg-base-200 overflow-y-scroll h-[170px]" />
            </Select> */}
        </DeviceSettingContainer>
    )
}

export default GeneralSettings
