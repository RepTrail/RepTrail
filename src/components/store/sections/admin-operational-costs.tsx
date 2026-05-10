'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingDown, TrendingUp, Edit3, LucideIcon } from 'lucide-react'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Input } from '../base/input'
import { Grid } from '../base/grid'
import { Badge } from '../base/badge'
import { FormSelect } from '../base/form-select'
import { Inline, Divider } from '../base/layout'
import { Modal } from '../advanced/modal'
import { RegistrySection } from '../advanced/registry-section'
import { addOperationalCost, deleteOperationalCost } from '@/actions/admin-actions'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { cn } from '@/lib/utils'
import { ActionableListCard } from '../intermediary/actionable-list-card'
import { EmptyState } from '../intermediary/empty-state'
import { ActionIconButton } from '../intermediary/action-icon-button'
import { CircleIcon } from '../intermediary/circle-icon'

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
        mutationFn: async (variables: { obj: any }) => (await addOperationalCost(variables.obj)) as any,
        onMutate: (variables) => {
            const tempId = crypto.randomUUID()
            const newCost = { ...variables.obj, id: tempId, created_at: new Date().toISOString() }
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

    function handleAddCost() {
        if (!description || !amount) return toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' })
        const numericAmount = parseFloat(amount.replace(',', '.'))
        addCostMutate({ obj: { description, amount: numericAmount, type } })
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

    return (
        <Stack gap="section">
            <RegistrySection 
                title="Custos Operacionais" 
                subtitle="Infraestrutura e operação mensal da plataforma." 
                icon={TrendingDown}
                rightElement={
                    <Stack direction="row" gap={5} align="center">
                        <Badge 
                            label={`R$ ${totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / mês`}
                            color="emerald"
                            variant="solid"
                            rounded="full"
                            size="md"
                        />
                        <Button 
                            variant="outline-red" 
                            rounded="full" 
                            onClick={() => {
                                setDescription('')
                                setAmount('')
                                setType('fixed')
                                setIsAddModalOpen(true)
                            }}
                            paddingX={5}
                            size="md"
                        >
                            <Stack direction="row" gap={2.5} align="center">
                                <Icon icon={Plus} size="sm" />
                                <Font variant="label-caps">Adicionar Custo</Font>
                            </Stack>
                        </Button>
                    </Stack>
                }
            >
                <Stack gap={5}>
                    {/* Listagem de Custos */}
                    <Stack gap={2.5}>
                {costs.map((cost) => (
                    <ActionableListCard 
                        key={cost.id}
                        badges={
                            <Inline gap={2.5} align="center">
                                <Badge 
                                    label={new Date(cost.created_at).toLocaleDateString('pt-BR')}
                                    variant="glass"
                                    size="xs"
                                    rounded="full"
                                />
                                <Badge 
                                    label={cost.type === 'fixed' ? 'Fixo' : 'Variável'}
                                    variant="glass"
                                    color={cost.type === 'fixed' ? 'blue' : 'orange'}
                                    size="xs"
                                    rounded="full"
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
                        <Inline gap={5} align="center">
                            <CircleIcon 
                                icon={TrendingDown} 
                                color={cost.type === 'fixed' ? 'blue' : 'orange'} 
                                size="sm" 
                            />
                            <Stack gap={0} minWidth={0}>
                                <Font weight="black" uppercase italic color="white" variant={{ base: 'body-sm', md: 'body' }} tracking="wider" truncate display="block">
                                    {cost.description}
                                </Font>
                                <Box fullWidth minWidth={0} overflow="hidden">
                                    <Font variant="sub-tiny" color="zinc-600" uppercase tracking="widest" display="block">
                                        - R$ {Number(cost.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </Font>
                                </Box>
                            </Stack>
                        </Inline>
                    </ActionableListCard>
                ))}

                {costs.length === 0 && (
                    <EmptyState 
                        icon={TrendingDown} 
                        title="Sem Custos" 
                        description="Nenhum custo operacional cadastrado no momento." 
                    />
                )}
            </Stack>
            </Stack>
            </RegistrySection>

            {/* Modal de Adição */}
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
                <Stack gap={5}>
                    <Input 
                        label="Descrição" 
                        placeholder="Ex: Servidor, Domínio, Marketing..." 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Stack direction="row" gap={5}>
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
            </Modal>

            {/* Modal de Edição */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Custo"
                subtitle={`Modificando: ${selectedCost?.description}`}
                icon={Edit3}
                confirmLabel="Salvar Alterações"
                onConfirm={() => {
                    toast({ title: 'Info', description: 'Funcionalidade de edição em desenvolvimento.' })
                    setIsEditModalOpen(false)
                }}
                variant="blue"
            >
                <Stack gap={5}>
                    <Input 
                        label="Descrição" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Stack direction="row" gap={5}>
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
            </Modal>

            {/* Modal de Exclusão */}
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
                <Font variant="description" color="zinc-400">
                    Esta ação não pode ser desfeita e removerá o registro permanentemente do sistema.
                </Font>
            </Modal>
        </Stack>
    )
}
