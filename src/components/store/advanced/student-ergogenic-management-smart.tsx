'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { LayoutDashboard } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentErgogenics, deleteErgogenic, addErgogenic, updateErgogenic } from '@/lib/dal/remote'
import { getStudentProfile, getStudentTrainer } from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'

import { ErgogenicManagementSectionContent } from '@/components/store/sections/ergogenic-management-section-content'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface StudentErgogenicManagementSmartProps {
    userId: string
}

export function StudentErgogenicManagementSmart({ userId }: StudentErgogenicManagementSmartProps) {
    const [actionModal, setActionModal] = React.useState<{ isOpen: boolean, type: RegistryActionType, data?: any }>({
        isOpen: false,
        type: 'assign_ergogenic'
    })

    // 1. Data Fetching
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: trainerLink } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: ergogenicsData = [], isLoading } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        queryFn: async () => {
            const res = await getStudentErgogenics(userId)
            if (Array.isArray(res)) return res
            return []
        },
        staleTime: 1000 * 60 * 5
    })

    const ergogenics = Array.isArray(ergogenicsData) ? ergogenicsData : []

    const isAutoMode = !trainerLink

    // 2. Realtime Sync
    useRealtimeSync({
        table: 'ergogenics',
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        filter: `student_id=eq.${userId}`
    })

    React.useEffect(() => {
        const handler = (e: any) => {
            if (e.detail?.type === 'create_ergogenic') {
                openAction('create_ergogenic', {})
            }
        }
        window.addEventListener('open-ergogenic-action', handler)
        return () => window.removeEventListener('open-ergogenic-action', handler)
    }, [])

    // 3. Mutations
    const { mutate: deleteMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'delete-ergogenic',
        updateFn: (oldData: any, variables: any) => {
            if (!Array.isArray(oldData)) return oldData
            return oldData.filter((item: any) => item.id !== variables.id)
        },
        mutationFn: async ({ id }: { id: string }) => {
            const res = await deleteErgogenic(id, userId)
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const { mutate: duplicateMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'duplicate-ergogenic',
        mutationFn: async ({ item }: { item: any }) => {
            const { id, created_at, updated_at, ...data } = item
            const res = await addErgogenic({ 
                ...data, 
                name: `${item.name} (Cópia)`,
                student_id: userId 
            })
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'assign-ergogenic',
        mutationFn: async ({ ergogenicId, days }: { ergogenicId: string, days: number[] }) => {
            const res = await updateErgogenic(ergogenicId, userId, { application_days: days })
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const { mutate: createMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'add-ergogenic',
        updateFn: (oldData: any, variables: any) => {
            const newItem = {
                id: variables.id || crypto.randomUUID(),
                ...variables,
                created_at: new Date().toISOString()
            };
            return Array.isArray(oldData) ? [...oldData, newItem] : [newItem];
        }
    })

    const handleConfirm = (data?: any) => {
        if (!actionModal.data && actionModal.type !== ('create_ergogenic' as any)) return

        switch (actionModal.type) {
            case 'confirm_delete':
                deleteMutation({ id: actionModal.data.id, userId })
                break
            case 'confirm_duplicate':
                duplicateMutation({ item: actionModal.data })
                break
            case 'assign_ergogenic':
                if (Array.isArray(data)) {
                    assignMutation({ ergogenicId: actionModal.data.id, days: data })
                }
                break
            case ('create_ergogenic' as any):
                createMutation({ ...data, student_id: userId })
                break
        }
        closeAction()
    }

    const openAction = (type: RegistryActionType, data?: any) => {
        setActionModal({ 
            isOpen: true, 
            type, 
            data: { 
                ...data, 
                item: data?.name, 
                dosage: data?.weekly_dosage,
                selectedDays: data?.application_days || [] 
            } 
        })
    }

    const closeAction = () => setActionModal(prev => ({ ...prev, isOpen: false }))

    return (
        <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={LayoutDashboard} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Section"}</Font>
                    </Inline>
                    
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
            <ErgogenicManagementSectionContent 
                items={ergogenics}
                mode={isAutoMode ? 'auto' : 'personal'}
                onEdit={(item) => openAction('edit_ergogenic', item)}
                onDelete={(item) => openAction('confirm_delete', item)}
                onDuplicate={(item) => openAction('confirm_duplicate', item)}
                onSchedule={(item) => openAction('assign_ergogenic', item)}
            />

            <RegistryActionModal 
                isOpen={actionModal.isOpen}
                onClose={closeAction}
                type={actionModal.type}
                onConfirm={handleConfirm}
                initialData={actionModal.data}
                isLoading={false}
            />
          </Stack>
        </Stack>
    )
}
