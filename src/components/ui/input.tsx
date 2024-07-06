import { FieldProps, Field } from 'solid-form-handler'
import { createSignal, splitProps, Show } from 'solid-js'
import type { Component, ComponentProps } from 'solid-js'
import { cn } from '@src/lib/utils'

type InputProps = ComponentProps<'input'> & {
    onFocus?: (e: FocusEvent) => void
    onInput?: (e: InputEvent) => void
} & FieldProps & {
        label?: string
    }

const Input: Component<InputProps> = (props) => {
    const [local, rest] = splitProps(props, ['type', 'class', 'classList', 'label', 'formHandler'])
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
        <Field
            {...props}
            mode="input"
            render={(field) => (
                <div class="w-full" classList={local.classList}>
                    <input
                        type={props.type}
                        class={cn(
                            'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
                            props.class,
                        )}
                        classList={{
                            'ring-accent': isAutocompleted(),
                            'bg-accent text-white': isAutocompleted(),
                            'is-invalid': field.helpers.error,
                            'form-control': true,
                        }}
                        onInput={handleInput}
                        onFocus={handleFocus}
                        {...rest}
                        {...field.props}
                    />
                    <Show when={field.helpers.error}>
                        <div class="text-sm text-error invalid-feedback">{field.helpers.error}</div>
                    </Show>
                </div>
            )}
        />
    )
}

export { Input }
