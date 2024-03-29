import { createSignal, Setter } from 'solid-js'
import * as yup from 'yup'
import { toCamelCase } from '@src/lib/utils'
import * as enums from '@static/enums'
import * as types from '@static/types'

// Define known dataLabel keys
type KnownDataLabel =
    | 'led-type'
    | 'led-bars-connected'
    | 'led-connection-point'
    | 'device-label'
    | 'device-type'
    | 'printer-serial-number'
    | 'mqtt-password'
    | 'flash-firmware'
    | 'wifi-ssid'
    | 'wifi-password'
    | 'lumin-device-address'

// Convert these known labels to camelCase for IntelliSense
type CamelCaseDataLabels = {
    [K in KnownDataLabel as ReturnType<typeof toCamelCase>]: string
}

interface GenericSignal {
    value: () => string
    setValue: Setter<string>
}

export type SelectionSignals = {
    [K in KnownDataLabel]?: GenericSignal
}

export type InputSignals = {
    [K in KnownDataLabel]?: GenericSignal
}

export const radius = 25
export const usb = 'USB'
export const installModalClassName = 'mdc-button__label'
export const installModalTarget = 'Install'
export const installationSuccess = 'Installation complete!'
export const questionModalId = 'questionModal'
export const apModalID = 'apMode'
export const debugModalId = 'debugModal'
export const debugModes = [...Object.values(enums.DebugMode)]

const circleSize = Math.PI * (radius * 2)

const selectionSignals: SelectionSignals = {}
const inputSignals: InputSignals = {}

const dataLabels: CamelCaseDataLabels = {} as CamelCaseDataLabels
const themes = [
    'light',
    'dark',
    'cupcake',
    'bumblebee',
    'emerald',
    'corporate',
    'synthwave',
    'retro',
    'cyberpunk',
    'valentine',
    'halloween',
    'garden',
    'forest',
    'aqua',
    'lofi',
    'pastel',
    'fantasy',
    'wireframe',
    'black',
    'luxury',
    'dracula',
    'cmyk',
    'autumn',
    'business',
    'acid',
    'lemonade',
    'night',
    'coffee',
    'winter',
    'dim',
    'nord',
    'sunset',
]

export const stepStatus: {
    [key in enums.STEP_STATUS_ENUM]: {
        step: string
        description: string
        dashoffset: string
        index: string
    }
} = {
    [enums.STEP_STATUS_ENUM.CONFIGURE_BOARD]: {
        index: '1',
        step: 'Step 1',
        description: 'Setup your Lumin device',
        dashoffset: (((100 - 0) / 100) * circleSize).toString(),
    },
    [enums.STEP_STATUS_ENUM.FLASH_FIRMWARE]: {
        index: '2',
        step: 'Step 2',
        description: 'Flash firmware assets',
        dashoffset: (((100 - 50) / 100) * circleSize).toString(),
    },
    [enums.STEP_STATUS_ENUM.BOARD_MANAGER]: {
        index: '3',
        step: 'Step 3',
        description: 'Board Manager',
        dashoffset: (((100 - 100) / 100) * circleSize).toString(),
    },
}

export interface DeviceSettingsObj {
    label: string
    dataLabel: KnownDataLabel
    popoverDescription: string
    placeholder: string
    ariaLabel?: string
    options?: string[]
    required: boolean
    inputType?: string
    minLen?: number
    maxLen?: number
    type: 'select' | 'input' | 'checkbox'
}

const ledSettings: DeviceSettingsObj[] = [
    {
        label: 'LED Type',
        dataLabel: 'led-type',
        popoverDescription: 'The type of LED device',
        ariaLabel: 'Select LED Type',
        placeholder: 'Select...',
        options: ['WLED', 'RGB', 'RGBWW/RGBCCT', 'LedBar'],
        required: true,
        type: 'select',
    },
    {
        label: 'LED Bars Connected',
        dataLabel: 'led-bars-connected',
        placeholder: '2',
        popoverDescription: 'The number of LED bars connected',
        required: true,
        minLen: 1,
        maxLen: 23,
        type: 'input',
    },
    {
        label: 'LED Connection Point',
        dataLabel: 'led-connection-point',
        placeholder: 'Select...',
        popoverDescription: 'The type of connector for the LED device',
        ariaLabel: 'Select LED Connection Point',
        options: [
            'Molex',
            'Screw Terminal',
            'Screw Terminal RGBW',
            'Screw Terminal RGB',
            'Screw Terminal RGBWW/RGBCCT',
        ],
        required: true,
        type: 'select',
    },
]

