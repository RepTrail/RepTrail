'use client'

import React from 'react'
import { Eye, FileUp, PencilLine } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { TrainerTeamCodeCard } from '@/components/store/advanced/trainer-team-code-card'
import { DashboardSidebarAction } from '@/components/store/intermediary/dashboard-sidebar-action'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TrainerDashboardSidebarPanelProps {
    trainerCode?: string | null
    editProfileHref?: string
    publicProfileHref?: string
    showImportTeaser?: boolean
    importHref?: string
}

export function TrainerDashboardSidebarPanel({
    trainerCode,
    editProfileHref,
    publicProfileHref,
    showImportTeaser = true,
    importHref,
}: TrainerDashboardSidebarPanelProps) {
    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            <TrainerTeamCodeCard trainerCode={trainerCode} />
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                <DashboardSidebarAction
                    href={editProfileHref}
                    label="Editar Perfil Público"
                    icon={PencilLine}
                    variant="primary"
                />

                <DashboardSidebarAction
                    href={publicProfileHref}
                    label="Ver Meu Perfil Público"
                    icon={Eye}
                    variant="outline-zinc"
                    disabled={!publicProfileHref}
                />
            </Stack>
            {showImportTeaser && (
                <Surface variant="tonal-primary" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={FileUp} color={STORE_TOKENS.COLORS.BRAND} size="sm" />
                            <Font
                                {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                {...{
                                    color: "primary",
                                }}>
                                Importação Inteligente
                            </Font>
                        </Box>

                        <Font
                            {...STORE_TOKENS.TYPOGRAPHY.DESCRIPTION}
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            Tem uma planilha ou PDF? Nossa IA pode ler o arquivo e criar o treino ou dieta em segundos.
                        </Font>

                        {importHref && (
                            <DashboardSidebarAction
                                href={importHref}
                                label="Importar PDF"
                                icon={FileUp}
                                variant="emerald"
                            />
                        )}
                    </Stack>
                </Surface>
            )}
        </Stack>
    );
}