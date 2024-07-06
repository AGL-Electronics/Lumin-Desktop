import { Switch as SwitchPrimitive } from '@kobalte/core'
import { Show, splitProps } from 'solid-js'
import type { Component } from 'solid-js'

import { cn } from '@src/lib/utils'

interface SwitchProps extends SwitchPrimitive.SwitchRootProps {
    label?: string
    errorMessage?: string
}

const Switch: Component<SwitchProps> = (props) => {
    const [, rest] = splitProps(props, ['label'])
    return (
        <SwitchPrimitive.Root {...rest}>
            <SwitchPrimitive.Input />
            <div class="items-top flex space-x-2">
                <SwitchPrimitive.Control class="bg-base-300/25 focus-visible:ring-ring focus-visible:ring-offset-background data-[checked]:bg-accent/25 peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <SwitchPrimitive.Thumb
                        class={cn(
                            'bg-base-100/75 pointer-events-none block h-5 w-5 translate-x-0 rounded-full shadow-lg ring-0 transition-transform data-[checked]:translate-x-5 data-[checked]:bg-accent',
                        )}
                    />
                </SwitchPrimitive.Control>
                <div class="grid gap-1.5 leading-none">
                    <Show when={props.label}>
                        <SwitchPrimitive.Label class="text-sm font-medium leading-none group-data-[disabled]:cursor-not-allowed group-data-[disabled]:opacity-70">
                            {props.label}
                        </SwitchPrimitive.Label>
                    </Show>
                    <Show when={props.errorMessage}>
                        <SwitchPrimitive.ErrorMessage class="text-reddit/75 text-sm">
                            {props.errorMessage}
                        </SwitchPrimitive.ErrorMessage>
                    </Show>
                </div>
            </div>
        </SwitchPrimitive.Root>
    )
}

export { Switch }
