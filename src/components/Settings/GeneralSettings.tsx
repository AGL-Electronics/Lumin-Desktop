import { For, Show, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { ActiveStatus } from '@src/lib/utils'
import { generalSettings } from '@src/static'

interface GeneralSettingsProps extends DeviceSettingsContentProps {
    enableMDNS: boolean
}

const GeneralSettings: Component<GeneralSettingsProps> = (props) => {
    const handleInputChange = (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => {
        console.log(e.currentTarget.dataset.label, e.currentTarget.value)
        // grab the data-label attribute from the input field
        // e.currentTarget.dataset.label
    }

    /* General Device Setup */
    return (
        <DeviceSettingContainer label="General Device Setup" layout="col">
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
                            data-label={deviceSetting.dataLabel}
                            placeholder={deviceSetting.placeholder}
                            id={deviceSetting.dataLabel}
                            required={deviceSetting.required}
                            type={deviceSetting.type}
                            onChange={handleInputChange}
                        />
                    </DeviceSettingItemWrapper>
                )}
            </For>
            <Show
                when={!props.createNewDevice}
                fallback={
                    <DeviceSettingItemWrapper
                        label="Lumin Device Address"
                        popoverDescription="The IP address or MDNS name of the Lumin device">
                        <Show
                            when={props.enableMDNS}
                            fallback={
                                <Input
                                    data-label="lumin-device-address"
                                    placeholder="192.168.0.245"
                                    id="lumin-device-address"
                                    required={true}
                                    type="text"
                                    onChange={handleInputChange}
                                />
                            }>
                            {/* TODO: show a drop-down list of detected lumin devices */}
                            <></>
                        </Show>
                    </DeviceSettingItemWrapper>
                }>
                <DeviceSettingItemWrapper
                    label="Lumin Device Address"
                    popoverDescription="The status of your Lumin Device">
                    <Label class={`text-[${ActiveStatus(props.deviceStatus)}]`}>
                        {props.deviceStatus}
                    </Label>
                </DeviceSettingItemWrapper>
            </Show>
        </DeviceSettingContainer>
    )
}

export default GeneralSettings
