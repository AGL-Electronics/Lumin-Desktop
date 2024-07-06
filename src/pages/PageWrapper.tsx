import type { ParentComponent } from 'solid-js'
import { Card } from '@components/ui/card'

const PageWrapper: ParentComponent = (props) => {
    return (
        <div class="mt-[112px] select-none overflow-y-scroll">
            <div class="p-4 mt-[30px]">
                <Card class="overflow-auto w-auto bg-primary-300 h-full pb-8">
                    {props.children}
                </Card>
            </div>
        </div>
    )
}

export default PageWrapper
