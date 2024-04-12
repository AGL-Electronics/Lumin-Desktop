import { For, Show, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from './DeviceSettingUtil'
import { Flex } from '@components/ui/flex'
import { Input } from '@components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { useAppDeviceContext } from '@store/context/device'
import {
    wiredFormHandler,
    useDeviceSettingsContext,
    deviceSettings,
    DeviceSettingsStore,
    DeviceSettingsObj,
} from '@store/context/deviceSettings'

interface LEDSettingsProps extends DeviceSettingsContentProps {}

const LEDSettings: Component<LEDSettingsProps> = () => {
    const { settings, setSettingWithoutSubcategory } = useDeviceSettingsContext()
    const { getSelectedDevice } = useAppDeviceContext()

    const handleLEDSettings = (): DeviceSettingsObj<'ledSettings'>[] => {
        // if led-type is LedBar, remove the led-bars-connected from the list of setting.
        // if led-type is not LedBar, remove the Molex option from the led-connection-point from the list of settings options.

        const ledType = settings.ledSettings
            .ledType as DeviceSettingsStore['ledSettings']['ledType']

        const ledSettings = deviceSettings.ledSettings

        const ledSettingsCopy = ledSettings.map((setting) => ({
            ...setting,
            options: setting.options ? [...setting.options] : [],
        }))

        if (ledType === 'LedBar') {
            return ledSettingsCopy
        }

        return ledSettingsCopy.filter((setting) => {
            if (setting.key === 'ledBarsConnected') {
                return false
            }

            if (setting.key === 'ledConnectionPoint') {
                setting.options = setting.options?.filter((option) => option !== 'Molex')
            }
            return true
        })
    }

    const handleDefaultValue = (key: keyof DeviceSettingsStore['ledSettings']) => {
        if (!getSelectedDevice()) {
            console.debug('No device selected')
            return ''
        }
        return settings.ledSettings[key] as string | number | (string | number)[] | undefined
    }

    return (
        <DeviceSettingContainer label="LED Configuration" layout="col">
            {/* Set LED Type - WLED, RGB, RGBWW/RGBCCT, LedBar */}
            {/* Set LED bars connected - max 23 */}
            {/* Set LEDs connection point - molex, screw terminal, screw terminal RGBW, screw terminal RGB, screw terminal RGBWW/RGBCCT */}

            <Flex
                class="gap-2 p-2 pt-4"
                flexDirection="row"
                justifyContent="start"
                alignItems="start">
                <For each={handleLEDSettings()}>
                    {(deviceSetting) => (
                        <DeviceSettingItemWrapper
                            label={deviceSetting.label}
                            popoverDescription={deviceSetting.popoverDescription}>
                            <div class="flex-col">
                                <Show
                                    when={deviceSetting.type === 'select'}
                                    fallback={
                                        <Input
                                            autocomplete="off"
                                            class="border border-accent"
                                            data-label={deviceSetting.dataLabel}
                                            name={deviceSetting.dataLabel}
                                            placeholder={deviceSetting.placeholder}
                                            id={deviceSetting.dataLabel}
                                            required={true}
                                            type="number"
                                            minLength={deviceSetting.minLen}
                                            maxLength={deviceSetting.maxLen}
                                            onInput={(e) => {
                                                setSettingWithoutSubcategory(
                                                    'ledSettings',
                                                    deviceSetting.key as keyof DeviceSettingsStore['ledSettings'],
                                                    (e.target as HTMLInputElement).value,
                                                )
                                            }}
                                            value={
                                                settings.generalSettings[
                                                    deviceSetting.key as keyof DeviceSettingsStore['ledSettings']
                                                ] as string
                                            }
                                            formHandler={wiredFormHandler}
                                        />
                                    }>
                                    <Select
                                        value={
                                            settings.ledSettings[
                                                deviceSetting.key as keyof DeviceSettingsStore['ledSettings']
                                            ]
                                        }
                                        onChange={(value) =>
                                            setSettingWithoutSubcategory(
                                                'ledSettings',
                                                deviceSetting.key as keyof DeviceSettingsStore['ledSettings'],
                                                value,
                                            )
                                        }
                                        defaultValue={
                                            handleDefaultValue(
                                                deviceSetting.key as keyof DeviceSettingsStore['ledSettings'],
                                            ) as string | number
                                        }
                                        options={deviceSetting.options || []}
                                        placeholder={deviceSetting.placeholder}
                                        itemComponent={(props) => (
                                            <SelectItem class="" item={props.item}>
                                                {props.item.rawValue}
                                            </SelectItem>
                                        )}>
                                        <SelectTrigger
                                            aria-label={deviceSetting.ariaLabel}
                                            class="w-[150px]">
                                            <SelectValue<string>>
                                                {(state) => state.selectedOption()}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent class="bg-base-300/75 hover:bg-base-200 overflow-y-scroll h-[170px]" />
                                    </Select>
                                </Show>
                            </div>
                        </DeviceSettingItemWrapper>
                    )}
                </For>
            </Flex>
        </DeviceSettingContainer>
    )
}

export default LEDSettings
