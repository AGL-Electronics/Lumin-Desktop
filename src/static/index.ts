import { createSignal, Setter } from 'solid-js'
import { DEVICE_TYPE } from './enums'
import { toCamelCase } from '@src/lib/utils'
import * as enums from '@static/enums'
import * as types from '@static/types'

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

// Define known dataLabel keys
type KnownDataLabel =
    | 'led-type'
    | 'led-bars-connected'
    | 'led-connection-point'
    | 'device-label'
    | 'device-type'
    | 'printer-serial-number'
    | 'mqtt-password'
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

const selectionSignals: SelectionSignals = {}
const inputSignals: InputSignals = {}

const dataLabels: CamelCaseDataLabels = {} as CamelCaseDataLabels

export interface DeviceSettingsObj {
    label: string
    dataLabel: KnownDataLabel
    popoverDescription: string
    placeholder: string
    ariaLabel?: string
    options?: string[]
    required: boolean
    inputType?: string
    type: 'select' | 'input'
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
        type: 'input',
    },
    {
        label: 'Lumin Type',
        dataLabel: 'device-type',
        popoverDescription: 'The type of Lumin device you are using',
        placeholder: DEVICE_TYPE.WIRED,
        ariaLabel: 'Select Lumin Device Type',
        options: [...Object.values(DEVICE_TYPE).filter((type) => type !== DEVICE_TYPE.NONE)],
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
        type: 'input',
    },
    {
        label: 'LANCode',
        dataLabel: 'mqtt-password',
        popoverDescription: 'The password for the printers MQTT Broker',
        placeholder: 'password',
        required: true,
        inputType: 'password',
        type: 'input',
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

export {
    themes,
    enums,
    types,
    generalSettings,
    ledSettings,
    networkSettings,
    dataLabels,
    ledSelections,
    networkInputs,
    networkSelections,
    generalInputs,
    ledInputs,
    selectionSignals,
    inputSignals,
}
