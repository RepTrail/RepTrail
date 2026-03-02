
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
    Users,
    ChevronLeft,
    Calendar,
    Activity,
    Dumbbell,
    Utensils,
    ArrowUpRight,
    MessageSquare,
    Settings,
    Wallet,
    Plus,
    Eye,
    Clock,
    Camera,
    Image as ImageIcon,
    AlertCircle,
    CheckCircle,
    DollarSign,
    TrendingUp,
    Sparkles,
    FlaskConical,
    Target,
    Syringe
} from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditStudentDialog } from '@/components/feature/trainer/edit-student-dialog'
import { StudentGalleryDialog } from '@/components/feature/trainer/student-gallery-dialog'
import { MarkPaidButton } from '@/components/feature/trainer/mark-paid-button'
import { UnassignButton } from '@/components/feature/trainer/unassign-button'
import { StudentWorkoutHistory } from '@/components/feature/trainer/student-workout-history'
import { getStudentWorkoutHistory, getStudentRecentActivities } from '@/actions/log-actions'
import { getStudentMetricsHistory, getStudentChartData } from '@/actions/metrics-actions'
import { StudentMetricsChart } from '@/components/feature/trainer/student-metrics-chart'
import { CardioAssignmentSection } from '@/components/feature/trainer/cardio-assignment-section'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { UnifiedAdherenceChart } from '@/components/feature/shared/unified-adherence-chart'
import { ToggleStudentStatusButton } from '@/components/feature/trainer/toggle-student-status-button'
import { StatCard } from '@/components/feature/shared/stat-card'
import { PerformanceAnalysisSection } from '@/components/feature/shared/performance-analysis-section'
import { StudentRecentActivities } from '@/components/feature/trainer/student-recent-activities'
import { Droplet, Ruler, Info } from 'lucide-react'

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: relationship } = await supabase
        .from('trainer_students')
        .select(`
            *,
            student:profiles!student_id(
                *,
                details:student_details(*),
                progress_photos(*),
                assigned_workouts(
                    id,
                    active,
                    workout:workouts(id, name)
                ),
                assigned_diets(
                    id,
                    active,
                    days_of_week,
                    diet:diets(id, name)
                )
            )
        `)
        .eq('id', id)
        .single()

    if (!relationship) {
        return <div className="p-10 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Aluno não encontrado.</div>
    }

    // Fetch trainer's own profile for tier check
    const { data: trainerProfile } = await supabase
        .from('profiles')
        .select('plan_tier')
        .eq('id', relationship.trainer_id)
        .single()

    const trainerTier = trainerProfile?.plan_tier || 'start'

    // Fetch Metrics & History
    const history = await getStudentWorkoutHistory(relationship.student_id)
    const metricsHistory = await getStudentMetricsHistory(relationship.student_id)
    const chartData = await getStudentChartData(relationship.student_id)
    const recentActivities = await getStudentRecentActivities(relationship.student_id, 50)
    const adherenceHistory = await getStudentAdherenceHistory(relationship.student_id, 30)

    const { student } = relationship
    const details = student?.details

    // Get assignments (only active ones)
    const assignedWorkouts = student?.assigned_workouts?.filter((aw: any) => aw.active) || []
    const activeDiets = student?.assigned_diets?.filter((ad: any) => ad.active) || []

    // Unified Age Logic
    const ageValue = details?.age || (details?.birth_date
        ? Math.floor((new Date().getTime() - new Date(details.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : '--')

    const activityLabels: Record<string, string> = {
        sedentary: 'Sedentário',
        light: 'Leve',
        moderate: 'Moderado',
        active: 'Ativo',
        athlete: 'Atleta',
        very: 'Muito Ativo',
        extra: 'Extremo'
    }

    const sexLabels: Record<string, string> = {
        male: 'Masc.',
        female: 'Fem.',
        other: 'Outro'
    }

    const today = new Date().getDate()
    const paymentDay = relationship.payment_day
    const lastPayment = relationship.last_payment_date
    const isPaidThisMonth = lastPayment &&
        new Date(lastPayment).getMonth() === new Date().getMonth() &&
        new Date(lastPayment).getFullYear() === new Date().getFullYear()

    let paymentStatus = null

    if (paymentDay && !isPaidThisMonth) {
        if (today === paymentDay) {
            paymentStatus = 'due_today'
        } else if (today > paymentDay) {
            paymentStatus = 'overdue'
        }
    }

    // Trend Calculations
    const weights = metricsHistory.weights
    const lastWeight = weights[weights.length - 1]?.weight_kg
    const prevWeight = weights[weights.length - 2]?.weight_kg
    const weightTrend = prevWeight ? (lastWeight - prevWeight).toFixed(1) : null

    const bfs = metricsHistory.bfs
    const lastBF = bfs.length > 0 ? bfs[bfs.length - 1]?.bf_percentage : details?.body_fat
    const prevBF = bfs[bfs.length - 2]?.bf_percentage
    const bfTrend = prevBF ? (lastBF - prevBF).toFixed(1) : null

    // Calculate Adherence Average (last 30 days) — Same as student evolution page
    const last30dAdherence = (adherenceHistory || []).filter(h => h.diet_percentage > 0 || h.workout_status === 'completed' || h.cardio_status === 'completed')
    const avgAdherence = last30dAdherence.length > 0 ? (
        last30dAdherence.reduce((acc, h) => {
            const pillars = [
                h.diet_percentage,
                h.workout_status === 'completed' ? 100 : 0,
                h.cardio_status === 'completed' ? 100 : 0,
                h.ergogenics_status === 'completed' ? 100 : 0
            ]
            return acc + (pillars.reduce((a, b) => a + b, 0) / 4)
        }, 0) / last30dAdherence.length
    ).toFixed(0) : 0

    const formatWhatsAppUrl = (phone: string | null | undefined, message: string) => {
        if (!phone) return '#';
        const cleaned = phone.replace(/\D/g, '');
        const formatted = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;
        return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
    };

    const studentFirstName = student?.full_name?.split(' ')[0] || 'aluno(a)';

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-6 pb-2 border-b border-zinc-800/50">
                <Link
                    href="/dashboard/trainer/students"
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                    <ChevronLeft className="w-3 h-3" />
                    Voltar para Lista
                </Link>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 md:h-16 md:w-16 border-2 border-zinc-800 shadow-2xl shrink-0">
                            <AvatarImage src={student?.avatar_url} />
                            <AvatarFallback className="bg-zinc-900 text-zinc-400 font-black text-lg md:text-xl italic uppercase">
                                {student?.full_name?.substring(0, 2) || 'AL'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 min-w-0">
                            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white font-sans italic uppercase truncate">
                                {student?.full_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                <span className="text-zinc-500 text-[10px] md:text-xs font-medium flex items-center gap-1.5 shrink-0">
                                    <Calendar className="w-3 h-3" />
                                    Desde {new Date(relationship.created_at).toLocaleDateString('pt-BR')}
                                </span>
                                <div className={`
                                    inline-flex items-center px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border
                                    ${relationship.active
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        : 'bg-zinc-800 text-zinc-500 border-zinc-700/50'}
                                `}>
                                    {relationship.active ? 'Ativo' : 'Inativo'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact payment status for mobile header */}
                    {(isPaidThisMonth || paymentStatus) && (
                        <div className="flex flex-wrap gap-2 lg:hidden">
                            {isPaidThisMonth && (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex gap-1 items-center">
                                    <CheckCircle className="w-3 h-3" /> Pago
                                </Badge>
                            )}
                            {paymentStatus === 'due_today' && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex gap-1 items-center">
                                    <AlertCircle className="w-3 h-3" /> Vence Hoje
                                </Badge>
                            )}
                            {paymentStatus === 'overdue' && (
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex gap-1 items-center">
                                    <AlertCircle className="w-3 h-3" /> Atrasado
                                </Badge>
                            )}
                        </div>
                    )}

                    <div className="hidden lg:flex items-center gap-3">
                        {isPaidThisMonth && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex gap-1 items-center">
                                <CheckCircle className="w-3 h-3" /> Pago • TAXA ZERO
                            </Badge>
                        )}
                        {paymentStatus === 'due_today' && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex gap-1 items-center">
                                    <AlertCircle className="w-3 h-3" /> Hoje: R$ {relationship.monthly_fee}
                                </Badge>
                                <MarkPaidButton studentId={student.id} trainerId={relationship.trainer_id} />
                            </div>
                        )}
                        {paymentStatus === 'overdue' && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex gap-1 items-center animate-pulse">
                                    <AlertCircle className="w-3 h-3" /> Atrasado: R$ {relationship.monthly_fee}
                                </Badge>
                                <MarkPaidButton studentId={student.id} trainerId={relationship.trainer_id} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Action Bar */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {student?.whatsapp ? (
                        <Button asChild variant="outline" className="flex-1 sm:flex-none border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl font-bold h-10 px-4 text-xs gap-2 transition-all">
                            <a href={formatWhatsAppUrl(student.whatsapp, `Olá ${studentFirstName}, tudo bem? Gostaria de conversar sobre seu planejamento.`)} target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="w-4 h-4" /> WhatsApp
                            </a>
                        </Button>
                    ) : (
                        <Button variant="outline" disabled className="flex-1 sm:flex-none border-zinc-800 bg-zinc-900/50 text-zinc-700 rounded-xl font-bold h-10 px-4 text-xs gap-2 transition-all">
                            <MessageSquare className="w-4 h-4" /> Sem WhatsApp
                        </Button>
                    )}

                    <EditStudentDialog
                        relationshipId={id}
                        studentId={student.id}
                        trainerId={relationship.trainer_id}
                        initialData={{
                            weight: details?.starting_weight,
                            body_fat: details?.body_fat,
                            monthly_fee: relationship.monthly_fee,
                            payment_day: relationship.payment_day,
                            steroid_use: details?.steroid_use,
                            whatsapp: student?.whatsapp
                        }}
                    >
                        <Button className="flex-1 sm:flex-none bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl font-bold h-10 px-6 text-xs shadow-xl active:scale-95 transition-all">
                            Editar
                        </Button>
                    </EditStudentDialog>

                    <ToggleStudentStatusButton
                        relationshipId={id}
                        isActive={relationship.active}
                    />
                </div>
            </div>

            {/* Metrics Cards — Matching Student Progress View */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    label="Peso Atual"
                    value={lastWeight || '--'}
                    unit="kg"
                    icon={<TrendingUp className="w-4 h-4" />}
                    trend={weightTrend ? (parseFloat(weightTrend) > 0 ? 'up' : 'down') : 'none'}
                    trendVal={weightTrend ? `${Math.abs(parseFloat(weightTrend))}kg` : '--'}
                    trendLabel={weightTrend ? "desde a última" : "Sem histórico"}
                />
                <StatCard
                    label="Percentual de Gordura"
                    value={lastBF || '--'}
                    unit="%"
                    icon={<Droplet className="w-4 h-4" />}
                    trend={bfTrend ? (parseFloat(bfTrend) > 0 ? 'up' : 'down') : 'none'}
                    trendVal={bfTrend ? `${Math.abs(parseFloat(bfTrend))}%` : '--'}
                    trendLabel={bfTrend ? "desde a última" : "Sem histórico"}
                />
                <StatCard
                    label="Adesão (30D)"
                    value={avgAdherence}
                    unit="%"
                    icon={<Target className="w-4 h-4" />}
                    trend="none"
                    trendVal=""
                    trendLabel="Média de Consistência"
                />
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Profile Info - Secondary Data */}
                <Card className="md:col-span-1 bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                    <CardHeader className="bg-zinc-900/60 border-b border-zinc-800/50 py-5">
                        <CardTitle className="text-[10px] font-black text-emerald-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                            <Info className="w-3.5 h-3.5" />
                            Informações Complementares
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-7 space-y-8">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <InfoField label="Altura" value={details?.height || '--'} sub="cm" />
                            <InfoField label="Idade" value={ageValue} sub="anos" />
                            <InfoField label="Gênero" value={details?.sex ? sexLabels[details.sex] : '--'} />
                            <InfoField label="Atividade" value={details?.activity_level ? activityLabels[details.activity_level] : '--'} />
                            <InfoField label="Ergogênicos" value={details?.steroid_use ? 'Sim' : 'Não'} />
                            <InfoField label="Visto" value={student?.last_seen_at ? new Date(student.last_seen_at).toLocaleDateString() : 'N/A'} />
                        </div>

                        <div className="pt-8 border-t border-zinc-800/50 space-y-5">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Financeiro</p>
                                <Wallet className="w-3 h-3 text-zinc-700" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mensalidade</span>
                                    <span className="text-base font-black text-white italic">R$ {Number(relationship.monthly_fee).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vencimento</span>
                                    <span className="text-base font-black text-zinc-100 italic">Dia {relationship.payment_day || '--'}</span>
                                </div>
                            </div>

                            {isPaidThisMonth && (
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle className="w-3 h-3" /> Pago • Taxa Zero
                                    </div>
                                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-tight">
                                        Estatus de pagamento verificado
                                    </p>
                                </div>
                            )}

                            {paymentStatus === 'due_today' && (
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                        <AlertCircle className="w-3 h-3" /> Vence Hoje
                                    </div>
                                    <div className="flex gap-2">
                                        {student.whatsapp && (
                                            <Button asChild size="sm" className="flex-1 bg-amber-500 text-black hover:bg-amber-400 font-black rounded-xl h-9 text-[9px] uppercase tracking-widest italic">
                                                <a href={formatWhatsAppUrl(student.whatsapp, `Olá ${studentFirstName}, tudo bem? Passando para lembrar que sua mensalidade da consultoria vence hoje. Qualquer dúvida, estou à disposição!`)} target="_blank" rel="noopener noreferrer">
                                                    Cobrar
                                                </a>
                                            </Button>
                                        )}
                                        <MarkPaidButton studentId={student.id} trainerId={relationship.trainer_id} className="flex-1" />
                                    </div>
                                </div>
                            )}

                            {paymentStatus === 'overdue' && (
                                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                        <AlertCircle className="w-3 h-3" /> Pagamento Atrasado
                                    </div>
                                    <div className="flex gap-2">
                                        {student.whatsapp && (
                                            <Button asChild size="sm" className="flex-1 bg-red-500 text-white hover:bg-red-400 font-black rounded-xl h-9 text-[9px] uppercase tracking-widest italic">
                                                <a href={formatWhatsAppUrl(student.whatsapp, `Olá ${studentFirstName}, tudo bem? Notei que sua mensalidade da consultoria está em aberto. Poderia verificar por gentileza? Qualquer dúvida, sigo à disposição.`)} target="_blank" rel="noopener noreferrer">
                                                    Cobrar WhatsApp
                                                </a>
                                            </Button>
                                        )}
                                        <MarkPaidButton studentId={student.id} trainerId={relationship.trainer_id} className="flex-1" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Assigned Content */}
                <div className="md:col-span-2 space-y-10">
                    <div className="space-y-10">
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Workouts Section */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                                        <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                                        Treinos Ativos
                                    </h3>
                                    {assignedWorkouts.length === 0 && (
                                        <Button asChild variant="ghost" size="sm" className="text-zinc-500 hover:text-white text-[9px] uppercase font-black tracking-widest gap-2 bg-zinc-900/50 rounded-lg h-7">
                                            <Link href="/dashboard/trainer/workouts">
                                                Novo <Plus className="w-3 h-3" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>

                                {assignedWorkouts.length > 0 ? (
                                    <div className="space-y-4">
                                        {assignedWorkouts.map((aw: any) => (
                                            <ContentCard
                                                key={aw.id}
                                                icon={<Dumbbell className="w-4 h-4 text-blue-500" />}
                                                label={aw.workout.name}
                                                actionLabel="Editar"
                                                href={`/dashboard/trainer/workouts/${aw.workout.id}`}
                                                unassignProps={{
                                                    type: 'workout',
                                                    contentId: aw.workout.id,
                                                    studentId: student.id
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl py-12 flex flex-col items-center justify-center text-center space-y-4">
                                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">Nenhum treino assinado</p>
                                        <Button asChild variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white rounded-xl h-9 px-6 text-[9px] font-black uppercase tracking-widest italic">
                                            <Link href="/dashboard/trainer/workouts">Ir para Treinos</Link>
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Diet Section */}
                            <div className="space-y-5">
                                <h3 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em] px-2">
                                    <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                                    Planos Alimentares
                                </h3>
                                {activeDiets.length > 0 ? (
                                    <div className="space-y-3">
                                        {activeDiets.map((ad: any) => {
                                            const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
                                            const daysFormatted = ad.days_of_week?.map((d: number) => dayLabels[d]).join(', ') || 'Todos os dias'

                                            return (
                                                <ContentCard
                                                    key={ad.id}
                                                    icon={<Utensils className="w-4 h-4 text-emerald-500" />}
                                                    label={ad.diet.name}
                                                    subLabel={daysFormatted}
                                                    actionLabel="Editar"
                                                    href={`/dashboard/trainer/diets/${ad.diet.id}`}
                                                    unassignProps={{
                                                        type: 'diet',
                                                        contentId: ad.diet.id,
                                                        studentId: student.id
                                                    }}
                                                />
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-900/30 border border-zinc-800/50 border-dashed rounded-3xl py-12 flex flex-col items-center justify-center text-center space-y-4">
                                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest italic">Nenhuma dieta assinada</p>
                                        <Button asChild variant="outline" size="sm" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white rounded-xl h-9 px-6 text-[9px] font-black uppercase tracking-widest italic">
                                            <Link href="/dashboard/trainer/diets">Configurar Dieta</Link>
                                        </Button>
                                    </div>
                                )}
                                {details?.steroid_use && (
                                    <div className="space-y-5 lg:col-span-2 pt-6">
                                        <h3 className="text-[10px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em] px-2 leading-none">
                                            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                                            Protocolo Ergogênico
                                        </h3>
                                        <ContentCard
                                            icon={<Syringe className="w-4 h-4 text-orange-500" />}
                                            label="Gerenciar Protocolo Farmacológico"
                                            actionLabel="Gerenciar"
                                            href={`/dashboard/trainer/students/${id}/ergogenics`}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cardio Section - Full Width */}
                        <div className="w-full">
                            <CardioAssignmentSection
                                studentId={student.id}
                                relationshipId={id}
                            />
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Recent Activities Card */}
                        <StudentRecentActivities activities={recentActivities} />

                        {/* Photo History Card */}
                        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                            <CardHeader className="bg-zinc-900/60 border-b border-zinc-800/50 py-5 flex flex-row items-center justify-between gap-4">
                                <CardTitle className="text-[10px] font-black text-purple-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Camera className="w-3.5 h-3.5" />
                                    Antes vs Depois
                                </CardTitle>
                                <StudentGalleryDialog photos={student?.progress_photos || []} studentName={student.full_name}>
                                    <Button variant="outline" size="sm" className="h-8 border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-purple-500/50 rounded-xl text-[10px] uppercase font-black tracking-widest px-4 gap-2 transition-all shadow-xl active:scale-95">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        Ver Galeria
                                    </Button>
                                </StudentGalleryDialog>
                            </CardHeader>
                            <CardContent className="p-7">
                                {(() => {
                                    const sortedPhotos = [...(student?.progress_photos || [])].sort((a, b) =>
                                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                                    );
                                    const before = sortedPhotos[0]?.front_url;
                                    const after = sortedPhotos[sortedPhotos.length - 1]?.front_url;

                                    if (!before) return (
                                        <div className="flex items-center gap-5 text-zinc-500 p-3">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                                <Camera className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest italic">Aguardando Fotos</p>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">O aluno ainda não enviou fotos</p>
                                            </div>
                                        </div>
                                    );

                                    return (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest text-center">Antes ({new Date(sortedPhotos[0].created_at).toLocaleDateString()})</p>
                                                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
                                                    <img src={before} alt="Antes" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest text-center">Depois ({new Date(sortedPhotos[sortedPhotos.length - 1].created_at).toLocaleDateString()})</p>
                                                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-zinc-900">
                                                    <img src={after} alt="Depois" className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Workout History Section */}
                    <div className="space-y-5">
                        <h3 className="text-[10px] font-black text-emerald-500 flex items-center gap-2 uppercase tracking-[0.2em] px-2 leading-none">
                            <Activity className="w-3.5 h-3.5" />
                            Histórico de Performance
                        </h3>
                        <StudentWorkoutHistory
                            history={history}
                            isBlocked={trainerTier === 'start'}
                            mode="trainer"
                        />
                    </div>
                </div>
            </div>

            {/* Performance Charts Section — Matching Student View */}
            <div className="space-y-10 mt-10">
                <PerformanceAnalysisSection
                    weights={chartData.weights}
                    bfs={chartData.bfs}
                    frequency={chartData.frequency}
                    trainerTier={trainerTier}
                />

                <UnifiedAdherenceChart
                    history={adherenceHistory}
                    showErgogenics={student.details?.steroid_use}
                    noCard
                />
            </div>
        </div>
    )
}

function InfoField({ label, value, sub }: any) {
    return (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-zinc-100 italic uppercase tracking-tighter leading-none">{value}</span>
                {sub && <span className="text-[10px] font-black text-zinc-600 uppercase italic">{sub}</span>}
            </div>
        </div>
    )
}

function ContentCard({ icon, label, subLabel, actionLabel, href, unassignProps }: any) {
    return (
        <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm group/card hover:border-zinc-700/50 transition-all duration-300">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/card:border-zinc-700 group-hover/card:shadow-[0_0_20px_rgba(255,255,255,0.02)] transition-all">
                        {icon}
                    </div>
                    <div>
                        <p className="text-zinc-100 text-sm font-black uppercase italic tracking-wide truncate max-w-[150px]">{label}</p>
                        {subLabel && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{subLabel}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {unassignProps && (
                        <UnassignButton {...unassignProps} />
                    )}
                    <Button asChild variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 h-10 rounded-2xl gap-2 border border-zinc-800/50 px-5 group-hover/card:border-zinc-700/80 transition-all flex-1 sm:flex-none italic">
                        <Link href={href}>
                            {actionLabel}
                            <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
