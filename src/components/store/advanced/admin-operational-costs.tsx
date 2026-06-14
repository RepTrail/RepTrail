'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingDown, Edit3 } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { Badge } from '@/components/store/base/badge'
import { FormSelect } from '@/components/store/base/form-select'
import { Inline } from '@/components/store/base/layout'
import { Modal } from '@/components/store/advanced/modal'
import { addOperationalCost, deleteOperationalCost, updateOperationalCost } from '@/lib/dal/remote'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { ActionableListCard } from '@/components/store/intermediary/actionable-list-card'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { ActionIconButton } from '@/components/store/intermediary/action-icon-button'
import { CircleIcon } from '@/components/store/intermediary/circle-icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface OperationalCost {
    id: string
    description: string
    amount: number
    type: 'fixed' | 'variable'
    created_at: string
}

interface OperationalCostsProps {
    initialCosts: OperationalCost[]
    totalMonthly: number
    totalAllTime: number
}

export function AdminOperationalCosts({ initialCosts, totalMonthly, totalAllTime }: OperationalCostsProps) {
    const { toast } = useToast()
    const [costs, setCosts] = useState<OperationalCost[]>(initialCosts)

    // Sync state with props to avoid stale data after refetch
    useEffect(() => {
        setCosts(initialCosts)
    }, [initialCosts])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCost, setSelectedCost] = useState<OperationalCost | null>(null)
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [type, setType] = useState<'fixed' | 'variable'>('fixed')

    const { mutate: addCostMutate } = useOptimisticMutation({
        actionName: 'add-operational-cost',
        entity: ENTITIES.OPERATIONAL_COST,
        queryKey: ['admin', 'operational-costs'],
        additionalQueryKeys: [['admin', 'overview']],
        mutationFn: async (variables: any) => (await addOperationalCost(variables)) as any,
        onMutate: (variables) => {
            const tempId = crypto.randomUUID()
            const newCost = { ...variables, id: tempId, created_at: new Date().toISOString() }
            setCosts(prev => [newCost, ...prev])
            setIsAddModalOpen(false)
            setDescription('')
            setAmount('')
            setType('fixed')
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
        mutationFn: async (variables: { id: string }) => (await deleteOperationalCost(variables.id)) as any,
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
        mutationFn: async (variables: any) => (await updateOperationalCost(variables.id, variables)) as any,
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
        setDescription(cost?.description)
        setAmount(cost.amount.toString())
        setType(cost.type)
        setIsEditModalOpen(true)
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION}>
            <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
                <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={TrendingDown} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                            <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Custos Operacionais"}</Font>
                        </Inline>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Infraestrutura e operação mensal da plataforma."}</Font>
                    </Stack>
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                        <Badge
                            label={`R$ ${(costs.reduce((sum, c) => sum + Number(c.amount), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês`}
                            color={STORE_TOKENS.COLORS.SUCCESS}
                            variant="solid"
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            size="md"
                        />
                        <Button
                            variant="outline-red"
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            onClick={() => {
                                setDescription('')
                                setAmount('')
                                setType('fixed')
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
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                {/* Listagem de Custos */}
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
                                            display="block"
                                            {...{
                                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                            }}>
                                            {cost?.description}
                                        </Font>
                                        <Box fullWidth minWidth={0} overflow="hidden">
                                            <Font
                                                variant="sub-tiny"
                                                uppercase
                                                tracking="widest"
                                                display="block"
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
            </Stack >
            {/* Modal de Adição */}
            < Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)
                }
                title="Adicionar Custo"
                subtitle="Registre gastos de infraestrutura ou marketing."
                icon={TrendingDown}
                confirmLabel="Salvar Custo"
                onConfirm={handleAddCost}
                variant="red"
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Input
                        label="Descrição"
                        placeholder="Ex: Servidor, Domínio, Marketing..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box flex1>
                            <Input
                                label="Valor (R$)"
                                type="number"
                                placeholder="0,00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Box>
                        <Box flex1>
                            <FormSelect
                                label="Tipo de Custo"
                                options={[
                                    { label: 'Fixo', value: 'fixed', description: 'Gastos recorrentes mensais' },
                                    { label: 'Variável', value: 'variable', description: 'Gastos esporádicos' }
                                ]}
                                value={type}
                                onChange={(val: any) => setType(val)}
                            />
                        </Box>
                    </Stack>
                </Stack>
            </Modal >
            {/* Modal de Edição */}
            < Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Custo"
                subtitle={`Modificando: ${selectedCost?.description}`}
                icon={Edit3}
                confirmLabel="Salvar Alterações"
                onConfirm={handleEditCost}
                variant="blue"
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Input
                        label="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box flex1>
                            <Input
                                label="Valor (R$)"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Box>
                        <Box flex1>
                            <FormSelect
                                label="Tipo de Custo"
                                options={[
                                    { label: 'Fixo', value: 'fixed', description: 'Gastos recorrentes mensais' },
                                    { label: 'Variável', value: 'variable', description: 'Gastos esporádicos' }
                                ]}
                                value={type}
                                onChange={(val: any) => setType(val)}
                            />
                        </Box>
                    </Stack>
                </Stack>
            </Modal >
            {/* Modal de Exclusão */}
            < Modal
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
            </Modal >
        </Stack >
    );
}
