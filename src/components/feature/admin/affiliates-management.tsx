'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { updateAffiliateCommission, reassignReferral, toggleAffiliateStatus } from '@/actions/admin-affiliate-actions'
import { Users, ArrowRightLeft, Save, UserPlus, Search, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AffiliatesManagementProps {
    initialAffiliates: any[]
    allUsers?: any[]
}

export function AffiliatesManagement({ initialAffiliates, allUsers = [] }: AffiliatesManagementProps) {
    const { toast } = useToast()
    const [affiliates, setAffiliates] = useState(initialAffiliates)
    const [loading, setLoading] = useState<string | null>(null)
    const [migrationLoading, setMigrationLoading] = useState(false)

    // Add Affiliate Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [userSearch, setUserSearch] = useState('')
    const [addingUser, setAddingUser] = useState<string | null>(null)

    // Migration
    const [studentEmail, setStudentEmail] = useState('')
    const [newAffiliateToken, setNewAffiliateToken] = useState('')

    // Editing commission
    const [commissionDrafts, setCommissionDrafts] = useState<Record<string, number>>({})

    const handleCommissionChange = (id: string, val: string) => {
        setCommissionDrafts(prev => ({ ...prev, [id]: parseFloat(val) }))
    }

    const saveCommission = async (affiliateId: string) => {
        const rate = commissionDrafts[affiliateId]
        if (rate === undefined || isNaN(rate)) return

        setLoading(affiliateId)
        try {
            const res = await updateAffiliateCommission(affiliateId, rate)
            if (res.error) throw new Error(res.error)

            setAffiliates(prev => prev.map(a => a.id === affiliateId ? { ...a, commission_rate: rate } : a))
            setCommissionDrafts(prev => {
                const draft = { ...prev }
                delete draft[affiliateId]
                return draft
            })
            toast({ title: 'Comissão atualizada!' })
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message })
        } finally {
            setLoading(null)
        }
    }

    const handleMigration = async (e: React.FormEvent) => {
        e.preventDefault()
        setMigrationLoading(true)
        try {
            const res = await reassignReferral(studentEmail, newAffiliateToken || null)
            if (res.error) throw new Error(res.error)

            toast({ title: 'Aluno movido com sucesso!', description: `Novo afiliado atribuído: ${newAffiliateToken || 'Nenhum'}` })
            setStudentEmail('')
            setNewAffiliateToken('')
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Erro na migração', description: e.message })
        } finally {
            setMigrationLoading(false)
        }
    }

    const handleAddAffiliate = async (userId: string) => {
        setAddingUser(userId)
        try {
            const res = await toggleAffiliateStatus(userId, true)
            if (res.error) throw new Error(res.error)

            toast({ title: 'Afiliado adicionado com sucesso!' })
            setIsAddModalOpen(false)
            window.location.reload()
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message })
        } finally {
            setAddingUser(null)
        }
    }

    const handleRemoveAffiliate = async (userId: string) => {
        if (!confirm('Remover status de afiliado? Isso removerá o acesso ao painel de afiliado.')) return
        setLoading(userId)
        try {
            const res = await toggleAffiliateStatus(userId, false)
            if (res.error) throw new Error(res.error)
            setAffiliates(prev => prev.filter(a => a.id !== userId))
            toast({ title: 'Afiliado removido!' })
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message })
        } finally {
            setLoading(null)
        }
    }

    // Filter users for modal (exclude already affiliates)
    const usersList = allUsers
        .filter(u => !affiliates.some(a => a.id === u.id)) // Filter out existing affiliates
        .filter(u =>
            !userSearch ||
            u.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(userSearch.toLowerCase())
        )
        .slice(0, 10)

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-500" />
                        Gestão de Afiliados
                    </h2>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                        Adicione afiliados, ajuste comissões e migre indicações.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase text-xs tracking-wide rounded-xl h-10 px-4 gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Novo Afiliado
                </Button>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-950/50 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Afiliado</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Cadastro</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Indicações</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Receita</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Comissão</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Rate %</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {affiliates.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-xs font-bold text-zinc-600 uppercase">
                                        Nenhum afiliado ativo. Clique em "Novo Afiliado" para adicionar.
                                    </td>
                                </tr>
                            ) : affiliates.map((affiliate) => {
                                const isEditing = commissionDrafts[affiliate.id] !== undefined
                                const currentRate = isEditing ? commissionDrafts[affiliate.id] : (affiliate.commission_rate ?? 10)
                                const hasChanges = isEditing && currentRate !== (affiliate.commission_rate ?? 10)

                                return (
                                    <tr key={affiliate.id} className="hover:bg-zinc-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white">{affiliate.full_name || 'Sem Nome'}</span>
                                                <span className="text-[10px] font-bold text-zinc-500">{affiliate.email}</span>
                                                <Badge variant="outline" className="w-fit mt-1.5 border-zinc-700 text-zinc-400 text-[9px] font-mono h-5 px-1.5">
                                                    {affiliate.affiliate_token}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-[10px] font-bold text-zinc-500">
                                                {new Date(affiliate.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <span className="text-xs font-black text-white">{affiliate.total_referrals || 0}</span>
                                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                                                    {affiliate.active_referrals || 0} ativos
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-black text-zinc-300">R$ {Number(affiliate.revenue_generated || 0).toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-emerald-400">R$ {Number(affiliate.monthly_commission || 0).toFixed(2)}</span>
                                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wide">Estimado</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        value={currentRate}
                                                        onChange={(e) => handleCommissionChange(affiliate.id, e.target.value)}
                                                        className="w-16 h-8 pl-2 pr-6 bg-zinc-950 border-zinc-800 rounded-lg text-center text-xs font-black text-white focus:border-amber-500 focus:ring-0"
                                                    />
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-500">%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {hasChanges && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => saveCommission(affiliate.id)}
                                                        disabled={loading === affiliate.id}
                                                        className="h-8 bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase text-[9px] tracking-widest rounded-lg"
                                                    >
                                                        <Save className="w-3 h-3 mr-1.5" />
                                                        Salvar
                                                    </Button>
                                                )}
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleRemoveAffiliate(affiliate.id)}
                                                    className="h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-zinc-200 text-sm font-black uppercase tracking-wide">
                        <ArrowRightLeft className="w-4 h-4 text-amber-500" />
                        Migração de Indicação
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleMigration} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="student-email" className="text-zinc-400 text-xs font-bold uppercase">Email do Aluno</Label>
                            <Input
                                id="student-email"
                                placeholder="aluno@exemplo.com"
                                value={studentEmail}
                                onChange={e => setStudentEmail(e.target.value)}
                                className="bg-zinc-950 border-zinc-700 text-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-token" className="text-zinc-400 text-xs font-bold uppercase">Novo Token</Label>
                            <Input
                                id="new-token"
                                placeholder="Token do Afiliado"
                                value={newAffiliateToken}
                                onChange={e => setNewAffiliateToken(e.target.value)}
                                className="bg-zinc-950 border-zinc-700 text-white"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={migrationLoading}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-10"
                        >
                            {migrationLoading ? 'Movendo...' : 'Mover Aluno'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black italic uppercase">Novo Afiliado</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                placeholder="Buscar usuário por nome ou email..."
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="pl-9 bg-zinc-900 border-zinc-800 focus:border-emerald-500 text-white"
                            />
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {usersList.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg hover:bg-zinc-900 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8 rounded-lg border border-zinc-800">
                                            <AvatarImage src={u.avatar_url} />
                                            <AvatarFallback className="bg-zinc-950 text-zinc-500 text-xs font-black rounded-lg">
                                                {u.full_name?.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase">{u.full_name}</p>
                                            <p className="text-[10px] text-zinc-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleAddAffiliate(u.id)}
                                        disabled={addingUser === u.id}
                                        className="h-7 bg-zinc-800 hover:bg-emerald-500/20 text-emerald-500 hover:text-emerald-400 font-black uppercase text-[9px] tracking-wide rounded-md"
                                    >
                                        {addingUser === u.id ? '...' : 'Adicionar'}
                                    </Button>
                                </div>
                            ))}
                            {usersList.length === 0 && (
                                <p className="text-center text-zinc-600 text-[10px] font-bold uppercase py-4">Nenhum usuário encontrado</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
