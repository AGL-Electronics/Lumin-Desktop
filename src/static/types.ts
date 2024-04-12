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

export interface LEDDevice {
    ledType: string
    ledCount: number
    ledConnection: string
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
            ssid: string
            password: string
        }
    }
    led: LEDDevice
    hasCamera: boolean
    ws?: object
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
    loader: boolean
    restAPI: IRest
    ghAPI: IGHRest
    firmwareType: string
    activeBoard: string
    ssid: string
    password: string
    apModeStatus: boolean
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

export interface IEndpoint {
    url: string
    type: RESTType
}

export interface IRest {
    status: RESTStatus
    device: string
    response: object
}

export interface IGHAsset {
    name: string
    browser_download_url: string
}

export interface IGHRest {
    status: RESTStatus
    assets: IGHAsset[]
    version: string
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
    endpointName: string
    deviceName: string
    args?: string
}

export interface MdnsResponse {
    ips: string[]
    names: string[]
}

// #endregion
