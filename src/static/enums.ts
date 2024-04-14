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

export enum DEVICE_MODIFY_EVENT {
    PUSH = 'PUSH',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
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
    PING = '/api/builtin/ping',
    SAVE = '/api/builtin/save',
    RESET_CONFIG = '/api/builtin/resetConfig',
    REBOOT_DEVICE = '/api/builtin/rebootDevice',
    RESTART_CAMERA = '/api/builtin/restartCamera',
    GET_STORED_CONFIG = '/api/builtin/getStoredConfig',
    LUMIN_DEVICE_CONFIG = '/lumin/api/json/getConfig',
    SET_TX_POWER = '/api/builtin/setTxPower',
    SET_DEVICE = '/api/builtin/setDevice',
    //? Network
    WIFI = '/api/builtin/wifi',
    WIFI_STRENGTH = '/api/builtin/wifiStrength',
    OTA = '/update',
    //? POST BODY
    JSON_HANDLER = '/lumin/api/json',
}

export enum ESPCommands {
    SET_LEDS = 'set_leds',
    SET_MDNS = 'set_mdns',
    SET_WIFI = 'set_wifi',
    SET_MQTT = 'set_mqtt',
    SET_OTA = 'set_ota',
    SET_HTTP = 'set_http',
}

export enum ESPLEDPatterns {
    UPDATE = 'update',
    RGB_CYCLE = 'rgb_cycle',
    RGB = 'rgb',
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue',
    WHITE = 'white',
    WARM = 'warm',
    COLD = 'cold',
    WARM_COLD = 'warm_cold',
    WIFI_STRENGTH = 'wifi_strength',
    CUSTOM = 'custom',
    NONE = 'none',
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
