'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentRelationship, getTrainerProfile } from '@/actions/trainer-actions'
import { useTrainerOnboarding } from '@/hooks/use-trainer-onboarding'
import { getStudentWorkoutHistory, getStudentRecentActivities } from '@/actions/log-actions'
import { getStudentMetricsHistory, getStudentChartData } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
import { getStudentCardioAssignments } from '@/actions/cardio-actions'
import { getAssignedErgogenics } from '@/actions/ergogenics-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    ChevronLeft,
    Calendar,
    TrendingUp,
    Target,
    Droplet,
    Info,
    Wallet,
    CheckCircle,
    AlertCircle,
    Dumbbell,
    Utensils,
    Plus,
    Sparkles,
    Syringe,
    Camera,
    Activity,
    ArrowUpRight,
    Zap,
    Eye,
    MessageSquare,
    ArrowRight,
    Users
} from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditStudentDialog } from './edit-student-dialog'
import { StudentGalleryDialog } from './student-gallery-dialog'
import { MarkPaidButton } from './mark-paid-button'
import { StudentWorkoutHistory } from './student-workout-history'
import { UnifiedAdherenceChart } from '@/components/store/advanced/unified-adherence-chart'
import { UnifiedDeleteButton } from '@/components/store/features(deprecated)/unified-delete-button'
import { ToggleStudentStatusButton } from './toggle-student-status-button'
import { StatCard } from '@/components/store/features(deprecated)/stat-card'
import { PerformanceAnalysisSection } from '@/components/store/advanced/performance-analysis-section'
import { StudentRecentActivities } from './student-recent-activities'
import { useToast } from '@/hooks/use-toast'

interface StudentDetailClientProps {
    relationshipId: string
    userId: string
}

