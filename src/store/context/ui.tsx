import {
    type Accessor,
    type ParentComponent,
    createContext,
    createMemo,
    useContext,
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { UIStore } from '@static/types'

interface AppUIContext {
    openModalStatus: Accessor<
        | {
              openModal: boolean
              editingMode: boolean
          }
        | undefined
    >

    showDeviceView: Accessor<boolean>
    showNotifications: Accessor<boolean | undefined>
    setOpenModal: (status: { openModal: boolean; editingMode: boolean }) => void
    setShowDeviceView: (showDeviceView: boolean) => void
}

const AppUIContext = createContext<AppUIContext>()
export const AppUIProvider: ParentComponent = (props) => {
    const defaultState: UIStore = {
        showDeviceView: false,
        modalStatus: {
            openModal: false,
            editingMode: false,
        },
        showNotifications: true,
    }

    const [state, setState] = createStore<UIStore>(defaultState)

    const setOpenModal = (status: { openModal: boolean; editingMode: boolean }) => {
        setState(
            produce((s) => {
                s.modalStatus = status
            }),
        )
    }

    const setShowDeviceView = (showDeviceView: boolean) => {
        setState(
            produce((s) => {
                s.showDeviceView = showDeviceView
            }),
        )
    }

    const uiState = createMemo(() => state)

    const openModalStatus = createMemo(() => uiState().modalStatus)
    const showNotifications = createMemo(() => uiState().showNotifications)
    const showDeviceView = createMemo(() => uiState().showDeviceView)

    return (
        <AppUIContext.Provider
            value={{
                openModalStatus,
                showDeviceView,
                showNotifications,
                setOpenModal,
                setShowDeviceView,
            }}>
            {props.children}
        </AppUIContext.Provider>
    )
}

export const useAppUIContext = () => {
    const context = useContext(AppUIContext)
    if (context === undefined) {
        throw new Error('useAppUIContext must be used within an AppUIProvider')
    }
    return context
}
