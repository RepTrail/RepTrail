'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addOperationalCost, deleteOperationalCost } from '@/actions/admin-actions'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

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

export function OperationalCosts({ initialCosts, totalMonthly, totalAllTime }: OperationalCostsProps) {
    const { toast } = useToast()
    const [costs, setCosts] = useState<OperationalCost[]>(initialCosts)
    const [isOpen, setIsOpen] = useState(false)
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
            setIsOpen(false)
            setDescription('')
            setAmount('')
            setType('fixed')
            return { tempId }
        },
        onSuccess: () => {
            toast({ title: 'Sucesso', description: 'Custo adicionado localmente e sendo sincronizado.' })
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
        <Card className="mt-8 border-zinc-800 bg-zinc-900/40 backdrop-blur-sm">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/50 pb-6">
                <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2 text-zinc-100">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                        Custos Operacionais
                    </CardTitle>
                    <p className="text-sm text-zinc-400 mt-1">
                        Gerencie os custos de infraestrutura e operação da plataforma.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center w-full sm:w-auto">
                    <div className="flex items-center px-6 h-12 bg-zinc-900/60 rounded-full border border-zinc-800">
                        <p className="text-base font-black text-red-400 italic tabular-nums">R$ {totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                             <Button variant="outline" className="h-12 gap-2 border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 min-w-[140px] rounded-full px-8 font-black uppercase italic tracking-wide transition-all active:scale-95">
                                <Plus className="h-4 w-4" />
                                Adicionar Custo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                            <DialogHeader>
                                <DialogTitle>Adicionar Custo Operacional</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Descrição</Label>
                                    <Input
                                        placeholder="Ex: Servidor, Domínio, Marketing..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-red-500/20"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Valor (R$)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={amount}
                                            onChange={e => setAmount(e.target.value)}
                                            className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-red-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-300">Tipo</Label>
                                        <Select value={type} onValueChange={(v: any) => setType(v)}>
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                                <SelectItem value="fixed">Fixo</SelectItem>
                                                <SelectItem value="variable">Variável</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white border-0" onClick={handleAddCost}>
                                    Salvar Custo
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm text-left text-zinc-400">
                        <thead className="text-xs uppercase bg-zinc-900/30 text-zinc-500 font-medium border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4">Descrição</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {costs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <TrendingDown className="h-8 w-8 opacity-20" />
                                            <p>Nenhum custo registrado este mês.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                costs.map((cost) => (
                                    <tr key={cost.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-200">{cost.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cost.type === 'fixed'
                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                }`}>
                                                {cost.type === 'fixed' ? 'Fixo' : 'Variável'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">{new Date(cost.created_at).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4 text-right font-medium text-red-400">
                                            - R$ {Number(cost.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(cost.id)}
                                                className="text-zinc-500 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-md"
                                                title="Remover custo"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
