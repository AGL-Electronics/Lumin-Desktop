import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'
import { DEVICE_STATUS } from '@static/enums'

export const DEFAULT_CANVAS_BOX_POSITION = { x: 0, y: 0, width: 0, height: 0 }
export const ACTIVE_SHADOW = '0 0 0 0 0.121333  0 0 0 0 0.866667  0 0 0 0 0  0 0 0 1 0'
export const LOADING_SHADOW = '0 0 0 0 1  0 0 0 0 0.20166699999999999  0 0 0 0 -1.878667  0 0 0 1 0'
export const DEFAULT_SHADOW = '0 0 0 0 1.966667  0 0 0 0 0  0 0 0 0 -0.04366700000000001  0 0 0 1 0'
export const ACTIVE_COLOR = '#1FDD00'
export const LOADING_COLOR = '#F9AA33'
export const DEFAULT_COLOR = '#DD0000'
export const DISABLED_COLOR = '#505668'
export const FAILED_COLOR = '#DD0000'
export const BULLET_POSITION_ADJUSTMENT = 18

export const getBulletPosition = (range: HTMLInputElement) => {
    return +range.value / +range.max
}

export const GenerateMatrixShadow = (activeStatus: DEVICE_STATUS) => {
    switch (activeStatus) {
        case DEVICE_STATUS.ACTIVE:
            return ACTIVE_SHADOW
        case DEVICE_STATUS.LOADING:
            return LOADING_SHADOW
        default:
            return DEFAULT_SHADOW
    }
}

export const ActiveStatus = (activeStatus: DEVICE_STATUS) => {
    switch (activeStatus) {
        case DEVICE_STATUS.ACTIVE:
            return ACTIVE_COLOR
        case DEVICE_STATUS.LOADING:
            return LOADING_COLOR
        case DEVICE_STATUS.FAILED:
            return FAILED_COLOR
        case DEVICE_STATUS.DISABLED:
            return DISABLED_COLOR
        default:
            return DEFAULT_COLOR
    }
}

export const CheckDisabled = (status: DEVICE_STATUS) => {
    if (status === DEVICE_STATUS.DISABLED) {
        return DISABLED_COLOR
    }
    return 'white'
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const capitalizeFirstLetter = (letter: string) => {
    return letter.charAt(0).toUpperCase() + letter.slice(1)
}

// Helper function to convert all caps string to first letter caps only
export const toFirstLetterCaps = (str: string) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
}

// Helper function to convert string to camelCase
export const toCamelCase = (str: string) => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
}

export const isEmpty = <T>(obj: string | object | Array<T>) => {
    if (!Array.isArray(obj)) {
        return Object.keys(obj).length === 0
    } else if (typeof obj === 'string') {
        obj = obj as string
        return !obj.length || obj === '' || obj === null || obj === undefined
    }
    return !obj.length
}
