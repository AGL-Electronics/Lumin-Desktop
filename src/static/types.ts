import type {
    ENotificationType,
    ENotificationAction,
    DEVICE_STATUS,
    MdnsStatus,
    RESTType,
    RESTStatus,
    DEVICE_TYPE,
} from '@static/enums'
import type { JSXElement } from 'solid-js'
import type { ToasterStore } from 'terracotta'

//********************************* Device *************************************/

export interface LEDDevice {
    ledType: string
    ledCount: string
    ledConnection: string
}

export interface Device {
    id: string
    name: string
    status: DEVICE_STATUS
    type: DEVICE_TYPE
    address: string
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
    devices: Device[]
}

export interface AppStoreNotifications {
    notifications?: ToasterStore<Notifications>
    enableNotificationsSounds: boolean
    enableNotifications: boolean
    globalNotificationsType: ENotificationAction
}

export interface UIStore {
    showDeviceView: boolean
    tabs: UITab[]
    selectedTab: UITab | null
    loggedIn: boolean
    modalStatus?: {
        openModal: boolean
        editingMode: boolean
    }
    showNotifications?: boolean
}

export interface AppStoreAPI {
    restAPI: IRest
    ghAPI: IGHRest
}

export interface AppStoreDevice {
    devices: Device[]
    selectedDevice: Device
}

export interface AppStoreNetwork {
    mdnsStatus: MdnsStatus
    mdnsData: MdnsResponse
}

// #endregion

// #region Config

//********************************* Config *************************************/

/**
 * @description Debug mode levels
 * @export typedef {string} DebugMode
 * @property {'off'} off
 * @property {'error'} error
 * @property {'warn'} warn
 * @property {'info'} info
 * @property {'debug'} debug
 * @property {'trace'} trace
 */
export type DebugMode = 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

/**
 * @description This is the export type that is passed to the Tauri Store instance to handle persistent data within the app.
 * @export typedef {Object} PersistentSettings
 * @property {string} user - The current user of the app
 * @property {AppSettings} - The app settings
 * @property {AppStoreNotifications} - The app store notifications
 */
export type PersistentSettings = {
    user?: string
    devices: Device[]
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

type TabEvent = 'add' | 'hide' | 'show' | 'active' | DropZoneName
export type DropZoneName = 'left' | 'right' | 'bottom'

/**
 * @description Business logic for the application
 * @interface UITabs
 * @property {string} id - The id of the UI element
 * @property {string} label - The label of the UI element
 * @property {string} icon - The icon of the UI element
 * @property {JSXElement | null} content - The content of the UI element
 * @property {boolean} enabled - The enabled state of the UI element
 * @property {boolean} visible - The visible state of the UI element
 * @property {DropZoneName} dropZone - The position of the UI element
 * @property {TabEvent} event - The event to trigger on the UI element
 */
export interface UITab {
    id: string
    icon: string
    content: JSXElement | null
    dropZone: DropZoneName
    visible: boolean
    label?: string
    event?: TabEvent
}

// #endregion

// #region Network

//********************************* Network *************************************/

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
