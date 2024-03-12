import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (letter: string) => {
    return letter.charAt(0).toUpperCase() + letter.slice(1)
}

export const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(' ')
}

export const isEmpty = <T>(obj: object | Array<T>) => {
    if (!Array.isArray(obj)) {
        // ⇒ do not attempt to process array
        return Object.keys(obj).length === 0
    }
    return !obj.length
}
