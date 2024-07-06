import { DeviceSettingContainer } from '../DeviceSettingUtil'
import FirmwareList from '@components/FirmwareSelection/FirmwareList'

const FirmwareSelection = () => {
    return (
        <DeviceSettingContainer label="Firmware" layout="col">
            <FirmwareList />
        </DeviceSettingContainer>
    )
}

export default FirmwareSelection
