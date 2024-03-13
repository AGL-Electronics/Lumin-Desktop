import PageWrapper from './PageWrapper'
import type { Component } from 'solid-js'
import DeviceSettingsContent from '@components/DeviceSettings'

// TODO: Set the main menu icon to be on the settings section when this page is active

const DeviceSettings: Component = (props) => {
    return (
        <PageWrapper>
            <DeviceSettingsContent param="TODO" />
        </PageWrapper>
    )
}

export default DeviceSettings
