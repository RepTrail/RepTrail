'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { ManagementCardPremium } from '@/components/store/intermediary/management-card-premium'
import { Utensils } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { DietPreviewDialog } from '@/components/store/advanced/diet-preview-dialog'
import { useRouter } from 'next/navigation'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

interface DietManagementSectionContentProps {
    userId?: string
    diets?: any[]
    mode?: 'auto' | 'personal'
    isEmpty?: boolean
}

/**
 * DietManagementSectionContent: Grid of premium diet cards.
 */
export function DietManagementSectionContent({ 
    userId = 'mock-id',
    diets,
    mode = 'auto',
    isEmpty = false
}: DietManagementSectionContentProps) {
    const [actionModal, setActionModal] = React.useState<{ isOpen: boolean, type: RegistryActionType, data?: any }>({
        isOpen: false,
        type: 'assign_diet'
    })
    const [previewDiet, setPreviewDiet] = React.useState<{ isOpen: boolean, dietId: string, dietName: string }>({
        isOpen: false,
        dietId: '',
        dietName: ''
    })

    const router = useRouter()

    const { mutate: deleteMutation } = useOptimisticMutation({
        queryKey: mode === 'auto' ? QUERY_KEYS.diets.library(userId) : QUERY_KEYS.diets.all(userId),
        entity: ENTITIES.DIET,
        actionName: 'delete-diet'
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: mode === 'auto' ? QUERY_KEYS.diets.library(userId) : QUERY_KEYS.diets.all(userId),
        entity: ENTITIES.DIET,
        actionName: 'duplicate-diet'
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.diets.all(userId),
        entity: ENTITIES.DIET,
        actionName: 'assign-diet'
    })

    const { mutate: updateMutation } = useOptimisticMutation({
        queryKey: mode === 'auto' ? QUERY_KEYS.diets.library(userId) : QUERY_KEYS.diets.all(userId),
        entity: ENTITIES.DIET,
        actionName: 'update-diet'
    })

    const { mutate: createMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.diets.library(userId),
        entity: ENTITIES.DIET,
        actionName: 'create-manual-diet'
    })

    const handleConfirm = (data?: any) => {
        if (!actionModal.data && actionModal.type !== 'create_diet') return

        switch (actionModal.type) {
            case 'confirm_delete':
                deleteMutation({ id: actionModal.data.id })
                break
            case 'confirm_duplicate':
                duplicateMutation({ id: actionModal.data.id })
                break
            case 'assign_diet':
                if (data?.selectedDays && Array.isArray(data.selectedDays)) {
                    assignMutation({ 
                        dietId: actionModal.data.id, 
                        studentId: userId, 
                        daysOfWeek: data.selectedDays 
                    })
                }
                break
            case 'create_diet':
                if (data?.name) {
                    createMutation({
                        name: data.name,
                        description: data.description,
                        daysOfWeek: data.selectedDays
                    })
                }
                break
        }
        closeAction()
    }

    React.useEffect(() => {
        const handler = (e: any) => {
            if (e.detail?.type === 'create_diet') {
                openAction('create_diet', {})
            }
        }
        window.addEventListener('open-diet-action', handler)
        return () => window.removeEventListener('open-diet-action', handler)
    }, [])

    const openAction = (type: RegistryActionType, data?: any) => {
        const selectedDays = (data.assigned_diets || []).map((a: any) => a.day_of_week)
        setActionModal({ 
            isOpen: true, 
            type, 
            data: { ...data, selectedDays } 
        })
    }

    const closeAction = () => setActionModal(prev => ({ ...prev, isOpen: false }))

    if (isEmpty || !diets || diets.length === 0) {
        return (
            <EmptyState 
                icon={Utensils}
                title="SEM DIETAS"
                description={mode === 'auto' ? "Você ainda não possui protocolos alimentares cadastrados." : "Seu treinador ainda não atribuiu dietas para sua conta."}
            />
        )
    }

    const dayNamesShort = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]

    return (
        <>
            <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                {diets.map((diet, idx) => {
                    const assignedDays = (diet.assigned_diets || [])
                        .filter((a: any) => a.day_of_week !== null && a.day_of_week !== undefined)
                        .map((a: any) => dayNamesShort[a.day_of_week % 7])
                    
                    return (
                        <ManagementCardPremium 
                            key={diet.id || idx}
                            title={diet.name.toUpperCase()}
                            description={diet.description || 'Plano alimentar oficial.'}
                            days={assignedDays}
                            mainStat={{ label: 'REFEIÇÕES', value: diet.meals_count || diet.meals?.length || 0 }}
                            date={new Date(diet.created_at).toLocaleDateString('pt-BR')}
                            icon={Utensils}
                            mode={mode}
                            color="primary"
                            registryType="diet"
                            onView={() => {
                                if (mode === 'personal') {
                                    setPreviewDiet({ isOpen: true, dietId: diet.id, dietName: diet.name })
                                } else {
                                    router.push(`/dashboard/student/diet/${diet.id}`)
                                }
                            }}
                            onSchedule={() => openAction('assign_diet', diet)}
                            onEdit={() => router.push(`/dashboard/student/diet/${diet.id}`)}
                            onDelete={() => openAction('confirm_delete', diet)}
                            onDuplicate={() => openAction('confirm_duplicate', diet)}
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

            <DietPreviewDialog
                dietId={previewDiet.dietId}
                dietName={previewDiet.dietName}
                isOpen={previewDiet.isOpen}
                onClose={() => setPreviewDiet(prev => ({ ...prev, isOpen: false }))}
            />
        </>
    )
}
