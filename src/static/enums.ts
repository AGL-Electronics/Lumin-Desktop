//********************************* UI *************************************/

export enum POPOVER_ID {
    GRIP = 'grip-popover',
    LIST = 'list-popover',
    SETTINGS_POPOVER = 'settings-popover',
}

export enum ANIMATION_MODE {
    GRIP = 'grip-popover',
    LIST = 'list-popover',
    NONE = 'NONE',
}

export enum loaderType {
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

//********************************* Network and App *************************************/

// TODO = add more exit codes related to potential areas of failure in the app
export enum ExitCodes {
    USER_EXIT = 0,
    ERROR = 1,
    ERROR_UNKNOWN = 2,
}
