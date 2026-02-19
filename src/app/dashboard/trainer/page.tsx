import { getTrainerProfile, getTrainerStudents, getTrainerTier, getEffectiveTier, getTrainerRanking, getTrainerActivityFeed } from '@/actions/trainer-actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, Activity, TrendingUp, Plus, FileUp, Sparkles, UserPlus, ArrowUpRight, Zap, Crown, Dumbbell, Utensils, Clock, CheckCircle2, Scale, Camera } from "lucide-react"
import { TrainerCodeCard } from '@/components/feature/trainer/trainer-code-card'
import { EditProfileDialog } from '@/components/feature/trainer/edit-profile-dialog'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { LockedFeature } from '@/components/ui/locked-feature'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getBetaTesterMode } from '@/actions/app-settings-actions'

export default async function TrainerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('trainer_code, full_name, plan_tier, bio, specialties, whatsapp')
        .eq('id', user?.id)
        .single()

    const effectiveTier = await getEffectiveTier()
    const currentTier = profile?.plan_tier || 'on_demand'

    // Fetch Real Stats
    const { count: activeStudents } = await supabase
        .from('trainer_students')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', user?.id)
        .eq('active', true)

    // New students this month
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const { count: newStudentsThisMonth } = await supabase
        .from('trainer_students')
        .select('*', { count: 'exact', head: true })
        .eq('trainer_id', user?.id)
        .gte('created_at', firstDayOfMonth)

    const { data: studentsData } = await supabase
        .from('trainer_students')
        .select('monthly_fee')
        .eq('trainer_id', user?.id)
        .eq('active', true)

    const monthlyRevenue = studentsData?.reduce((acc, curr) => acc + (Number(curr.monthly_fee) || 0), 0) || 0

    const betaTesterMode = await getBetaTesterMode()

    const tierName = profile?.plan_tier ? profile.plan_tier.charAt(0).toUpperCase() + profile.plan_tier.slice(1) : 'Start'
    const tierTrend = profile?.plan_tier === 'elite' ? 'Nível Máximo' : 'Upgrade Disponível'

    // Ranking Logic
    const fullRanking = await getTrainerRanking()
    const userRankIndex = fullRanking.findIndex((t: any) => t.id === user?.id)
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : '-'

    // Fetch Activity Feed
    const activities = await getTrainerActivityFeed()

    const tierColors: Record<string, string> = {
        on_demand: 'text-zinc-500',
        start: 'text-blue-500',
        pro: 'text-emerald-500',
        elite: 'text-amber-500'
    }
    const tierIcons: Record<string, any> = {
        on_demand: Activity,
        start: Zap,
        pro: Sparkles,
        elite: Crown
    }
    const TierIcon = tierIcons[currentTier] || Activity
    const tierColor = tierColors[currentTier] || 'text-zinc-500'


    const TIER_LIMITS: Record<string, number> = {
        on_demand: 9999,
        start: 10,
        pro: 50,
        elite: Infinity
    }
    const limit = TIER_LIMITS[currentTier] || 9999
    const displayValue = limit === Infinity ? `${activeStudents || 0} / ∞` : `${activeStudents || 0} / ${limit}`

    return (
        <div className="space-y-10 pb-10">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Visão Geral
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Bem-vindo de volta, <span className="text-zinc-200">{profile?.full_name?.split(' ')[0] || 'Treinador'}</span>. Aqui está o resumo do seu time.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button asChild className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-bold h-11 px-6 shadow-xl active:scale-95 transition-all gap-2">
                        <Link href="/dashboard/trainer/students">
                            <UserPlus className="w-4 h-4" />
                            Novo Aluno
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Alunos Ativos"
                    value={displayValue}
                    icon={<Users className="w-5 h-5" />}
                    description="Total de alunos ativos"
                    accentColor="text-blue-500"
                    trend={`+ ${newStudentsThisMonth || 0} este mês`}
                />
                <MetricCard
                    title="Receita Mensal"
                    value={`R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} `}
                    icon={<DollarSign className="w-5 h-5" />}
                    description="Seu lucro total"
                    accentColor="text-emerald-500"
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
                    trend={tierTrend}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden rounded-2xl border-t-zinc-700/50">
                        <CardHeader className="border-b border-zinc-900/50 bg-zinc-900/10 py-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-500" />
                                    Atividade em Tempo Real
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/30 text-[10px] uppercase font-bold tracking-widest h-8 transition-all px-3 rounded-xl border border-transparent hover:border-zinc-800/50">
                                    Ver Todos
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {activities.length > 0 ? (
                                <div className="divide-y divide-zinc-900">
                                    {activities.map((activity) => (
                                        <div key={`${activity.type}-${activity.id}`} className="p-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Avatar className="h-10 w-10 border border-zinc-800">
                                                        <AvatarImage src={activity.studentAvatar || undefined} />
                                                        <AvatarFallback className="bg-zinc-900 text-zinc-400 font-bold text-xs uppercase">
                                                            {activity.studentName.substring(0, 2)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-1 border border-zinc-800 shadow-xl">
                                                        {activity.type === 'workout' && <Dumbbell className="w-2.5 h-2.5 text-blue-500" />}
                                                        {activity.type === 'meal' && <Utensils className="w-2.5 h-2.5 text-emerald-500" />}
                                                        {activity.type === 'cardio' && <Zap className="w-2.5 h-2.5 text-amber-500" />}
                                                        {activity.type === 'weight' && <Scale className="w-2.5 h-2.5 text-purple-500" />}
                                                        {activity.type === 'photo' && <Camera className="w-2.5 h-2.5 text-orange-500" />}
                                                    </div>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs text-white block">
                                                        <span className="font-bold">{activity.studentName}</span>
                                                        <span className="text-zinc-500 ml-1">
                                                            {activity.type === 'workout' ? 'concluiu um treino' :
                                                                activity.type === 'meal' ? 'marcou uma refeição' :
                                                                    activity.type === 'cardio' ? 'concluiu um cardio' :
                                                                        activity.type === 'weight' ? 'atualizou o peso' :
                                                                            'mandou novas fotos'}
                                                        </span>
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-zinc-400 uppercase italic tracking-tight">{activity.contentName}</span>
                                                        <span className="text-zinc-800">•</span>
                                                        <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                                                            <Clock className="w-2.5 h-2.5" />
                                                            {formatTimeAgo(activity.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {activity.status === 'completed' && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/10 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <CheckCircle2 className="w-2.5 h-2.5" /> Sucesso
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="p-4 bg-zinc-900/50 rounded-full border border-zinc-800">
                                        <Activity className="h-8 w-8 text-zinc-800 animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-zinc-400 font-medium">Aguardando registros...</p>
                                        <p className="text-zinc-600 text-xs max-w-[280px]">
                                            Quando seus alunos concluírem treinos ou dietas, as atualizações aparecerão aqui instantaneamente.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

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
                            icon={<Sparkles className="w-6 h-6 text-emerald-500" />}
                            href="/dashboard/trainer/diets"
                            label="Acessar Dietas"
                        />
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-2xl overflow-hidden shadow-2xl space-y-4">
                        <TrainerCodeCard initialCode={profile?.trainer_code} />

                        <div className="p-1">
                            <EditProfileDialog profile={{
                                full_name: profile?.full_name,
                                bio: profile?.bio,
                                specialties: profile?.specialties,
                                whatsapp: profile?.whatsapp
                            }} />

                            {profile?.trainer_code ? (
                                <Button asChild variant="ghost" className="w-full text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 text-[10px] uppercase font-bold tracking-widest mt-2 h-9 transition-all duration-200">
                                    <Link href={`/personal/${profile.trainer_code.toUpperCase().trim()}`} target="_blank">
                                        Ver Meu Perfil Público
                                        <ArrowUpRight className="w-3 h-3 ml-2" />
                                    </Link>
                                </Button>
                            ) : null}
                        </div>
                    </div>

                    {!betaTesterMode && (
                        <LockedFeature isLocked={effectiveTier === 'start' || effectiveTier === 'on_demand'} requiredTier="pro" message="Importação de PDF disponível nos planos PRO e ELITE">
                            <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden group">
                                <CardHeader className="bg-green-500/5 border-b border-green-500/10 py-4">
                                    <CardTitle className="text-sm font-bold text-green-500 flex items-center gap-2">
                                        <FileUp className="w-4 h-4" />
                                        Importação Inteligente
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-zinc-400 text-xs leading-relaxed">
                                        Tem uma planilha ou PDF? Nossa IA pode ler o arquivo e criar o treino ou dieta em segundos.
                                    </p>
                                    <Button asChild className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 rounded-xl h-11 transition-all active:scale-[0.98] group-hover:border-green-500/30">
                                        <Link href="/dashboard/trainer/import-pdf">
                                            Importar via PDF
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </LockedFeature>
                    )}
                </div>
            </div>
        </div>
    )
}

function formatTimeAgo(dateString: string) {
    if (!dateString) return 'Recentemente'
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Agora'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function MetricCard({ title, value, icon, description, accentColor, trend }: any) {
    return (
        <Card className="bg-zinc-950 border-zinc-800 shadow-xl rounded-2xl overflow-hidden border-t-zinc-700/50 transition-all hover:border-zinc-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
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
                    <p className="text-xs text-zinc-500 leading-relaxed px-4">{description}</p>
                </div>
                <Button asChild variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-900/50 h-9 px-4 text-xs font-bold rounded-xl mt-2 transition-all active:scale-95">
                    <Link href={href}>
                        {label}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}
