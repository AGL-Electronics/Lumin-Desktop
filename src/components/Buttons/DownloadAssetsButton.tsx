import { FaSolidDownload } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import CustomButton from '@components/Buttons/CustomButton'
import { useAppAPIContext } from '@src/store/context/api'

const DownloadAssetsButton = () => {
    const [isButtonActive, setIsButtonActive] = createSignal(false)
    let download: (firmware: string) => Promise<void> = () => Promise.resolve()
    const { downloadAsset, getFirmware } = useAppAPIContext()
    if (downloadAsset) download = downloadAsset

    const handleDownload = () => {
        download(getFirmware().type)
        debug('[Download Asset]: Downloading...')
        setIsButtonActive(!isButtonActive())
    }
    return (
        <CustomButton
            isButtonActive={isButtonActive()}
            tooltip="Download Firmware Assets"
            icon={<FaSolidDownload size={45} fill="#FFFFFFe3" />}
            onClick={handleDownload}
        />
    )
}

export default DownloadAssetsButton
