/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormHandler } from 'solid-form-handler'
import { yupSchema } from 'solid-form-handler/yup'
import { createContext, useContext, type ParentComponent } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import * as yup from 'yup'
import { DEVICE_TYPE, ESPLEDPatterns } from '@src/static/enums'
import { DeviceSettingsStore } from '@src/static/types'

interface DeviceSettingsContext {
    settings: DeviceSettingsStore
    setSettingWithSubcategory<
        C extends keyof DeviceSettingsStore,
        S extends keyof DeviceSettingsStore[C],
        K extends keyof DeviceSettingsStore[C][S],
    >(
        category: C,
        subcategory: S,
        key: K,
        value: DeviceSettingsStore[C][S][K],
    ): void

    setSettingWithoutSubcategory<
        C extends keyof DeviceSettingsStore,
        K extends keyof DeviceSettingsStore[C],
    >(
        category: C,
        key: K,
        value: DeviceSettingsStore[C][K],
    ): void
    clearStore: () => void
}

const DeviceSettingsContext = createContext<DeviceSettingsContext>()
export const DeviceSettingsProvider: ParentComponent = (props) => {
    //#region Store
    const defaultState: DeviceSettingsStore = {
        ledSettings: {
            ledType: '',
            ledBarsConnected: 0,
            ledConnectionPoint: '',
        },
        generalSettings: {
            deviceLabel: '',
            deviceType: DEVICE_TYPE.WIRELESS,
            printerSerialNumber: '',
            lanCode: '',
            flashFirmware: false,
        },
        networkSettings: {
            wifiSSID: '',
            wifiPassword: '',
            luminDeviceAddress: '',
            luminDeviceMDNS: '',
        },
        ledControlSettings: {
            behavior: {
                pattern: ESPLEDPatterns.RGB_CYCLE,
                maintenanceModeToggle: false,
                rgbCycleToggle: true,
                replicateLedStateToggle: false,
                testLedsToggle: false,
                showWifiStrengthToggle: false,
                disableLEDSToggle: false,
            },
            options: {
                finishIndicationToggle: false,
                finishIndicationColor: '',
                exitFinishAfterToggle: false,
                exitFinishAfterTime: 0,
                inactivityTimeoutToggle: false,
                inactivityTimeout: 0,
                debuggingToggle: false,
                debuggingOnchangeEventsToggle: false,
                mqttLoggingToggle: false,
            },
            printer: {
                p1PrinterToggle: false,
                doorSwitchToggle: false,
                lidarStageCleaningNozzleColor: '',
                lidarStageBedLevelingColor: '',
                lidarStageCalibratingExtrusionColor: '',
                lidarStageScanningBedSurfaceColor: '',
                lidarStageFirstLayerInspectionColor: '',
            },
            customizeColors: {
                errorDetectionToggle: false,
                wifiSetupColor: '',
                pauseColor: '',
                firstLayerErrorColor: '',
                nozzleCloggedColor: '',
                hmsSeveritySeriousColor: '',
                hmsSeverityFatalColor: '',
                filamentRunoutColor: '',
                frontCoverRemovedColor: '',
                nozzleTempFailColor: '',
                bedTempFailColor: '',
            },
        },
    }

    const [settings, setSettings] = createStore<DeviceSettingsStore>(defaultState)

    function setSettingWithSubcategory<
        C extends keyof DeviceSettingsStore,
        S extends keyof DeviceSettingsStore[C],
        K extends keyof DeviceSettingsStore[C][S],
    >(category: C, subcategory: S, key: K, value: DeviceSettingsStore[C][S][K]) {
        setSettings(
            produce((draft) => {
                if (!draft[category][subcategory]) {
                    draft[category][subcategory] = {} as any
                }
                draft[category][subcategory][key] = value
            }),
        )
    }

    function setSettingWithoutSubcategory<
        C extends keyof DeviceSettingsStore,
        K extends keyof DeviceSettingsStore[C],
    >(category: C, key: K, value: DeviceSettingsStore[C][K]) {
        setSettings(
            produce((draft) => {
                draft[category][key] = value
            }),
        )
    }

    const clearStore = () => setSettings(defaultState)

    const store = { settings, setSettingWithSubcategory, setSettingWithoutSubcategory, clearStore }
    //#endregion

    return (
        <DeviceSettingsContext.Provider value={store}>
            {props.children}
        </DeviceSettingsContext.Provider>
    )
}

