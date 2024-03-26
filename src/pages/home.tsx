import { useNavigate } from '@solidjs/router'
import { createEffect, createSignal } from 'solid-js'
import Dashboard from '@components/Dashboard'
import { Card, CardContent } from '@components/ui/card'
import PageWrapper from '@pages/PageWrapper'
import { useAppAPIContext } from '@store/context/api'
import { useAppDeviceContext } from '@store/context/device'

export default function Main() {
    const { getFirmwareVersion, setRESTDevice } = useAppAPIContext()
    const { getDevices, setSelectedDevice, resetSelectedDevice } = useAppDeviceContext()
    const [firmwareVersion, setFirmwareVersion] = createSignal('0.0.0')

    createEffect(() => {
        setFirmwareVersion(getFirmwareVersion())
    })

    const navigate = useNavigate()

    return (
        <PageWrapper>
            <Card class="overflow-auto w-auto bg-primary-300 h-full pb-8">
                <CardContent class="flex flex-1">
                    <Dashboard
                        firmwareVersion={firmwareVersion()}
                        devices={getDevices()}
                        onClickNavigateDevice={(device) => {
                            navigate('/deviceSettings/false', { replace: true })
                            setSelectedDevice(device)
                            setRESTDevice(device.address)
                        }}
                        onClickNavigateCreateDevice={() => {
                            navigate('/deviceSettings/true', { replace: true })
                            resetSelectedDevice()
                        }}
                    />
                </CardContent>
            </Card>
        </PageWrapper>
    )
}
