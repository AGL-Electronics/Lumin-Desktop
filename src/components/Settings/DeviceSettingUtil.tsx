import type { JSXElement, ParentComponent } from 'solid-js'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { HoverPopover } from '@components/ui/popover'
import { cn } from '@src/lib/utils'
import { DEVICE_STATUS } from '@static/enums'

export interface DeviceSettingsContentProps {
    deviceStatus: DEVICE_STATUS
    createNewDevice: boolean
    devicesUrl?: string[]
}

const DeviceSettingContainer: ParentComponent<{
    label: string
    layout?: 'row' | 'col'
    styles?: string
}> = (props) => {
    return (
        <div class="w-full p-3 mb-5">
            <Flex
                flexDirection="col"
                class={cn('pl-4 pr-4 rounded-xl pb-4 pt-4 bg-[#333742] text-white', props.styles)}>
                <Flex flexDirection={props.layout} justifyContent="between" class="text-base">
                    <Label weight="extraBold" size="lg">
                        {props.label}
                    </Label>
                    {props.children}
                </Flex>
            </Flex>
        </div>
    )
}

const DeviceSettingItemWrapper: ParentComponent<{
    label: string
    popover?: JSXElement
    popoverDescription?: string
    labelJustify?: 'start' | 'end' | 'center'
    styles?: string
}> = (props) => {
    return (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            class="mb-5 gap-2 text-secondary-content">
            <Flex
                class={cn('w-full gap-2', props.styles)}
                flexDirection="row"
                justifyContent={props.labelJustify || 'start'}
                alignItems="center">
                <Label size="lg" weight="bold" for="device-address">
                    {props.label}
                </Label>
                <HoverPopover
                    arrow={true}
                    trigger={<Icons.questionCircle class="" size={20} />}
                    popoverDescription={props.popoverDescription}>
                    {/* TODO: link to docs regarding this section */}
                    {props.popover}
                </HoverPopover>
            </Flex>
            {props.children}
        </Flex>
    )
}

export { DeviceSettingItemWrapper, DeviceSettingContainer }
