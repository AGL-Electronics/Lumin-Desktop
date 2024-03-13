import type { Component } from 'solid-js'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'

// TODO: Detect if this is a new device, or an existing device, if new device then show a button to create a new device

// TODO: Setup as stepper, with each section as a step - maybe?

interface DeviceSettingsContentProps {
    param: string
}

const DeviceSettingsContent: Component<DeviceSettingsContentProps> = (props) => {
    return (
        <Card class="h-full">
            <Flex flexDirection="col" justifyContent="between" alignItems="center">
                <CardHeader>
                    <CardTitle>
                        <Label class="text-white" size="3xl" weight="extraBold">
                            Device Settings
                        </Label>
                    </CardTitle>
                </CardHeader>
                <CardContent>
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

                    {/* If existing device - save,if not - create */}
                </CardContent>
            </Flex>
        </Card>
    )
}

export default DeviceSettingsContent
