import PageWrapper from './PageWrapper'
import DeveloperSettings from '@components/Settings/AppSettings/DeveloperSettings'
import FirmwareSelection from '@components/Settings/AppSettings/FirmwareSelection'
import { CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'
//import DeviceConfig from '@components/AppSettings/DeviceConfig'

// TODO: Setup check for firmware updates
// TODO: Setup menu for selection logging mode

const AppSettingsPage = () => {
    return (
        <PageWrapper>
            <CardHeader>
                <Flex flexDirection="col" justifyContent="between" alignItems="center">
                    <CardTitle>
                        <Label class="text-white" size="3xl" weight="extraBold">
                            Settings
                        </Label>
                    </CardTitle>
                </Flex>
            </CardHeader>
            <CardContent class="w-full h-full overflow-y-scroll">
                <div class="h-full w-full overflow-y-scroll">
                    <Flex
                        class="w-full lg:items-start lg:flex-row gap-5"
                        flexDirection="col"
                        justifyContent="center"
                        alignItems="center">
                        <FirmwareSelection />
                        <DeveloperSettings />
                    </Flex>
                </div>
            </CardContent>
        </PageWrapper>
    )
}

export default AppSettingsPage