export const useDeviceSettingsContext = () => {
    const context = useContext(DeviceSettingsContext)
    if (context === undefined) {
        throw new Error('useDeviceSettingsContext must be used within a DeviceSettingsProvider')
    }
    return context
}

// Define individual schemas for each category
const ledSettingsSchema = yup.object({
    ledType: yup.string().required(),
    ledBarsConnected: yup.number().required().positive().integer().max(23).min(1),
    ledConnectionPoint: yup.string().required(),
})

const generalSettingsSchema = yup.object({
    deviceLabel: yup.string().required().min(1).max(20),
    deviceType: yup.string().required(),
    printerSerialNumber: yup.string().required().min(15).max(15),
    lanCode: yup.string().required().min(7).max(7),
    flashFirmware: yup.boolean(),
})

/* const networkSettingsSchema = yup.object({
    wifiSSID: yup.string().required(),
    wifiPassword: yup.string().required(),
    luminDeviceAddress: yup.string().required().min(7).max(15),
}) */

/* const behaviorSchema = yup.object({
    maintenanceModeToggle: yup.boolean(),
    rgbCycleToggle: yup.boolean(),
    replicateLedStateToggle: yup.boolean(),
    testLedsToggle: yup.boolean(),
    showWifiStrengthToggle: yup.boolean(),
})

const optionsSchema = yup.object({
    finishIndicationToggle: yup.boolean(),
    finishIndicationColor: yup.string(),
    exitFinishAfterToggle: yup.boolean(),
    exitFinishAfterTime: yup.number().positive().integer(),
    inactivityTimeout: yup.number().positive().integer(),
    debuggingToggle: yup.boolean(),
    debuggingOnchangeEventsToggle: yup.boolean(),
    mqttLoggingToggle: yup.boolean(),
})

const printerSchema = yup.object({
    p1PrinterToggle: yup.boolean(),
    doorSwitchToggle: yup.boolean(),
    lidarStageCleaningNozzleColor: yup.string(),
    lidarStageBedLevelingColor: yup.string(),
    lidarStageCalibratingExtrusionColor: yup.string(),
    lidarStageScanningBedSurfaceColor: yup.string(),
    lidarStageFirstLayerInspectionColor: yup.string(),
})

const customizeColorsSchema = yup.object({
    errorDetectionToggle: yup.boolean(),
    wifiSetupColor: yup.string(),
    pauseColor: yup.string(),
    firstLayerErrorColor: yup.string(),
    nozzleCloggedColor: yup.string(),
    hmsSeveritySeriousColor: yup.string(),
    hmsSeverityFatalColor: yup.string(),
    filamentRunoutColor: yup.string(),
    frontCoverRemovedColor: yup.string(),
    nozzleTempFailColor: yup.string(),
    bedTempFailColor: yup.string(),
}) */

const deviceSettingsSchema = yup.object({
    ledSettings: ledSettingsSchema,
    generalSettings: generalSettingsSchema,
    //networkSettings: networkSettingsSchema,
    /* ledControlSettings: yup.object({
        behavior: behaviorSchema,
        options: optionsSchema,
        printer: printerSchema,
        customizeColors: customizeColorsSchema,
    }), */
})

export const wiredFormHandler = useFormHandler(yupSchema(deviceSettingsSchema))
export const { formData } = wiredFormHandler

export const validateSettings = async (settings) => {
    try {
        await deviceSettingsSchema.validate(settings, { abortEarly: false })
        console.log('Validation succeeded')
        // Proceed with your logic for valid data
    } catch (error) {
        console.error('Validation failed', error)
        // Handle validation errors
    }
}

