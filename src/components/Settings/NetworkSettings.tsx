import { FaSolidEye, FaSolidEyeLowVision } from 'solid-icons/fa'
import { For, Show, Switch, type Component, Match, createSignal, createEffect } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Button } from '@components/ui/button'
import { Flex } from '@components/ui/flex'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { Switch as ToggleSwitch } from '@components/ui/switch'
import { ActiveStatus, capitalizeFirstLetter, DEFAULT_COLOR } from '@src/lib/utils'
import { DEVICE_TYPE } from '@src/static/enums'
import { DeviceSettingsStore } from '@src/static/types'
import { useAppContext } from '@src/store/context/app'
import { useAppDeviceContext } from '@store/context/device'
import { deviceSettings, useDeviceSettingsContext } from '@store/context/deviceSettings'

interface NetworkSettingsProps extends DeviceSettingsContentProps {}

const NetworkSettings: Component<NetworkSettingsProps> = (props) => {
    const { settings, setSettingWithoutSubcategory } = useDeviceSettingsContext()
    const { getSelectedDevice } = useAppDeviceContext()
    const { appState } = useAppContext()

    const [status, setStatus] = createSignal(DEFAULT_COLOR)
    const [inputType, setInputType] = createSignal('password')

    const togglePasswordVisibility = () => {
        setInputType(inputType() === 'password' ? 'text' : 'password')
    }

    const handleSetInputType = (key?: string): string => {
        return key === 'password' ? inputType() : key || 'text'
    }

    createEffect(() => {
        setStatus(getSelectedDevice() ? ActiveStatus(getSelectedDevice()!.status) : DEFAULT_COLOR)
    })

    const handleDeviceStatusRender = (): string => {
        // Get the selected device
        if (!getSelectedDevice()) return ''
        return capitalizeFirstLetter(getSelectedDevice()!.status.toLocaleLowerCase())
    }

    /* const handleDefaultValue = (key: keyof DeviceSettingsStore['networkSettings']) => {
        return settings.networkSettings[key] as string
    } */

    createEffect(() => {
        const selectedDevice = getSelectedDevice()
        if (!selectedDevice) return

        setSettingWithoutSubcategory(
            'networkSettings',
            'wifiSSID',
            selectedDevice.network.wifi.ssid,
        )
        setSettingWithoutSubcategory(
            'networkSettings',
            'wifiPassword',
            selectedDevice.network.wifi.password,
        )
        setSettingWithoutSubcategory(
            'networkSettings',
            'luminDeviceAddress',
            selectedDevice.network.address,
        )
    })

    createEffect(() => {
        // set the device address to the default value if the apModeToggle is enabled
        if (settings.networkSettings.apModeToggle)
            setSettingWithoutSubcategory('networkSettings', 'luminDeviceAddress', '192.168.4.1')
    })

    return (
        <DeviceSettingContainer label="Lumin Network Setup" layout="col">
            {/* Network Setup */}
            {/* Set WIFI SSID */}
            {/* Set WIFI Password */}
            {/* TODO: show a drop-down list of detected lumin devices when mdns is enabled */}
            <Show when={!props.createNewDevice}>
                <DeviceSettingItemWrapper
                    label="Status"
                    popoverDescription="The current status of the device">
                    <div class="max-md:hidden text-left flex justify-end content-center items-center ">
                        <Label
                            style={{ color: status() }}
                            class="text-ellipsis overflow-hidden whitespace-nowrap text-base">
                            {handleDeviceStatusRender()}
                        </Label>
                        <div
                            style={{ 'background-color': status() }}
                            class="ml-[6px] h-[10px] rounded-full mr-[10px] w-[10px]"
                        />
                    </div>
                </DeviceSettingItemWrapper>
            </Show>
            <For
                each={deviceSettings.networkSettings.filter((setting) => {
                    // Always exclude the 'lumin-device-mdns' setting if the specific condition is false
                    if (!appState().enableMDNS && setting.dataLabel === 'lumin-device-mdns') {
                        return false
                    }
                    // Exclude 'ssid' and 'password' settings if the deviceType is 'ethernet'
                    if (
                        settings.generalSettings.deviceType === DEVICE_TYPE.WIRED &&
                        (setting.dataLabel === 'wifi-ssid' || setting.dataLabel === 'wifi-password')
                    ) {
                        return false
                    }

                    if (
                        settings.generalSettings.deviceType === DEVICE_TYPE.WIRED &&
                        setting.dataLabel === 'ap-mode-toggle'
                    ) {
                        return false
                    }

                    // Exclude 'lumin-device-address' setting if the apModeStatus is true
                    if (
                        settings.networkSettings.apModeToggle &&
                        setting.dataLabel === 'lumin-device-address'
                    ) {
                        return false
                    }

                    return true // Include the setting by default
                })}>
                {(deviceSetting) => (
                    <DeviceSettingItemWrapper
                        label={deviceSetting.label}
                        popoverDescription={deviceSetting.popoverDescription}>
                        <Switch>
                            <Match when={deviceSetting.type === 'toggle'}>
                                <ToggleSwitch
                                    id={deviceSetting.dataLabel}
                                    aria-label={deviceSetting.ariaLabel}
                                    label=""
                                    onChange={(value) => {
                                        setSettingWithoutSubcategory(
                                            'networkSettings',
                                            deviceSetting.key as keyof DeviceSettingsStore['networkSettings'],
                                            value,
                                        )
                                    }}
                                />
                            </Match>
                            <Match when={deviceSetting.type === 'input'}>
                                <Flex
                                    flexDirection="row"
                                    justifyContent="end"
                                    alignItems="center"
                                    class="w-full">
                                    <Input
                                        autocomplete="off"
                                        class="border border-accent"
                                        data-label={deviceSetting.dataLabel}
                                        name={deviceSetting.dataLabel}
                                        placeholder={deviceSetting.placeholder}
                                        id={deviceSetting.dataLabel}
                                        minLength={deviceSetting.minLen}
                                        maxLength={deviceSetting.maxLen}
                                        required={deviceSetting.required}
                                        type={handleSetInputType(deviceSetting.inputType)}
                                        value={
                                            settings.networkSettings[
                                                deviceSetting.key as keyof DeviceSettingsStore['networkSettings']
                                            ] as string
                                        }
                                        onChange={(e) => {
                                            setSettingWithoutSubcategory(
                                                'networkSettings',
                                                deviceSetting.key as keyof DeviceSettingsStore['networkSettings'],
                                                (e.target as HTMLInputElement).value,
                                            )
                                        }}
                                    />
                                    <Show when={deviceSetting.inputType === 'password'}>
                                        <Button
                                            styles="circle"
                                            size="xs"
                                            variant="ghost"
                                            class="ml-[12px]"
                                            onClick={togglePasswordVisibility}>
                                            <Label
                                                class="text-xs"
                                                aria-label="Toggle password visibility"
                                                size="xs"
                                                for={deviceSetting.dataLabel}>
                                                <Show
                                                    when={inputType() === 'password'}
                                                    aria-label="Show password"
                                                    fallback={
                                                        <FaSolidEyeLowVision size={18} class="" />
                                                    }>
                                                    <FaSolidEye size={18} class="" />
                                                </Show>
                                                {/* {inputType() === 'password' ? 'Show' : 'Hide'} */}
                                            </Label>
                                        </Button>
                                    </Show>
                                </Flex>
                            </Match>
                        </Switch>
                    </DeviceSettingItemWrapper>
                )}
            </For>
        </DeviceSettingContainer>
    )
}

export default NetworkSettings
