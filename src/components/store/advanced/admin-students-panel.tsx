'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistrySection } from '@/components/store/advanced/registry-section'
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
        <RegistrySection
            title="Gestão de Alunos"
            icon={GraduationCap}
            subtitle="Monitoramento de base de alunos e ativação de planos automatizados."
        >
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
        </RegistrySection>
    )
}