// Define known dataLabel keys
type SettingsKnownDataLabel =
    | 'led-type'
    | 'led-bars-connected'
    | 'led-connection-point'
    | 'led-pattern'
    | 'device-label'
    | 'device-type'
    | 'printer-serial-number'
    | 'lan-code'
    | 'flash-firmware'
    | 'wifi-ssid'
    | 'wifi-password'
    | 'lumin-device-address'
    | 'lumin-device-mdns'
    | 'maintenance-mode-toggle'
    | 'rgb-cycle-toggle'
    | 'replicate-led-state-toggle'
    | 'test-leds-toggle'
    | 'show-wifi-strength-toggle'
    | 'disable-leds-toggle'
    | 'finish-indication-toggle'
    | 'finish-indication-color'
    | 'exit-finish-after-toggle'
    | 'exit-finish-after-time'
    | 'inactivity-timeout-toggle'
    | 'inactivity-timeout'
    | 'debugging-toggle'
    | 'debugging-onchange-events-toggle'
    | 'mqtt-logging-toggle'
    | 'p1-printer-toggle'
    | 'door-switch-toggle'
    | 'lidar-stage-cleaning-nozzle-color'
    | 'lidar-stage-bed-leveling-color'
    | 'lidar-stage-calibrating-extrusion-color'
    | 'lidar-stage-scanning-bed-surface-color'
    | 'lidar-stage-first-layer-inspection-color'
    | 'error-detection-toggle'
    | 'wifi-setup-color'
    | 'pause-color'
    | 'first-layer-error-color'
    | 'nozzle-clogged-color'
    | 'hms-severity-serious-color'
    | 'hms-severity-fatal-color'
    | 'filament-runout-color'
    | 'front-cover-removed-color'
    | 'nozzle-temp-fail-color'
    | 'bed-temp-fail-color'

export interface DeviceSettingsObj<
    C extends keyof DeviceSettingsStore,
    S extends keyof DeviceSettingsStore[C] = any,
> {
    label: string
    dataLabel: SettingsKnownDataLabel
    popoverDescription: string
    placeholder: string
    ariaLabel?: string
    options?: string[]
    required: boolean
    inputType?: string
    minLen?: number
    maxLen?: number
    type: 'select' | 'input' | 'toggle' | 'color'
    key: S extends keyof DeviceSettingsStore[C] ? keyof DeviceSettingsStore[C][S] : never
}

// Define the LEDControlSettings interface directly or import if defined elsewhere
export interface LEDControlSettings {
    behavior: DeviceSettingsObj<'ledControlSettings', 'behavior'>[]
    options: DeviceSettingsObj<'ledControlSettings', 'options'>[]
    printer: DeviceSettingsObj<'ledControlSettings', 'printer'>[]
    customizeColors: DeviceSettingsObj<'ledControlSettings', 'customizeColors'>[]
}

export interface SettingCategories {
    ledSettings: DeviceSettingsObj<'ledSettings'>[]
    generalSettings: DeviceSettingsObj<'generalSettings'>[]
    networkSettings: DeviceSettingsObj<'networkSettings'>[]
    ledControlSettings: LEDControlSettings
}

