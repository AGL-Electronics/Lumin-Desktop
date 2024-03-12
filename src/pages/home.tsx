import { createEffect, createSignal } from 'solid-js'
import { Card, CardContent } from '@components/ui/card'
import PageWrapper from '@src/pages/PageWrapper'

// TODO: Add journal
// TODO: Add Tasks with Todo list

export default function Main() {
    return (
        <PageWrapper>
            <Card class="overflow-auto border-none w-auto rounded-none bg-primary-300 h-screen">
                <CardContent class="flex flex-1">
                    <div class="flex flex-col">
                        <h1 class="text-3xl font-bold">Welcome to the Dashboard</h1>
                        <p class="text-lg">This is the main page of the dashboard</p>
                    </div>
                </CardContent>
            </Card>
        </PageWrapper>
    )
}
