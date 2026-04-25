'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerStudents, getTrainerProfile, getTrainerRanking } from '@/actions/trainer-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
    Users, 
    Search, 
    Mail, 
    Wallet, 
    Activity, 
    ArrowUpRight, 
    AlertCircle, 
    CheckCircle, 
    Zap, 
    Sparkles, 
    Crown, 
    BedDouble, 
    Plus,
    UserMinus
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { PillButton } from '@/components/ui/pill-button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StudentPrefetchLink } from './student-prefetch-link'
import { CopyInviteButton } from './copy-invite-button'
import Link from 'next/link'
import { useState } from 'react'

interface TrainerStudentsClientProps {
    userId: string
}

export function TrainerStudentsClient({ userId }: TrainerStudentsClientProps) {
    const [search, setSearch] = useState('')

    // ─── Queries ──────────────────────────────────────────────────────────
    const { data: students = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.students(userId),
        queryFn: () => getTrainerStudents(),
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.profile.detail(userId),
        queryFn: getTrainerProfile,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: fullRanking = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.ranking(),
        queryFn: getTrainerRanking,
        staleTime: 0,
        refetchOnMount: 'always'
    })

    // ─── Metrics ──────────────────────────────────────────────────────────
    const currentTier = (profile?.plan_tier as 'on_demand' | 'start' | 'pro' | 'elite') || 'on_demand'
    const TIER_LIMITS = {
        on_demand: 5,
        start: 10,
        pro: 50,
        elite: Infinity
    }
    const limit = TIER_LIMITS[currentTier] || 5
    const limitDisplay = limit === Infinity ? '∞' : limit

    const userRankIndex = fullRanking.findIndex((t: any) => t.id === userId)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const activeStudentsCount = students.filter((s: any) => s.active).length
    const totalRevenue = students.filter((s: any) => s.active).reduce((acc: number, curr: any) => acc + (Number(curr.monthly_fee) || 0), 0)

    const filteredStudents = students.filter((s: any) => 
        s.active && (
            (s.student?.full_name?.toLowerCase().includes(search.toLowerCase())) ||
            (s.student?.email?.toLowerCase().includes(search.toLowerCase()))
        )
    )

    // Tier Styling
    const tierColors = {
        on_demand: 'text-zinc-500',
        start: 'text-blue-500',
        pro: 'text-orange-500',
        elite: 'text-orange-500'
    }
    const tierIcons = {
        on_demand: Activity,
        start: Zap,
        pro: Sparkles,
        elite: Crown
    }
    const TierIcon = tierIcons[currentTier] || Activity
    const tierColor = tierColors[currentTier] || 'text-zinc-500'

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2 sm:space-y-5">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Meus Alunos
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerenciamento básico e financeiro dos seus alunos vinculados.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pb-4">
                    <CopyInviteButton trainerCode={profile?.trainer_code || ''} className="w-full sm:w-auto" />
                    <UnifiedCreationDialog
                        title="Vincular Novo Aluno"
                        description="Insira o email que o aluno usará para criar a conta e sincronizar os dados. O email pode ser provisório e alterado depois."
                        trigger={
                            <PillButton variant="emerald" className="w-full sm:w-auto shadow-lg shadow-emerald-500/10">
                                <Plus className="w-4 h-4" /> Vincular Aluno
                            </PillButton>
                        }
                        fields={[
                            { name: 'email', label: 'Email da Conta', placeholder: 'ex: aluno@email.com', type: 'text', required: true },
                            { name: 'monthlyFee', label: 'Valor da Mensalidade (R$)', placeholder: '0.00', type: 'number', required: false }
                        ]}
                        actionType="create-student"
                        successMessage="Aluno vinculado com sucesso!"
                        footerLabel="Finalizar Vínculo"
                    />
                </div>
            </div>

            {/* Metrics Mini-Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <MetricSmall
                    label="Alunos Ativos"
                    value={activeStudentsCount}
                    total={limitDisplay}
                    icon={<Users className="w-4 h-4 text-zinc-500" />}
                />
                <MetricSmall
                    label="Receita Mensal"
                    value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    icon={<Wallet className="w-4 h-4 text-zinc-500" />}
                />
                <MetricSmall
                    label="Ranking Geral"
                    value={`${userRank}º`}
                    icon={<Activity className="w-4 h-4 text-zinc-500" />}
                    secondaryIcon={<TierIcon className={`w-5 h-5 ${tierColor}`} />}
                />
            </div>

            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden border-t-zinc-700/50">
                <CardHeader className="bg-zinc-900/10 border-b border-zinc-900/50 px-6 py-4 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                            <Users className="w-4 h-4 text-zinc-500" />
                            Lista da Matrícula
                        </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-hover:text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Buscar aluno..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl h-9 pl-9 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all w-48 md:w-64"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredStudents.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-zinc-900/30">
                                    <TableRow className="border-zinc-900 hover:bg-transparent">
                                        <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12">Aluno</TableHead>
                                        <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12 hidden md:table-cell">Contato</TableHead>
                                        <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12">Financeiro</TableHead>
                                        <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12 text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((item: any, index: number) => {
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

                                        return (
                                            <TableRow key={item.id} className="border-zinc-900 hover:bg-zinc-900/20 transition-colors group">
                                                <TableCell className="py-4">
                                                    <StudentPrefetchLink 
                                                        relationshipId={item.id} 
                                                        studentId={item.student_id} 
                                                        href={`/dashboard/trainer/students/${item.id}`}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <Avatar className="h-9 w-9 border border-zinc-800">
                                                            <AvatarImage src={item.student?.avatar_url} />
                                                            <AvatarFallback className="bg-zinc-900 text-zinc-400 font-bold text-xs uppercase">
                                                                {item.student?.full_name?.substring(0, 2) || 'AL'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-zinc-100 group-hover:text-white transition-colors">
                                                                {item.student?.full_name || 'Sem nome'}
                                                            </span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {item.is_new && (
                                                                    <div className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                                        Pendente
                                                                    </div>
                                                                )}
                                                                {item.is_placeholder ? (
                                                                    <div className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                                        Aguardando Cadastro
                                                                    </div>
                                                                ) : (
                                                                    <div className={`
                                                                        inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border
                                                                        ${item.active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}
                                                                    `}>
                                                                        {item.active ? 'Ativo' : 'Inativo'}
                                                                    </div>
                                                                )}
                                                                {paymentStatus === 'overdue' && !item.is_placeholder && (
                                                                    <div className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                                                                        Atrasado
                                                                    </div>
                                                                )}
                                                                {paymentStatus === 'due_today' && !item.is_placeholder && (
                                                                    <div className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                                        Vence Hoje
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </StudentPrefetchLink>
                                                </TableCell>
                                                <TableCell className="py-4 hidden md:table-cell">
                                                    <span className="text-xs text-zinc-400">{item.student?.email}</span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-bold text-zinc-200 italic">
                                                            R$ {Number(item.monthly_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                        </div>
                                                        {item.payment_day && (
                                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Dia {item.payment_day}</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-right">
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <Button 
                                                            id={index === 0 ? "tour-view-profile-0" : undefined}
                                                            asChild 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 h-9 rounded-xl gap-2 px-4 shadow-none"
                                                        >
                                                            <StudentPrefetchLink relationshipId={item.id} studentId={item.student_id} href={`/dashboard/trainer/students/${item.id}`}>
                                                                Perfil
                                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                                            </StudentPrefetchLink>
                                                        </Button>

                                                        {item.active && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                                                title="Desativar e Limpar Ficha"
                                                                onClick={async () => {
                                                                    if (confirm(`Tem certeza que deseja desativar ${item.student?.full_name}? Isso removerá todos os treinos, dietas e cardios atribuídos por você.`)) {
                                                                        const { deactivateAndPurgeStudent } = await import('@/actions/trainer-actions')
                                                                        const { useQueryClient } = await import('@tanstack/react-query')
                                                                        
                                                                        const result = await deactivateAndPurgeStudent(item.id, item.student_id)
                                                                        if (result.success) {
                                                                            // Force immediate UI update
                                                                            window.location.reload()
                                                                        }
                                                                    }
                                                                }}
                                                            >
                                                                <UserMinus className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}

                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <Users className="h-8 w-8 text-zinc-800" />
                            <p className="text-zinc-600 text-xs">Nenhum aluno encontrado.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function MetricSmall({ label, value, total, icon, secondaryIcon }: any) {
    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-xl flex items-center justify-between border-t-zinc-700/10">
            <div className="space-y-1 w-full">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    {icon}
                    {label}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-white italic">{value}</span>
                        {total !== undefined && (
                            <span className="text-xs text-zinc-600 font-bold">/ {total}</span>
                        )}
                    </div>
                    {secondaryIcon && <div>{secondaryIcon}</div>}
                </div>
            </div>
        </div>
    )
}
