import type { ParentComponent } from 'solid-js'

const PageWrapper: ParentComponent = (props) => {
    return (
        <div class="mt-[112px] select-none">
            <div class="p-4 mt-[30px]">{props.children}</div>
        </div>
    )
}

export default PageWrapper
