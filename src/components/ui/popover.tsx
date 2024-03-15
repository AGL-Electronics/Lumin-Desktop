import { Popover as PopoverPrimitive } from '@kobalte/core'
import { Show, createSignal, splitProps } from 'solid-js'
import type { Component, JSXElement } from 'solid-js'

import { cn } from '@src/lib/utils'

type PopoverContentProps = PopoverPrimitive.PopoverContentProps & {
    arrow: boolean
    description?: string
}

type HoverPopoverContentProps = PopoverContentProps & {
    disablePopover?: boolean
    trigger: JSXElement
    popoverDescription?: string
}

const Popover: Component<PopoverPrimitive.PopoverRootProps> = (props) => {
    return <PopoverPrimitive.Root gutter={4} {...props} />
}

const PopoverTrigger: Component<PopoverPrimitive.PopoverTriggerProps> = (props) => {
    return <PopoverPrimitive.Trigger {...props}>{props.children}</PopoverPrimitive.Trigger>
}

const PopoverContent: Component<PopoverContentProps> = (props) => {
    const [, rest] = splitProps(props, ['class', 'arrow', 'description'])

    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                class={cn(
                    'bg-popover text-popover-foreground data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 z-50 w-72 origin-[var(--kb-popover-content-transform-origin)] rounded-md border p-4 shadow-md outline-none',
                    props.class,
                )}
                {...rest}>
                <Show when={props.arrow}>
                    <PopoverPrimitive.Arrow class="text-popover" />
                </Show>
                <Show when={props.description}>
                    <PopoverPrimitive.Description class="popover__description">
                        {props.description}
                    </PopoverPrimitive.Description>
                </Show>
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
    )
}

const HoverPopover: Component<HoverPopoverContentProps> = (props) => {
    const [open, setOpen] = createSignal(false)

    const handlePopOver = (e: PointerEvent) => {
        e.preventDefault()
        if (props.disablePopover) {
            setOpen(false)
        }
        setOpen(!open())
    }
    return (
        <div
            onPointerEnter={handlePopOver}
            onPointerLeave={handlePopOver}
            class="group relative inline-flex">
            <Popover open={open()}>
                <PopoverTrigger>{props.trigger}</PopoverTrigger>
                <PopoverContent
                    arrow={props.arrow}
                    class="bg-accent text-white"
                    description={props.popoverDescription}>
                    {props.children}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export { Popover, PopoverTrigger, PopoverContent, HoverPopover }
