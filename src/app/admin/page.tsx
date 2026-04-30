'use client'

import { useState, useEffect, useTransition } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import {
    getAdminOverview, getAllTrainers, getAllUsers,
    updateUserPlanTier, toggleEliteStatus, grantEliteTrial, toggleBillingExemption,
    impersonateUser,
    getAllStoreProducts, toggleProductStatus, addStoreProduct, updateStoreProduct, deleteStoreProduct, fetchProductFromUrl,
    getAdminLogs, getTopProductsByClicks, getRecentStudentActivity,
    getPlanPricing, updatePlanPricing, deleteUser, grantAutoTraining,
    getOperationalCosts, repairWorkoutExercisesData, repairBiSets
} from '@/actions/admin-actions'
import { getAdminAffiliates, getAdminPayouts } from '@/actions/admin-affiliate-actions'
import { AffiliatesManagement } from '@/components/feature/admin/affiliates-management'
import { PayoutsManagement } from '@/components/feature/admin/payouts-management'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    BarChart3, Users, CreditCard, ShoppingBag, TrendingUp,
    ArrowUpRight, Users2, Settings, Package, Trophy,
    Shield, Star, Eye, EyeOff, Plus, ChevronDown,
    Activity, Zap, Crown, AlertCircle, Check, X,
    Search, Filter, RefreshCw, ExternalLink, Clock, Layers, Pencil, Save, Wrench, Key, Trash2, HeartHandshake, AlertTriangle
} from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { Logo } from '@/components/ui/logo'
import { OperationalCosts } from '@/components/feature/admin/operational-costs'
import { UnifiedSidebar } from '@/components/layout/sidebar-unified'
import { createClient } from '@/lib/supabase/client'

type Tab = 'overview' | 'trainers' | 'students' | 'affiliates' | 'store' | 'logs'

