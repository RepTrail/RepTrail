'use client'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { 
    getTrainerProfile, 
    getEffectiveTier, 
    getTrainerRanking, 
    getTrainerActivityFeed 
} from '@/actions/trainer-actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stack } from '@/components/store/base/stack'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { LayoutDashboard, UserPlus, Users, DollarSign, TrendingUp, Zap, Sparkles, Crown, FileUp, ArrowUpRight, Activity, Star } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import Link from 'next/link'

// Deprecated features
import { ActivityFeed } from './activity-feed'
import { CodeAutoGenerator } from './code-auto-generator'
import { TrainerCodeCard } from './trainer-code-card'
import { EditProfileDialog } from './edit-profile-dialog'

interface TrainerDashboardClientProps {
    userId: string
    betaTesterMode: boolean
}

export function TrainerDashboardClient({ userId, betaTesterMode }: TrainerDashboardClientProps) {
    // ─── Queries ──────────────────────────────────────────────────────────
    const { data: profile } = useQuery({ 
        queryKey: QUERY_KEYS.profile.detail(userId), 
        queryFn: () => getTrainerProfile(userId),
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: effectiveTier } = useQuery({ 
        queryKey: QUERY_KEYS.trainer.effectiveTier(userId), 
        queryFn: () => getEffectiveTier(userId),
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: fullRanking = [] } = useQuery({ 
        queryKey: QUERY_KEYS.trainer.ranking(), 
        queryFn: getTrainerRanking,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: activities = [] } = useQuery({ 
        queryKey: QUERY_KEYS.trainer.activity(userId), 
        queryFn: () => getTrainerActivityFeed(userId),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    // ─── Derived State ───────────────────────────────────────────────────
    const currentTier = profile?.plan_tier || 'on_demand'
    
    // Stats (These come from the profile/ranking or separate queries if needed)
    // For now we use the ones available in the profile or provided initial data
    const activeStudents = profile?.stats?.active_students || 0
    const newStudentsThisMonth = profile?.stats?.new_students_this_month || 0
    const monthlyRevenue = profile?.stats?.monthly_revenue || 0
    const totalRevenue = profile?.stats?.total_revenue || 0

    const userRankIndex = fullRanking.findIndex((t: any) => t.id === userId)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    const tierName = profile?.plan_tier
        ? profile.plan_tier.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'On Demand'

    const tierColors: Record<string, string> = {
        on_demand: 'text-zinc-500',
        start: 'text-blue-500',
        pro: 'text-orange-500',
        elite: 'text-orange-500'
    }
    const tierIcons: Record<string, any> = {
        on_demand: Activity,
        start: Zap,
        pro: Sparkles,
        elite: Crown
    }
    const TierIcon = tierIcons[currentTier] || Activity
    const tierColor = tierColors[currentTier] || 'text-zinc-500'

    return (
        <RegistryMain
            title="VISÃO GERAL"
            subtitle="Bem-vindo de volta. Acompanhe o desempenho do seu time."
            icon={LayoutDashboard}
            contextLabel="Área do Personal"
            showTabs={false}
        >
            <Stack gap={{ base: 'empty_state', md: 'section' }} className="pb-10">
                <CodeAutoGenerator hasCode={!!profile?.trainer_code} />

                {/* Quick Actions Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">
                    <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-bold h-11 px-6 shadow-none active:scale-95 transition-all gap-2">
                        <Link href="/dashboard/trainer/students">
                            <UserPlus className="w-4 h-4" />
                            Novo Aluno
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Alunos Ativos"
                        value={activeStudents}
                        icon={<Users className="w-5 h-5" />}
                        description="Total de alunos ativos"
                        accentColor="text-blue-500"
                        trend={`+ ${newStudentsThisMonth || 0} este mês`}
                    />
                    <MetricCard
                        title="Receita Mensal"
                        value={`R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} `}
                        icon={<DollarSign className="w-5 h-5" />}
                        description={`Total Est.: R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        accentColor="text-orange-500"
                        trend="TAXA ZERO 🔥"
                    />
                    <MetricCard
                        title="Ranking Geral"
                        value={`${userRank}º`}
                        icon={<TierIcon className="w-5 h-5" />}
                        description="Sua posição atual"
                        accentColor={tierColor}
                    />
                    <MetricCard
                        title="Seu Nível"
                        value={tierName}
                        icon={<TrendingUp className="w-5 h-5" />}
                        description="Seu plano atual no RepTrail"
                        accentColor="text-purple-500"
                        trend="Ativo"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-8 space-y-6">
                        <ActivityFeed userId={userId} initialData={activities} />

                        <div className="grid gap-6 md:grid-cols-2">
                            <QuickActionCard
                                title="Biblioteca de Treinos"
                                description="Gerencie seus modelos de treino personalizados."
                                icon={<TrendingUp className="w-6 h-6 text-blue-500" />}
                                href="/dashboard/trainer/workouts"
                                label="Acessar Treinos"
                            />
                            <QuickActionCard
                                title="Plano Alimentar"
                                description="Crie e ajuste dietas para seus alunos."
                                icon={<Sparkles className="w-6 h-6 text-orange-500" />}
                                href="/dashboard/trainer/diets"
                                label="Acessar Dietas"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="rounded-2xl overflow-hidden shadow-2xl space-y-4">
                            <TrainerCodeCard initialCode={profile?.trainer_code} />

                            {profile?.is_affiliate ? (
                                <Button asChild variant="ghost" className="w-full text-orange-500/70 hover:text-orange-400 hover:bg-orange-500/5 text-[10px] uppercase font-bold tracking-widest h-9 transition-all duration-200 border border-orange-500/10 rounded-xl">
                                    <Link href="/dashboard/affiliate">
                                        ⭐ Meu Painel de Afiliado
                                    </Link>
                                </Button>
                            ) : (
                                <BecomeAffiliateCard />
                            )}

                            <div className="p-1">
                                <EditProfileDialog profile={{
                                    full_name: profile?.full_name,
                                    bio: profile?.bio,
                                    specialties: profile?.specialties,
                                    whatsapp: profile?.whatsapp,
                                    trainer_code: profile?.trainer_code
                                }} />

                                {profile?.trainer_code ? (
                                    <Button asChild variant="ghost" className="w-full text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 text-[10px] uppercase font-bold tracking-widest mt-2 h-9 transition-all duration-200">
                                        <Link href={`/personal/${profile.trainer_code.trim()}`} target="_blank">
                                            Ver Meu Perfil Público
                                            <ArrowUpRight className="w-3 h-3 ml-2" />
                                        </Link>
                                    </Button>
                                ) : null}
                            </div>
                        </div>

                        {!betaTesterMode && (
                            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden group">
                                <CardHeader className="bg-orange-500/5 border-b border-orange-500/10 py-4">
                                    <CardTitle className="text-sm font-bold text-orange-500 flex items-center gap-2">
                                        <FileUp className="w-4 h-4" />
                                        Importação Inteligente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-zinc-400 text-xs leading-relaxed">
                                        Tem uma planilha ou PDF? Nossa IA pode ler o arquivo e criar o treino ou dieta em segundos.
                                    </p>
                                    <Button asChild className="w-full bg-orange-500 border border-orange-400 text-zinc-950 hover:bg-orange-400 rounded-xl h-11 font-bold shadow-lg shadow-orange-500/10 transition-all active:scale-[0.98]">
                                        <Link id="tour-import-pdf-mobile" href="/dashboard/trainer/import-pdf">
                                            Importar via PDF
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </Stack>
        </RegistryMain>
    )
}

function MetricCard({ title, value, icon, description, accentColor, trend }: any) {
    return (
        <Card className="bg-zinc-950 border-zinc-800 shadow-xl rounded-2xl overflow-hidden border-t-zinc-700/50 transition-all hover:border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-[10px] font-bold text-zinc-500 capitalize">{title}</span>
                <div className={`${accentColor} opacity-90`}>{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black text-white font-sans">{value}</div>
                <div className="mt-1 flex items-center gap-2">
                    <p className="text-[10px] text-zinc-500 font-medium">{description}</p>
                    {trend && (
                        <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-md text-zinc-400 font-bold">
                            {trend}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function QuickActionCard({ title, description, icon, href, label }: any) {
    return (
        <Card className="bg-zinc-950 border-zinc-800 shadow-xl rounded-2xl overflow-hidden transition-all hover:bg-zinc-900/50 border-t-zinc-700/20 group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 transition-all group-hover:scale-110 group-hover:border-zinc-700">
                    {icon}
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-zinc-100">{title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed ">{description}</p>
                </div>
                <Button asChild variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 h-9 text-xs font-bold rounded-xl mt-2 transition-all active:scale-95">
                    <Link href={href}>
                        {label}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
function BecomeAffiliateCard() {
    return (
        <Card className="bg-orange-500/5 border-orange-500/20 shadow-xl rounded-2xl overflow-hidden border-t-orange-500/30 transition-all hover:bg-orange-500/10 group">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-xl">
                        <Star className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Seja um Afiliado</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Ganhe 50% de comissão</p>
                    </div>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                    Indique o RepTrail para outros personais e ganhe comissões recorrentes.
                </p>
                <Button asChild variant="orange" className="w-full h-10 text-[10px] uppercase font-black tracking-widest shadow-lg shadow-orange-500/20">
                    <Link href="/dashboard/affiliate/onboarding">
                        Saber Mais
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
