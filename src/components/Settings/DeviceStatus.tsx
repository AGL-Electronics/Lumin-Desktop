import type { Component } from 'solid-js'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'
import { ActiveStatus } from '@src/lib/utils'
import { DEVICE_STATUS } from '@static/enums'

const DeviceConnectionStatus: Component<{
    deviceStatus: DEVICE_STATUS
}> = (props) => {
    return (
        <Flex flexDirection="col" class="pl-4 pr-4 rounded-xl pb-4 pt-4 bg-[#333742] text-white">
            <Flex justifyContent="between" class="text-base">
                <Label weight="extraBold" size="lg">
                    Device status
                </Label>
                
            </Flex>
        </Flex>
    )
}

export default DeviceConnectionStatus
