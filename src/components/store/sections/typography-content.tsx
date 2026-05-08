import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { GlassPanel } from '@/components/store/base/surface'

export function TypographyContent() {
    return (
        <Stack gap={5}>
            {/* Main Typographic Scale */}
            <GlassPanel padding={5}>
                <Stack gap="title-content">
                    <Stack gap={5}>
                        <Font variant="sub-tiny" color="zinc-500">H1 - System Hero</Font>
                        <Font variant="h1">REPTRAIL PERFORMANCE</Font>
                    </Stack>

                    <Stack gap={5}>
                        <Font variant="sub-tiny" color="zinc-500">H2 - Section Header</Font>
                        <Font variant="h2">TRANSFORM YOUR TRAINING WITH AI</Font>
                    </Stack>

                    <Stack gap={5}>
                        <Font variant="sub-tiny" color="zinc-500">Heading - Component Title</Font>
                        <Font variant="heading">DASHBOARD OVERVIEW</Font>
                    </Stack>
                </Stack>
            </GlassPanel>

            {/* Content & Descriptions */}
            <GlassPanel padding={5}>
                <Stack gap="title-content">
                    <Stack gap={5}>
                        <Font variant="sub-tiny" color="zinc-500">Description - Subtitles & Context</Font>
                        <Font variant="description">A plataforma mais completa para personal trainers e consultorias de alta performance que buscam escala.</Font>
                    </Stack>

                    <Grid cols={1} mdCols={2} gap={8}>
                        <Stack gap={5}>
                            <Font variant="sub-tiny" color="zinc-500">Body - Standard Reading</Font>
                            <Font variant="body">
                                Nossa plataforma foi construída para treinadores que buscam excelência técnica e agilidade no acompanhamento de seus alunos. Unimos inteligência artificial com uma interface premium e intuitiva.
                            </Font>
                        </Stack>

                        <Stack gap={5}>
                            <Font variant="sub-tiny" color="zinc-500">Body SM - Dense UI Content</Font>
                            <Font variant="body-sm">
                                Utilize nossas ferramentas de análise biomecânica e prescrição automatizada para reduzir em até 70% o tempo gasto com burocracia técnica semanal.
                            </Font>
                        </Stack>
                    </Grid>
                </Stack>
            </GlassPanel>

            {/* Utility & Micro Typography */}
            <GlassPanel padding={5}>
                <Grid cols={2} mdCols={4} gap={5}>
                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" color="zinc-500">Label Caps</Font>
                        <div className="bg-white/5 p-2.5 rounded-[5px] border border-white/10 flex items-center h-full min-h-[48px]">
                           <Font variant="label-caps">ESTATÍSTICAS</Font>
                        </div>
                    </Stack>

                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" color="zinc-500">Auxiliary</Font>
                        <div className="bg-white/5 p-2.5 rounded-[5px] border border-white/10 flex items-center h-full min-h-[48px]">
                           <Font variant="auxiliary">CRIADO EM 2024</Font>
                        </div>
                    </Stack>

                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" color="zinc-500">Sub Tiny</Font>
                        <div className="bg-white/5 p-2.5 rounded-[5px] border border-white/10 flex items-center h-full min-h-[48px]">
                           <Font variant="sub-tiny">VERSÃO 2.0.4 - STABLE</Font>
                        </div>
                    </Stack>

                    <Stack gap={2.5}>
                        <Font variant="sub-tiny" color="zinc-500">Mono Variation</Font>
                        <div className="bg-white/5 p-2.5 rounded-[5px] border border-white/10 flex items-center h-full min-h-[48px]">
                           <Font variant="body-sm" mono>0x7F2A91C4B</Font>
                        </div>
                    </Stack>
                </Grid>
            </GlassPanel>
        </Stack>
    )
}
