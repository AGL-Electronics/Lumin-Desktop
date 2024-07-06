import { DeviceSettingContainer } from '../DeviceSettingUtil'
import DownloadAssetsButton from '@components/Buttons/DownloadAssetsButton'
import EraseButton from '@components/Buttons/EraseButton'
import OpenDocs from '@components/OpenDocs'
import WebSerial from '@components/WebSerial'
import { Flex } from '@components/ui/flex'

// TODO: Setup iterating through all connected devices and updating them with the new firmware

const FlashSettings = () => {
    return (
        <DeviceSettingContainer
            label="Flash Settings"
            layout="col"
            styles="bg-[#333742] text-white rounded-xl p-3">
            <Flex
                flexDirection="row"
                justifyContent="evenly"
                alignItems="center"
                class="flex-wrap gap-3">
                <div>
                    <DownloadAssetsButton />
                </div>
                <div>
                    <WebSerial />
                </div>
                <div>
                    <OpenDocs />
                </div>
                <div>
                    <EraseButton />
                </div>
            </Flex>
        </DeviceSettingContainer>
    )
}
export default FlashSettings
