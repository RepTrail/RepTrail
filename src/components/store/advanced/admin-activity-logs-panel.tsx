'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { LogItem } from '@/components/store/intermediary/log-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { History } from 'lucide-react'

export function AdminActivityLogsPanel() {
    return (
        <RegistrySection
            title="Logs de Atividade"
            icon={History}
            subtitle="Rastro de auditoria de todas as ações realizadas no painel administrativo."
        >
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                <LogItem 
                    action="UPDATE_USER_ROLE"
                    admin="Marcos Vinicius"
                    target="ALUNO_CARLOS"
                    details={{ from: 'FREE', to: 'PREMIUM', method: 'MANUAL_ADMIN' }}
                    date="há 5 minutos"
                    variant="blue"
                />
                <LogItem 
                    action="ACTIVATE_ONDEMAND"
                    admin="Juliana Silva"
                    target="PERSONAL_JULIANA"
                    details={{ service: 'ON_DEMAND_V2', status: 'ACTIVE' }}
                    date="há 12 minutos"
                    variant="orange"
                />
                <LogItem 
                    action="DELETE_PRODUCT"
                    admin="Sistema"
                    target="PROD_TEST_01"
                    details="Remoção automática de produto sem estoque há 30 dias."
                    date="há 1 hora"
                    variant="red"
                />

                <EmptyState 
                    icon={History}
                    title="Sem mais atividades"
                    description="Não há registros adicionais de auditoria para o período selecionado."
                />
            </Stack>
        </RegistrySection>
    )
}
