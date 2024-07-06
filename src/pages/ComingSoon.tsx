import PageWrapper from './PageWrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Flex } from '@components/ui/flex'
import { Label } from '@components/ui/label'

const ComingSoon = () => {
    return (
        <PageWrapper>
            <Flex class="h-screen" flexDirection="col" justifyContent="center" alignItems="center">
                <Card class="card rounded-md bg-base-200">
                    <CardHeader>
                        <CardTitle>
                            <Label class="text-pretty text-primary" size="2xl" weight="bold">
                                Coming Soon
                            </Label>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label class="p-4 text-pretty text-secondary" size="lg" weight="bold">
                            This page is under construction 👷‍♂️
                        </Label>
                    </CardContent>
                </Card>
            </Flex>
        </PageWrapper>
    )
}

export default ComingSoon
