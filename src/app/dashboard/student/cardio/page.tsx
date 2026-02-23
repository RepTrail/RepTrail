import { createClient } from '@/lib/supabase/server'
import { getStudentCardioAssignments, getCardioLibrary } from '@/actions/cardio-actions'
import { CardioPlayer } from '@/components/feature/student/cardio-player'
import { Flame, Activity, Clock, Timer, History, ChevronRight, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CreateCardioDialog } from '@/components/feature/trainer/create-cardio-dialog'
import { DuplicateButton } from '@/components/feature/trainer/duplicate-button'
import { ScheduleCardioDialog } from '@/components/feature/student/schedule-cardio-dialog'

export default async function StudentCardioPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: trainerRel } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'

    // Auto-training (no trainer): show cardio library + CRUD
    if (!trainerRel && isAutoTrainingActive) {
        const cardios = await getCardioLibrary()
        const assignments = await getStudentCardioAssignments(user.id)

        // Create a map of cardioId to assigned days
        const cardioDaysMap = assignments.reduce((acc: any, assignment: any) => {
            if (!acc[assignment.cardio_id]) {
                acc[assignment.cardio_id] = []
            }
            acc[assignment.cardio_id].push(assignment.day_of_week)
            return acc
        }, {})

        return (
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                            Biblioteca de Cardio
                        </h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-orange-500" />
                            Gerencie seus modelos de cardio
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <CreateCardioDialog />
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cardios.length > 0 ? (
                        cardios.map((cardio: any) => {
                            const assignedDays = cardioDaysMap[cardio.id] || []
                            const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
                            
                            return (
                                <Card key={cardio.id} className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-orange-500/30 transition-all group rounded-[2rem] overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <CardTitle className="mt-4 text-xl font-black italic uppercase tracking-tight">{cardio.name}</CardTitle>
                                        <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest line-clamp-2">
                                            {cardio.description || "Sem descrição."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 border-t border-zinc-800 pt-4">
                                            <span>Template</span>
                                            <span>{new Date(cardio.created_at).toLocaleDateString('pt-BR')}</span>
                                        </div>

                                        {assignedDays.length > 0 && (
                                            <div className="mb-6 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="w-3 h-3 text-orange-400" />
                                                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Agendado para:</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {assignedDays.sort((a: number, b: number) => a - b).map((day: number) => (
                                                        <span key={day} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-[8px] font-black uppercase rounded-lg border border-orange-500/30">
                                                            {dayNames[day]}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                            <ScheduleCardioDialog cardioId={cardio.id} />
                                            <div className="flex gap-2">
                                                <Button asChild size="sm" className="flex-1 bg-zinc-100 text-zinc-900 hover:bg-white flex items-center justify-center gap-1.5 rounded-xl font-bold">
                                                    <Link href={`/dashboard/student/cardio/${cardio.id}`}>
                                                        Editar
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </Button>
                                                <DuplicateButton id={cardio.id} type="cardio" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <Card className="col-span-full bg-zinc-900/40 border-dashed border-zinc-800 rounded-[3rem] p-20 text-center">
                            <div className="flex flex-col items-center gap-6">
                                <div className="p-6 bg-zinc-900 rounded-[2rem] text-zinc-700 border border-zinc-800">
                                    <Activity className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Nenhum cardio encontrado</h3>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Crie seu primeiro modelo de cardio para começar.</p>
                                </div>
                                <CreateCardioDialog />
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        )
    }

    const cardios = await getStudentCardioAssignments(user.id)

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-xl">
                            <Activity className="w-5 h-5 text-zinc-950" />
                        </div>
                        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                            Meus <span className="text-orange-500">Cardios</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium max-w-md">
                        Gerencie suas sessões de cardio, queime calorias e acompanhe sua evolução cardiovascular.
                    </p>
                </div>
            </header>

            <div className="grid gap-10 lg:grid-cols-12">
                {/* Active Sessions */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                            <Timer className="w-4 h-4 text-orange-500" />
                            Sessões Pendentes
                        </h2>
                    </div>

                    {cardios.length > 0 ? (
                        <div className="grid gap-8">
                            {cardios.map((assignment: any) => (
                                <CardioPlayer key={assignment.id} assignment={assignment} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-[3rem] py-24 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="p-6 bg-zinc-900 rounded-full border border-zinc-800">
                                <Activity className="w-12 h-12 text-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-white text-lg font-black uppercase tracking-tight italic">Tudo em dia!</p>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-[250px] leading-relaxed">
                                    Não há cardios atribuídos para você no momento. Continue focado nos treinos!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em] px-2">
                            <History className="w-4 h-4 text-emerald-500" />
                            Dicas de Cardio
                        </h2>
                        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-xl">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Intensidade</p>
                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                                        Mantenha uma frequência cardíaca constante para maximizar a queima de gordura.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Hidratação</p>
                                    <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                                        Beber água durante o cardio ajuda a manter a temperatura corporal e a performance.
                                    </p>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <span className="text-[10px] font-black text-white uppercase italic">Metabolismo em Alta</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
