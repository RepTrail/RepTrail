'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ErgogenicCardPremium } from '@/components/store/intermediary/ergogenic-card-premium'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { FlaskConical } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'

interface ErgogenicManagementSectionContentProps {
    items?: any[]
    mode?: 'auto' | 'personal' | 'trainer'
    isEmpty?: boolean
    onEdit?: (item: any) => void
    onDelete?: (item: any) => void
    onDuplicate?: (item: any) => void
    onSchedule?: (item: any) => void
}

/**
 * ErgogenicManagementSectionContent: Grid of premium ergogenic cards.
 */
export function ErgogenicManagementSectionContent({ 
    items = [],
    mode = 'auto',
    isEmpty = false,
    onEdit,
    onDelete,
    onDuplicate,
    onSchedule
}: ErgogenicManagementSectionContentProps) {
    if (isEmpty || !items || items.length === 0) {
        return (
            <EmptyState 
                icon={FlaskConical}
                title="SEM ERGOGÊNICOS"
                description={
                    mode === 'trainer'
                        ? 'Nenhuma substância no protocolo deste aluno. Use "Adicionar Substância" para começar.'
                        : mode === 'auto'
                          ? 'Você ainda não possui protocolos de ergogênicos cadastrados.'
                          : 'Seu treinador ainda não atribuiu ergogênicos para sua conta.'
                }
            />
        )
    }

    const dayNamesShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

    return (
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {items.map((item, idx) => {
                const assignedDays = (item.application_days || []).map((d: any) => dayNamesShort[Number(d) % 7])
                const weeklyDosage = item.weekly_dosage || 0
                const frequency = (item.application_days?.length || 1)
                const unit = item.unit || 'MG'

                return (
                    <ErgogenicCardPremium 
                        key={item.id || idx}
                        id={item.id}
                        title={item.name.toUpperCase()}
                        days={assignedDays}
                        dosage={`${(weeklyDosage / frequency).toFixed(1)} ${unit.toUpperCase()}`}
                        frequency={`${frequency}X NA SEMANA`}
                        mode={mode}
                        color={STORE_TOKENS.COLORS.BRAND as any}
                        onEdit={() => onEdit?.(item)}
                        onDelete={() => onDelete?.(item)}
                        onDuplicate={() => onDuplicate?.(item)}
                        onSchedule={() => onSchedule?.(item)}
                        notes={item.notes}
                    />
                )
            })}
        </Grid>
    )
}