export default function AdminDashboardPage() {
    const queryClient = useQueryClient()
    const [tab, setTab] = useState<Tab>('overview')
    const [search, setSearch] = useState('')
    const [productModalOpen, setProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    // ─── Queries ─────────────────────────────────────────────────────────────
    const { data: stats } = useQuery({ queryKey: QUERY_KEYS.admin.overview, queryFn: () => getAdminOverview() })
    const { data: trainers = [], isLoading: loadingTrainers } = useQuery({ queryKey: QUERY_KEYS.admin.trainers, queryFn: () => getAllTrainers() })
    const { data: students = [], isLoading: loadingStudents } = useQuery({ queryKey: QUERY_KEYS.admin.students, queryFn: () => getAllUsers() })
    const { data: affiliatesData } = useQuery({ queryKey: QUERY_KEYS.admin.affiliates, queryFn: () => getAdminAffiliates() })
    const { data: payoutsData } = useQuery({ queryKey: QUERY_KEYS.admin.payouts, queryFn: () => getAdminPayouts() })
    const { data: products = [], isLoading: loadingProducts } = useQuery({ queryKey: QUERY_KEYS.store.products, queryFn: () => getAllStoreProducts() })
    const { data: logs = [] } = useQuery({ queryKey: QUERY_KEYS.admin.logs, queryFn: () => getAdminLogs() })
    const { data: topProducts = [] } = useQuery({ queryKey: QUERY_KEYS.store.clicks, queryFn: () => getTopProductsByClicks() })
    const { data: activityFeed = [] } = useQuery({ queryKey: QUERY_KEYS.admin.activity, queryFn: () => getRecentStudentActivity() })
    const { data: operationalCosts = [] } = useQuery({ queryKey: QUERY_KEYS.admin.costs, queryFn: () => getOperationalCosts() })

    const { data: adminUser } = useQuery({
        queryKey: QUERY_KEYS.auth.user,
        queryFn: async () => {
            const supabase = createClient()
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (!authUser) return null
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
            return profile || authUser
        }
    })

    const affiliates = affiliatesData?.data || []
    const payouts = payoutsData?.data || []
    const loading = loadingTrainers || loadingStudents || loadingProducts

    async function loadAll() {
        startTransition(async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.students }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.affiliates }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.payouts }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.costs }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.activity }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.logs }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products }),
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.clicks })
            ])
            toast({ title: 'Dados atualizados!' })
        })
    }

    async function handlePlanChange(userId: string, plan: string) {
        startTransition(async () => {
            const res = /* ❌ OUTBOX VIOLATION */ await updateUserPlanTier(userId, plan)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: 'Plano atualizado!' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
            }
        })
    }

    async function handleEliteToggle(userId: string, current: boolean) {
        startTransition(async () => {
            const res = /* ❌ OUTBOX VIOLATION */ await toggleEliteStatus(userId, !current)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: !current ? 'Elite ativado!' : 'Elite removido' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
            }
        })
    }

    async function handleExemptToggle(userId: string, current: boolean) {
        startTransition(async () => {
            const res = /* ❌ OUTBOX VIOLATION */ await toggleBillingExemption(userId, !current)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: !current ? 'Isenção ativada!' : 'Isenção removida' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
            }
        })
    }

    async function handleEliteTrial(userId: string) {
        startTransition(async () => {
            const res = await grantEliteTrial(userId)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: 'Elite trial (15 dias) concedido!' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
            }
        })
    }

    async function handleImpersonate(userId: string) {
        startTransition(async () => {
            const res = await impersonateUser(userId)
            if (res?.error) toast({ variant: 'destructive', title: 'Erro ao inspecionar', description: res.error })
        })
    }

    async function handleDeleteUser(userId: string, userName: string, isTrainer: boolean) {
        if (!confirm(`Tem certeza que deseja deletar ${userName}?\n\nEsta ação é IRREVERSÍVEL e vai:\n- Deletar todos os dados do usuário\n- Deletar o login e autenticação\n- Deletar todas as relações e dados relacionados`)) {
            return
        }

        startTransition(async () => {
            const res = /* ❌ OUTBOX VIOLATION */ await deleteUser(userId)
            if (res.error) {
                toast({ variant: 'destructive', title: 'Erro', description: res.error })
            } else {
                if (res.warning) {
                    toast({
                        variant: 'default',
                        title: 'Usuário deletado parcialmente',
                        description: res.warning
                    })
                } else {
                    toast({ title: 'Usuário deletado com sucesso!' })
                }
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.trainers })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.students })
            }
        })
    }

    async function handleProductToggle(productId: string, current: boolean) {
        startTransition(async () => {
            const res = /* ❌ OUTBOX VIOLATION */ await toggleProductStatus(productId, !current)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: !current ? 'Produto ativado!' : 'Produto desativado' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products })
            }
        })
    }

    async function handleDeleteProduct(productId: string) {
        if (!confirm('Tem certeza que deseja remover este produto? A ação é irreversível.')) return false
        startTransition(async () => {
            const res = /* ❌ OUTBOX VIOLATION */ await deleteStoreProduct(productId)
            if (res.error) toast({ title: 'Erro ao deletar', description: res.error, variant: 'destructive' })
            else {
                toast({ title: 'Produto removido com sucesso!', className: 'bg-emerald-500 border-none text-white' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products })
            }
        })
        return true
    }

    async function handleRepairData() {
        if (!confirm('Deseja iniciar a limpeza dos dados de treino? Isso removerá textos desnecessários dos campos de repetições (ex: "X movimentos" -> "X").')) return
        startTransition(async () => {
            const res = await repairWorkoutExercisesData()
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: 'Sucesso!', description: res.message })
                loadAll()
            }
        })
    }

    async function handleRepairBiSets() {
        if (!confirm('Deseja reparar Bi-sets? Isso vai:\n1. Mesclar exercícios seguidos com 0 de descanso\n2. Corrigir histórico antigo para aparecer no novo player\n\nEsta ação modifica treinos e histórico.')) return
        startTransition(async () => {
            const res = await repairBiSets()
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: 'Sucesso!', description: res.message, className: 'bg-emerald-500 border-none text-white' })
                loadAll()
            }
        })
    }

    async function handleGrantAutoTraining(studentId: string, currentStatus: string) {
        const newStatus = currentStatus === 'active' ? 'none' : 'active'
        startTransition(async () => {
            const res = await grantAutoTraining(studentId, newStatus)
            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: res.error })
            else {
                toast({ title: newStatus === 'active' ? 'Auto-Treino concedido!' : 'Auto-Treino removido' })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.students })
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.overview })
            }
        })
    }

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
        { id: 'trainers', label: 'Personais', icon: Users2 },
        { id: 'students', label: 'Alunos', icon: Users },
        { id: 'affiliates', label: 'Afiliados', icon: HeartHandshake },
        { id: 'store', label: 'Loja', icon: ShoppingBag },
        { id: 'logs', label: 'Logs', icon: Activity },
    ]

    if (loading) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <div className="space-y-4 text-center">
                <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Carregando painel...</p>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
            <UnifiedSidebar
                brandColor="red"
                logoColor="red"
                user={{
                    id: adminUser?.id || 'admin',
                    name: adminUser?.full_name || "Admin RepTrail",
                    email: adminUser?.email || "admin@reptrail.com.br",
                    avatar_url: adminUser?.avatar_url || null
                }}
                links={tabs.map(t => ({
                    label: t.label,
                    icon: <t.icon className="w-4 h-4" />,
                    onClick: () => {
                        setTab(t.id)
                        const main = document.getElementById('admin-main')
                        if (main) main.scrollTo({ top: 0, behavior: 'smooth' })
                    },
                    isActive: tab === t.id
                }))}
                showSettings={false}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent" id="admin-main">
                    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900">
                        <div className="flex items-center justify-between px-4 sm:px-8 h-14 sm:h-16">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                    <Shield className="w-3 h-3 text-red-500" />
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Super Admin</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={loadAll}
                                    variant="ghost"
                                    className="h-9 px-3 text-zinc-500 hover:text-white gap-2 border border-transparent hover:border-zinc-800 hover:bg-white/5 transition-all"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Atualizar Painel</span>
                                </Button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-4 sm:p-8 space-y-6 sm:space-y-8 pb-24 md:pb-8">
                        {/* Page Header */}
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-black text-white italic uppercase tracking-tighter">
                                {tabs.find(t => t.id === tab)?.label}
                            </h1>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
                                Painel de Controle RepTrail
                            </p>
                        </div>

                        {/* OVERVIEW TAB */}
                        {tab === 'overview' && (
                            <div className="space-y-8">
                                {/* Stats Grid */}
                                {/* Stats Grid */}
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* PLATFORM REVENUE */}
                                    <StatCard
                                        label="Lucro Líquido (Plataforma)"
                                        value={`R$ ${Number(stats?.monthlyPlatformProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        sub={`Bruto: R$ ${Number(stats?.monthlyGrossRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Custos: R$ ${Number(stats?.monthlyOperationalCosts || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-500/10"
                                    />
                                    <StatCard
                                        label="Faturamento Personais"
                                        value={`R$ ${Number(stats?.monthlyTrainerVolume || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        sub={`Médio: R$ ${Number(stats?.trainerAverageTicket || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / personal`}
                                        icon={CreditCard} color="text-blue-500" bg="bg-blue-500/10"
                                    />
                                    <StatCard
                                        label="Ticket Médio (RepTrail)"
                                        value={`R$ ${Number(stats?.platformTicketPerTrainer || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        sub="por personal cadastrado"
                                        icon={Activity} color="text-amber-500" bg="bg-amber-500/10"
                                    />
                                    <StatCard
                                        label="Comissões Pendentes"
                                        value={`R$ ${Number(stats?.pendingCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        sub={`Este mês: R$ ${Number(stats?.commissionsThisMonth || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        icon={AlertCircle} color="text-red-500" bg="bg-red-500/10"
                                    />

                                    {/* COUNTS & AFFILIATES */}
                                    <StatCard
                                        label="Afiliados"
                                        value={stats?.affiliatesCount || 0}
                                        sub={`Lucro Total: R$ ${Number(stats?.affiliateTotalEarnings || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        icon={HeartHandshake} color="text-purple-500" bg="bg-purple-500/10"
                                    />
                                    <StatCard
                                        label="Personais"
                                        value={stats?.trainers || 0}
                                        sub={`${stats?.trialTrainers || 0} em período de teste`}
                                        icon={Users2} color="text-indigo-500" bg="bg-indigo-500/10"
                                    />
                                    <StatCard
                                        label="Alunos"
                                        value={stats?.students || 0}
                                        sub={`${stats?.studentsWithTrainer || 0} com personal | ${stats?.autoTrainingCount || 0} auto-treino | ${(stats?.students || 0) - (stats?.studentsWithTrainer || 0) - (stats?.autoTrainingCount || 0)} avulsos`}
                                        icon={Users} color="text-cyan-500" bg="bg-cyan-500/10"
                                    />
                                    <StatCard
                                        label="Produtos Loja"
                                        value={stats?.totalProducts || 0}
                                        sub={`${stats?.productClicks || 0} cliques totais`}
                                        icon={ShoppingBag} color="text-pink-500" bg="bg-pink-500/10"
                                    />
                                </div>

                                <OperationalCosts
                                    initialCosts={operationalCosts}
                                    totalMonthly={stats?.monthlyOperationalCosts || 0}
                                    totalAllTime={stats?.totalOperationalCosts || 0}
                                />

                                {/* Two columns */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                    {/* Top Products */}
                                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[2rem]">
                                        <CardHeader className="p-6 border-b border-zinc-800/50">
                                            <CardTitle className="text-sm font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                Produtos Mais Clicados
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-3">
                                            {topProducts.length === 0 ? (
                                                <p className="text-zinc-600 text-xs font-bold uppercase text-center py-8">Nenhum clique ainda</p>
                                            ) : topProducts.map((p, i) => (
                                                <div key={p.id} className="flex items-center gap-4 p-3 bg-zinc-950 rounded-xl">
                                                    <span className="text-[10px] font-black text-zinc-600 w-4">{i + 1}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-black text-white truncate">{p.name}</p>
                                                        <p className="text-[9px] font-bold text-zinc-600 uppercase">{p.category}</p>
                                                    </div>
                                                    <span className="text-xs font-black text-emerald-500">{p.clicks} cliques</span>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>

                                    {/* Student Activity Feed */}
                                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[2rem]">
                                        <CardHeader className="p-6 border-b border-zinc-800/50">
                                            <CardTitle className="text-sm font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-blue-500" />
                                                Atividade dos Alunos
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-2 max-h-80 overflow-y-auto">
                                            {activityFeed.length === 0 ? (
                                                <p className="text-zinc-600 text-xs font-bold uppercase text-center py-8">Nenhuma atividade registrada</p>
                                            ) : activityFeed.map((entry: any) => {
                                                const student = entry.student as any
                                                const workout = entry.workout as any
                                                const statusColor = entry.status === 'completed' ? 'text-emerald-500' : entry.status === 'in_progress' ? 'text-blue-500' : 'text-zinc-500'
                                                const statusLabel = entry.status === 'completed' ? 'Concluído' : entry.status === 'in_progress' ? 'Em progresso' : entry.status || '—'
                                                const timeAgo = (() => {
                                                    const diff = Date.now() - new Date(entry.created_at).getTime()
                                                    const mins = Math.floor(diff / 60000)
                                                    if (mins < 60) return `${mins}min atrás`
                                                    const hrs = Math.floor(mins / 60)
                                                    if (hrs < 24) return `${hrs}h atrás`
                                                    return `${Math.floor(hrs / 24)}d atrás`
                                                })()
                                                return (
                                                    <div key={entry.id} className="flex items-center gap-3 pb-4 p-3 bg-zinc-950 rounded-xl">
                                                        <Avatar className="w-8 h-8 shrink-0">
                                                            <AvatarImage src={student?.avatar_url} />
                                                            <AvatarFallback className="bg-zinc-800 text-zinc-500 text-[10px] font-black">
                                                                {student?.full_name?.substring(0, 2)?.toUpperCase() || '?'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] font-black text-white truncate">
                                                                {student?.full_name || 'Aluno'}
                                                            </p>
                                                            <p className="text-[9px] font-bold text-zinc-600 truncate">
                                                                {workout?.name || 'Treino'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0 space-y-0.5">
                                                            <p className={`text-[9px] font-black uppercase tracking-wide ${statusColor}`}>{statusLabel}</p>
                                                            <p className="text-[8px] font-bold text-zinc-700">{timeAgo}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* TRAINERS TAB */}
                        {tab === 'trainers' && (
                            <div className="space-y-6">
                                <SearchBar value={search} onChange={setSearch} placeholder="Buscar personal..." />
                                <div className="space-y-3">
                                    {trainers
                                        .filter(t => !search || t.full_name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase()))
                                        .map(trainer => (
                                            <TrainerRow
                                                key={trainer.id}
                                                trainer={trainer}
                                                onPlanChange={(plan: string) => handlePlanChange(trainer.id, plan)}
                                                onEliteToggle={() => handleEliteToggle(trainer.id, trainer.is_elite)}
                                                onExemptToggle={() => handleExemptToggle(trainer.id, trainer.is_billing_exempt)}
                                                onEliteTrial={() => handleEliteTrial(trainer.id)}
                                                onImpersonate={() => handleImpersonate(trainer.id)}
                                                onDelete={() => handleDeleteUser(trainer.id, trainer.full_name || trainer.email, true)}
                                                isPending={isPending}
                                            />
                                        ))}
                                    {trainers.length === 0 && <EmptyState label="Nenhum personal cadastrado" />}
                                </div>
                            </div>
                        )}

                        {/* AFFILIATES TAB */}
                        {tab === 'affiliates' && (
                            <Tabs defaultValue="list" className="w-full">
                                <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-6">
                                    <TabsTrigger value="list" className="text-xs font-black uppercase tracking-widest px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-xl">
                                        Afiliados
                                    </TabsTrigger>
                                    <TabsTrigger value="payouts" className="text-xs font-black uppercase tracking-widest px-6 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500 data-[state=active]:shadow-xl relative overflow-visible">
                                        Saques PIX
                                        {payouts.filter(p => p.status === 'requested' || p.status === 'pending').length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                                        )}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="list" className="mt-0 outline-none">
                                    <AffiliatesManagement initialAffiliates={affiliates} allUsers={students} />
                                </TabsContent>

                                <TabsContent value="payouts" className="mt-0 outline-none">
                                    <PayoutsManagement initialPayouts={payouts} />
                                </TabsContent>
                            </Tabs>
                        )}

                        {/* STUDENTS TAB */}
                        {tab === 'students' && (
                            <div className="space-y-6">
                                <SearchBar value={search} onChange={setSearch} placeholder="Buscar aluno..." />
                                <div className="space-y-3">
                                    {students
                                        .filter(s => s.role === 'student')
                                        .filter(s => !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()))
                                        .map(student => (
                                            <StudentRow
                                                key={student.id}
                                                student={student}
                                                onImpersonate={() => handleImpersonate(student.id)}
                                                onDelete={() => handleDeleteUser(student.id, student.full_name || student.email, false)}
                                                onGrantAutoTraining={() => handleGrantAutoTraining(student.id, (student as any).auto_training_status)}
                                                isPending={isPending}
                                            />
                                        ))}
                                    {students.length === 0 && <EmptyState label="Nenhum aluno cadastrado" />}
                                </div>
                            </div>
                        )}

                        {/* STORE TAB */}
                        {tab === 'store' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <SearchBar value={search} onChange={setSearch} placeholder="Buscar produto..." />
                                    <Button
                                        onClick={() => { setEditingProduct(null); setProductModalOpen(true) }}
                                        className="h-12 px-6 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-wide shrink-0"
                                    >
                                        <Plus className="w-4 h-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Novo Produto</span>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                    {products
                                        .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()))
                                        .map(product => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onToggle={() => handleProductToggle(product.id, product.is_active)}
                                                onEdit={() => { setEditingProduct(product); setProductModalOpen(true) }}
                                                onDelete={() => handleDeleteProduct(product.id)}
                                                isPending={isPending}
                                            />
                                        ))}
                                    {products.length === 0 && <div className="col-span-full"><EmptyState label="Nenhum produto na loja" /></div>}
                                </div>

                                <ProductEditorModal
                                    isOpen={productModalOpen}
                                    onClose={() => setProductModalOpen(false)}
                                    product={editingProduct}
                                    onImport={fetchProductFromUrl}
                                    onDelete={async () => {
                                        if (editingProduct && await handleDeleteProduct(editingProduct.id)) {
                                            setProductModalOpen(false)
                                        }
                                    }}
                                    onSave={async (data: any) => {
                                        startTransition(async () => {
                                            const res = editingProduct
                                                ? /* ❌ OUTBOX VIOLATION */ await updateStoreProduct(editingProduct.id, data)
                                                : await addStoreProduct(data)

                                            if (res.error) toast({ variant: 'destructive', title: 'Erro', description: (res as any).error })
                                            else {
                                                toast({ title: editingProduct ? 'Produto atualizado!' : 'Produto adicionado!' })
                                                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.store.products })
                                                setProductModalOpen(false)
                                            }
                                        })
                                    }}
                                />
                            </div>
                        )}



                        {/* LOGS TAB */}
                        {tab === 'logs' && (
                            <div className="space-y-4">
                                {logs.map(log => (
                                    <div key={log.id} className="flex items-start gap-4 p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl">
                                        <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center shrink-0 border border-zinc-800">
                                            <Zap className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 pb-4 flex-wrap">
                                                <span className="text-[11px] font-black text-white uppercase tracking-wide">{log.action.replace(/_/g, ' ')}</span>
                                                {log.admin?.full_name && (
                                                    <span className="text-[9px] font-bold text-zinc-600 uppercase">por {log.admin.full_name}</span>
                                                )}
                                            </div>
                                            {log.details && (
                                                <p className="text-[10px] font-mono text-zinc-500 mt-1 truncate">
                                                    {JSON.stringify(log.details)}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-1 mt-2">
                                                <Clock className="w-3 h-3 text-zinc-700" />
                                                <span className="text-[9px] font-bold text-zinc-600">{new Date(log.created_at).toLocaleString('pt-BR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {logs.length === 0 && <EmptyState label="Nenhum log registrado" />}
                            </div>
                        )}
                    </main>
                </div>

                {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-900 flex">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all ${tab === t.id
                            ? 'text-white'
                            : 'text-zinc-600 hover:text-zinc-400'
                            }`}
                    >
                        <t.icon className="w-4 h-4" />
                        <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    )
}

// ─── Sub Components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl overflow-hidden hover:bg-zinc-900/60 transition-all group">
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-2.5 rounded-xl ${bg} ${color}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
                    <p className="text-xl sm:text-2xl font-black text-white italic uppercase tabular-nums">{value}</p>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase">{sub}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 pl-11 pr-4 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-medium"
            />
        </div>
    )
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="py-20 text-center">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{label}</p>
        </div>
    )
}

function TrainerRow({ trainer, onPlanChange, onEliteToggle, onExemptToggle, onEliteTrial, onImpersonate, onDelete, isPending }: any) {
    const plans = ['on_demand']
    const planColors: Record<string, string> = {
        on_demand: 'text-orange-400',
        start: 'text-zinc-400',
        pro: 'text-blue-400',
        elite: 'text-amber-400'
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:bg-zinc-900/60 transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={trainer.avatar_url} />
                    <AvatarFallback className="bg-zinc-800 text-zinc-500 text-xs font-black">
                        {trainer.full_name?.substring(0, 2)?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-white truncate">{trainer.full_name || 'Sem nome'}</p>
                        {trainer.is_elite && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        {trainer.is_billing_exempt && (
                            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[8px] font-black text-amber-500 uppercase tracking-widest">
                                Isento
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-zinc-600 truncate">{trainer.email}</p>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Registro: {new Date(trainer.created_at).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            {trainer.students?.filter((s: any) => s.active).length || 0} Alunos
                        </span>
                    </div>
                </div>

                <div className="hidden xl:flex items-center gap-4  border-l border-zinc-800/50">
                    <div className="text-right">
                        <span className="block text-[8px] font-black uppercase text-zinc-600 tracking-wide">Mensal</span>
                        <span className="block text-xs font-black text-emerald-500 tabular-nums">R$ {Number(trainer.monthly_revenue || 0).toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[8px] font-black uppercase text-zinc-600 tracking-wide">Total Est.</span>
                        <span className="block text-xs font-black text-zinc-400 tabular-nums">R$ {Number(trainer.total_revenue || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {/* Plan selector */}
                <div className="flex bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
                    {plans.map(p => (
                        <button
                            key={p}
                            /* ❌ UI BLOCKING REMOVED */ disabled={false}
                            onClick={() => onPlanChange(p as string)}
                            className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all ${trainer.plan_tier === p
                                ? `bg-zinc-800 ${planColors[p]}`
                                : 'text-zinc-700 hover:text-zinc-400'
                                }`}
                        >
                            {p === 'on_demand' ? 'O.D.' : p}
                        </button>
                    ))}
                </div>
                {/* Removed Elite toggle and Trial Button for On-Demand model */}

                {/* Exempt toggle */}
                <button
                    onClick={onExemptToggle}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all text-[9px] font-black uppercase tracking-widest ${trainer.is_billing_exempt
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 hover:bg-amber-500/30'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500'
                        }`}
                    title={trainer.is_billing_exempt ? "Remover Isenção" : "Tornar Isento (VIP)"}
                >
                    <HeartHandshake className="w-3 h-3" />
                    {trainer.is_billing_exempt ? 'Isento' : 'Isentar'}
                </button>

                {/* Impersonate Button */}
                <button
                    onClick={onImpersonate}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:border-blue-500/50 text-[9px] font-black uppercase tracking-widest transition-all"
                    title="Inspecionar conta"
                >
                    <Eye className="w-3 h-3" />
                    Inspecionar
                </button>

                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:border-red-500/50 text-[9px] font-black uppercase tracking-widest transition-all"
                >
                    <Trash2 className="w-3 h-3" />
                    Deletar
                </button>
            </div>
        </div>
    )
}

function StudentRow({ student, onImpersonate, onDelete, onGrantAutoTraining, isPending }: any) {
    const isAutoTraining = student.auto_training_status === 'active'

    return (
        <div className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl">
            <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={student.avatar_url} />
                <AvatarFallback className="bg-zinc-800 text-zinc-500 text-xs font-black">
                    {student.full_name?.substring(0, 2)?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{student.full_name || 'Sem nome'}</p>
                <p className="text-[10px] font-bold text-zinc-600 truncate">{student.email}</p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest hidden sm:inline">
                    {new Date(student.created_at).toLocaleDateString('pt-BR')}
                </span>

                <button
                    onClick={onGrantAutoTraining}
                    disabled={isPending}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${isAutoTraining
                        ? 'bg-amber-500/20 border-amber-500/30 text-amber-500 hover:bg-amber-500/30'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500'
                        }`}
                    title={isAutoTraining ? "Remover Auto-Treino" : "Conceder Auto-Treino Grátis"}
                >
                    <Zap className="w-3 h-3" />
                    {isAutoTraining ? 'Auto-Treino' : 'Conceder Auto'}
                </button>

                <button
                    onClick={onImpersonate}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:border-blue-500/50 text-[9px] font-black uppercase tracking-widest transition-all"
                    title="Inspecionar conta"
                >
                    <Eye className="w-3 h-3" />
                    Inspecionar
                </button>

                <button
                    onClick={onDelete}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:border-red-500/50 text-[9px] font-black uppercase tracking-widest transition-all"
                >
                    <Trash2 className="w-3 h-3" />
                    Deletar
                </button>
            </div>
        </div>
    )
}

function ProductCard({ product, onToggle, onEdit, onDelete, isPending }: any) {
    return (
        <Card className={`border rounded-3xl overflow-hidden transition-all group ${product.is_active ? 'bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700' : 'bg-zinc-950 border-zinc-900 opacity-60'}`}>
            <CardContent className="p-0">
                <div className="h-48 overflow-hidden relative bg-zinc-950">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-800"><ShoppingBag className="w-8 h-8" /></div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-100 transition-opacity">
                        <button onClick={onEdit} /* ❌ UI BLOCKING REMOVED */ disabled={false} className="h-8 w-8 flex items-center justify-center bg-black/60 backdrop-blur text-white hover:bg-black/80 rounded-lg transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={onDelete} /* ❌ UI BLOCKING REMOVED */ disabled={false} className="h-8 w-8 flex items-center justify-center bg-red-500/80 backdrop-blur text-white hover:bg-red-600 rounded-lg transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
                <div className="p-5 space-y-3">
                    <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{product.category}</p>
                        <h3 className="text-sm font-black text-white italic uppercase leading-tight line-clamp-1">{product.name}</h3>
                    </div>
                    {product.official_price && (
                        <p className="text-lg font-black text-emerald-500 italic">R$ {Number(product.official_price).toFixed(2)}</p>
                    )}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onToggle}
                            /* ❌ UI BLOCKING REMOVED */ disabled={false}
                            className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${product.is_active
                                ? 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20'
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                                }`}
                        >
                            {product.is_active ? <><EyeOff className="w-3 h-3" /> Desativar</> : <><Eye className="w-3 h-3" /> Ativar</>}
                        </button>
                        {product.link_url && (
                            <a href={product.link_url} target="_blank" rel="noopener noreferrer"
                                className="h-9 w-9 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all">
                                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                            </a>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ProductEditorModal({ isOpen, onClose, product, onSave, onImport, onDelete }: any) {
    const [form, setForm] = useState({ name: '', description: '', image_url: '', official_price: 0, link_url: '', category: 'supplement', sub_category: '', rating: 0, reviews_count: 0 })
    const [importUrl, setImportUrl] = useState('')
    const [importing, setImporting] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

    useEffect(() => {
        if (product) setForm({ ...product, sub_category: product.sub_category || '' })
        else setForm({ name: '', description: '', image_url: '', official_price: 0, link_url: '', category: 'supplement', sub_category: '', rating: 0, reviews_count: 0 })
        setImportUrl('')
    }, [product, isOpen])

    if (!isOpen) return null

    const handleImport = async () => {
        if (!importUrl) return
        setImporting(true)
        try {
            const data = await onImport(importUrl)
            if (data.error) throw new Error(data.error)
            setForm(prev => ({
                ...prev,
                name: data.title || prev.name,
                description: data.description || prev.description,
                image_url: data.image || prev.image_url,
                official_price: data.price || prev.official_price,
                // Don't overwrite link_url if user already pasted an affiliate link
                link_url: prev.link_url,
                rating: data.rating || prev.rating || 0,
                reviews_count: data.reviews_count || prev.reviews_count || 0,
                category: data.category || prev.category,
                sub_category: data.sub_category || prev.sub_category
            }))
            // Clear import URL after success to avoid confusion
            setImportUrl('')
        } catch (e: any) {
            alert('Erro ao importar: ' + e.message)
        } finally {
            setImporting(false)
        }
    }

    const supplementSubs = ['Pré-treino', 'Vitaminas', 'Whey', 'Outros']

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 sm:p-8 w-full max-w-lg space-y-6 max-h-[95vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-white italic uppercase">{product ? 'Editar Produto' : 'Novo Produto'}</h3>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Configure os detalhes da oferta na loja</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition-all">
                        <X className="w-4 h-4 text-zinc-500" />
                    </button>
                </div>

                {/* Import Section - More prominent */}
                <div className="p-5 bg-emerald-500/5 rounded-[1.5rem] border border-emerald-500/10 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <Zap className="w-3 h-3 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Auto-Importar Dados (IA)</span>
                    </div>
                    <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">
                        Cole o link <span className="text-zinc-300 font-bold">direto do produto</span> para preencher automaticamente nome, preço, imagem e descrição via Inteligência Artificial.
                    </p>
                    <div className="flex gap-2">
                        <input
                            placeholder="Link do produto (ex: mercadolivre.com/p/whey...)"
                            value={importUrl}
                            onChange={e => setImportUrl(e.target.value)}
                            className="flex-1 h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                        <Button
                            onClick={handleImport}
                            disabled={importing || !importUrl}
                            className="h-11 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[10px] tracking-widest shrink-0 rounded-xl disabled:opacity-50"
                        >
                            {importing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Carregar'}
                        </Button>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Link de Afiliado (Botão de Compra)</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                                <input
                                    placeholder="Seu link de afiliado (ex: meli.la/...)"
                                    value={form.link_url}
                                    onChange={e => setForm(prev => ({ ...prev, link_url: e.target.value }))}
                                    className="w-full h-11 pl-11 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-600 placeholder:text-zinc-700"
                                />
                            </div>
                        </div>

                        {[
                            { key: 'name', label: 'Nome do Produto', type: 'text', icon: Package },
                            { key: 'description', label: 'Descrição Curta', type: 'text', icon: Pencil },
                            { key: 'image_url', label: 'URL da Imagem', type: 'text', icon: Eye },
                        ].map(field => (
                            <div key={field.key} className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">{field.label}</label>
                                <div className="relative">
                                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                                    <input
                                        type={field.type}
                                        value={(form as any)[field.key]}
                                        onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                        className="w-full h-11 pl-11 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-600"
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Preço (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.official_price}
                                    onChange={e => setForm(prev => ({ ...prev, official_price: Number(e.target.value) }))}
                                    className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-emerald-500 font-bold focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Nota (0-5)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={form.rating}
                                    onChange={e => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                                    className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-amber-500 font-bold focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Reviews</label>
                                <input
                                    type="number"
                                    value={form.reviews_count}
                                    onChange={e => setForm(prev => ({ ...prev, reviews_count: Number(e.target.value) }))}
                                    className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-400 font-bold focus:outline-none focus:border-zinc-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Categoria</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value, sub_category: '' }))}
                                    className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-600"
                                >
                                    <option value="Suplemento">Suplemento</option>
                                    <option value="Acessório">Acessório</option>
                                    <option value="Vestuário">Vestuário</option>
                                    <option value="Equipamento">Equipamento</option>
                                </select>
                            </div>
                            {form.category === 'Suplemento' && (
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest pl-1">Tipo</label>
                                    <select
                                        value={form.sub_category}
                                        onChange={e => setForm(prev => ({ ...prev, sub_category: e.target.value }))}
                                        className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-zinc-600"
                                    >
                                        <option value="">Geral</option>
                                        {supplementSubs.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    {product && onDelete && (
                        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="h-12 w-12 rounded-2xl p-0 flex items-center justify-center shrink-0">
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 rounded-[2.5rem] shadow-2xl p-0 border-white/5 overflow-hidden z-[60]">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                                        <AlertTriangle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <DialogHeader className="space-y-3">
                                        <DialogTitle className="text-2xl font-black italic uppercase tracking-tight text-white text-center">
                                            Deletar Produto?
                                        </DialogTitle>
                                        <DialogDescription className="text-zinc-500 text-sm font-medium text-center leading-relaxed">
                                            Você tem certeza que deseja excluir <strong>{form.name}</strong>? <br />Esta ação removerá o item da loja permanentemente.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <DialogFooter className="grid grid-cols-2 gap-4 w-full mt-8">
                                        <Button
                                            variant="outline"
                                            onClick={() => setDeleteConfirmOpen(false)}
                                            className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-2xl h-14 font-black uppercase italic tracking-widest text-[10px]"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onClick={() => { setDeleteConfirmOpen(false); onDelete() }}
                                            className="bg-red-600 hover:bg-red-700 text-white font-black uppercase italic rounded-2xl h-14 tracking-widest text-[10px] shadow-lg shadow-red-900/20"
                                        >
                                            Sim, Deletar
                                        </Button>
                                    </DialogFooter>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 h-12 bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-sm"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => onSave(form)}
                        className="flex-1 h-12 rounded-2xl bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-wide"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Produto
                    </Button>
                </div>
            </div>
        </div>
    )
}

function AppSettingsEditor({ settings, onSave, isPending }: {
    settings: { beta_tester_mode: boolean; gemini_api_key: string } | null
    onSave: (data: { beta_tester_mode?: boolean; gemini_api_key?: string | null }) => void
    isPending: boolean
}) {
    const [betaMode, setBetaMode] = useState(settings?.beta_tester_mode ?? false)
    const [geminiKey, setGeminiKey] = useState('')

    useEffect(() => {
        setBetaMode(settings?.beta_tester_mode ?? false)
        setGeminiKey('')
    }, [settings])

    const handleSave = () => {
        const data: { beta_tester_mode: boolean; gemini_api_key?: string | null } = { beta_tester_mode: betaMode }
        if (geminiKey.trim()) data.gemini_api_key = geminiKey.trim()
        onSave(data)
    }

    if (!settings) return (
        <div className="py-12 flex items-center justify-center">
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Carregando credenciais...</p>
        </div>
    )

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl overflow-hidden max-w-2xl">
            <CardContent className="p-6 space-y-8">
                {/* Modo de teste incompleto */}
                <div className="flex items-center justify-between p-5 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <div>
                        <p className="text-sm font-black text-zinc-200 uppercase tracking-widest">Modo de teste incompleto</p>
                        <p className="text-xs text-zinc-500 mt-2">Quando ativado, oculta o botão Importar PDF (integração com IA desativada)</p>
                    </div>
                    <button
                        onClick={() => {
                            const newMode = !betaMode
                            setBetaMode(newMode)
                            onSave({ beta_tester_mode: newMode })
                        }}
                        /* ❌ UI BLOCKING REMOVED */ disabled={false}
                        className={`h-11 w-24 rounded-xl border transition-all font-black text-[10px] uppercase shrink-0 flex items-center justify-center ${betaMode
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-700'
                            }`}
                    >
                        {isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : (betaMode ? 'Ativado' : 'Desativado')}
                    </button>
                </div>

                {/* Tokens */}
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tokens (prioridade sobre variáveis de ambiente)</p>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <Key className="w-3 h-3" /> Gemini API Key
                        </label>
                        <input
                            type="password"
                            value={geminiKey}
                            onChange={e => setGeminiKey(e.target.value)}
                            placeholder={settings.gemini_api_key ? '•••••••• (deixe em branco para manter)' : 'Cole a chave Gemini para importação de PDF'}
                            className="w-full h-12  bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="h-12 px-8 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-widest w-full sm:w-auto"
                >
                    {isPending ? <><Save className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="w-4 h-4 mr-2" /> Salvar Credenciais</>}
                </Button>
            </CardContent>
        </Card>
    )
}

function PlanEditor({ tier, pricing, onSave, isPending }: {
    tier: string
    pricing: { monthly: number; quarterly_discount: number; annual_discount: number }
    onSave: (monthly: number, qDiscount: number, aDiscount: number) => void
    isPending: boolean
}) {
    const [monthly, setMonthly] = useState(pricing.monthly)
    const [qDiscount, setQDiscount] = useState(pricing.quarterly_discount)
    const [aDiscount, setADiscount] = useState(pricing.annual_discount)

    const tierColors: Record<string, string> = {
        start: 'border-blue-500/20 bg-blue-500/5',
        pro: 'border-emerald-500/20 bg-emerald-500/5',
        elite: 'border-amber-500/20 bg-amber-500/5',
    }
    const tierLabel: Record<string, string> = { start: 'Start', pro: 'Pro', elite: 'Elite' }

    const qPrice = monthly * 3 * (1 - qDiscount / 100)
    const aPrice = monthly * 12 * (1 - aDiscount / 100)

    return (
        <div className={`p-6 border rounded-3xl space-y-5 ${tierColors[tier] || 'border-zinc-800 bg-zinc-900/40'}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{tierLabel[tier]}</h3>
                <Button
                    onClick={() => onSave(monthly, qDiscount, aDiscount)}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="h-8  rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-[10px] font-black uppercase tracking-widest"
                >
                    <Save className="w-3 h-3 mr-1.5" />
                    Salvar
                </Button>
            </div>
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Preco Mensal (R$)</label>
                    <input type="number" step="0.01" value={monthly} onChange={e => setMonthly(Number(e.target.value))}
                        className="w-full h-11  bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-zinc-600 font-mono" />
                    <p className="text-[9px] text-zinc-600 font-bold">Mensal: R$ {monthly.toFixed(2)}/mes</p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Desconto Trimestral (%)</label>
                    <input type="number" min="0" max="50" value={qDiscount} onChange={e => setQDiscount(Number(e.target.value))}
                        className="w-full h-11  bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-zinc-600 font-mono" />
                    <p className="text-[9px] text-zinc-600 font-bold">Trimestral: R$ {qPrice.toFixed(2)} total - R$ {(qPrice / 3).toFixed(2)}/mes</p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Desconto Anual (%)</label>
                    <input type="number" min="0" max="50" value={aDiscount} onChange={e => setADiscount(Number(e.target.value))}
                        className="w-full h-11  bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-zinc-600 font-mono" />
                    <p className="text-[9px] text-zinc-600 font-bold">Anual: R$ {aPrice.toFixed(2)} total - R$ {(aPrice / 12).toFixed(2)}/mes</p>
                </div>
            </div>
        </div>
    )
}

function OnDemandEditor({ pricing, onSave, isPending }: {
    pricing: { price_per_student?: number; free_students_limit?: number; pro_features_threshold?: number }
    onSave: (pricePerStudent: number, freeLimit: number, proThreshold: number) => void
    isPending: boolean
}) {
    const [pricePerStudent, setPricePerStudent] = useState(pricing.price_per_student || 20)
    const [freeLimit, setFreeLimit] = useState(pricing.free_students_limit || 5)
    const [proThreshold, setProThreshold] = useState(pricing.pro_features_threshold || 8)

    return (
        <div className="p-6 border rounded-3xl space-y-5 border-zinc-800 bg-zinc-900/40">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white italic uppercase tracking-tight">On Demand</h3>
                <Button
                    onClick={() => onSave(pricePerStudent, freeLimit, proThreshold)}
                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                    className="h-8  rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-[10px] font-black uppercase tracking-widest"
                >
                    <Save className="w-3 h-3 mr-1.5" />
                    Salvar
                </Button>
            </div>
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Preço por Aluno (R$)</label>
                    <input type="number" step="0.50" value={pricePerStudent} onChange={e => setPricePerStudent(Number(e.target.value))}
                        className="w-full h-11  bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-zinc-600 font-mono" />
                    <p className="text-[9px] text-zinc-600 font-bold">Custo por aluno ativo</p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Limite Gratuito (Alunos)</label>
                    <input type="number" min="0" value={freeLimit} onChange={e => setFreeLimit(Number(e.target.value))}
                        className="w-full h-11  bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-zinc-600 font-mono" />
                    <p className="text-[9px] text-zinc-600 font-bold">Até X alunos é grátis</p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Gatilho Plano PRO (Alunos)</label>
                    <input type="number" min="0" value={proThreshold} onChange={e => setProThreshold(Number(e.target.value))}
                        className="w-full h-11  bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-zinc-600 font-mono" />
                    <p className="text-[9px] text-zinc-600 font-bold">Libera recursos PRO com X alunos</p>
                </div>
            </div>
        </div>
    )
}
