import {
    FaSolidQuestion,
    FaSolidGrip,
    FaSolidListUl,
    FaSolidLightbulb,
    FaSolidPlus,
    FaSolidArrowLeft,
    FaSolidArrowRight,
} from 'solid-icons/fa'
import { IoSettingsSharp } from 'solid-icons/io'
import { OcQuestion2 } from 'solid-icons/oc'
import { TbDashboard, TbGardenCart, TbSelector } from 'solid-icons/tb'
import { type ComponentProps, type Component, splitProps } from 'solid-js'

export type IconProps = ComponentProps<'svg'> & {
    class?: string
    color?: string
    size: number
    viewBox?: string
}

const Icon: Component<IconProps> = (props) => {
    const [, rest] = splitProps(props, ['class'])
    const handleSize = (): string => {
        return props.size + 'px'
    }
    return (
        <svg
            width={handleSize()}
            height={handleSize()}
            viewBox={props.viewBox ? props.viewBox : '0 0 24 24'}
            fill={props.color ? props.color : 'none'}
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...props}
            {...rest}
        />
    )
}
type IconType = typeof Icon

const Icons = {
    arrowDown: (props: IconProps) => (
        <Icon {...props}>
            <line x1="12" x2="12" y1="5" y2="19" />
            <polyline points="19 12 12 19 5 12" />
        </Icon>
    ),
    arrowDownRight: (props: IconProps) => (
        <Icon {...props}>
            <line x1="7" x2="17" y1="7" y2="17" />
            <polyline points="17 7 17 17 7 17" />
        </Icon>
    ),
    arrowRight: (props: IconProps) => (
        <FaSolidArrowRight class={props.class} size={props.size} color={props.color} />
    ),
    arrowLeft: (props: IconProps) => (
        <FaSolidArrowLeft class={props.class} size={props.size} color={props.color} />
    ),
    arrowUp: (props: IconProps) => (
        <Icon {...props}>
            <line x1="12" x2="12" y1="19" y2="5" />
            <polyline points="5 12 12 5 19 12" />
        </Icon>
    ),
    arrowUpRight: (props: IconProps) => (
        <Icon {...props}>
            <line x1="7" x2="17" y1="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
        </Icon>
    ),
    bell: (props: IconProps) => (
        <Icon {...props}>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </Icon>
    ),
    check: (props: IconProps) => (
        <Icon {...props}>
            <polyline points="20 6 9 17 4 12" />
        </Icon>
    ),
    chevronDown: (props: IconProps) => (
        <Icon {...props}>
            <polyline points="6 9 12 15 18 9" />
        </Icon>
    ),
    chevronLeft: (props: IconProps) => (
        <Icon {...props}>
            <polyline points="15 18 9 12 15 6" />
        </Icon>
    ),
    chevronRight: (props: IconProps) => (
        <Icon {...props}>
            <polyline points="9 18 15 12 9 6" />
        </Icon>
    ),
    chevronUp: (props: IconProps) => (
        <Icon {...props}>
            <polyline points="18 15 12 9 6 15" />
        </Icon>
    ),
    chevronsLeft: (props: IconProps) => (
        <Icon {...props}>
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
        </Icon>
    ),
    chevronsRight: (props: IconProps) => (
        <Icon {...props}>
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
        </Icon>
    ),
    chevronsUpDown: (props: IconProps) => (
        <TbSelector class={props.class} size={props.size} color={props.color} />
    ),
    circle: (props: IconProps) => (
        <Icon {...props}>
            <circle cx="12" cy="12" r="10" />
        </Icon>
    ),
    close: (props: IconProps) => (
        <Icon {...props}>
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
        </Icon>
    ),
    eyeOff: (props: IconProps) => (
        <Icon {...props}>
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
            <line x1="2" x2="22" y1="2" y2="22" />
        </Icon>
    ),
    gitHub: (props: IconProps) => (
        <Icon {...props}>
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </Icon>
    ),
    laptop: (props: IconProps) => (
        <Icon {...props}>
            <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
        </Icon>
    ),
    logo: (props: IconProps) => (
        <Icon viewBox="0 0 256 256" {...props}>
            <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                stroke="#4d83c4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="24"
            />
            <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                stroke="#93c4e9"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="24"
            />
        </Icon>
    ),
    moon: (props: IconProps) => (
        <Icon {...props}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </Icon>
    ),
    sidebarOpen: (props: IconProps) => (
        <Icon {...props}>
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <path d="M9 3v18" />
            <path d="m14 9 3 3-3 3" />
        </Icon>
    ),
    slidersHorizontal: (props: IconProps) => (
        <Icon {...props}>
            <line x1="21" x2="14" y1="4" y2="4" />
            <line x1="10" x2="3" y1="4" y2="4" />
            <line x1="21" x2="12" y1="12" y2="12" />
            <line x1="8" x2="3" y1="12" y2="12" />
            <line x1="21" x2="16" y1="20" y2="20" />
            <line x1="12" x2="3" y1="20" y2="20" />
            <line x1="14" x2="14" y1="2" y2="6" />
            <line x1="8" x2="8" y1="10" y2="14" />
            <line x1="16" x2="16" y1="18" y2="22" />
        </Icon>
    ),
    sortDesc: (props: IconProps) => (
        <Icon {...props}>
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="M11 4h10" />
            <path d="M11 8h7" />
            <path d="M11 12h4" />
        </Icon>
    ),
    sortAsc: (props: IconProps) => (
        <Icon {...props}>
            <path d="m3 8 4-4 4 4" />
            <path d="M7 4v16" />
            <path d="M11 12h4" />
            <path d="M11 16h7" />
            <path d="M11 20h10" />
        </Icon>
    ),
    sun: (props: IconProps) => (
        <Icon {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </Icon>
    ),
    plus: (props: IconProps) => (
        <FaSolidPlus class={props.class} size={props.size} color={props.color} />
    ),
    dashboard: (props: IconProps) => (
        <TbDashboard class={props.class} size={props.size} color={props.color} />
    ),
    gear: (props: IconProps) => (
        <IoSettingsSharp class={props.class} size={props.size} color={props.color} />
    ),
    grip: (props: IconProps) => (
        <FaSolidGrip class={props.class} size={props.size} color={props.color} />
    ),
    list: (props: IconProps) => (
        <FaSolidListUl class={props.class} size={props.size} color={props.color} />
    ),
    question: (props: IconProps) => (
        <FaSolidQuestion class={props.class} size={props.size} color={props.color} />
    ),
    questionCircle: (props: IconProps) => (
        <OcQuestion2 class={props.class} size={props.size} color={props.color} />
    ),
    profile: (props: IconProps) => (
        <TbGardenCart class={props.class} size={props.size} color={props.color} />
    ),
    led: (props: IconProps) => (
        <FaSolidLightbulb class={props.class} size={props.size} color={props.color} />
    ),
    wifiHigh: (props: IconProps) => (
        <Icon {...props}>
            <g id="System / Wifi_High">
                <path
                    id="Vector"
                    d="M8.34277 14.5899C8.80861 14.0903 9.37187 13.6915 9.9978 13.418C10.6237 13.1446 11.2995 13.0025 11.9826 13.0001C12.6656 12.9977 13.3419 13.1353 13.9697 13.4044C14.5975 13.6735 15.1637 14.0683 15.633 14.5646M6.14941 11.5439C6.89476 10.7446 7.79597 10.1066 8.79745 9.66902C9.79893 9.23148 10.8793 9.00389 11.9721 9.00007C13.065 8.99626 14.1466 9.21651 15.1511 9.64704C16.1556 10.0776 17.0617 10.7094 17.8127 11.5035M3.22363 8.81635C4.34165 7.61742 5.69347 6.66028 7.19569 6.00398C8.69791 5.34768 10.3179 5.0058 11.9572 5.00007C13.5966 4.99435 15.2208 5.32472 16.7276 5.97052C18.2344 6.61632 19.5931 7.56458 20.7195 8.75568M12 19.0001C11.4477 19.0001 11 18.5524 11 18.0001C11 17.4478 11.4477 17.0001 12 17.0001C12.5523 17.0001 13 17.4478 13 18.0001C13 18.5524 12.5523 19.0001 12 19.0001Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>
        </Icon>
    ),
    wifiLow: (props: IconProps) => (
        <Icon {...props}>
            <g id="System / Wifi_Low">
                <path
                    id="Vector"
                    d="M8.34277 14.5898C8.80861 14.0903 9.37187 13.6915 9.9978 13.418C10.6237 13.1445 11.2995 13.0024 11.9826 13C12.6656 12.9976 13.3418 13.1353 13.9697 13.4044C14.5975 13.6735 15.1637 14.0683 15.633 14.5645M12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>
        </Icon>
    ),
    wifiMedium: (props: IconProps) => (
        <Icon {...props}>
            <g id="System / Wifi_Medium">
                <path
                    id="Vector"
                    d="M8.34375 14.5898C8.80959 14.0903 9.37285 13.6915 9.99877 13.418C10.6247 13.1446 11.2995 13.0024 11.9826 13C12.6656 12.9977 13.3418 13.1353 13.9697 13.4044C14.5975 13.6735 15.1637 14.0683 15.633 14.5646M6.14941 11.5439C6.89476 10.7446 7.79597 10.1065 8.79745 9.66899C9.79893 9.23146 10.8802 9.00386 11.9731 9.00005C13.066 8.99623 14.1475 9.21648 15.1521 9.64701C16.1566 10.0775 17.0617 10.7084 17.8127 11.5025M12 19C11.4477 19 11 18.5523 11 18C11 17.4478 11.4477 17 12 17C12.5523 17 13 17.4478 13 18C13 18.5523 12.5523 19 12 19Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>
        </Icon>
    ),
    wifiNone: (props: IconProps) => (
        <Icon {...props}>
            <g id="System / Wifi_None">
                <path
                    id="Vector"
                    d="M11 18C11 18.5523 11.4477 19 12 19C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>
        </Icon>
    ),
    wifiProblem: (props: IconProps) => (
        <Icon {...props}>
            <g id="System / Wifi_Problem">
                <path
                    id="Vector"
                    d="M8.34277 14.5898C8.80861 14.0902 9.37187 13.6914 9.9978 13.418C10.6237 13.1445 11.2995 13.0024 11.9826 13C12.6656 12.9976 13.3419 13.1353 13.9697 13.4044C14.5975 13.6734 15.1637 14.0682 15.633 14.5645M6.14941 11.5439C6.89312 10.7464 7.79203 10.1093 8.79091 9.67188C9.7898 9.23441 10.8678 9.00575 11.9583 9M3.22363 8.81649C4.34177 7.61743 5.69376 6.66021 7.19618 6.00391C8.69859 5.3476 10.3198 5.00558 11.9593 5M16 8.99997L18 6.99998M18 6.99998L20 5M18 6.99998L16 5M18 6.99998L20 8.99997M12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17C12.5523 17 13 17.4477 13 18C13 18.5523 12.5523 19 12 19Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>
        </Icon>
    ),
}

export { Icons, Icon }
export type { IconType }
