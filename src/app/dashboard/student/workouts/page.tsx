import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Dumbbell, Calendar, PlayCircle, Clock, ChevronRight } from 'lucide-react'

export default async function StudentWorkoutsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Get My Trainer
    const { data: relationship } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('student_id', user?.id)
        .single()

    let workouts: any[] = []
    if (user?.id) {
        const { data } = await supabase
            .from('assigned_workouts')
            .select(`
                id,
                day_of_week,
                active,
                workout:workouts(*)
            `)
            .eq('student_id', user.id)
            .eq('active', true)
        workouts = data || []
    }

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                    <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                        Meus Treinos
                    </h1>
                </div>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                    Seu treinador preparou {workouts.length} fichas de treino para você.
                </p>
            </div>

            {workouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
                    <div className="p-6 bg-zinc-950 rounded-full border border-zinc-800 mb-2">
                        <Dumbbell className="h-10 w-10 text-zinc-700" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white uppercase italic">Nenhum treino encontrado</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-[300px]">
                            Seu treinador ainda não atribuiu treinos para sua conta.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {workouts.map((assignment: any) => {
                        const workout = assignment.workout
                        const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
                        const scheduledDay = assignment.day_of_week !== undefined ? dayNames[assignment.day_of_week] : "Não agendado"

                        return (
                            <Card key={assignment.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden group backdrop-blur-sm">
                                <CardHeader className="p-8 pb-4 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 shadow-2xl transition-all duration-300">
                                            <Dumbbell className="w-8 h-8 text-zinc-700 group-hover:text-emerald-500 transition-colors shadow-inner" />
                                        </div>
                                        <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-2xl">
                                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-[10px] font-black text-white italic uppercase tracking-widest text-emerald-500">60 min</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tight group-hover:text-emerald-500 transition-colors truncate">
                                            {workout.name}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[9px] line-clamp-2">
                                            {workout.description || 'Ficha oficial preparada pelo seu treinador.'}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 pb-8 space-y-6">
                                    <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Programado</span>
                                            <span className="text-xs font-black text-zinc-400 italic">{scheduledDay}</span>
                                        </div>
                                        <Button asChild size="lg" className="h-14 bg-white hover:bg-emerald-500 text-zinc-950 font-black italic uppercase tracking-tight rounded-2xl transition-all shadow-xl active:scale-[0.98] group/btn">
                                            <Link href={`/dashboard/student/workout/${workout.id}`} className="flex items-center gap-3 px-4">
                                                Bora
                                                <div className="w-2.5 h-2.5 bg-zinc-300 rounded-full group-hover/btn:bg-white transition-colors" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
