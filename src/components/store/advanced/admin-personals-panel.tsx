'use client'

import React, { useState } from 'react'
import { useQuery, actions } from '@/lib/dal'
import { Stack } from '@/components/store/base/stack'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Search, UserCheck } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AdminPersonalsPanelProps {
    onDelete: (name: string) => void
    onInspect: (name: string) => void
}

/**
 * AdminPersonalsPanel: Organism for managing personal trainers.
 * - Encapsulates the specific list and activation logic for personals.
 * - Responsibility: Personal trainers domain management.
 */
export function AdminPersonalsPanel({ onDelete, onInspect }: AdminPersonalsPanelProps) {
    const [userServices, setUserServices] = useState<Record<string, boolean>>({
        'Marcos Vinicius': true,
        'Juliana Silva': false,
    })

    const { data: pricingData } = useQuery({
        queryKey: ['publicPricing'],
        queryFn: () => actions.getPublicPlanPricing()
    })
    const limit = (pricingData as any)?.on_demand?.free_students_limit ?? 5

    const toggleService = (name: string) => {
        setUserServices(prev => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <RegistrySection
            title="Gestão de Personals"
            icon={UserCheck}
            subtitle="Administração de profissionais parceiros e status de serviço On-Demand."
        >
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <UserListItem 
                    name="Marcos Vinicius"
                    email="marcos@reptrail.com.br"
                    registrationDate="08/05/2024"
                    role="personal"
                    roleLabel="12 ALUNOS"
                    initials="MV"
                    avatarVariant="orange"
                    onDelete={() => onDelete('Marcos Vinicius')}
                    onInspect={() => onInspect('Marcos Vinicius')}
                    onAction={() => toggleService('Marcos Vinicius')}
                    isActionActive={userServices['Marcos Vinicius']}
                />
                <UserListItem 
                    name="Juliana Silva"
                    email="juliana.silva@gmail.com"
                    registrationDate="12/11/2023"
                    role="personal"
                    roleLabel={`${limit} ALUNOS`}
                    initials="JS"
                    avatarVariant="amber"
                    onDelete={() => onDelete('Juliana Silva')}
                    onInspect={() => onInspect('Juliana Silva')}
                    onAction={() => toggleService('Juliana Silva')}
                    isActionActive={userServices['Juliana Silva']}
                />
                
                <EmptyState 
                    icon={Search}
                    title="Nenhum personal encontrado"
                    description="Tente ajustar os filtros de busca para encontrar o profissional desejado."
                />
            </Stack>
        </RegistrySection>
    )
}
