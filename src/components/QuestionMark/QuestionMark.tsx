import { Component } from 'solid-js'
import { QuestionMarkModal } from './QuestionMarkModal'
import { Titlebar } from '@components/Titlebar'
import { questionModalId } from '@src/static'
import { TITLEBAR_ACTION } from '@static/enums'

export interface IProps {
    onPointerDownHeader: (action: TITLEBAR_ACTION) => void
    onClickOpenModal: (id: string) => void
}

export const QuestionMark: Component<IProps> = (props) => {
    return (
        <div>
            <button
                class="ml-auto flex items-center justify-center leadu w-[35px] h-[35px] rounded-full border border-solid border-[#192736] bg-[#0D1B26] cursor-pointer focus-visible:border-[#9793FD]"
                onClick={(e) => {
                    e.preventDefault()
                    props.onClickOpenModal(questionModalId)
                }}>
                <p class="text-white leading-[12px]">?</p>
            </button>
            <dialog id={questionModalId} class="modal">
                <Titlebar onPointerDownHeader={props.onPointerDownHeader} />
                <div class="modal-box w-auto h-auto p-[10px] bg-transparent ">
                    <QuestionMarkModal />
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button class="cursor-default">close</button>
                </form>
            </dialog>
        </div>
    )
}

export default QuestionMark