export const deviceSettings: SettingCategories = {
    ledSettings: [
        {
            label: 'LED Type',
            dataLabel: 'led-type',
            popoverDescription: 'The type of LED device',
            ariaLabel: 'Select LED Type',
            placeholder: 'Select...',
            options: ['WLED', 'RGB', 'RGBWW/RGBCCT', 'LedBar'],
            required: true,
            type: 'select',
            key: 'ledType',
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
            key: 'ledBarsConnected',
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
            key: 'ledConnectionPoint',
        },
    ],
    generalSettings: [
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
            key: 'deviceLabel',
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
            key: 'deviceType',
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
            key: 'printerSerialNumber',
        },
        {
            label: 'LANCode',
            dataLabel: 'lan-code',
            popoverDescription: 'The password for the printers MQTT Broker',
            placeholder: 'password',
            required: true,
            inputType: 'password',
            minLen: 7,
            maxLen: 7,
            type: 'input',
            key: 'lanCode',
        },
        {
            label: 'Flash Firmware',
            dataLabel: 'flash-firmware',
            popoverDescription: 'Do you want to flash the firmware?',
            placeholder: 'Flash Firmware',
            required: true,
            type: 'toggle',
            key: 'flashFirmware',
        },
    ],
    networkSettings: [
        {
            label: 'WIFI SSID',
            dataLabel: 'wifi-ssid',
            popoverDescription: 'The name of the WIFI network',
            placeholder: 'My WIFI Network',
            required: true,
            inputType: 'text',
            type: 'input',
            key: 'wifiSSID',
        },
        {
            label: 'WIFI Password',
            dataLabel: 'wifi-password',
            popoverDescription: 'The password for the WIFI network',
            placeholder: 'password',
            required: true,
            inputType: 'password',
            type: 'input',
            key: 'wifiPassword',
        },
        {
            label: 'Lumin Device Address',
            dataLabel: 'lumin-device-address',
            popoverDescription:
                'The device address of the lumin device. If MDNS is enabled this field can be used to manually set the device mdns name. If MDNS is not enabled this is where you enter the IP address of your Lumin device',
            placeholder: '192.168.0.240 or lumin1',
            required: true,
            inputType: 'text',
            type: 'input',
            key: 'luminDeviceAddress',
        },
        {
            label: 'List of Lumin Devices',
            dataLabel: 'lumin-device-mdns',
            popoverDescription: 'A list of detected lumin devices on the network',
            placeholder: 'Select...',
            required: true,
            inputType: 'text',
            type: 'select',
            key: 'luminDeviceMDNS',
        },
    ],
    ledControlSettings: {
        behavior: [
            {
                label: 'Maintenance Mode',
                dataLabel: 'maintenance-mode-toggle',
                popoverDescription: 'Enable maintenance mode',
                placeholder: 'Maintenance Mode',
                required: false,
                type: 'toggle',
                key: 'maintenanceModeToggle',
            },
            {
                label: 'RGB Color Cycle',
                dataLabel: 'rgb-cycle-toggle',
                popoverDescription: 'Enable RGB Color Cycle',
                placeholder: 'RGB Cycle',
                required: false,
                type: 'toggle',
                key: 'rgbCycleToggle',
            },
            {
                label: 'Replicate LED State',
                dataLabel: 'replicate-led-state-toggle',
                popoverDescription: 'Enable LED state replication',
                placeholder: 'Replicate LED State',
                required: false,
                type: 'toggle',
                key: 'replicateLedStateToggle',
            },
            {
                label: 'Test LEDs',
                dataLabel: 'test-leds-toggle',
                popoverDescription: 'Test the LEDs',
                placeholder: 'Test LEDs',
                required: false,
                type: 'toggle',
                key: 'testLedsToggle',
            },
            {
                label: 'Show WIFI Strength',
                dataLabel: 'show-wifi-strength-toggle',
                popoverDescription: 'Show WIFI strength via the LEDs',
                placeholder: 'Show WIFI Strength',
                required: false,
                type: 'toggle',
                key: 'showWifiStrengthToggle',
            },
            {
                label: 'Disable LEDS',
                dataLabel: 'disable-leds-toggle',
                popoverDescription: 'Disable the LEDs',
                placeholder: 'Disable LEDs',
                required: false,
                type: 'toggle',
                key: 'disableLEDSToggle',
            },
            /*  {
                label: 'Set LED Pattern',
                dataLabel: 'led-pattern',
                popoverDescription: 'Select the LED pattern',
                placeholder: 'Select...',
                options: [...Object.values(ESPLEDPatterns)],
                required: true,
                type: 'select',
                key: 'pattern',
            }, */
        ],
        options: [
            {
                label: 'Finish Indication',
                dataLabel: 'finish-indication-toggle',
                popoverDescription: 'Enable finish indication',
                placeholder: 'Finish Indication',
                required: true,
                type: 'toggle',
                key: 'finishIndicationToggle',
            },
            {
                label: 'Finish Indication Color',
                dataLabel: 'finish-indication-color',
                popoverDescription: 'Select the finish indication color',
                placeholder: 'Select...',
                ariaLabel: 'Select Finish Indication Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'finishIndicationColor',
            },
            {
                label: 'Exit Finish After',
                dataLabel: 'exit-finish-after-toggle',
                popoverDescription: 'Enable exit finish after',
                placeholder: 'Exit Finish After',
                required: true,
                type: 'toggle',
                key: 'exitFinishAfterToggle',
            },
            {
                label: 'Exit Finish After Time',
                dataLabel: 'exit-finish-after-time',
                popoverDescription: 'Select the exit finish after time in minutes',
                placeholder: 'Select...',
                ariaLabel: 'Select Exit Finish After Time',
                required: true,
                type: 'input',
                inputType: 'number',
                key: 'exitFinishAfterTime',
            },
            {
                label: 'Inactivity Timeout',
                dataLabel: 'inactivity-timeout-toggle',
                popoverDescription: 'Enable the inactivity timeout',
                placeholder: '',
                ariaLabel: 'Enable Inactivity Timeout',
                required: true,
                type: 'toggle',
                key: 'inactivityTimeoutToggle',
            },
            {
                label: 'Inactivity Timeout Time',
                dataLabel: 'inactivity-timeout',
                popoverDescription: 'Select the inactivity timeout in minutes',
                placeholder: 'Select...',
                ariaLabel: 'Select Inactivity Timeout',
                required: true,
                type: 'input',
                inputType: 'number',
                key: 'inactivityTimeout',
            },
            {
                label: 'Debugging',
                dataLabel: 'debugging-toggle',
                popoverDescription: 'Enable debugging',
                placeholder: 'Debugging',
                required: true,
                type: 'toggle',
                key: 'debuggingToggle',
            },
            {
                label: 'Debugging Onchange Events',
                dataLabel: 'debugging-onchange-events-toggle',
                popoverDescription: 'Enable debugging onchange events',
                placeholder: 'Debugging Onchange Events',
                required: true,
                type: 'toggle',
                key: 'debuggingOnchangeEventsToggle',
            },
            {
                label: 'MQTT Logging',
                dataLabel: 'mqtt-logging-toggle',
                popoverDescription: 'Enable MQTT logging',
                placeholder: 'MQTT Logging',
                required: true,
                type: 'toggle',
                key: 'mqttLoggingToggle',
            },
        ],
        printer: [
            {
                label: 'P1 Printer',
                dataLabel: 'p1-printer-toggle',
                popoverDescription: 'Enable P1 printer, No Door Switch, No Lidar',
                placeholder: 'P1 Printer',
                required: true,
                type: 'toggle',
                key: 'p1PrinterToggle',
            },
            {
                label: 'Door Switch',
                dataLabel: 'door-switch-toggle',
                popoverDescription: 'Enable door switch',
                placeholder: 'Door Switch',
                required: true,
                type: 'toggle',
                key: 'doorSwitchToggle',
            },
            {
                label: 'Lidar Stage Cleaning Nozzle Color',
                dataLabel: 'lidar-stage-cleaning-nozzle-color',
                popoverDescription: 'Select the lidar stage cleaning nozzle color',
                placeholder: 'Select...',
                ariaLabel: 'Select Lidar Stage Cleaning Nozzle Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'lidarStageCleaningNozzleColor',
            },
            {
                label: 'Lidar Stage Bed Leveling Color',
                dataLabel: 'lidar-stage-bed-leveling-color',
                popoverDescription: 'Select the lidar stage bed leveling color',
                placeholder: 'Select...',
                ariaLabel: 'Select Lidar Stage Bed Leveling Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'lidarStageBedLevelingColor',
            },
            {
                label: 'Lidar Stage Calibrating Extrusion Color',
                dataLabel: 'lidar-stage-calibrating-extrusion-color',
                popoverDescription: 'Select the lidar stage calibrating extrusion color',
                placeholder: 'Select...',
                ariaLabel: 'Select Lidar Stage Calibrating Extrusion Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'lidarStageCalibratingExtrusionColor',
            },
            {
                label: 'Lidar Stage Scanning Bed Surface Color',
                dataLabel: 'lidar-stage-scanning-bed-surface-color',
                popoverDescription: 'Select the lidar stage scanning bed surface color',
                placeholder: 'Select...',
                ariaLabel: 'Select Lidar Stage Scanning Bed Surface Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'lidarStageScanningBedSurfaceColor',
            },
            {
                label: 'Lidar Stage First Layer Inspection Color',
                dataLabel: 'lidar-stage-first-layer-inspection-color',
                popoverDescription: 'Select the lidar stage first layer inspection color',
                placeholder: 'Select...',
                ariaLabel: 'Select Lidar Stage First Layer Inspection Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'lidarStageFirstLayerInspectionColor',
            },
        ],
        customizeColors: [
            {
                label: 'Error Detection',
                dataLabel: 'error-detection-toggle',
                popoverDescription: 'Enable error detection',
                placeholder: 'Error Detection',
                required: true,
                type: 'toggle',
                key: 'errorDetectionToggle',
            },
            {
                label: 'WIFI Setup Color',
                dataLabel: 'wifi-setup-color',
                popoverDescription: 'Select the WIFI setup color',
                placeholder: 'Select...',
                ariaLabel: 'Select WIFI Setup Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'wifiSetupColor',
            },
            {
                label: 'Pause Color',
                dataLabel: 'pause-color',
                popoverDescription: 'Select the pause color',
                placeholder: 'Select...',
                ariaLabel: 'Select Pause Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'pauseColor',
            },
            {
                label: 'First Layer Error Color',
                dataLabel: 'first-layer-error-color',
                popoverDescription: 'Select the first layer error color',
                placeholder: 'Select...',
                ariaLabel: 'Select First Layer Error Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'firstLayerErrorColor',
            },
            {
                label: 'Nozzle Clogged Color',
                dataLabel: 'nozzle-clogged-color',
                popoverDescription: 'Select the nozzle clogged color',
                placeholder: 'Select...',
                ariaLabel: 'Select Nozzle Clogged Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'nozzleCloggedColor',
            },
            {
                label: 'HMS Severity Serious Color',
                dataLabel: 'hms-severity-serious-color',
                popoverDescription: 'Select the HMS severity serious color',
                placeholder: 'Select...',
                ariaLabel: 'Select HMS Severity Serious Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'hmsSeveritySeriousColor',
            },
            {
                label: 'HMS Severity Fatal Color',
                dataLabel: 'hms-severity-fatal-color',
                popoverDescription: 'Select the HMS severity fatal color',
                placeholder: 'Select...',
                ariaLabel: 'Select HMS Severity Fatal Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'hmsSeverityFatalColor',
            },
            {
                label: 'Filament Runout Color',
                dataLabel: 'filament-runout-color',
                popoverDescription: 'Select the filament runout color',
                placeholder: 'Select...',
                ariaLabel: 'Select Filament Runout Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'filamentRunoutColor',
            },
            {
                label: 'Front Cover Removed Color',
                dataLabel: 'front-cover-removed-color',
                popoverDescription: 'Select the front cover removed color',
                placeholder: 'Select...',
                ariaLabel: 'Select Front Cover Removed Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'frontCoverRemovedColor',
            },
            {
                label: 'Nozzle Temp Fail Color',
                dataLabel: 'nozzle-temp-fail-color',
                popoverDescription: 'Select the nozzle temp fail color',
                placeholder: 'Select...',
                ariaLabel: 'Select Nozzle Temp Fail Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'nozzleTempFailColor',
            },
            {
                label: 'Bed Temp Fail Color',
                dataLabel: 'bed-temp-fail-color',
                popoverDescription: 'Select the bed temp fail color',
                placeholder: 'Select...',
                ariaLabel: 'Select Bed Temp Fail Color',
                inputType: 'color',
                required: true,
                type: 'color',
                key: 'bedTempFailColor',
            },
        ],
    },
}
