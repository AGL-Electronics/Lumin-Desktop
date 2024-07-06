export enum LED_Connection_Type_e {
    ADDRESSABLE = 'ADDRESSABLE',
    GPIO = 'GPIO',
}
export enum LED_Pattern_e {
    UPDATE = 'UPDATE',
    RGB_CYCLE = 'RGB_CYCLE',
    RGB = 'RGB',
    RED = 'RED',
    GREEN = 'GREEN',
    BLUE = 'BLUE',
    WHITE = 'WHITE',
    WARM = 'WARM',
    COLD = 'COLD',
    WARM_COLD = 'WARM_COLD',
    WIFI_STRENGTH = 'WIFI_STRENGTH',
    CUSTOM = 'CUSTOM',
    ON = 'ON',
    NONE = 'NONE',
}
export enum LED_Type_e {
    RGB = 'RGB',
    RGBW = 'RGBW',
    RGBWW = 'RGBWW',
    RGBWWW = 'RGBWWW',
}

/**
 * 'set_leds'
 * 'set_mdns'
 * 'set_wifi'
 * 'set_mqtt'
 * 'set_ota'
 * 'set_http'
 * 'set_save'
 */
export enum REST_CMDS {
    SET_LEDS = 'set_leds',
    SET_MDNS = 'set_mdns',
    SET_WIFI = 'set_wifi',
    SET_MQTT = 'set_mqtt',
    SET_OTA = 'set_ota',
    SET_HTTP = 'set_http',
    SET_SAVE = 'set_save',
}
