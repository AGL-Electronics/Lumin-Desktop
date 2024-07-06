import { FaSolidDownload, FaSolidGraduationCap, FaSolidPlug, FaSolidTrashCan } from 'solid-icons/fa'
import { Component } from 'solid-js'
import PageWrapper from './PageWrapper'
import { EspWebButton } from '@components/Buttons/EspWebButton'
import { FlashButton } from '@components/Buttons/FlashButton'
import FormActions from '@components/Modal/FormActions'
import { CardContent } from '@components/ui/card'
import { Label } from '@components/ui/label'
import { APMode } from '@pages/APMode'
import { TITLEBAR_ACTION } from '@static/enums'

export interface IProps {
    onClickBack: () => void
    onClickDownloadFirmware: () => void
    onClickOpenDocs: () => void
    onClickEraseSoft: () => void
    onClickConfigureAPMode: () => void
    manifest: string
    checkSameFirmware: (manifest: { name: string }, improvInfo: { firmware: string }) => void
    onClickOpenModal: (id: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickEnableAPMode: () => void
    onClickESPButton: () => void
    onClickUpdateNetworkSettings: () => void
    isUSBBoard: boolean
    isAPModeActive: boolean
}

const AppSettingsPage: Component<IProps> = (props) => {
    return (
        <PageWrapper>
            <CardContent class="flex flex-1">
                <div class="flex flex-col justify-between h-full mr-[24px] ml-[24px]">
                    <div class="flex flex-col h-full justify-center items-center">
                        <div class="flex flex-col gap-[10px]">
                            <div class="flex flex-row">
                                <APMode
                                    isAPModeActive={props.isAPModeActive}
                                    onClickOpenModal={props.onClickOpenModal}
                                    onPointerDownHeader={props.onClickHeader}
                                    onClickEnableAPMode={props.onClickEnableAPMode}
                                    onClickConfigureAPMode={props.onClickConfigureAPMode}
                                />
                            </div>
                            <div class="bg-[#0D1B26] w-auto p-[24px] flex flex-col gap-[22px] rounded-[24px] border-solid border-1 border-[#192736]">
                                <Label
                                    weight="semiBold"
                                    class="text-white leading-[20px] text-[20px] not-italic text-left">
                                    Flash settings
                                </Label>
                                <div class="grid grid-cols-2 grid-rows-2 min-[800px]:grid-rows-1 min-[800px]:grid-cols-4 grid-flow-col gap-[16px]">
                                    <FlashButton
                                        step="1/2"
                                        label="Download firmware assets"
                                        onClick={props.onClickDownloadFirmware}
                                        img={<FaSolidDownload size={48} fill="#FFFFFFe3" />}
                                    />
                                    <EspWebButton
                                        label="Flash mode"
                                        img={<FaSolidPlug size={48} fill="#FFFFFFe3" />}
                                        manifest={props.manifest}
                                        onClickESPButton={props.onClickESPButton}
                                        checkSameFirmware={props.checkSameFirmware}
                                    />
                                    <FlashButton
                                        label="Open Lumin Docs"
                                        onClick={props.onClickOpenDocs}
                                        img={<FaSolidGraduationCap size={48} fill="#FFFFFFe3" />}
                                    />
                                    <FlashButton
                                        label="Erase Firmware Assets"
                                        onClick={props.onClickEraseSoft}
                                        img={<FaSolidTrashCan size={48} fill="#FFFFFFe3" />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <FormActions
                        submitLabel="Next"
                        cancelLabel="Cancel"
                        onSubmit={() => {}}
                        onCancel={props.onClickBack}
                    />
                </div>
            </CardContent>
        </PageWrapper>
    )
}

export default AppSettingsPage
