import { createSignal, splitProps } from 'solid-js'
import type { Component, ComponentProps } from 'solid-js'
import { cn } from '@src/lib/utils'

type InputProps = ComponentProps<'input'> & {
    onFocus?: (e: FocusEvent) => void
    onInput?: (e: InputEvent) => void
}

const Input: Component<InputProps> = (props) => {
    const [, rest] = splitProps(props, ['type', 'class'])
    const [isAutocompleted, setIsAutocompleted] = createSignal(false)
    // Event handlers
    const handleInput = (
        e: InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement },
    ) => {
        setIsAutocompleted(true)
        if (props.onInput) props.onInput(e) // Forward the event if there's an onInput prop
    }

    const handleFocus = (
        e: FocusEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement },
    ) => {
        setIsAutocompleted(false) // Reset on focus
        if (props.onFocus) props.onFocus(e) // Forward the event if there's an onFocus prop
    }

    return (
        <input
            type={props.type}
            class={cn(
                'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                props.class,
            )}
            classList={{
                'ring-accent': isAutocompleted(),
                'bg-accent text-white': isAutocompleted(),
            }}
            onInput={handleInput}
            onFocus={handleFocus}
            {...rest}
        />
    )
}

export { Input }
