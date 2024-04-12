import { FormHandler } from 'solid-form-handler'
import { For, Switch, Match, type Component } from 'solid-js'
import {
    DeviceSettingContainer,
    DeviceSettingItemWrapper,
    DeviceSettingsContentProps,
} from '../DeviceSettingUtil'
import { Input } from '@components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { Switch as ToggleSwitch } from '@components/ui/switch'

interface LEDControlProps extends DeviceSettingsContentProps {
    handleSelectionChange: (dataLabel: string, value: string) => void
    handleInputChange: (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => void
    handleToggleChange: (isChecked: boolean) => void
    formHandler?: FormHandler | undefined
    handleValueChange: (dataLabel: string) => string
}

// P1 has no door switch, must disable door switch if P1 is selected
// P1 has no lidar, must disable lidar stages if P1 is selected
const LEDControl: Component<LEDControlProps> = (props) => {
    return (
        
    )
}

export default LEDControl
