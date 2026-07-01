'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { GlassPanel } from '@/components/store/base/surface'
import { Inline } from '@/components/store/base/layout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RegistryActionModal } from '@/components/store/advanced/registry-action-modal'
import { useOptimisticMutation } from '@/lib/dal'
import { assignDiet } from '@/lib/dal/remote'
import { ENTITIES } from '@/lib/outbox-db'
import { Pencil, Check, X, Calendar, Sparkles, Loader2, Utensils } from 'lucide-react'
import { AssignmentBadge } from '@/components/store/intermediary/assignment-badge'

interface DietBuilderHeaderProps {
    dietId: string
    name: string
    description?: string
    isEditing: boolean
    setIsEditing: (val: boolean) => void
    editName: string
    setEditName: (val: string) => void
    onSave: () => void
    onCancel: () => void
    showAssignmentBadge?: boolean
    canAssign?: boolean
    assignments?: any[]
    students?: any[]
    isEstimatingAll: boolean
    onEstimateAll: () => void
    contextLabel?: string
    icon?: string
    contextColor?: string
}

export function DietBuilderHeader({
    dietId,
    name,
    description,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    onSave,
    onCancel,
    showAssignmentBadge = true,
    canAssign = true,
    assignments = [],
    students = [],
    isEstimatingAll,
    onEstimateAll,
    contextLabel,
    contextColor
}: DietBuilderHeaderProps) {
    const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: ['diet'],
        entity: ENTITIES.DIET,
        actionName: 'assign-diet',
        mutationFn: async ({ dietId, daysOfWeek, studentId }: { dietId: string; daysOfWeek: number[]; studentId: string }) => {
            const res = await assignDiet(dietId, studentId, daysOfWeek)
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const handleAssignConfirm = (data?: any) => {
        if (!data || !data.student_id) return
        const { selectedDays, student_id } = data
        assignMutation({ dietId, daysOfWeek: selectedDays || [0, 1, 2, 3, 4, 5, 6], studentId: student_id })
        setIsAssignModalOpen(false)
    }

    return (
        <Stack
            direction={{ base: 'col', md: 'row' }}
            align={{ base: 'stretch', md: 'start' }}
            justify="between"
            gap={STORE_TOKENS.SPACING.SECTION}
            fullWidth
        >
            {/* Diet name â€” display or edit mode */}
            <Box flex1>
                {isEditing ? (
                    <GlassPanel padding={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>
                                    Nome da Dieta
                                </Font>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') onSave()
                                        if (e.key === 'Escape') onCancel()
                                    }}
                                    placeholder="Nome da dieta..."
                                    size="lg"
                                    autoFocus
                                />
                            </Stack>
                            <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button
                                    variant="outline-emerald"
                                    onClick={onSave}
                                    fullWidth={{ base: true, md: false }}
                                    text="Salvar"
                                    iconLeft={Check} />
                                <Button
                                    variant="outline-red"
                                    onClick={onCancel}
                                    fullWidth={{ base: true, md: false }}
                                    text="Cancelar"
                                    iconLeft={X} />
                            </Stack>
                        </Stack>
                    </GlassPanel>
                ) : (
                    <Box
                        display="flex"
                        align="start"
                        gap={STORE_TOKENS.SPACING.ELEMENT}
                        cursor="pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            {contextLabel && (
                                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={Utensils} color={(contextColor as any) || STORE_TOKENS.COLORS.BRAND} size="lg" />
                                    <Font
                                        variant="auxiliary"
                                        uppercase
                                        {...{
                                            color: (contextColor as any) || STORE_TOKENS.COLORS.BRAND,
                                        }}>
                                        {contextLabel}
                                    </Font>
                                </Inline>
                            )}
                            <Inline align="center" gap={'tiny'}>
                                <Font
                                    variant="h1"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>
                                    {name}
                                </Font>
                                <Box
                                    padding={'tiny'}
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    hoverBg={STORE_TOKENS.COLORS.BACKGROUND}
                                    display="flex"
                                    align="center"
                                    justify="center"
                                >
                                    <Icon icon={Pencil} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                                </Box>
                            </Inline>
                            <Font
                                variant="description"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>
                                {description || 'Toque para editar nome e detalhes'}
                            </Font>
                        </Stack>
                    </Box>
                )}
            </Box>
            {/* Actions: estimate + assign */}
            {!isEditing && (
                <Stack
                    direction={{ base: 'col', md: 'row' }}
                    align={{ base: 'stretch', md: 'center' }}
                    justify="end"
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                    {/* Assignment badge */}
                    {showAssignmentBadge && assignments && assignments.length > 0 && (
                        <AssignmentBadge
                            studentName={assignments[0]?.student?.full_name || 'Aluno'}
                            studentAvatarUrl={assignments[0]?.student?.avatar_url}
                            variant="primary"
                        />
                    )}

                    {/* Calcular Macros */}
                    <Button
                        variant="outline-zinc"
                        size="lg"
                        shine
                        onClick={onEstimateAll}
                        disabled={isEstimatingAll}
                        fullWidth={{ base: true, md: false }}
                        text={isEstimatingAll ? 'Calculando...' : 'Calcular Macros'}
                        iconLeft={isEstimatingAll ? Loader2 : Sparkles} />

                    {/* Assign diet */}
                    {canAssign && (
                        <Box shrink={0} display="flex" justify="center">
                            <Button
                                variant="outline-primary"
                                size="lg"
                                shine
                                fullWidth={{ base: true, md: false }}
                                onClick={() => setIsAssignModalOpen(true)}
                                text={assignments?.length ? 'Gerenciar Atribuição' : 'Atribuir Dieta'}
                                iconLeft={Calendar} />
                        </Box>
                    )}

                    <RegistryActionModal
                        isOpen={isAssignModalOpen}
                        onClose={() => setIsAssignModalOpen(false)}
                        type="assign_diet"
                        onConfirm={handleAssignConfirm}
                        students={students}
                        initialData={{
                            student_id: assignments?.[0]?.student_id,
                            selectedDays: assignments?.[0]?.days_of_week || [0, 1, 2, 3, 4, 5, 6]
                        }}
                    />
                </Stack>
            )}
        </Stack>
    );
}
