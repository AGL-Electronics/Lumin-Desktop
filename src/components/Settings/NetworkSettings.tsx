import { For, Show, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { ActiveStatus } from '@src/lib/utils'
import { networkSettings } from '@src/static'

interface NetworkSettingsProps extends DeviceSettingsContentProps {
    enableMDNS: boolean
    handleInputChange: (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => void
}

const NetworkSettings: Component<NetworkSettingsProps> = (props) => {
    return (
        <DeviceSettingContainer label="Lumin Network Setup" layout="col">
            {/* Network Setup */}
            {/* Set WIFI SSID */}
            {/* Set WIFI Password */}
            {/* Set MQTT password */}
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
                                    autocomplete="off"
                                    class="border border-accent"
                                    data-label="lumin-device-address"
                                    placeholder="192.168.0.245"
                                    id="lumin-device-address"
                                    required={true}
                                    type="text"
                                    onChange={props.handleInputChange}
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
            <For each={networkSettings}>
                {(deviceSetting) => (
                    <DeviceSettingItemWrapper
                        label={deviceSetting.label}
                        popoverDescription={deviceSetting.popoverDescription}>
                        <Input
                            autocomplete="off"
                            class="border border-accent"
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
        </DeviceSettingContainer>
    )
}

export default NetworkSettings
