import { FormHandler } from 'solid-form-handler'
import { For, Show, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { ActiveStatus } from '@src/lib/utils'
import { dataLabels, networkSettings, DeviceSettingsObj, selectionSignals } from '@src/static'
import { DEVICE_TYPE } from '@src/static/enums'

interface NetworkSettingsProps extends DeviceSettingsContentProps {
    enableMDNS: boolean
    handleInputChange: (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => void
    handleValueChange: (dataLabel: string) => string
    formHandler?: FormHandler | undefined
}

const NetworkSettings: Component<NetworkSettingsProps> = (props) => {
    /* TODO: implement showing wifi settings only when device type is set to wireless */

    const handleDeviceType = (): DeviceSettingsObj[] => {
        return selectionSignals[dataLabels.deviceType]?.value() === DEVICE_TYPE.WIRELESS
            ? networkSettings
            : networkSettings.filter(
                  (setting) => setting.label !== 'WIFI SSID' && setting.label !== 'WIFI Password',
              )
    }

    return (
        <DeviceSettingContainer label="Lumin Network Setup" layout="col">
            {/* Network Setup */}
            {/* Set WIFI SSID */}
            {/* Set WIFI Password */}
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
                                    name="lumin-device-address"
                                    placeholder="192.168.0.245"
                                    id="lumin-device-address"
                                    minLength={7}
                                    maxLength={15}
                                    required={true}
                                    type="text"
                                    onChange={props.handleInputChange}
                                    formHandler={props.formHandler}
                                />
                            }>
                            {/* TODO: show a drop-down list of detected lumin devices */}
                            <></>
                        </Show>
                    </DeviceSettingItemWrapper>
                }>
                <DeviceSettingItemWrapper
                    label="Lumin Device Status"
                    popoverDescription="The status of your Lumin Device">
                    <Label class={`text-[${ActiveStatus(props.deviceStatus)}]`}>
                        {props.deviceStatus}
                    </Label>
                </DeviceSettingItemWrapper>
            </Show>
            <For each={handleDeviceType()}>
                {(deviceSetting) => (
                    <DeviceSettingItemWrapper
                        label={deviceSetting.label}
                        popoverDescription={deviceSetting.popoverDescription}>
                        <Input
                            autocomplete="off"
                            class="border border-accent"
                            data-label={deviceSetting.dataLabel}
                            name={deviceSetting.dataLabel}
                            placeholder={deviceSetting.placeholder}
                            id={deviceSetting.dataLabel}
                            required={deviceSetting.required}
                            type={deviceSetting.inputType}
                            minLength={deviceSetting.minLen}
                            maxLength={deviceSetting.maxLen}
                            onChange={props.handleInputChange}
                            value={props.handleValueChange(deviceSetting.dataLabel)}
                            formHandler={props.formHandler}
                        />
                    </DeviceSettingItemWrapper>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default NetworkSettings
