import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { GlassPanel, Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function TypographyContent({ id }: { id?: string }) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} id={id}>
                {/* Main Typographic Scale */}
                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>H1 - System Hero</Font>
                            <Font variant="h1">REPTRAIL PERFORMANCE</Font>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>H2 - Section Header</Font>
                            <Font variant="h2">TRANSFORM YOUR TRAINING WITH AI</Font>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Heading - Component Title</Font>
                            <Font variant="heading">DASHBOARD OVERVIEW</Font>
                        </Stack>
                    </Stack>
                </GlassPanel>

                {/* Content & Descriptions */}
                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Description - Subtitles & Context</Font>
                            <Font variant="description">A plataforma mais completa para personal trainers e consultorias de alta performance que buscam escala.</Font>
                        </Stack>

                        <Grid cols={1} mdCols={2} gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Font
                                    variant="sub-tiny"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>Body - Standard Reading</Font>
                                <Font variant="body">
                                    Nossa plataforma foi construída para treinadores que buscam excelência técnica e agilidade no acompanhamento de seus alunos. Unimos inteligência artificial com uma interface premium e intuitiva.
                                </Font>
                            </Stack>

                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Font
                                    variant="sub-tiny"
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>Body SM - Dense UI Content</Font>
                                <Font variant="body-sm">
                                    Utilize nossas ferramentas de análise biomecânica e prescrição automatizada para reduzir em até 70% o tempo gasto com burocracia técnica semanal.
                                </Font>
                            </Stack>
                        </Grid>
                    </Stack>
                </GlassPanel>

                {/* Utility & Micro Typography */}
                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                    <Grid cols={2} mdCols={4} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Label Caps</Font>
                            <Surface variant="showcase" padding={STORE_TOKENS.PADDING.ELEMENT} minHeight="sm" align="center" justify="center">
                               <Font variant="label-caps">ESTATÍSTICAS</Font>
                            </Surface>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Auxiliary</Font>
                            <Surface variant="showcase" padding={STORE_TOKENS.PADDING.ELEMENT} minHeight="sm" align="center" justify="center">
                               <Font variant="auxiliary">CRIADO EM 2024</Font>
                            </Surface>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Sub Tiny</Font>
                            <Surface variant="showcase" padding={STORE_TOKENS.PADDING.ELEMENT} minHeight="sm" align="center" justify="center">
                               <Font variant="sub-tiny">VERSÃO 2.0.4 - STABLE</Font>
                            </Surface>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="sub-tiny"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>Mono Variation</Font>
                            <Surface variant="showcase" padding={STORE_TOKENS.PADDING.ELEMENT} minHeight="sm" align="center" justify="center">
                               <Font variant="body-sm" mono>0x7F2A91C4B</Font>
                            </Surface>
                        </Stack>
                    </Grid>
                </GlassPanel>
            </Stack>
    );
}
