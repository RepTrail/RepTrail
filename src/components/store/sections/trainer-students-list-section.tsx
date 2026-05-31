'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerStudents } from '@/lib/dal/remote'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { ActionableListCard } from '@/components/store/intermediary/actionable-list-card'
import { Input } from '@/components/store/base/input'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Badge } from '@/components/store/base/badge'
import { Button } from '@/components/store/base/button'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Modal } from '@/components/store/advanced/modal'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Users, Search, ArrowUpRight, UserMinus, AlertTriangle } from 'lucide-react'

interface TrainerStudentsListSectionProps {
    userId: string
}

export function TrainerStudentsListSection({ userId }: TrainerStudentsListSectionProps) {
    const [search, setSearch] = useState('')
    const [deactivateTarget, setDeactivateTarget] = useState<any>(null)
    const [isDeactivating, setIsDeactivating] = useState(false)

    const { data: students = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.students(userId),
        queryFn: () => getTrainerStudents(userId),
    })

    const filteredStudents = students.filter((s: any) =>
        s.active && (
            (s.student?.full_name?.toLowerCase().includes(search.toLowerCase())) ||
            (s.student?.email?.toLowerCase().includes(search.toLowerCase()))
        )
    )

    const handleDeactivateConfirm = useCallback(async () => {
        if (!deactivateTarget) return
        setIsDeactivating(true)
        try {
            const { deactivateAndPurgeStudent } = await import('@/lib/dal/remote')
            const result = await deactivateAndPurgeStudent(deactivateTarget.id, deactivateTarget.student_id)
            if (result.success) {
                window.location.reload()
            }
        } finally {
            setIsDeactivating(false)
            setDeactivateTarget(null)
        }
    }, [deactivateTarget])

    return (
        <>
            <RegistrySection
                title="Lista da Matrícula"
                subtitle="Gerencie seus alunos ativos e suas informações."
                icon={Users}
                rightElement={
                    <Box width={{ base: 'full', md: 'auto' }}>
                        <Input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Icon icon={Search} size="xs" />}
                        />
                    </Box>
                }
            >
                {filteredStudents.length > 0 ? (
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                        {filteredStudents.map((item: any) => {
                            const todayDay = new Date().getDate()
                            const paymentDay = item.payment_day
                            const lastPayment = item.last_payment_date
                            const isPaidThisMonth = lastPayment &&
                                new Date(lastPayment).getMonth() === new Date().getMonth() &&
                                new Date(lastPayment).getFullYear() === new Date().getFullYear()

                            let paymentStatus = null
                            if (paymentDay && !isPaidThisMonth) {
                                if (todayDay === paymentDay) paymentStatus = 'due_today'
                                else if (todayDay > paymentDay) paymentStatus = 'overdue'
                            }

                            const avatarInitials = item.student?.full_name?.substring(0, 2) || 'AL'
                            const formattedValue = `R$ ${Number(item.monthly_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                            const formattedDay = item.payment_day ? `Dia ${item.payment_day}` : null

                            return (
                                <ActionableListCard
                                    key={item.id}
                                    badges={
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="end">
                                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                                {item.is_new && (
                                                    <Badge label="Pendente" variant="glass" color={STORE_TOKENS.COLORS.INFO} size="xs" />
                                                )}
                                                {item.is_placeholder ? (
                                                    <Badge label="Aguardando Cadastro" variant="glass" color={STORE_TOKENS.COLORS.WARNING} size="xs" />
                                                ) : (
                                                    <Badge 
                                                        label={item.active ? 'Ativo' : 'Inativo'} 
                                                        variant={item.active ? 'glass' : 'outline'} 
                                                        color={item.active ? STORE_TOKENS.COLORS.SUCCESS : STORE_TOKENS.COLORS.BACKGROUND} 
                                                        size="xs" 
                                                    />
                                                )}
                                                {paymentStatus === 'overdue' && !item.is_placeholder && (
                                                    <Badge label="Atrasado" variant="glass" color={STORE_TOKENS.COLORS.ERROR} size="xs" />
                                                )}
                                                {paymentStatus === 'due_today' && !item.is_placeholder && (
                                                    <Badge label="Vence Hoje" variant="glass" color={STORE_TOKENS.COLORS.WARNING} size="xs" />
                                                )}
                                                <Badge label={formattedValue} variant="glass" color={STORE_TOKENS.COLORS.WARNING} size="xs" />
                                                {formattedDay && (
                                                    <Badge label={formattedDay} variant="glass" color={STORE_TOKENS.COLORS.ERROR} size="xs" />
                                                )}
                                            </Inline>
                                        </Stack>
                                    }
                                    actions={
                                        <>
                                            <Button 
                                                variant="outline-zinc" 
                                                size="sm" 
                                                rounded={STORE_TOKENS.RADIUS.FULL} 
                                                isIconOnly 
                                                hoverScale={110}
                                                activeScale={95}
                                                transition
                                                asChild
                                            >
                                                <Link
                                                    href={`/dashboard/trainer/students/${item.id}`}
                                                    aria-label="Abrir página do aluno"
                                                >
                                                    <Icon icon={ArrowUpRight} size="xs" />
                                                </Link>
                                            </Button>
                                            {item.active && (
                                                <Button 
                                                    variant="outline-red" 
                                                    size="sm" 
                                                    rounded={STORE_TOKENS.RADIUS.FULL} 
                                                    isIconOnly 
                                                    hoverScale={110}
                                                    activeScale={95}
                                                    transition
                                                    onClick={() => setDeactivateTarget(item)}
                                                >
                                                    <Icon icon={UserMinus} size="xs" />
                                                </Button>
                                            )}
                                        </>
                                    }
                                >
                                    <Inline
                                        gap={STORE_TOKENS.SPACING.CONTAINER}
                                        align="center"
                                        fullWidth
                                        {...{
                                            minWidth: 0,
                                        }}>
                                        <Box shrink={0}>
                                            <BaseAvatar src={item.student?.avatar_url || undefined} initials={avatarInitials} variant="zinc" size="md" />
                                        </Box>
                                        <Stack gap={STORE_TOKENS.SPACING.NONE} minWidth={0} flex1>
                                            <Box fullWidth minWidth={0} overflow="hidden">
                                                <Font
                                                    {...STORE_TOKENS.TYPOGRAPHY.HEADING}
                                                    variant={{ base: 'body-sm', md: 'body' }}
                                                    truncate
                                                    display="block"
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                                    }}>
                                                    {item.student?.full_name || 'Sem nome'}
                                                </Font>
                                            </Box>
                                            <Box fullWidth minWidth={0} overflow="hidden">
                                                <Font
                                                    {...STORE_TOKENS.TYPOGRAPHY.LABEL}
                                                    lowercase
                                                    truncate
                                                    display="block"
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                                    }}>
                                                    {item.student?.email || 'Sem email'}
                                                </Font>
                                            </Box>
                                        </Stack>
                                    </Inline>
                                </ActionableListCard>
                            );
                        })}
                    </Stack>
                ) : (
                    <EmptyState
                        icon={Users}
                        title="Nenhum aluno encontrado"
                        description="Sua busca não retornou nenhum aluno ou você ainda não possui alunos ativos."
                        variant="zinc"
                    />
                )}
            </RegistrySection>
            <Modal
                isOpen={!!deactivateTarget}
                onClose={() => setDeactivateTarget(null)}
                title="Desativar Aluno"
                subtitle="Esta ação não pode ser desfeita facilmente."
                icon={AlertTriangle}
                variant="red"
                confirmLabel="Desativar"
                confirmVariant="outline-red"
                confirmIcon={UserMinus}
                cancelLabel="Cancelar"
                onConfirm={handleDeactivateConfirm}
                isLoading={isDeactivating}
            >
                <Font
                    variant="description"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                    }}>
                    Tem certeza que deseja desativar <Font
                    variant="description"
                    weight="black"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                    }}>{deactivateTarget?.student?.full_name}</Font>? Isso removerá todos os treinos, dietas e cardios atribuídos por você.
                </Font>
            </Modal>
        </>
    );
}
