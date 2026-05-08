import React from 'react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Font } from '../base/font'
import { Card, CardHeader, CardContent } from '../base/card'
import { Logo } from '../base/logo'

export function BrandingSectionContent() {
    return (
        <Grid cols={1} gap="section">
            <Card border="white/5" variant="surface">
                <CardContent>
                    <Stack direction="row" gap={12.5} justify="around" wrap padding={4}>
                        <Stack align="center" gap={5}>
                            <Logo color="orange" size="md" />
                            <Font variant="sub-tiny" color="orange" weight="bold">ALUNO (STUDENT)</Font>
                        </Stack>
                        <Stack align="center" gap={5}>
                            <Logo color="emerald" size="md" />
                            <Font variant="sub-tiny" color="emerald" weight="bold">PERSONAL (TRAINER)</Font>
                        </Stack>
                        <Stack align="center" gap={5}>
                            <Logo color="amber" size="md" />
                            <Font variant="sub-tiny" color="amber" weight="bold">AFILIADO (DASHBOARD)</Font>
                        </Stack>
                        <Stack align="center" gap={5}>
                            <Logo color="red" size="md" />
                            <Font variant="sub-tiny" color="red" weight="bold">ADMIN (PLATFORM)</Font>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
    )
}