const generalSettings: DeviceSettingsObj[] = [
    {
        label: 'Lumin Label',
        dataLabel: 'device-label',
        popoverDescription: 'A custom name for your lumin device',
        placeholder: 'Lumin Device',
        required: true,
        inputType: 'text',
        minLen: 1,
        maxLen: 20,
        type: 'input',
    },
    {
        label: 'Lumin Type',
        dataLabel: 'device-type',
        popoverDescription: 'The type of Lumin device you are using',
        placeholder: enums.DEVICE_TYPE.WIRED,
        ariaLabel: 'Select Lumin Device Type',
        options: [
            ...Object.values(enums.DEVICE_TYPE).filter((type) => type !== enums.DEVICE_TYPE.NONE),
        ],
        required: true,
        type: 'select',
    },
    {
        label: 'Printer Serial Number',
        dataLabel: 'printer-serial-number',
        popoverDescription: 'The serial number of your printer',
        placeholder: '123456789',
        required: true,
        inputType: 'text',
        minLen: 15,
        maxLen: 15,
        type: 'input',
    },
    {
        label: 'LANCode',
        dataLabel: 'mqtt-password',
        popoverDescription: 'The password for the printers MQTT Broker',
        placeholder: 'password',
        required: true,
        inputType: 'password',
        minLen: 7,
        maxLen: 7,
        type: 'input',
    },
    {
        label: 'Flash Firmware',
        dataLabel: 'flash-firmware',
        popoverDescription: 'Do you want to flash the firmware?',
        placeholder: 'Flash Firmware',
        required: true,
        inputType: '',
        type: 'checkbox',
    },
]

const networkSettings: DeviceSettingsObj[] = [
    {
        label: 'WIFI SSID',
        dataLabel: 'wifi-ssid',
        popoverDescription: 'The name of the WIFI network',
        placeholder: 'My WIFI Network',
        required: true,
        inputType: 'text',
        type: 'input',
    },
    {
        label: 'WIFI Password',
        dataLabel: 'wifi-password',
        popoverDescription: 'The password for the WIFI network',
        placeholder: 'password',
        required: true,
        inputType: 'password',
        type: 'input',
    },
]

const ledSelections = ledSettings.filter((setting) => setting.type === 'select')
const ledInputs = ledSettings.filter((setting) => setting.type === 'input')

const networkInputs = networkSettings.filter((setting) => setting.type === 'input')
const networkSelections = networkSettings.filter((setting) => setting.type === 'select')

// push the device address input
networkInputs.push({
    label: '',
    dataLabel: 'lumin-device-address',
    popoverDescription: '',
    placeholder: '',
    required: true,
    inputType: 'text',
    type: 'input',
})

const generalSelections = generalSettings.filter((setting) => setting.type === 'select')
const generalInputs = generalSettings.filter((setting) => setting.type === 'input')
const generalCheckboxes = generalSettings.filter((setting) => setting.type === 'checkbox')

// Function to process each setting array
const processSettings = (settings: { dataLabel: KnownDataLabel }[]) => {
    settings.forEach((setting) => {
        const camelCasedKey = toCamelCase(setting.dataLabel)
        dataLabels[camelCasedKey] = setting.dataLabel
    })
}

// Assuming ledSelections, networkSelections, ledInputs, networkInputs, generalInputs are defined elsewhere
processSettings(ledSelections)
processSettings(ledInputs)
processSettings(networkSelections)
processSettings(networkInputs)
processSettings(generalInputs)
processSettings(generalSelections)
processSettings(generalCheckboxes)

// Generic callback function
export function genericCallback(
    setting: { dataLabel: string },
    signalStorage: { [key: string]: GenericSignal },
) {
    const [value, setValue] = createSignal<string>('') // Create a new signal for this setting
    signalStorage[setting.dataLabel] = { value, setValue } // Store the signal in the provided storage object
}

// Assuming ledSelections, networkSelections, ledInputs, networkInputs, and generalInputs are defined elsewhere
// Also assuming selectionSignals and inputSignals are defined as suitable storage objects

ledSelections.forEach((setting) => genericCallback(setting, selectionSignals))
networkSelections.forEach((setting) => genericCallback(setting, selectionSignals))
generalSelections.forEach((setting) => genericCallback(setting, selectionSignals))

ledInputs.forEach((setting) => genericCallback(setting, inputSignals))
networkInputs.forEach((setting) => genericCallback(setting, inputSignals))
generalInputs.forEach((setting) => genericCallback(setting, inputSignals))

generalCheckboxes.forEach((setting) => genericCallback(setting, inputSignals))

// generate a schema type from the networkInputs and generalInputs settings
export type Schema = {
    [K in KnownDataLabel]?: string
}

const wiredSchema: yup.Schema<Schema> = yup.object({
    [dataLabels.deviceLabel]: yup.string().required().min(1).max(20),
    [dataLabels.printerSerialNumber]: yup.string().required().min(15).max(15),
    [dataLabels.mqttPassword]: yup.string().required().min(7).max(7),
    [dataLabels.luminDeviceAddress]: yup.string().required().min(7).max(15),
})

const wifiSchema: yup.Schema<Schema> = yup.object({
    [dataLabels.deviceLabel]: yup.string().required().min(1).max(20),
    [dataLabels.printerSerialNumber]: yup.string().required().min(15).max(15),
    [dataLabels.mqttPassword]: yup.string().required().min(7).max(7),
    [dataLabels.wifiSsid]: yup.string().required().min(1),
    [dataLabels.wifiPassword]: yup.string().required(),
    [dataLabels.luminDeviceAddress]: yup.string().required().min(7).max(15),
})

console.debug('dataLabels:', dataLabels)

export {
    themes,
    enums,
    types,
    wiredSchema,
    wifiSchema,
    generalSettings,
    ledSettings,
    networkSettings,
    dataLabels,
    ledSelections,
    networkInputs,
    networkSelections,
    generalInputs,
    generalSelections,
    generalCheckboxes,
    ledInputs,
    selectionSignals,
    inputSignals,
}
