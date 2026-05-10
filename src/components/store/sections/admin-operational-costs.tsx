'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { Stack } from '../base/stack'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Input } from '../base/input'
import { Grid } from '../base/grid'
import { Badge } from '../base/badge'
import { FormSelect } from '../base/form-select'
import { Modal } from '../advanced/modal'
import { addOperationalCost, deleteOperationalCost } from '@/actions/admin-actions'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { cn } from '@/lib/utils'
import { EmptyState } from '../intermediary/empty-state'

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
    const [isModalOpen, setIsModalOpen] = useState(false)
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
            setIsModalOpen(false)
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

    function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja apagar este custo?')) return
        deleteCostMutate({ id })
    }

    return (
        <Stack gap={10}>
            {/* Header com Resumo */}
            <Stack direction="row" align="center" justify="between" className="border-b border-white/5 pb-5">
                <Stack gap={1}>
                    <Font variant="body" weight="black" color="white" uppercase italic>CUSTOS OPERACIONAIS</Font>
                    <Font variant="description" color="zinc-500">Infraestrutura e operação mensal da plataforma.</Font>
                </Stack>
                <Stack direction="row" gap={5} align="center">
                    <Box paddingX={5} paddingY={2.5} rounded="full" className="bg-zinc-900/60 border border-white/5">
                         <Font variant="heading" color="red">R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Font>
                    </Box>
                    <Button 
                        variant="outline-red" 
                        rounded="full" 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8"
                    >
                        <Stack direction="row" gap={2.5} align="center">
                            <Icon icon={Plus} size="sm" />
                            <Font variant="label-caps">Adicionar Custo</Font>
                        </Stack>
                    </Button>
                </Stack>
            </Stack>

            {/* Listagem de Custos */}
            <Box rounded="system" className="bg-zinc-900/20 border border-zinc-800 overflow-hidden">
                {/* Header da Tabela */}
                <Box padding={5} className="bg-zinc-950/50 border-b border-zinc-800">
                    <Grid columns={5} gap={5}>
                        <Box><Font variant="label-caps" color="zinc-500">Descrição</Font></Box>
                        <Box><Font variant="label-caps" color="zinc-500">Tipo</Font></Box>
                        <Box><Font variant="label-caps" color="zinc-500">Data</Font></Box>
                        <Box align="end"><Font variant="label-caps" color="zinc-500">Valor</Font></Box>
                        <Box align="end"><Font variant="label-caps" color="zinc-500">Ações</Font></Box>
                    </Grid>
                </Box>

                {/* Corpo da Tabela */}
                <Stack gap={0} className="divide-y divide-zinc-800/50">
                    {costs.length === 0 ? (
                        <Box padding={5}>
                            <EmptyState 
                                icon={TrendingDown} 
                                title="Sem Custos" 
                                description="Nenhum custo operacional registrado este mês." 
                            />
                        </Box>
                    ) : (
                        costs.map((cost) => (
                            <Box key={cost.id} padding={5} className="hover:bg-zinc-800/20 transition-colors">
                                <Grid columns={5} gap={5} align="center">
                                    <Box>
                                        <Font variant="body" weight="bold" color="white">{cost.description}</Font>
                                    </Box>
                                    <Box>
                                        <Badge 
                                            label={cost.type === 'fixed' ? 'Fixo' : 'Variável'}
                                            variant="glass"
                                            color={cost.type === 'fixed' ? 'blue' : 'orange'}
                                        />
                                    </Box>
                                    <Box>
                                        <Font variant="auxiliary" color="zinc-400">{new Date(cost.created_at).toLocaleDateString('pt-BR')}</Font>
                                    </Box>
                                    <Box align="end">
                                        <Font variant="body" weight="black" color="red">- R$ {Number(cost.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Font>
                                    </Box>
                                    <Box align="end">
                                        <Button variant="close" isIconOnly onClick={() => handleDelete(cost.id)}>
                                            <Icon icon={Trash2} size="sm" color="zinc-500" className="hover:text-red-500 transition-colors" />
                                        </Button>
                                    </Box>
                                </Grid>
                            </Box>
                        ))
                    )}
                </Stack>
            </Box>

            {/* Modal de Adição */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Adicionar Custo Operacional"
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
                        onChange={setDescription}
                    />
                    <Stack direction="row" gap={5}>
                        <Box flex1>
                            <Input 
                                label="Valor (R$)" 
                                type="number" 
                                placeholder="0,00" 
                                value={amount}
                                onChange={setAmount}
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
        </Stack>
    )
}
