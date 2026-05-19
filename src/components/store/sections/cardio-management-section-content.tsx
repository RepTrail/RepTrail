'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Activity } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { useRouter } from 'next/navigation'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

interface CardioManagementSectionContentProps {
    userId?: string
    cardios?: any[]
    mode?: 'auto' | 'personal'
    isEmpty?: boolean
}

/**
 * CardioManagementSectionContent: Grid of premium cardio cards.
 */
export function CardioManagementSectionContent({ 
    userId = 'mock-id',
    cardios,
    mode = 'auto',
    isEmpty = false
}: CardioManagementSectionContentProps) {
    const [actionModal, setActionModal] = React.useState<{ isOpen: boolean, type: RegistryActionType, data?: any }>({
        isOpen: false,
        type: 'assign_cardio'
    })

    const router = useRouter()

    const { mutate: deleteMutation } = useOptimisticMutation({
        queryKey: mode === 'auto' ? QUERY_KEYS.cardio.library(userId) : QUERY_KEYS.cardio.all(userId),
        entity: ENTITIES.CARDIO,
        actionName: 'delete-cardio'
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: mode === 'auto' ? QUERY_KEYS.cardio.library(userId) : QUERY_KEYS.cardio.all(userId),
        entity: ENTITIES.CARDIO,
        actionName: 'duplicate-cardio'
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.cardio.all(userId),
        entity: ENTITIES.CARDIO,
        actionName: 'assign-cardio'
    })

    const { mutate: updateMutation } = useOptimisticMutation({
        queryKey: mode === 'auto' ? QUERY_KEYS.cardio.library(userId) : QUERY_KEYS.cardio.all(userId),
        entity: ENTITIES.CARDIO,
        actionName: 'update-cardio'
    })

    const { mutate: createMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.cardio.library(userId),
        entity: ENTITIES.CARDIO,
        actionName: 'create-cardio'
    })

    const handleConfirm = (data?: any) => {
        if (!actionModal.data) return

        switch (actionModal.type) {
            case 'confirm_delete':
                deleteMutation({ id: actionModal.data.id })
                break
            case 'confirm_duplicate':
                duplicateMutation({ id: actionModal.data.id })
                break
            case 'assign_cardio':
                if (data?.selectedDays && Array.isArray(data.selectedDays)) {
                    assignMutation({ 
                        cardioId: actionModal.data.id, 
                        studentId: userId, 
                        daysOfWeek: data.selectedDays 
                    })
                }
                break
            case 'edit_cardio':
                updateMutation({ 
                    id: actionModal.data.id, 
                    name: data?.name || actionModal.data.name,
                    description: data?.description || actionModal.data.description,
                    duration: data?.duration || actionModal.data.duration_minutes,
                    intensity: data?.intensity || actionModal.data.suggested_intensity
                })
                if (data?.selectedDays) {
                    assignMutation({ 
                        cardioId: actionModal.data.id, 
                        studentId: userId, 
                        daysOfWeek: data.selectedDays 
                    })
                }
                break
            case 'create_cardio':
                if (data?.name) {
                    createMutation({
                        name: data.name,
                        description: data.description,
                        duration: data.duration,
                        intensity: data.intensity,
                        daysOfWeek: data.selectedDays
                    })
                }
                break
        }
        closeAction()
    }

    React.useEffect(() => {
        const handler = (e: any) => {
            if (e.detail?.type === 'create_cardio') {
                openAction('create_cardio', {})
            }
        }
        window.addEventListener('open-cardio-action', handler)
        return () => window.removeEventListener('open-cardio-action', handler)
    }, [])

    const openAction = (type: RegistryActionType, data?: any) => {
        const selectedDays = (data.assigned_cardios || []).map((a: any) => a.day_of_week)
        setActionModal({ 
            isOpen: true, 
            type, 
            data: { ...data, selectedDays } 
        })
    }

    const closeAction = () => setActionModal(prev => ({ ...prev, isOpen: false }))

    if (isEmpty || !cardios || cardios.length === 0) {
        return (
            <EmptyState 
                icon={Activity}
                title="SEM CARDIOS"
                description={mode === 'auto' ? "Você ainda não possui protocolos de cardio cadastrados." : "Seu treinador ainda não atribuiu cardios para sua conta."}
            />
        )
    }

    const dayNamesShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

    return (
        <>
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                {cardios.map((cardio, idx) => {
                    const assignedDays = (cardio.assigned_cardios || [])
                        .filter((a: any) => a.day_of_week !== null && a.day_of_week !== undefined)
                        .map((a: any) => dayNamesShort[a.day_of_week % 7])
                    
                    return (
                        <ManagementCardPremium 
                            key={cardio.id || idx}
                            title={cardio.name.toUpperCase()}
                            description={cardio.description || 'Protocolo oficial de cardio.'}
                            days={assignedDays}
                            mainStat={{ label: 'MINUTOS', value: cardio.duration_minutes || 0 }}
                            date={new Date(cardio.created_at).toLocaleDateString('pt-BR')}
                            icon={Activity}
                            mode={mode}
                            color="orange"
                            registryType="training"
                            onSchedule={() => openAction('assign_cardio', cardio)}
                            onEdit={() => openAction('edit_cardio', cardio)}
                            onDelete={() => openAction('confirm_delete', cardio)}
                            onDuplicate={() => openAction('confirm_duplicate', cardio)}
                        />
                    )
                })}
            </Grid>

            <RegistryActionModal 
                isOpen={actionModal.isOpen}
                onClose={closeAction}
                type={actionModal.type}
                onConfirm={handleConfirm}
                initialData={actionModal.data}
            />
        </>
    )
}