export function StudentDetailClient({ relationshipId, userId }: StudentDetailClientProps) {
    const { toast } = useToast()
    // ─── Queries ──────────────────────────────────────────────────────────
    const { data: relationship } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        queryFn: () => getStudentRelationship(relationshipId),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    if (relationship) {
        console.log(`[STUDENT-DETAIL] Relationship Data:`, {
            id: relationship.id,
            is_placeholder: relationship.is_placeholder,
            student_name: relationship.student?.full_name,
            diets: relationship.student?.assigned_diets?.length,
            cardios: relationship.student?.assigned_cardios?.length,
            ergos: relationship.student?.ergogenics?.length
        });
    }

    const queryClient = useQueryClient()
    const [hasCheckedLink, setHasCheckedLink] = useState(false)

    // ─── Auto-sync on mount ──────────────────────────────────────────
    useEffect(() => {
        // Only trigger once to check for linking, avoid loop
        if (relationship?.is_placeholder && !hasCheckedLink) {
            console.log("[STUDENT-DETAIL] Placeholder detected, checking for link...")
            setHasCheckedLink(true)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId) })
        }
    }, [relationship?.is_placeholder, hasCheckedLink, relationshipId, queryClient])

    const studentId = relationship?.student_id

    const { data: history = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentHistory(studentId!),
        queryFn: () => getStudentWorkoutHistory(studentId!),
        enabled: !!studentId,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: metricsHistory = { weights: [], bfs: [] } } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentMetrics(studentId!),
        queryFn: () => getStudentMetricsHistory(studentId!),
        enabled: !!studentId,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: chartData = { weights: [], bfs: [], frequency: [] } } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentChartData(studentId!),
        queryFn: () => getStudentChartData(studentId!),
        enabled: !!studentId,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: adherenceHistory = [] } = useQuery({
        queryKey: QUERY_KEYS.trainer.studentAdherence(studentId!),
        queryFn: () => getStudentAdherenceHistory(studentId!, 30),
        enabled: !!studentId,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: trainerProfile } = useQuery({
        queryKey: QUERY_KEYS.profile.detail(userId),
        queryFn: () => getTrainerProfile()
    })
    const { data: recentActivities = [] } = useQuery({
        queryKey: ['student-recent-activities', studentId],
        queryFn: () => getStudentRecentActivities(studentId!, 50),
        enabled: !!studentId,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: cardioAssignments = [] } = useQuery({
        queryKey: QUERY_KEYS.cardio.assignments(studentId!),
        queryFn: () => getStudentCardioAssignments(studentId!),
        enabled: !!studentId,
        staleTime: 0,
        refetchOnMount: 'always'
    })
    const { data: ergogenics = [] } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(studentId!),
        queryFn: () => getAssignedErgogenics(studentId!),
        enabled: !!studentId,
        staleTime: 0,
        refetchOnMount: 'always'
    })

    const { step: onboardingStep, complete } = useTrainerOnboarding(userId, {
        activeStudents: 0,
        workoutsCount: 0,
        dietsCount: 0
    })

    const [isImpersonating, setIsImpersonating] = useState(false)

    useEffect(() => {
        const cookies = document.cookie.split('; ')
        const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
        setIsImpersonating(imp === 'true')
    }, [])

    if (!relationship) return null

    const trainerTier = trainerProfile?.plan_tier || 'start'
    const { student } = relationship
    const details = student?.details

    const assignedWorkouts = student?.assigned_workouts?.filter((aw: any) => aw.active) || []
    const activeDiets = student?.assigned_diets?.filter((ad: any) => ad.active) || []

    // Use data from relationship if placeholder, fallback to separate queries
    const displayCardios = cardioAssignments.length > 0
        ? cardioAssignments
        : (student?.assigned_cardios || [])

    const displayErgogenics = ergogenics.length > 0
        ? ergogenics
        : (student?.ergogenics || [])

    // ─── Metrics Calculation ─────────────────────────────────────────────
    const weights = metricsHistory.weights || []
    const lastWeight = weights[weights.length - 1]?.weight_kg ?? details?.starting_weight
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const weightBase30 = weights.filter((w: any) => new Date(w.recorded_at) <= thirtyDaysAgo).at(-1) ?? weights[0]
    const weightTrend = (lastWeight != null && weightBase30 && weightBase30.weight_kg !== lastWeight)
        ? (lastWeight - weightBase30.weight_kg).toFixed(1)
        : null

    const bfs = metricsHistory.bfs || []
    const lastBF = bfs.length > 0 ? bfs[bfs.length - 1]?.bf_percentage : details?.body_fat
    const bfBase30 = bfs.filter((b: any) => new Date(b.recorded_at) <= thirtyDaysAgo).at(-1) ?? bfs[0]
    const bfTrend = (lastBF != null && bfBase30 && bfBase30.bf_percentage !== lastBF)
        ? (lastBF - bfBase30.bf_percentage).toFixed(1)
        : null

    const last30dAdherence = (adherenceHistory || []).filter((h: any) => h.diet_percentage > 0 || h.workout_status === 'completed' || h.cardio_status === 'completed')
    const avgAdherence = last30dAdherence.length > 0 ? (
        last30dAdherence.reduce((acc: number, h: any) => {
            const pillars = [
                h.diet_percentage,
                h.workout_status === 'completed' ? 100 : 0,
                h.cardio_status === 'completed' ? 100 : 0,
                h.ergogenics_status === 'completed' ? 100 : 0
            ]
            return acc + (pillars.reduce((a, b) => a + b, 0) / 4)
        }, 0) / last30dAdherence.length
    ).toFixed(0) : 0

    const sexLabels: Record<string, string> = { male: 'Masc.', female: 'Fem.', other: 'Outro' }
    const activityLabels: Record<string, string> = { sedentary: 'Sedentário', light: 'Leve', moderate: 'Moderado', active: 'Ativo', athlete: 'Atleta' }

    const calculateAge = (birthDate: string | null) => {
        if (!birthDate) return '--'
        const birth = new Date(birthDate)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
        return age
    }

    const todayDay = new Date().getDate()
    const paymentDay = relationship.payment_day
    const lastPayment = relationship.last_payment_date
    const isPaidThisMonth = lastPayment &&
        new Date(lastPayment).getMonth() === new Date().getMonth() &&
        new Date(lastPayment).getFullYear() === new Date().getFullYear()

    let paymentStatus = null
    if (paymentDay && !isPaidThisMonth) {
        if (todayDay === paymentDay) paymentStatus = 'due_today'
        else if (todayDay > paymentDay) paymentStatus = 'overdue'
    }

    const formatWhatsAppUrl = (phone: string | null | undefined, message: string) => {
        if (!phone) return '#';
        const cleaned = phone.replace(/\D/g, '');
        return `https://wa.me/${cleaned.startsWith('55') ? cleaned : `55${cleaned}`}?text=${encodeURIComponent(message)}`;
    };

    return (
        <RegistryMain
            title={student?.full_name?.split(' ')[0] || "DETALHES DO ALUNO"}
            subtitle="Análise de desempenho, protocolos ativos e histórico completo."
            icon={Users}
            contextLabel="Gestão de Aluno"
            showTabs={false}
        >
            <Stack gap={10} className="pb-10">

                {((onboardingStep === 'aha_moment' || relationship.is_placeholder) && !isImpersonating) && (
                    <div id="tour-aha-card" className="bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Sparkles className="w-24 h-24 text-emerald-500" />
                        </div>
                        <div className="space-y-2 relative z-10 text-center md:text-left">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center justify-center md:justify-start gap-2">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                Protocolo Pronto! 🔥
                            </h3>
                            <p className="text-zinc-400 text-sm max-w-md">
                                Tudo foi importado e o acesso do <b>{student?.full_name}</b> já está configurado. Envie agora pelo WhatsApp para ele começar!
                            </p>
                        </div>
                        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                            <Button
                                onClick={() => {
                                    if (!student?.whatsapp) {
                                        toast({
                                            variant: "destructive",
                                            title: "WhatsApp não cadastrado!",
                                            description: "Adicione o número do aluno no perfil para enviar o acesso."
                                        });
                                        return;
                                    }
                                    const studentName = student?.full_name?.split(' ')[0];
                                    const trainerName = trainerProfile?.full_name?.split(' ')[0] || 'seu treinador';
                                    const msg = `Fala ${studentName}! Aqui é o ${trainerName}. Já montei seu protocolo no RepTrail!\n\nPara acessar seu treino e dieta, utilize o link abaixo:\nhttps://reptrail.com.br\n\nUtilize seu e-mail para o cadastro:\n${student?.email}\n\nBora pra cima!`;
                                    window.open(formatWhatsAppUrl(student?.whatsapp, msg), '_blank');
                                }}
                                className="flex-1 md:flex-none h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase italic tracking-widest text-sm rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <MessageSquare className="w-5 h-5" /> Enviar Acesso
                            </Button>
                        </div>
                    </div>
                )}


                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
                    <StatCard label="Peso Atual" value={lastWeight || '--'} unit="kg" icon={<TrendingUp className="w-4 h-4" />} trend={weightTrend ? (parseFloat(weightTrend) > 0 ? 'up' : 'down') : 'none'} trendVal={weightTrend ? `${Math.abs(parseFloat(weightTrend))}kg` : '--'} trendLabel="nos últimos 30d" />
                    <StatCard label="Percentual de Gordura" value={lastBF || '--'} unit="%" icon={<Droplet className="w-4 h-4" />} trend={bfTrend ? (parseFloat(bfTrend) > 0 ? 'up' : 'down') : 'none'} trendVal={bfTrend ? `${Math.abs(parseFloat(bfTrend))}%` : '--'} trendLabel="nos últimos 30d" />
                    <StatCard label="Adesão (30D)" value={avgAdherence} unit="%" icon={<Target className="w-4 h-4" />} trend="none" trendLabel="Média de Consistência" />
                </div>


                <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                    <Card className="bg-zinc-900 border-zinc-800 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden w-full">

                        <CardHeader className="bg-zinc-900/60 border-b border-zinc-800/50 py-6">
                            <CardTitle className="text-[10px] font-black text-emerald-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <Info className="w-3.5 h-3.5" /> INFORMAÇÕES COMPLEMENTARES
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-7 space-y-10">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-y-10">
                                <InfoField label="Altura" value={details?.height || '--'} sub="CM" />
                                <InfoField label="Idade" value={details?.age || calculateAge(details?.birth_date)} sub="ANOS" />
                                <InfoField label="Ergogênicos" value={details?.steroid_use ? 'SIM' : 'NÃO'} />
                                <InfoField label="Visto" value={new Date().toLocaleDateString('en-US')} />
                            </div>


                            <div className="pt-6 border-t border-zinc-800/50 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                        <Wallet className="w-3.5 h-3.5" /> FINANCEIRO
                                    </h4>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-zinc-900/80 border border-zinc-800/50 p-5 flex items-center justify-between group hover:border-zinc-700 transition-colors rounded-[2rem]">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">MENSALIDADE</span>
                                        <span className="text-lg font-black text-white italic">R$ {Number(relationship.monthly_fee || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="bg-zinc-900/80 border border-zinc-800/50 p-5 flex items-center justify-between group hover:border-zinc-700 transition-colors rounded-[2rem]">
                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">VENCIMENTO</span>
                                        <span className="text-lg font-black text-white italic">Dia {relationship.payment_day || '--'}</span>
                                    </div>
                                </div>


                                {paymentStatus === 'overdue' && (
                                    <div className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-5 space-y-5">
                                        <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <AlertCircle className="w-3.5 h-3.5" /> PAGAMENTO ATRASADO
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full bg-[#FF3B3B] hover:bg-red-600 border-none text-white font-black uppercase italic tracking-widest h-10 rounded-xl text-[9px] px-0 shadow-lg shadow-red-500/20 transition-all active:scale-95"
                                            >
                                                <a
                                                    href={formatWhatsAppUrl(student?.whatsapp, `Olá ${student?.full_name?.split(' ')[0]}, tudo bem? Notei que sua mensalidade da consultoria está em aberto. Poderia verificar por gentileza? Qualquer dúvida, sigo à disposição.`)}
                                                    target="_blank"
                                                    className="w-full h-full flex items-center justify-center"
                                                >

                                                    COBRAR WHATSAPP
                                                </a>
                                            </Button>
                                            <MarkPaidButton relationshipId={relationshipId} studentId={studentId!} trainerId={userId} asChild>
                                                <Button
                                                    className="w-full bg-[#00C48C] hover:bg-emerald-600 text-zinc-950 font-black uppercase italic tracking-widest h-10 rounded-xl text-[9px] gap-2 px-0 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" /> JÁ RECEBI
                                                </Button>
                                            </MarkPaidButton>
                                        </div>

                                    </div>
                                )}

                            </div>
                        </CardContent>
                    </Card>


                    <div className="md:col-span-2 space-y-10 min-w-0">


                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* COLUNA 1: Treinos e Ergogênicos */}
                            <div className="space-y-10 min-w-0">

                                <div className="space-y-5">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                                            <Dumbbell className="w-3.5 h-3.5 text-orange-500" /> Treinos Ativos
                                        </h3>
                                        <Button asChild variant="ghost" className="h-6 text-[9px] font-black uppercase italic tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg px-2 gap-1.5">
                                            <Link href="/dashboard/trainer/workouts">
                                                Gerenciar <ArrowRight className="w-2.5 h-2.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                    {assignedWorkouts.length > 0 ? (
                                        assignedWorkouts.map((aw: any, idx: number) => (
                                            <ContentCard
                                                key={aw.id || `workout-${idx}`}
                                                icon={<Dumbbell className="w-4 h-4 text-orange-500" />}
                                                label={aw.workout.name}
                                                actionLabel="Editar"
                                                href={`/dashboard/trainer/workouts/${aw.workout.id}`}
                                                showAction={relationship.active}
                                                daysOfWeek={aw.day_of_week !== null ? [aw.day_of_week] : undefined}
                                                secondaryAction={<UnifiedDeleteButton
                                                    actionType="workout"
                                                    id={aw.id}
                                                    contentId={aw.workout.id}
                                                    studentId={studentId!}
                                                    relationshipId={relationshipId}
                                                    itemName={aw.workout.name}
                                                    queryKey={QUERY_KEYS.workouts.assignments(studentId!)}
                                                />}
                                            />
                                        ))
                                    ) : (
                                        <EmptyStateCard
                                            icon={<Dumbbell className="w-4 h-4" />}
                                            label="Sem treinos ativos"
                                            actionLabel="Atribuir Treino"
                                            href="/dashboard/trainer/workouts"
                                        />
                                    )}
                                </div>

                                <div className="space-y-5 pt-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                                            <Syringe className="w-3.5 h-3.5 text-purple-500" /> Protocolo de Recuperação
                                        </h3>
                                        <Button asChild variant="ghost" className="h-6 text-[9px] font-black uppercase italic tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg px-2 gap-1.5">
                                            <Link href={`/dashboard/trainer/students/${studentId}/ergogenics`}>
                                                Gerenciar <ArrowRight className="w-2.5 h-2.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                    {displayErgogenics.length > 0 ? (
                                        <ContentCard
                                            icon={<Syringe className="w-4 h-4 text-purple-500" />}
                                            label={`${displayErgogenics.length} Substância${displayErgogenics.length > 1 ? 's' : ''} Prescrita${displayErgogenics.length > 1 ? 's' : ''}`}
                                            subLabel="Protocolo Farmacológico Ativo"
                                            actionLabel="Ver Protocolo"
                                            href={`/dashboard/trainer/students/${studentId}/ergogenics`}
                                            showAction={relationship.active}
                                        />
                                    ) : (
                                        <EmptyStateCard
                                            icon={<Syringe className="w-4 h-4" />}
                                            label="Sem protocolos ativos"
                                            actionLabel="Adicionar"
                                            href={`/dashboard/trainer/students/${studentId}/ergogenics`}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* COLUNA 2: Dieta e Cardios */}
                            <div className="space-y-10 min-w-0">

                                <div className="space-y-5">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                                            <Utensils className="w-3.5 h-3.5 text-orange-500" /> Dieta Ativa
                                        </h3>
                                        <Button asChild variant="ghost" className="h-6 text-[9px] font-black uppercase italic tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg px-2 gap-1.5">
                                            <Link href="/dashboard/trainer/diets">
                                                Gerenciar <ArrowRight className="w-2.5 h-2.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                    {activeDiets.length > 0 ? (
                                        activeDiets.map((ad: any, idx: number) => (
                                            <ContentCard
                                                key={ad.id || `diet-${idx}`}
                                                icon={<Utensils className="w-4 h-4 text-orange-500" />}
                                                label={ad.diet.name}
                                                actionLabel="Editar"
                                                href={`/dashboard/trainer/diets/${ad.diet.id}`}
                                                showAction={relationship.active}
                                                daysOfWeek={ad.days_of_week}
                                                secondaryAction={<UnifiedDeleteButton
                                                    actionType="diet"
                                                    id={ad.id}
                                                    contentId={ad.diet.id}
                                                    studentId={studentId!}
                                                    relationshipId={relationshipId}
                                                    itemName={ad.diet.name}
                                                    queryKey={QUERY_KEYS.diets.assignments(studentId!)}
                                                />}
                                            />
                                        ))
                                    ) : (
                                        <EmptyStateCard
                                            icon={<Utensils className="w-4 h-4" />}
                                            label="Sem dieta ativa"
                                            actionLabel="Atribuir Dieta"
                                            href="/dashboard/trainer/diets"
                                        />
                                    )}
                                </div>

                                <div className="space-y-5 pt-4">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 text-orange-500" /> Cardios Atribuídos
                                        </h3>
                                        <Button asChild variant="ghost" className="h-6 text-[9px] font-black uppercase italic tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg px-2 gap-1.5">
                                            <Link href="/dashboard/trainer/cardio">
                                                Gerenciar <ArrowRight className="w-2.5 h-2.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                    {displayCardios.length > 0 ? (
                                        <div className="space-y-4">
                                            {displayCardios.map((a: any, idx: number) => (
                                                <ContentCard
                                                    key={a.id || `cardio-${idx}`}
                                                    icon={<Activity className="w-4 h-4 text-orange-500" />}
                                                    label={a.cardio.name}
                                                    subLabel={`${a.duration_minutes} MIN`}
                                                    showAction={relationship.active}
                                                    daysOfWeek={a.days_of_week}
                                                    deleteProps={{
                                                        id: a.id,
                                                        actionType: 'cardio',
                                                        itemName: a.cardio.name,
                                                        studentId: studentId!,
                                                        relationshipId: relationshipId,
                                                        queryKey: QUERY_KEYS.cardio.assignments(studentId!),
                                                        onMutate: (vars: { id: string }) => {
                                                            queryClient.setQueryData(QUERY_KEYS.cardio.assignments(studentId!), (old: any) => {
                                                                if (!old) return old
                                                                return old.filter((c: any) => c.id !== vars.id)
                                                            })
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyStateCard
                                            icon={<Zap className="w-4 h-4" />}
                                            label="Sem cardios ativos"
                                            actionLabel="Atribuir Cardio"
                                            href="/dashboard/trainer/cardio"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid gap-6 md:grid-cols-2">
                    <StudentRecentActivities activities={recentActivities} />

                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
                        <CardHeader className="bg-zinc-900/60 border-b border-zinc-800/50 py-5 flex flex-row items-center justify-between gap-4">
                            <CardTitle className="text-[10px] font-black text-purple-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <Camera className="w-3.5 h-3.5" /> Antes vs Depois
                            </CardTitle>
                            <StudentGalleryDialog
                                photos={student?.progress_photos || []}
                                studentName={student?.full_name || ''}
                                trigger={
                                    <Button variant="ghost" className="h-7 border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl text-[9px] uppercase font-black tracking-widest px-3 gap-2">
                                        <Eye className="w-3 h-3" /> Ver Galeria
                                    </Button>
                                }
                            />
                        </CardHeader>
                        <CardContent className="p-7 flex flex-col items-center justify-center min-h-[220px] text-center space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700">
                                <Camera className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Aguardando Fotos</p>
                                <p className="text-[9px] text-zinc-600 font-medium">O aluno ainda não enviou fotos</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {!relationship.is_placeholder && (
                    <>
                        <StudentWorkoutHistory history={history} isBlocked={trainerTier === 'start'} mode="trainer" />
                        <PerformanceAnalysisSection weights={chartData.weights} bfs={chartData.bfs} frequency={chartData.frequency} trainerTier={trainerTier} />
                        <UnifiedAdherenceChart history={adherenceHistory} showErgogenics={student.details?.steroid_use} noCard />
                    </>
                )}

                {relationship.is_placeholder && (
                    <Card className="bg-zinc-950 border-zinc-800 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div className="space-y-2 max-w-sm">
                            <h3 className="text-xl font-black text-white italic uppercase">Aguardando Cadastro</h3>
                            <p className="text-zinc-500 text-sm">
                                Este aluno foi criado como um <b>Placeholder</b>. Assim que ele criar uma conta usando o email <b>{student?.email}</b>, todos os dados serão vinculados automaticamente.
                            </p>
                        </div>
                    </Card>
                )}
            </Stack>
        </RegistryMain>
    )
}

function InfoField({ label, value, sub }: any) {
    return (
        <div className="space-y-2">
            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
            <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-zinc-100 italic uppercase">
                    {value}
                </span>
                {sub && <span className="text-[10px] font-bold text-zinc-600 uppercase italic leading-none">{sub}</span>}
            </div>
        </div>
    )
}


const DAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function DayDisplay({ days }: { days: number[] | number | null | undefined }) {
    if (days === null || days === undefined) return null;

    const dayArray = Array.isArray(days) ? days : [days];
    if (dayArray.length === 0) return null;

    if (dayArray.length === 7) return (
        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
            Diário
        </span>
    );

    return (
        <div className="flex gap-0.5 shrink-0">
            {dayArray.map(d => (
                <span key={d} className="w-4 h-4 flex items-center justify-center text-[8px] font-black bg-zinc-800 text-zinc-400 rounded-md border border-zinc-700">
                    {DAYS_SHORT[d]}
                </span>
            ))}
        </div>
    );
}

function ContentCard({ icon, label, subLabel, actionLabel, href, showAction = true, deleteProps, secondaryAction, daysOfWeek }: any) {
    return (
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center justify-between group hover:border-zinc-700 transition-all gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">{icon}</div>
                <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <p className="text-zinc-100 text-xs md:text-sm font-black uppercase italic truncate">{label}</p>
                        <DayDisplay days={daysOfWeek} />
                    </div>
                    {subLabel && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{subLabel}</p>}
                </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                {showAction && href && (
                    <Button asChild variant="ghost" className="text-[10px] font-black uppercase text-zinc-400 hover:text-white h-9 px-4 rounded-xl border border-zinc-800 italic">
                        <Link href={href}>{actionLabel}</Link>
                    </Button>
                )}
                {showAction && secondaryAction}
                {showAction && deleteProps && (
                    <UnifiedDeleteButton {...deleteProps} />
                )}
            </div>
        </div>
    );
}


function EmptyStateCard({ icon, label, actionLabel, href }: any) {
    return (
        <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center text-zinc-700">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
                <Button asChild variant="link" className="text-orange-500 h-auto p-0 text-[10px] uppercase font-black italic gap-1.5 group">
                    <Link href={href}>
                        {actionLabel}
                        <Plus className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}

