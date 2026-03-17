
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Search, Mail, Wallet, Activity, ArrowUpRight, AlertCircle, CheckCircle, Zap, Sparkles, Crown, BedDouble, Plus } from 'lucide-react'
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
import { createStudent } from '@/actions/trainer-actions'
import { CopyInviteButton } from '@/components/feature/trainer/copy-invite-button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { getTrainerRanking } from '@/actions/trainer-actions'

export default async function StudentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('trainer_code, plan_tier, rating, full_name, avatar_url')
        .eq('id', user?.id)
        .single()

    // Tier Limits
    // Tier Limits
    const currentTier = (profile?.plan_tier as 'on_demand' | 'start' | 'pro' | 'elite') || 'on_demand'
    const TIER_LIMITS = {
        on_demand: 5, // Based on your previous DB seeds or business logic
        start: 10,
        pro: 50,
        elite: Infinity
    }
    const limit = TIER_LIMITS[currentTier] || 5
    const limitDisplay = limit === Infinity ? '∞' : limit

    // Tier Badge Styling
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

    // Ranking Logic
    const fullRanking = await getTrainerRanking()
    const userRankIndex = fullRanking.findIndex((t: any) => t.id === user?.id)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const { data: students } = await supabase
        .from('trainer_students')
        .select(`
            *,
            student:profiles!student_id(full_name, email, avatar_url, last_seen_at)
        `)
        .eq('trainer_id', user?.id)
        .order('created_at', { ascending: false })

    const totalStudents = students?.length || 0
    const activeStudents = students?.filter(s => s.active).length || 0
    const totalRevenue = students?.filter(s => s.active).reduce((acc, curr) => acc + (Number(curr.monthly_fee) || 0), 0) || 0

    function getDaysSinceActivity(lastSeen: string | null): number | null {
        if (!lastSeen) return null
        const diffMs = Date.now() - new Date(lastSeen).getTime()
        return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
    }

    function isLazyStudent(lastSeen: string | null, joinedAt: string): boolean {
        const days = getDaysSinceActivity(lastSeen)
        if (days === null) {
            const joinedDays = Math.floor((Date.now() - new Date(joinedAt).getTime()) / (1000 * 60 * 60 * 24))
            return joinedDays >= 7
        }
        return days >= 7
    }

    function formatLastSeen(lastSeen: string | null): string {
        if (!lastSeen) return 'Nunca'
        const diffMs = Date.now() - new Date(lastSeen).getTime()
        const mins = Math.floor(diffMs / 60000)
        const hours = Math.floor(mins / 60)
        const days = Math.floor(hours / 24)

        if (mins < 1) return 'Agora'
        if (mins < 60) return `${mins}m atrás`
        if (hours < 24) return `${hours}h atrás`
        if (days < 7) return `${days}d atrás`
        return new Date(lastSeen).toLocaleDateString('pt-BR')
    }

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
                        description="O aluno deve possuir uma conta no RepTrail. Insira o email abaixo."
                        trigger={
                            <Button variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/30 hover:border-emerald-500/50 hover:text-emerald-400 rounded-xl font-bold h-11 px-6 gap-2 transition-all duration-200 w-full sm:w-auto shadow-lg shadow-emerald-500/10">
                                <Plus className="w-4 h-4" /> Vincular Aluno
                            </Button>
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
                    value={activeStudents}
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
                                className="bg-zinc-900 border border-zinc-800 rounded-xl h-9 pl-9 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all w-48 md:w-64"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {students && students.length > 0 ? (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-zinc-900/30">
                                        <TableRow className="border-zinc-900 hover:bg-transparent">
                                            <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12">Aluno</TableHead>
                                            <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12">Contato</TableHead>
                                            <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12">Mensalidade</TableHead>
                                            <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12">Status</TableHead>
                                            <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] h-12 text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {students.map((item: any) => (
                                            <TableRow key={item.id} className="border-zinc-900 hover:bg-zinc-900/20 transition-colors group">
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3 pb-4">
                                                        <div className="relative">
                                                            <Avatar className="h-9 w-9 border border-zinc-800">
                                                                <AvatarImage src={item.student?.avatar_url} />
                                                                <AvatarFallback className="bg-zinc-900 text-zinc-400 font-bold text-xs uppercase">
                                                                    {item.student?.full_name?.substring(0, 2) || 'AL'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {item.active && item.student_id && isLazyStudent(item.student?.last_seen_at, item.created_at) && (
                                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[10px] shadow-lg animate-in zoom-in duration-500 hover:scale-110 transition-transform cursor-help" title="Modo Ilha: Sem atividade há mais de 7 dias">
                                                                    🏝️
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-zinc-100 group-hover:text-white transition-colors">
                                                                {item.student?.full_name || 'Sem nome'}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-600 font-medium">Desde {new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                                                            <Mail className="w-3 h-3 text-zinc-600" />
                                                            {item.student?.email}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                                            Visto: {formatLastSeen(item.student?.last_seen_at)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="text-sm font-bold text-zinc-200">
                                                        R$ {Number(item.monthly_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col gap-2">
                                                        <div className={`
                                                            inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                                            ${item.active
                                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                                : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}
                                                        `}>
                                                            {item.active ? 'Ativo' : 'Inativo'}
                                                        </div>

                                                        {(() => {
                                                            const today = new Date().getDate()
                                                            const paymentDay = item.payment_day
                                                            const lastPayment = item.last_payment_date
                                                            const isPaidThisMonth = lastPayment &&
                                                                new Date(lastPayment).getMonth() === new Date().getMonth() &&
                                                                new Date(lastPayment).getFullYear() === new Date().getFullYear()

                                                            if (isPaidThisMonth) {
                                                                return (
                                                                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center w-fit">
                                                                        <CheckCircle className="w-2.5 h-2.5" /> Pago
                                                                    </Badge>
                                                                )
                                                            }

                                                            if (!paymentDay) return null

                                                            if (today === paymentDay) {
                                                                return (
                                                                    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center w-fit">
                                                                        <AlertCircle className="w-2.5 h-2.5" /> Hoje
                                                                    </Badge>
                                                                )
                                                            } else if (today > paymentDay) {
                                                                return (
                                                                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center animate-pulse w-fit">
                                                                        <AlertCircle className="w-2.5 h-2.5" /> Atrasado
                                                                    </Badge>
                                                                )
                                                            }
                                                            return null
                                                        })()}
                                                        {/* Lazy badge desktop */}
                                                        {item.active && item.student_id && isLazyStudent(item.student?.last_seen_at, item.created_at) && (
                                                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[9px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center w-fit shadow-sm shadow-orange-500/10" title={`Sem atividade há ${getDaysSinceActivity(item.student?.last_seen_at) ?? '7+'} dias`}>
                                                                <BedDouble className="w-2.5 h-2.5" /> Modo Ilha
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-right">
                                                    <Button asChild variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 h-9 rounded-xl gap-2 px-4">
                                                        <Link href={`/dashboard/trainer/students/${item.id}`}>
                                                            Perfil
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-zinc-900">
                                {students.map((item: any) => {
                                    const today = new Date().getDate()
                                    const paymentDay = item.payment_day
                                    const lastPayment = item.last_payment_date
                                    const isPaidThisMonth = lastPayment &&
                                        new Date(lastPayment).getMonth() === new Date().getMonth() &&
                                        new Date(lastPayment).getFullYear() === new Date().getFullYear()
                                    const isLate = paymentDay && today > paymentDay && !isPaidThisMonth

                                    return (
                                        <div key={item.id} className="p-4 space-y-4 hover:bg-zinc-900/20 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 pb-4">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10 border border-zinc-800 group-hover:scale-105 transition-transform">
                                                            <AvatarImage src={item.student?.avatar_url} />
                                                            <AvatarFallback className="bg-zinc-900 text-zinc-400 font-bold text-xs uppercase">
                                                                {item.student?.full_name?.substring(0, 2) || 'AL'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {item.active && item.student_id && isLazyStudent(item.student?.last_seen_at, item.created_at) && (
                                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-300 rounded-full border-2 border-zinc-950 flex items-center justify-center text-[10px] shadow-lg animate-bounce duration-[3s]">
                                                                🏝️
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm text-zinc-100 group-hover:text-orange-500 transition-colors">{item.student?.full_name}</span>
                                                        <span className="text-[10px] text-zinc-600 font-medium">Desde {new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                                                    </div>
                                                </div>
                                                <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                                    <Link href={`/dashboard/trainer/students/${item.id}`}>
                                                        <ArrowUpRight className="h-4 w-4 text-zinc-500" />
                                                    </Link>
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Financeiro</p>
                                                    <p className="text-xs font-bold text-zinc-300">R$ {Number(item.monthly_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                                </div>
                                                <div className="space-y-1 flex flex-col items-end">
                                                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Status</p>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className={`
                                                            inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border
                                                            ${item.active ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}
                                                        `}>
                                                            {item.active ? 'Ativo' : 'Inativo'}
                                                        </div>
                                                        {isPaidThisMonth ? (
                                                            <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center">
                                                                <CheckCircle className="w-2 h-2" /> Pago
                                                            </Badge>
                                                        ) : isLate ? (
                                                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center animate-pulse">
                                                                <AlertCircle className="w-2 h-2" /> Atrasado
                                                            </Badge>
                                                        ) : paymentDay === today ? (
                                                            <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center">
                                                                <AlertCircle className="w-2 h-2" /> Hoje
                                                            </Badge>
                                                        ) : null}
                                                        {/* Lazy badge mobile */}
                                                        {item.active && item.student_id && isLazyStudent(item.student?.last_seen_at, item.created_at) && (
                                                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full flex gap-1 items-center shadow-sm shadow-orange-500/5">
                                                                <BedDouble className="w-2 h-2" /> Modo Ilha
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="p-4 bg-zinc-900/50 rounded-full border border-zinc-800">
                                <Users className="h-8 w-8 text-zinc-800" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-zinc-400 font-medium">Nenhum aluno encontrado</p>
                                <p className="text-zinc-600 text-xs max-w-[280px]">
                                    Use o botão "Vincular Aluno" ou compartilhe seu link de convite para começar.
                                </p>
                            </div>
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
                        <span className="text-xl font-black text-white">{value}</span>

                        {total !== undefined && (
                            <span className="text-xs text-zinc-600 font-bold">/ {total}</span>
                        )}
                    </div>
                    {secondaryIcon && (
                        <div>
                            {secondaryIcon}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
