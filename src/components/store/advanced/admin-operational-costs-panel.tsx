'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingDown, Edit3 } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Badge } from '@/components/store/base/badge'
import { Inline } from '@/components/store/base/layout'
import { Modal } from '@/components/store/advanced/modal'
import { actions } from '@/lib/dal'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { ActionableListCard } from '../intermediary/actionable-list-card'
import { EmptyState } from '../intermediary/empty-state'
import { ActionIconButton } from '../intermediary/action-icon-button'
import { CircleIcon } from '../intermediary/circle-icon'
import { OperationalCostForm } from '../intermediary/operational-cost-form'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface OperationalCost {
    id: string
    description: string
    amount: number
    type: 'fixed' | 'variable'
    created_at: string
}

/**
 * AdminOperationalCostsPanel: Encapsulates all operational cost management logic.
 * - Handles state for costs, modals, and forms.
 * - Manages optimistic mutations for CRUD operations.
 * - Follows strict Design System governance.
 */
export function AdminOperationalCostsPanel({ initialCosts }: { initialCosts: OperationalCost[] }) {
    const { toast } = useToast()
    const [costs, setCosts] = useState<OperationalCost[]>(initialCosts)

    useEffect(() => {
        setCosts(initialCosts)
    }, [initialCosts])

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCost, setSelectedCost] = useState<OperationalCost | null>(null)
    
    // Form state
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [type, setType] = useState<'fixed' | 'variable'>('fixed')

    const { mutate: addCostMutate } = useOptimisticMutation({
        actionName: 'add-operational-cost',
        entity: ENTITIES.OPERATIONAL_COST,
        queryKey: ['admin', 'operational-costs'],
        additionalQueryKeys: [['admin', 'overview']],
        mutationFn: async (variables: any) => (await actions.addOperationalCost(variables)) as any,
        onMutate: (variables) => {
            const tempId = crypto.randomUUID()
            const newCost = { ...variables, id: tempId, created_at: new Date().toISOString() }
            setCosts(prev => [newCost, ...prev])
            setIsAddModalOpen(false)
            resetForm()
            return { tempId }
        },
        onSuccess: () => {
            toast({ title: 'Sucesso', description: 'Custo adicionado localmente.' })
        },
        onError: (err, variables, ctx) => {
            setCosts(prev => prev.filter(c => c.id !== ctx?.tempId))
            toast({ title: 'Erro', description: 'Erro ao adicionar custo.', variant: 'destructive' })
        }
    })

    const { mutate: deleteCostMutate } = useOptimisticMutation({
        actionName: 'delete-operational-cost',
        entity: ENTITIES.OPERATIONAL_COST,
        queryKey: ['admin', 'operational-costs'],
        additionalQueryKeys: [['admin', 'overview']],
        mutationFn: async (variables: { id: string }) => (await actions.deleteOperationalCost(variables.id)) as any,
        onMutate: (variables) => {
            const previousCosts = [...costs]
            setCosts(prev => prev.filter(c => c.id !== variables.id))
            setIsDeleteModalOpen(false)
            return { previousCosts }
        },
        onSuccess: () => {
            toast({ title: 'Sucesso', description: 'Custo removido localmente.' })
        },
        onError: (err, variables, ctx) => {
            setCosts(ctx?.previousCosts || [])
            toast({ title: 'Erro', description: 'Erro ao deletar custo.', variant: 'destructive' })
        }
    })

    const { mutate: updateCostMutate } = useOptimisticMutation({
        actionName: 'update-operational-cost',
        entity: ENTITIES.OPERATIONAL_COST,
        queryKey: ['admin', 'operational-costs'],
        additionalQueryKeys: [['admin', 'overview']],
        mutationFn: async (variables: any) => (await actions.updateOperationalCost(variables.id, variables)) as any,
        onMutate: (variables) => {
            const previousCosts = [...costs]
            setCosts(prev => prev.map(c => c.id === variables.id ? { ...c, ...variables } : c))
            setIsEditModalOpen(false)
            return { previousCosts }
        },
        onSuccess: () => {
            toast({ title: 'Sucesso', description: 'Custo atualizado localmente.' })
        },
        onError: (err, variables, ctx) => {
            setCosts(ctx?.previousCosts || [])
            toast({ title: 'Erro', description: 'Erro ao atualizar custo.', variant: 'destructive' })
        }
    })

    function resetForm() {
        setDescription('')
        setAmount('')
        setType('fixed')
    }

    function handleAddCost() {
        if (!description || !amount) return toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' })
        const numericAmount = parseFloat(amount.replace(',', '.'))
        addCostMutate({ description, amount: numericAmount, type })
    }

    function handleEditCost() {
        if (!selectedCost || !description || !amount) return toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' })
        const numericAmount = parseFloat(amount.replace(',', '.'))
        updateCostMutate({ id: selectedCost.id, description, amount: numericAmount, type })
    }

    function openDeleteModal(cost: OperationalCost) {
        setSelectedCost(cost)
        setIsDeleteModalOpen(true)
    }

    function openEditModal(cost: OperationalCost) {
        setSelectedCost(cost)
        setDescription(cost.description)
        setAmount(cost.amount.toString())
        setType(cost.type)
        setIsEditModalOpen(true)
    }

    const totalMonthly = costs.reduce((sum, c) => sum + Number(c.amount), 0)

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
            <Stack direction="row" justify="end" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Badge
                    label={`R$ ${totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês`}
                    color={STORE_TOKENS.COLORS.SUCCESS}
                    variant="solid"
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    size="md"
                />
                <Button
                    variant="outline-red"
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    onClick={() => {
                        resetForm()
                        setIsAddModalOpen(true)
                    }}
                    paddingX={STORE_TOKENS.PADDING.CONTAINER}
                    size="md"
                >
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Plus} size="sm" />
                        <Font variant="label-caps">Adicionar Custo</Font>
                    </Stack>
                </Button>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                {costs.map((cost) => {
                    const badgeColor = cost.type === 'fixed' ? STORE_TOKENS.COLORS.INFO : STORE_TOKENS.COLORS.BRAND;
                    return (
                    <ActionableListCard
                        key={cost.id}
                        badges={
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Badge
                                    label={new Date(cost.created_at).toLocaleDateString('pt-BR')}
                                    variant="glass"
                                    size="xs"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                />
                                <Badge
                                    label={cost.type === 'fixed' ? 'Fixo' : 'Variável'}
                                    variant="glass"
                                    color={badgeColor}
                                    size="xs"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                />
                            </Inline>
                        }
                        actions={
                            <>
                                <ActionIconButton
                                    icon={Edit3}
                                    variant="outline-blue"
                                    onClick={() => openEditModal(cost)}
                                />
                                <ActionIconButton
                                    icon={Trash2}
                                    variant="outline-red"
                                    onClick={() => openDeleteModal(cost)}
                                />
                            </>
                        }
                    >
                        <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                            <CircleIcon
                                icon={TrendingDown}
                                size="sm"
                                color={cost.type === 'fixed' ? 'blue' : 'orange'}
                            />
                            <Stack gap={STORE_TOKENS.SPACING.NONE} minWidth={0}>
                                <Font
                                    weight="black"
                                    uppercase
                                    italic
                                    variant={{ base: 'body-sm', md: 'body' }}
                                    tracking="wider"
                                    truncate
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>
                                    {cost.description}
                                </Font>
                                <Box fullWidth minWidth={0} overflow="hidden">
                                    <Font
                                        variant="sub-tiny"
                                        uppercase
                                        tracking="widest"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.DIM,
                                        }}>
                                        - R$ {Number(cost.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </Font>
                                </Box>
                            </Stack>
                        </Inline>
                    </ActionableListCard>
                    );
                })}

                {costs.length === 0 && (
                    <EmptyState
                        icon={TrendingDown}
                        title="Sem Custos"
                        description="Nenhum custo operacional cadastrado no momento."
                    />
                )}
            </Stack>
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Adicionar Custo"
                subtitle="Registre gastos de infraestrutura ou marketing."
                icon={TrendingDown}
                confirmLabel="Salvar Custo"
                onConfirm={handleAddCost}
                variant="red"
            >
                <OperationalCostForm 
                    description={description} setDescription={setDescription}
                    amount={amount} setAmount={setAmount}
                    type={type} setType={setType}
                />
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Custo"
                subtitle={`Modificando: ${selectedCost?.description}`}
                icon={Edit3}
                confirmLabel="Salvar Alterações"
                onConfirm={handleEditCost}
                variant="blue"
            >
                <OperationalCostForm 
                    description={description} setDescription={setDescription}
                    amount={amount} setAmount={setAmount}
                    type={type} setType={setType}
                />
            </Modal>
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirmar Exclusão"
                subtitle={`Deseja realmente apagar o custo: ${selectedCost?.description}?`}
                icon={Trash2}
                variant="red"
                confirmLabel="Sim, Excluir"
                onConfirm={() => deleteCostMutate({ id: selectedCost?.id || '' })}
            >
                <Font
                    variant="description"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                    }}>
                    Esta ação não pode ser desfeita e removerá o registro permanentemente do sistema.
                </Font>
            </Modal>
        </Stack>
    );
}
