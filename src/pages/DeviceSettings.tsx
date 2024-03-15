import { useParams } from '@solidjs/router'
import PageWrapper from './PageWrapper'
import type { Component } from 'solid-js'
import DeviceSettingsContent from '@components/Settings/DeviceSettings'
import { useAppDeviceContext } from '@src/store/context/device'

// TODO: Set the main menu icon to be on the settings section when this page is active

const DeviceSettings: Component = (props) => {
    const params = useParams()
    const { getSelectedDevice } = useAppDeviceContext()

    return (
        <PageWrapper>
            <DeviceSettingsContent
                deviceStatus={getSelectedDevice().status}
                devicesUrl={['.', '.', '.']}
                createNewDevice={params.flag === 'true'}
            />
        </PageWrapper>
    )
}

export default DeviceSettings
