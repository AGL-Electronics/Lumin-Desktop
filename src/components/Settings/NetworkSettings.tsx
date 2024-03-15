import { For, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Input } from '@components/ui/input'
import { networkSettings } from '@src/static'

interface NetworkSettingsProps extends DeviceSettingsContentProps {
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
            <For each={networkSettings}>
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
                            onChange={props.handleInputChange}
                        />
                    </DeviceSettingItemWrapper>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default NetworkSettings
