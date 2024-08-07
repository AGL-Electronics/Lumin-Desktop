import { lazy } from 'solid-js'
import type { RouteDefinition } from '@solidjs/router'
import { capitalizeFirstLetter } from '@src/lib/utils'

const Main = lazy(() => import('@pages/home'))
const AppSettings = lazy(() => import('@pages/settings'))
const DeviceSettings = lazy(() => import('@pages/DeviceSettings'))
//const FlashFirmware = lazy(() => import('@containers/FlashFirmware'))
const page404 = lazy(() => import('@pages/page404'))

export const routes: RouteDefinition[] = [
    { path: '/', component: Main },
    { path: '/settings', component: AppSettings },
    //{ path: '/network', component: NetworkConfigurator },
    { path: '/deviceSettings/:flag', component: DeviceSettings },
    //{ path: '/flashFirmware', component: FlashFirmware },
    { path: '*404', component: page404 },
]

const getRoutes = () => routes.filter((route) => route.path !== '*404')
export const createRoutes = () => {
    return getRoutes().map((route) => {
        const label = capitalizeFirstLetter(
            route.path.replace('/', route.path.length > 2 ? '' : 'dashboard'),
        )
        return {
            label: label,
            path: route.path,
        }
    })
}
