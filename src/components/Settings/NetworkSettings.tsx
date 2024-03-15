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

interface NetworkSettingsProps extends DeviceSettingsContentProps {}

const NetworkSettings: Component<NetworkSettingsProps> = (props) => {
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
                            onChange={handleInputChange}
                        />
                    </DeviceSettingItemWrapper>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default NetworkSettings
