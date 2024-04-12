import { useParams } from '@solidjs/router'
import type { Component } from 'solid-js'
import DeviceSettingsContent from '@components/Settings/DeviceSettings'
import { DeviceSettingsProvider } from '@store/context/deviceSettings'

// TODO: Set the main menu icon to be on the settings section when this page is active

const DeviceSettings: Component = () => {
    const params = useParams()

    return (
        <div class="mt-[112px] select-none overflow-y-scroll">
            <div class="p-4 mt-[30px]">
                <DeviceSettingsProvider>
                    <DeviceSettingsContent createNewDevice={params.flag === 'true'} />
                </DeviceSettingsProvider>
            </div>
        </div>
    )
}

export default DeviceSettings
