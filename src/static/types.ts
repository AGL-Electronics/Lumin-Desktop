import { UniqueArray } from './uniqueArray'
import type {
    ENotificationType,
    ENotificationAction,
    DEVICE_STATUS,
    MdnsStatus,
    RESTType,
    RESTStatus,
    DEVICE_TYPE,
    DebugMode,
    ESPLEDPatterns,
} from '@static/enums'
import type { JSXElement } from 'solid-js'
import type { ToasterStore } from 'terracotta'

export interface CustomHTMLElement extends HTMLElement {
    port: Navigator
}

export interface INavigatorPort extends Navigator {
    open: ({ baudRate }: { baudRate: number }) => Promise<void>
    close: () => void
}

export interface INavigator extends Navigator {
    serial: {
        requestPort: () => INavigatorPort
    }
}

//********************************* Device *************************************/

export interface LEDSettings {
    ledType: string
    ledBarsConnected: number
    ledConnectionPoint: string
}

export interface GeneralSettings {
    deviceLabel: string
    deviceType: DEVICE_TYPE
    printerSerialNumber: string
    lanCode: string
    flashFirmware: boolean
}

export interface NetworkSettings {
    wifiSSID: string
    wifiPassword: string
    luminDeviceAddress: string
    luminDeviceMDNS: string
}

export interface BehaviorSettings {
    pattern?: ESPLEDPatterns
    maintenanceModeToggle: boolean
    rgbCycleToggle: boolean
    replicateLedStateToggle: boolean
    testLedsToggle: boolean
    showWifiStrengthToggle: boolean
    disableLEDSToggle: boolean
}

export interface OptionsSettings {
    finishIndicationToggle: boolean
    finishIndicationColor: string
    exitFinishAfterToggle: boolean
    exitFinishAfterTime: number
    inactivityTimeoutToggle: boolean
    inactivityTimeout: number
    debuggingToggle: boolean
    debuggingOnchangeEventsToggle: boolean
    mqttLoggingToggle: boolean
}

export interface PrinterSettings {
    p1PrinterToggle: boolean
    doorSwitchToggle: boolean
    lidarStageCleaningNozzleColor: string
    lidarStageBedLevelingColor: string
    lidarStageCalibratingExtrusionColor: string
    lidarStageScanningBedSurfaceColor: string
    lidarStageFirstLayerInspectionColor: string
}

export interface CustomizeColorsSettings {
    errorDetectionToggle: boolean
    wifiSetupColor: string
    pauseColor: string
    firstLayerErrorColor: string
    nozzleCloggedColor: string
    hmsSeveritySeriousColor: string
    hmsSeverityFatalColor: string
    filamentRunoutColor: string
    frontCoverRemovedColor: string
    nozzleTempFailColor: string
    bedTempFailColor: string
}

export interface LEDControllerSettings {
    behavior: BehaviorSettings
    options: OptionsSettings
    printer: PrinterSettings
    customizeColors: CustomizeColorsSettings
}

export interface DeviceSettingsStore {
    ledSettings: LEDSettings
    generalSettings: GeneralSettings
    networkSettings: NetworkSettings
    ledControlSettings: LEDControllerSettings
}

export interface LEDDevice {
    settings: LEDSettings
    ledControlSettings: LEDControllerSettings
}

export interface Device {
    id: string
    name: string
    type: DEVICE_TYPE
    status: DEVICE_STATUS
    serialNumber: string
    network: {
        lanCode: string
        mdns?: string
        address: string
        wifi: {
            apModeStatus: boolean
            ssid: string
            password: string
        }
    }
    led: LEDDevice
    hasCamera: boolean
    ws?: object
    lastUpdate: number
}

//********************************* Components *************************************/

export interface Internal {
    errorMsg?: string
    error?: boolean
}

export interface Inputs {
    input: (props?: Internal) => JSXElement
}

// #region Context Stores

//********************************* Stores *************************************/

export interface AppStore extends AppSettings {
    devices: UniqueArray<Device>
}

export interface AppStoreNotifications {
    notifications?: ToasterStore<Notifications>
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: ENotificationAction
}

export interface UIStore {
    showDeviceView: boolean
    modalStatus?: {
        openModal: boolean
        editingMode: boolean
    }
    showNotifications?: boolean
    contextAnchor?: HTMLElement | null
}

export interface AppStoreAPI {
    restAPI: IRest
    ghAPI: IGHRest
}

export interface AppStoreDevice {
    devices: UniqueArray<Device>
    selectedDevice?: Device
}

export interface AppStoreNetwork {
    mdnsStatus: MdnsStatus
    mdnsData: MdnsResponse
}

// #endregion

// #region Config

//********************************* Config *************************************/

/**
 * @description This is the export type that is passed to the Tauri Store instance to handle persistent data within the app.
 * @export typedef {Object} PersistentSettings
 * @property {string} user - The current user of the app
 * @property {AppSettings} - The app settings
 * @property {AppStoreNotifications} - The app store notifications
 */
export type PersistentSettings = {
    user?: string
    devices: UniqueArray<Device>
} & AppSettings &
    AppStoreNotifications

/**
 * @description Backend Config
 */
export type BackendConfig = {
    version?: number | string
    debug?: DebugMode
}

// #endregion

// #region Settings

//********************************* Settings *************************************/

export interface MainApp {
    loggedIn: boolean
}

export interface AppSettings {
    scanForDevicesOnStartup: boolean
    enableMDNS: boolean
    debugMode: DebugMode
}

export interface NotificationSettings {
    enableNotificationsSounds?: boolean
    enableNotifications?: boolean
    globalNotificationsType?: ENotificationAction
}

//* Utility Interfaces

export interface GeneralError {
    readonly _tag: 'Error'
    readonly error: string | number | unknown
}

// #endregion

// #region UI
//********************************* UI *************************************/

export interface SkeletonHandlerProps {
    render?: boolean
    items?: SkeletonProps[]
    children?: JSXElement
}

export interface SkeletonProps {
    class: string
}

export interface CardProps {
    children?: JSXElement
    src?: string
    title?: string
    subTitle?: string
    imageAlt?: string
    buttonElement?: JSXElement
    background?: string
    backgroundColor?: string
}

export interface NotificationAction {
    callbackOS(): void
    callbackApp(): void
}

export interface Notifications {
    title: string
    message: string
    type: ENotificationType
}

// #endregion

// #region Network

//********************************* Network *************************************/

export type IEndpointKey =
    | 'ota'
    | 'ping'
    | 'save'
    | 'wifi'
    | 'setDevice'
    | 'setTxPower'
    | 'resetConfig'
    | 'rebootDevice'
    | 'wifiStrength'
    | 'restartCamera'
    | 'getStoredConfig'
    | 'jsonHandler'

export interface IEndpoint {
    url: string
    type: RESTType
}

export interface IRest {
    status: RESTStatus
    response: object
}

export interface IPOSTCommand {
    commands: Array<{
        command: 'set_leds' | 'set_mdns' | 'set_wifi' | 'set_mqtt' | 'set_ota' | 'set_http'
        data: object
    }>
}

export interface IGHAsset {
    name: string
    browser_download_url: string
}

export interface IGHRest {
    status: RESTStatus
    firmware: {
        assets: IGHAsset[]
        type: string
        version: string
    }
}

export interface IGHRelease {
    data: object
    headers: object
    rawHeaders: object
    ok: boolean
    status: number
    url: string
}

export interface IRestProps {
    endpointKey: IEndpointKey
    deviceID: string
    body: IPOSTCommand
    args?: string
}

export interface MdnsResponse {
    ips: string[]
    names: string[]
}

// #endregion
