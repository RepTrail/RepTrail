'use client'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    getStudentErgogenics,
    deleteErgogenic,
    addErgogenic,
    updateErgogenic,
} from '@/lib/dal/remote'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { ErgogenicManagementSectionContent } from '@/components/store/sections/ergogenic-management-section-content'
import { RegistryActionModal, RegistryActionType } from '@/components/store/advanced/registry-action-modal'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { Syringe, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Grid } from '../base/grid'
import { Box } from '../base/box'

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

    const { mutate: createMutation } = useOptimisticMutation({
        queryKey: QUERY_KEYS.ergogenics.all(effectiveStudentId),
        entity: ENTITIES.ERGOGENIC,
        actionName: 'add-ergogenic',
        mutationFn: async ({ data }: { data: any }) => {
            const res = await addErgogenic({
                ...data,
                student_id: effectiveStudentId,
            })
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
            case 'create_ergogenic':
                createMutation({ data })
                break
            case 'edit_ergogenic':
                updateMutation({ id: actionModal.data.id, data: { ...data, student_id: effectiveStudentId } })
                break
        }
        closeAction()
    }

    if (isLoading) {
        return (
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                <Box height={8} width={48} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    {[1, 2, 3].map((i) => (
                        <Box key={i} height={280} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth />
                    ))}
                </Grid>
            </Stack>
        );
    }

    return (
        <>
            <RegistrySection
                title="PROTOCOLO ATIVO"
                subtitle="Gerencie e acompanhe a dosagem e cronograma de ergogênicos e suplementação avançada."
                icon={Syringe}
                rightElement={
                    <Button
                        variant="outline-emerald"
                        shine
                        onClick={() => openAction('create_ergogenic')}
                        fullWidth={{ base: true, lg: false }}
                    >
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Plus} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                            Adicionar Substância
                        </Stack>
                    </Button>
                }
            >
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
    );
}
