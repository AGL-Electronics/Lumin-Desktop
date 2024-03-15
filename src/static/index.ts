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

interface InputDeviceSettings {
    label: string
    dataLabel: string
    popoverDescription: string
    placeholder: string
    required: boolean
    type: string
}

interface LEDDeviceSettings {
    label: string
    dataLabel: string
    popoverDescription: string
    ariaLabel?: string
    options?: string[]
    placeholder: string
    type: 'select' | 'input'
}

const ledSettings: LEDDeviceSettings[] = [
    {
        label: 'LED Type',
        dataLabel: 'led-type',
        popoverDescription: 'The type of LED device',
        ariaLabel: 'Select LED Type',
        placeholder: 'WLED',
        options: ['WLED', 'RGB', 'RGBWW/RGBCCT', 'LedBar'],
        type: 'select',
    },
    {
        label: 'LED Bars Connected',
        dataLabel: 'led-bars-connected',
        placeholder: '2',
        popoverDescription: 'The number of LED bars connected',
        type: 'input',
    },
    {
        label: 'LED Connection Point',
        dataLabel: 'led-connection-point',
        placeholder: 'Molex',
        popoverDescription: 'The type of connector for the LED device',
        ariaLabel: 'Select LED Connection Point',
        options: [
            'Molex',
            'Screw Terminal',
            'Screw Terminal RGBW',
            'Screw Terminal RGB',
            'Screw Terminal RGBWW/RGBCCT',
        ],
        type: 'select',
    },
]

const generalSettings: InputDeviceSettings[] = [
    {
        label: 'Device Label',
        dataLabel: 'device-label',
        popoverDescription: 'The name of the device',
        placeholder: 'Lumin Device',
        required: true,
        type: 'text',
    },
    {
        label: 'Printer Serial Number',
        dataLabel: 'printer-serial-number',
        popoverDescription: 'The serial number of your printer',
        placeholder: '123456789',
        required: true,
        type: 'text',
    },
    {
        label: 'LANCode',
        dataLabel: 'mqtt-password',
        popoverDescription: 'The password for the printers MQTT Broker',
        placeholder: 'password',
        required: true,
        type: 'password',
    },
]

const networkSettings: InputDeviceSettings[] = [
    {
        label: 'WIFI SSID',
        dataLabel: 'wifi-ssid',
        popoverDescription: 'The name of the WIFI network',
        placeholder: 'My WIFI Network',
        required: true,
        type: 'text',
    },
    {
        label: 'WIFI Password',
        dataLabel: 'wifi-password',
        popoverDescription: 'The password for the WIFI network',
        placeholder: 'password',
        required: true,
        type: 'password',
    },
    
]

export { themes, enums, types, generalSettings, ledSettings, networkSettings }
