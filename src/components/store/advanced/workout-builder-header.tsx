'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel, Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { AssignmentBadge } from '@/components/store/intermediary/assignment-badge'
import { Pencil, Check, X, Calendar, Dumbbell, BarChart3, Users2, HeartHandshake, Zap, Users, ClipboardList, Activity, TrendingUp, Sparkles, Utensils, FlaskConical, FileUp, Flame, CreditCard, UserCheck, LayoutDashboard, LucideIcon } from 'lucide-react'
import { RegistryActionModal } from '@/components/store/advanced/registry-action-modal'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { assignWorkout } from '@/actions/workout-actions'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

const iconMap: Record<string, LucideIcon> = {
    BarChart3, Users2, HeartHandshake, Zap, Users, ClipboardList, Activity, TrendingUp, Sparkles, Utensils, Dumbbell, FlaskConical, FileUp, Flame, CreditCard, UserCheck, LayoutDashboard
}

interface WorkoutBuilderHeaderProps {
    workoutId: string
    name: string
    description: string
    isEditing: boolean
    setIsEditing: (val: boolean) => void
    editName: string
    setEditName: (val: string) => void
    editDesc: string
    setEditDesc: (val: string) => void
    onSave: () => void
    onCancel: () => void
    showAssignmentBadge?: boolean
    canAssign?: boolean
    assignments?: any[]
    students?: any[]
    contextLabel?: string
    icon?: string
    contextColor?: string
}

export function WorkoutBuilderHeader({
    workoutId,
    name,
    description,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    onSave,
    onCancel,
    showAssignmentBadge = true,
    canAssign = true,
    assignments = [],
    students = [],
    contextLabel,
    icon,
    contextColor
}: WorkoutBuilderHeaderProps) {
    const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)

    const { mutate: assignMutation } = useOptimisticMutation({
        queryKey: ['workout'],
        entity: ENTITIES.WORKOUT,
        actionName: 'assign-workout',
        mutationFn: async ({ workoutId, day, studentId }: { workoutId: string, day: number, studentId: string }) => {
            const res = await assignWorkout(workoutId, studentId, day)
            if (res.error) throw new Error(res.error)
            return res
        }
    })

    const handleAssignConfirm = (data?: any) => {
        if (!data || !data.student_id) return

        const { selectedDays, student_id } = data
        if (Array.isArray(selectedDays)) {
            selectedDays.forEach(day => {
                assignMutation({ workoutId, day, studentId: student_id })
            })
        }
        setIsAssignModalOpen(false)
    }
    const IconComp = icon ? (iconMap[icon] || Dumbbell) : null

    return (
        <Stack
            direction={{ base: 'col', md: 'row' }}
            align={{ base: 'stretch', md: 'start' }}
            justify="between"
            gap={STORE_TOKENS.SPACING.SECTION}
            fullWidth
        >
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
                                    }}>Nome do Treino</Font>
                                <Input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
                                    placeholder="Ex: Hipertrofia A - Peito/Tríceps"
                                    size="lg"
                                    autoFocus
                                />
                            </Stack>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>Descrição (Opcional)</Font>
                                <Input
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Escape') onCancel() }}
                                    placeholder="Ex: Foco na contração e descanso rápido"
                                />
                            </Stack>
                            <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button
                                    variant="outline-emerald"
                                    onClick={onSave}
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                    fullWidth={{ base: true, md: false }}
                                >
                                    <Icon icon={Check} size="xs" />
                                    Salvar
                                </Button>
                                <Button
                                    variant="outline-red"
                                    onClick={onCancel}
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                    fullWidth={{ base: true, sm: false }}
                                >
                                    <Icon icon={X} size="xs" />
                                    Cancelar
                                </Button>
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
                            {contextLabel && IconComp && (
                                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={IconComp} color={contextColor as any || STORE_TOKENS.COLORS.SUCCESS} size="lg" />
                                    <Font
                                        variant="auxiliary"
                                        uppercase
                                        {...{
                                            color: contextColor as any || STORE_TOKENS.COLORS.SUCCESS,
                                        }}>{contextLabel}</Font>
                                </Inline>
                            )}
                            <Inline align="center" gap={STORE_TOKENS.SPACING.TINY}>
                                <Font
                                    variant="h1"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>{name}</Font>
                                <Box
                                    padding={STORE_TOKENS.SPACING.TINY}
                                    rounded="system"
                                    hoverBg="zinc"
                                    display="flex"
                                    align="center"
                                    justify="center"
                                    // EXCEPTION: Icon button hover states in base component layer
                                >
                                    <Icon icon={Pencil} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                                </Box>
                            </Inline>
                            <Font
                                variant="description"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>{description || 'Sem descrição'}</Font>


                        </Stack>
                    </Box>
                )}
            </Box>
            {canAssign && !isEditing && (
                <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'stretch', md: 'center' }} justify="end" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    {showAssignmentBadge && assignments && assignments.length > 0 && (
                        <AssignmentBadge
                            studentName={assignments[0]?.student?.full_name || 'Aluno'}
                            studentAvatarUrl={assignments[0]?.student?.avatar_url}
                            daysOfWeek={assignments[0]?.days_of_week}
                            variant="warning"
                        />
                    )}
                    <Box shrink={0} display="flex" justify="center">
                        <Button variant="outline-orange" size="lg" shine fullWidth={{ base: true, md: false }} onClick={() => setIsAssignModalOpen(true)}>
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={Calendar} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                                {assignments?.length ? "Gerenciar Atribuição" : "Atribuir"}
                            </Inline>
                        </Button>
                    </Box>
                    <RegistryActionModal
                        isOpen={isAssignModalOpen}
                        onClose={() => setIsAssignModalOpen(false)}
                        type="assign_training"
                        onConfirm={handleAssignConfirm}
                        students={students}
                        initialData={{
                            student_id: assignments?.[0]?.student_id,
                            selectedDays: assignments?.[0]?.days_of_week || []
                        }}
                    />
                </Stack>
            )}
        </Stack>
    );
}
