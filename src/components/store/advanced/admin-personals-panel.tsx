'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'

import React, { useState } from 'react'
import { useQuery, actions } from '@/lib/dal'
import { Stack } from '@/components/store/base/stack'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
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
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={UserCheck} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Gestão de Personals"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Administração de profissionais parceiros e status de serviço On-Demand."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
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
          </Stack>
        </Stack>
    )
}
