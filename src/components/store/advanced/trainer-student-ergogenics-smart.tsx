'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    getStudentErgogenics,
    deleteErgogenic,
    addErgogenic,
    updateErgogenic,
} from '@/actions/ergogenics-actions'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { ErgogenicManagementSectionContent } from '@/components/store/sections/ergogenic-management-section-content'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { Syringe } from 'lucide-react'

interface TrainerStudentErgogenicsSmartProps {
    effectiveStudentId: string
}

export function TrainerStudentErgogenicsSmart({ effectiveStudentId }: TrainerStudentErgogenicsSmartProps) {
    const [actionModal, setActionModal] = React.useState<{
        isOpen: boolean
        type: RegistryActionType
        data?: any
    }>({
        isOpen: false,
        type: 'assign_ergogenic',
    })

    const { data: ergogenicsData = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        queryFn: async () => {
            const res = await getStudentErgogenics(effectiveStudentId)
            if (Array.isArray(res)) return res
            return []
        },
        staleTime: 1000 * 60 * 5,
    })

    const ergogenics = Array.isArray(ergogenicsData) ? ergogenicsData : []

    useRealtimeSync({
        table: 'ergogenics',
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        filter: `student_id=eq.${effectiveStudentId}`,
    })

    const { mutate: deleteMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'delete-ergogenic',
        mutationFn: async ({ id }: { id: string }) => {
            const res = await deleteErgogenic(id, effectiveStudentId)
            if (res.error) throw new Error(res.error)
            return res
        },
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'duplicate-ergogenic',
        mutationFn: async ({ item }: { item: any }) => {
            const { id, created_at, updated_at, ...data } = item
            const res = await addErgogenic({
                ...data,
                name: `${item.name} (Cópia)`,
                student_id: effectiveStudentId,
            })
            if (res.error) throw new Error(res.error)
            return res
        },
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'assign-ergogenic',
        mutationFn: async ({ ergogenicId, days }: { ergogenicId: string; days: number[] }) => {
            const res = await updateErgogenic(ergogenicId, effectiveStudentId, { application_days: days })
            if (res.error) throw new Error(res.error)
            return res
        },
    })

    const { mutate: updateMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'update-ergogenic',
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await updateErgogenic(id, effectiveStudentId, data)
            if (res.error) throw new Error(res.error)
            return res
        },
    })

    const openAction = (type: RegistryActionType, data?: any) => {
        setActionModal({
            isOpen: true,
            type,
            data: {
                ...data,
                item: data?.name,
                dosage: data?.weekly_dosage,
                notes: data?.notes,
                selectedDays: data?.application_days || [],
            },
        })
    }

    const closeAction = () => setActionModal((prev) => ({ ...prev, isOpen: false }))

    const handleConfirm = (data?: any) => {
        switch (actionModal.type) {
            case 'confirm_delete':
                deleteMutation({ id: actionModal.data.id })
                break
            case 'confirm_duplicate':
                duplicateMutation({ item: actionModal.data })
                break
            case 'assign_ergogenic':
                if (Array.isArray(data)) {
                    assignMutation({ ergogenicId: actionModal.data.id, days: data })
                }
                break
            case 'edit_ergogenic':
                updateMutation({ id: actionModal.data.id, data: { ...data, student_id: effectiveStudentId } })
                break
        }
        closeAction()
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 w-48 bg-zinc-900 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[280px] bg-zinc-900 rounded-[2rem]" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <RegistrySection title="PROTOCOLO ATIVO" icon={Syringe}>
                <ErgogenicManagementSectionContent
                    items={ergogenics}
                    mode="trainer"
                    isEmpty={ergogenics.length === 0}
                    onEdit={(item) => openAction('edit_ergogenic', item)}
                    onDelete={(item) => openAction('confirm_delete', item)}
                    onDuplicate={(item) => openAction('confirm_duplicate', item)}
                    onSchedule={(item) => openAction('assign_ergogenic', item)}
                />
            </RegistrySection>

            <RegistryActionModal
                isOpen={actionModal.isOpen}
                onClose={closeAction}
                type={actionModal.type}
                onConfirm={handleConfirm}
                initialData={actionModal.data}
                isLoading={false}
            />
        </>
    )
}
