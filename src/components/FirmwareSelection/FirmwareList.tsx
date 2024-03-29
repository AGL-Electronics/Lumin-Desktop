import { type Component, createSignal, createEffect, onMount } from 'solid-js'
import { debug, trace } from 'tauri-plugin-log-api'
import Selection from '@components/FirmwareSelection'
import { DeviceSettingItemWrapper } from '@components/Settings/DeviceSettingUtil'
import { useAppAPIContext } from '@src/store/context/api'

const FirmwareList: Component = () => {
    const [firmwareVersion, setFirmwareVersion] = createSignal('')
    const [boardNames, setBoardNames] = createSignal<string[]>([])
    const [defaultValue, setDefaultValue] = createSignal('')

    const { getFirmwareAssets, getFirmwareVersion, setFirmwareType } = useAppAPIContext()

    onMount(() => {
        setDefaultValue(
            getFirmwareAssets().find((item) => item.name === 'esp32AIThinker')?.name || '',
        )
        if (getFirmwareVersion()) setFirmwareVersion(getFirmwareVersion())
    })

    createEffect(() => {
        setBoardNames(
            getFirmwareAssets().map((item) => {
                trace(`${item.name}`)
                return item.name
            }),
        )
    })

    const handleFirmwareChange = (value: string) => {
        const temp = getFirmwareAssets().find((item) => item.name === value)?.name
        const msg = temp ? temp : 'Not Selected'
        debug(`[Firmware]: ${msg}`)
        setFirmwareType(msg)
    }

    return (
        <DeviceSettingItemWrapper
            label="Global Firmware Selection"
            labelJustify="center"
            styles="p-2"
            popoverDescription="Choose a Firmware Version">
            <div class="w-full pt-3">
                <Selection
                    name="firmware"
                    options={boardNames()}
                    placeholder="Select a board"
                    defaultValue={defaultValue()}
                    description={`Firmware version: ${firmwareVersion()}`}
                    onValueChange={handleFirmwareChange}
                />
            </div>
        </DeviceSettingItemWrapper>
    )
}

export default FirmwareList
