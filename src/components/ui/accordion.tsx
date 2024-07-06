import { Accordion as AccordionPrimitive } from '@kobalte/core'
import { splitProps } from 'solid-js'

import type { Component } from 'solid-js'
import { cn } from '@src/lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem: Component<AccordionPrimitive.AccordionItemProps> = (props) => {
    const [, rest] = splitProps(props, ['class'])
    return <AccordionPrimitive.Item class={cn('', props.class)} {...rest} />
}

interface AccordionTriggerProps extends AccordionPrimitive.AccordionTriggerProps {
    fill?: string
    stroke?: string
}

const AccordionTrigger: Component<AccordionTriggerProps> = (props) => {
    const [, rest] = splitProps(props, ['class', 'children'])
    return (
        <AccordionPrimitive.Header class="flex">
            <AccordionPrimitive.Trigger
                class={cn(
                    'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline text-white/75 [&[data-expanded]>svg]:rotate-180',
                    props.class,
                )}
                {...rest}>
                {props.children}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={props.fill || 'none'}
                    stroke={props.stroke || 'currentColor'}
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="size-4 shrink-0 transition-transform duration-200">
                    <path d="M6 9l6 6l6 -6" />
                </svg>
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    )
}

const AccordionContent: Component<AccordionPrimitive.AccordionContentProps> = (props) => {
    const [, rest] = splitProps(props, ['class', 'children'])
    return (
        <AccordionPrimitive.Content
            class={cn(
                'animate-accordion-up overflow-hidden text-sm transition-all data-[expanded]:animate-accordion-down',
                props.class,
            )}
            {...rest}>
            <div class="pb-4 pt-0">{props.children}</div>
        </AccordionPrimitive.Content>
    )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
