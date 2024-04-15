import { type Component, createSignal, createEffect, onMount } from 'solid-js'
import { debug, trace } from 'tauri-plugin-log-api'
import Selection from '@components/FirmwareSelection'
import { DeviceSettingItemWrapper } from '@components/Settings/DeviceSettingUtil'
import { useAppAPIContext } from '@src/store/context/api'

const FirmwareList: Component = () => {
    const [firmwareVersion, setFirmwareVersion] = createSignal('')
    const [boardNames, setBoardNames] = createSignal<string[]>([])
    const [defaultValue, setDefaultValue] = createSignal('')

    const { getFirmware, setFirmware } = useAppAPIContext()

    onMount(() => {
        setDefaultValue(
            getFirmware().assets.find((item) => item.name === 'esp32AIThinker')?.name || '',
        )
        if (getFirmware().version) setFirmwareVersion(getFirmware().version)
    })

    createEffect(() => {
        setBoardNames(
            getFirmware().assets.map((item) => {
                trace(`${item.name}`)
                return item.name
            }),
        )
    })

    const handleFirmwareChange = (value: string) => {
        const temp = getFirmware().assets.find((item) => item.name === value)?.name
        const msg = temp ? temp : 'Not Selected'
        debug(`[Firmware]: ${msg}`)
        setFirmware(undefined, undefined, msg)
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
