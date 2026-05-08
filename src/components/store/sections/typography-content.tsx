import React from 'react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Font } from '../base/font'
import { Card, CardContent } from '../base/card'

export function TypographyContent() {
    return (
        <Card border="white/5">
            <Stack gap={12.5}>
                <Stack gap={5}>
                    <Font variant="sub-tiny" color="zinc-500">H1 - Extra Bold Italic</Font>
                    <Font variant="h1">RepTrail Performance</Font>
                </Stack>

                <Stack gap={5}>
                    <Font variant="sub-tiny" color="zinc-500">H2 - Bold</Font>
                    <Font variant="h2">Transform your training with AI</Font>
                </Stack>

                <Grid cols={2} gap={12.5}>
                    <Stack gap={5}>
                        <Font variant="sub-tiny" color="zinc-500">Body - Regular</Font>
                        <Font variant="body" color="zinc-400">
                            Nossa plataforma foi construída para treinadores que buscam excelência técnica e agilidade no acompanhamento de seus alunos. Unimos inteligência artificial com uma interface premium.
                        </Font>
                    </Stack>
                    <Stack gap={5}>
                        <Font variant="sub-tiny" color="zinc-500">Interface Label (Black Italic)</Font>
                        <Font variant="label-caps" color="orange" italic>
                            Acessar Dashboard
                        </Font>
                    </Stack>
                </Grid>
            </Stack>
        </Card>
    )
}
