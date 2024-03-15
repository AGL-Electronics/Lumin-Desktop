import { useNavigate } from '@solidjs/router'
import { Show, type Component } from 'solid-js'
import { DeviceSettingsContentProps } from './DeviceSettingUtil'
import GeneralSettings from './GeneralSettings'
import LEDSettings from './LEDSettings'
import FormActions from '@components/Modal/FormActions'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { useAppContext } from '@store/context/app'
import NetworkSettings from './NetworkSettings'

// TODO: Setup as stepper, with each section as a step - maybe?

// TODO: use url params to get the device id? Grab the device object from the store using the device id

const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    const { appState } = useAppContext()

    const navigate = useNavigate()

    const handleBackButton = (e: PointerEvent) => {
        e.preventDefault()
        navigate('/')
    }

    return (
        <Card class="h-full w-full">
            <Flex class="w-full" flexDirection="col" justifyContent="around" alignItems="center">
                <Flex
                    flexDirection="row"
                    justifyContent="start"
                    alignItems="center"
                    class="p-2 cursor-pointer"
                    onPointerDown={handleBackButton}>
                    <Icons.arrowLeft class="mr-3 text-white" size={20} />
                    <div class="text-white">
                        <Label
                            size="lg"
                            class="text-left text-lg text-upper uppercase max-lg:text-sm ">
                            go back to home
                        </Label>
                    </div>
                </Flex>
                <CardHeader>
                    <Flex flexDirection="col" justifyContent="between" alignItems="center">
                        <CardTitle>
                            <Label class="text-white" size="3xl" weight="extraBold">
                                Device Settings
                            </Label>
                        </CardTitle>
                    </Flex>
                </CardHeader>
                <CardContent class="w-full">
                    <div class="flex justify-center flex-col items-center lg:items-start lg:flex-row gap-5">
                        <div class="w-full">
                            <GeneralSettings
                                createNewDevice={props.createNewDevice}
                                deviceStatus={props.deviceStatus}
                                enableMDNS={appState().enableMDNS}
                            />
                            <NetworkSettings
                                createNewDevice={props.createNewDevice}
                                deviceStatus={props.deviceStatus}
                            />
                            <LEDSettings
                                createNewDevice={props.createNewDevice}
                                deviceStatus={props.deviceStatus}
                            />
                        </div>
                    </div>
                    <FormActions
                        submitLabel={props.createNewDevice ? 'Create Device' : 'Save'}
                        cancelLabel="Cancel"
                        onSubmit={() => console.log('submit')}
                        onCancel={handleBackButton}
                    />
                </CardContent>
            </Flex>
        </Card>
    )
}

export default DeviceSettingsContent

/* 
<div class="lg:mt-5 max-w-[700px] w-full">
    <DevicesModal devicesUrl={props.devicesUrl} />
</div>
*/
