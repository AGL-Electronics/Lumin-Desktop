import { useNavigate } from '@solidjs/router'
import {
    JSXElement,
    ParentComponent,
    Show,
    createEffect,
    createSignal,
    type Component,
} from 'solid-js'
import FormActions from '@components/Modal/FormActions'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Flex } from '@components/ui/flex'
import { Icons } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { HoverPopover, Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { ActiveStatus } from '@src/lib/utils'
import { DEVICE_STATUS } from '@static/enums'
import { useAppContext } from '@store/context/app'

// TODO: Detect if this is a new device, or an existing device, if new device then show a button to create a new device

// TODO: Setup as stepper, with each section as a step - maybe?

// TODO: use url params to get the device id? Grab the device object from the store using the device id

interface DeviceSettingsContentProps {
    deviceStatus: DEVICE_STATUS
    devicesUrl: string[]
    createNewDevice: boolean
}

const DeviceSettingItemWrapper: ParentComponent<{
    label: string
    popover?: JSXElement
    popoverDescription?: string
}> = (props) => {
    return (
        <Flex
            flexDirection="col"
            justifyContent="start"
            alignItems="start"
            class="mb-5 gap-2 text-secondary-content">
            <Flex class="gap-2" flexDirection="row" justifyContent="start" alignItems="center">
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

const DeviceSettingContainer: ParentComponent<{
    label: string
    layout?: 'row' | 'col'
}> = (props) => {
    return (
        <div class="mb-5">
            <Flex
                flexDirection="col"
                class="pl-4 pr-4 rounded-xl pb-4 pt-4 bg-[#333742] text-white">
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

const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    const { appState } = useAppContext()

    const navigate = useNavigate()

    const handleBackButton = (e: PointerEvent) => {
        e.preventDefault()
        navigate('/')
    }

    const handleDeviceAddressChange = (
        e: Event & {
            currentTarget: HTMLInputElement
            target: HTMLInputElement
        },
    ) => {
        console.log(e.currentTarget.value)
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
                    <div class="">
                        {/* LED Setup */}
                        {/* Set LED Type - WLED, RGB, RGBWW/RGBCCT, LedBar */}
                        {/* Set LED bars connected - max 23 */}
                        {/* Set LEDs connection point - molex, screw terminal, screw terminal RGBW, screw terminal RGB, screw terminal RGBWW/RGBCCT */}

                        {/* General Device Setup */}
                        {/* Set Name */}
                        {/* Set Bound Printer - from MDNS dropdown list*/}
                        {/* Set Printer Serial number */}
                        {/* Set Printer LAN Code */}

                        {/* Network Setup */}
                        {/* Set WIFI SSID */}
                        {/* Set WIFI Password */}
                        {/* Set MQTT password */}

                        <div class="flex justify-center flex-col items-center lg:items-start lg:flex-row gap-5 ">
                            <div class="mt-5 max-w-[700px] w-full">
                                <Show
                                    when={!props.createNewDevice}
                                    fallback={
                                        <DeviceSettingItemWrapper
                                            label="Lumin Device Address"
                                            popoverDescription="The IP address or MDNS name of the Lumin device">
                                            <Show
                                                when={appState().enableMDNS}
                                                fallback={
                                                    <Input
                                                        placeholder="192.168.0.245"
                                                        id="device-address"
                                                        required={true}
                                                        type="text"
                                                        onChange={handleDeviceAddressChange}
                                                    />
                                                }>
                                                {/* TODO: show a drop-down list of detected lumin devices */}
                                                <></>
                                            </Show>
                                        </DeviceSettingItemWrapper>
                                    }>
                                    <DeviceSettingContainer
                                        label="Lumin Connection Status"
                                        layout="row">
                                        <Label class={`text-[${ActiveStatus(props.deviceStatus)}]`}>
                                            {props.deviceStatus}
                                        </Label>
                                    </DeviceSettingContainer>
                                </Show>
                            </div>
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
