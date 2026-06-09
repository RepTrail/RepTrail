'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Search, GraduationCap } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AdminStudentsPanelProps {
    onDelete: (name: string) => void
    onInspect: (name: string) => void
}

/**
 * AdminStudentsPanel: Organism for managing student base.
 * - Encapsulates the specific list and subscription status for students.
 * - Responsibility: Students domain management.
 */
export function AdminStudentsPanel({ onDelete, onInspect }: AdminStudentsPanelProps) {
    const [userServices, setUserServices] = useState<Record<string, boolean>>({
        'Carlos Eduardo': true,
        'Beatriz Santos': false
    })

    const toggleService = (name: string) => {
        setUserServices(prev => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={GraduationCap} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Gestão de Alunos"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Monitoramento de base de alunos e ativação de planos automatizados."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <UserListItem 
                    name="Carlos Eduardo"
                    email="cadu.fit@outlook.com"
                    registrationDate="15/02/2024"
                    role="aluno"
                    roleLabel="ALUNO PREMIUM"
                    initials="CE"
                    avatarVariant="emerald"
                    onDelete={() => onDelete('Carlos Eduardo')}
                    onInspect={() => onInspect('Carlos Eduardo')}
                    onAction={() => toggleService('Carlos Eduardo')}
                    isActionActive={userServices['Carlos Eduardo']}
                />
                <UserListItem 
                    name="Beatriz Santos"
                    email="bia.santos22@uol.com.br"
                    registrationDate="02/05/2024"
                    role="aluno"
                    roleLabel="ALUNO FREE"
                    initials="BS"
                    avatarVariant="zinc"
                    onDelete={() => onDelete('Beatriz Santos')}
                    onInspect={() => onInspect('Beatriz Santos')}
                    onAction={() => toggleService('Beatriz Santos')}
                    isActionActive={userServices['Beatriz Santos']}
                />

                <EmptyState 
                    icon={Search}
                    title="Nenhum aluno encontrado"
                    description="Não localizamos registros com os critérios informados. Verifique a digitação ou remova os filtros."
                />
            </Stack>
          </Stack>
        </Stack>
    )
}
