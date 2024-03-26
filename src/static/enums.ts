//********************************* Device *************************************/

export enum DEVICE_VIEW_MODE {
    LIST = 'LIST',
    GRIP = 'GRIP',
}

export enum DEVICE_STATUS {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    LOADING = 'LOADING',
    FAILED = 'FAILED',
    NONE = 'NONE',
}

export enum DEVICE_TYPE {
    WIRELESS = 'WIRELESS',
    WIRED = 'ETHERNET',
    NONE = 'NONE',
}

//********************************* UI *************************************/

export enum TITLEBAR_ACTION {
    MINIMIZE = 'minimize',
    MAXIMIZE = 'maximize',
    CLOSE = 'close',
}

export enum POPOVER_ID {
    GRIP = 'grip-popover',
    LIST = 'list-popover',
    TRACKER_MANAGER = 'tracker-manager-popover',
    SETTINGS_POPOVER = 'settings-popover',
}

export enum ANIMATION_MODE {
    GRIP = 'grip-popover',
    LIST = 'list-popover',
    NONE = 'NONE',
}

export enum LoaderType {
    MDNS_CONNECTING = 'MDNS_CONNECTING',
    REST_CLIENT = 'REST_CLIENT',
}

export enum ENotificationType {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING',
    DEFAULT = 'DEFAULT',
}

export enum ENotificationAction {
    OS = 'OS',
    APP = 'APP',
    NULL = 'null',
}

export enum STEP_STATUS_ENUM {
    CONFIGURE_BOARD = 'CONFIGURE_BOARD',
    BOARD_MANAGER = 'BOARD_MANAGER',
    FLASH_FIRMWARE = 'FLASH_FIRMWARE',
}

//********************************* Network and App *************************************/

// TODO = add more exit codes related to potential areas of failure in the app
export enum ExitCodes {
    USER_EXIT = 0,
    ERROR = 1,
    ERROR_UNKNOWN = 2,
}

export enum RESTStatus {
    ACTIVE = 'ACTIVE',
    COMPLETE = 'COMPLETE',
    LOADING = 'LOADING',
    FAILED = 'FAILED',
    NO_DEVICE = 'NO_DEVICE',
    NO_CONFIG = 'NO_CONFIG',
}

export enum RESTType {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum MdnsStatus {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
    LOADING = 'LOADING',
    FAILED = 'FAILED',
}

export enum ESPEndpoints {
    //? Default
    PING = '/control/builtin/command/ping',
    SAVE = '/control/builtin/command/save',
    RESET_CONFIG = '/control/builtin/command/resetConfig',
    REBOOT_DEVICE = '/control/builtin/command/rebootDevice',
    RESTART_CAMERA = '/control/builtin/command/restartCamera',
    GET_STORED_CONFIG = '/control/builtin/command/getStoredConfig',
    SET_TX_POWER = '/control/builtin/command/setTxPower',
    SET_DEVICE = '/control/builtin/command/setDevice',
    //? Network
    WIFI = '/control/builtin/command/wifi',
    WIFI_STRENGTH = '/control/builtin/command/wifiStrength',
    OTA = '/update',
}
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
export enum DebugMode {
    OFF = 'off',
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    TRACE = 'trace',
}

export enum DIRECTION {
    '/' = STEP_STATUS_ENUM.BOARD_MANAGER,
    '/deviceSettings/true' = STEP_STATUS_ENUM.CONFIGURE_BOARD,
    '/flashFirmware' = STEP_STATUS_ENUM.FLASH_FIRMWARE,
}
