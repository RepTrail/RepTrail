import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Grid } from '../base/grid'
import { RegistrySection } from '../advanced/registry-section'
import { Eye, Trash2, Check, X, Dumbbell } from 'lucide-react'

export function ComponentsRegistryContent() {
    return (
        <Stack gap="section">
            <RegistrySection
                title="Grid & Row Actions"
                icon={Dumbbell}
                subtitle="Ações de alta densidade para tabelas e listagens administrativas."
            >
                <Box bg="zinc-950/40" padding={5} border="white/5" rounded="system">
                    <Grid cols={1} gap={5} align="center">
                        <Stack align="center" gap={2.5}>
                            <Button variant="outline-blue" rounded="full" size="sm">
                                <Stack direction="row" align="center" gap={2.5}>
                                    <Icon icon={Eye} size="xs" color="blue" />
                                    <Font variant="auxiliary" weight="black" italic uppercase color="blue">Inspecionar</Font>
                                </Stack>
                            </Button>
                            <Font variant="sub-tiny" color="zinc-600">ROW ACTION (BLUE)</Font>
                        </Stack>

                        <Stack align="center" gap={2.5}>
                            <Button variant="outline-red" rounded="full" size="sm">
                                <Stack direction="row" align="center" gap={2.5}>
                                    <Icon icon={Trash2} size="xs" color="red" />
                                    <Font variant="auxiliary" weight="black" italic uppercase color="red">Deletar</Font>
                                </Stack>
                            </Button>
                            <Font variant="sub-tiny" color="zinc-600">ROW ACTION (RED)</Font>
                        </Stack>

                        <Stack align="center" gap={2.5}>
                            <Button variant="outline-emerald" rounded="full" size="sm">
                                <Stack direction="row" align="center" gap={2.5}>
                                    <Icon icon={Check} size="xs" color="emerald" />
                                    <Font variant="auxiliary" weight="black" italic uppercase color="emerald">Finalizar</Font>
                                </Stack>
                            </Button>
                            <Font variant="sub-tiny" color="zinc-600">ROW ACTION (EMERALD)</Font>
                        </Stack>

                        <Stack align="center" gap={2.5}>
                            <Button variant="close" rounded="full" isIconOnly size="sm">
                                <Icon icon={X} size="xs" />
                            </Button>
                            <Font variant="sub-tiny" color="zinc-600">CLOSE ACTION</Font>
                        </Stack>
                    </Grid>
                </Box>
            </RegistrySection>
        </Stack>
    )
}
