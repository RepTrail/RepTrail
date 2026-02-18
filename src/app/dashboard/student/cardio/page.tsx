import { createClient } from '@/lib/supabase/server'
import { getStudentCardioAssignments } from '@/actions/cardio-actions'
import { CardioPlayer } from '@/components/feature/student/cardio-player'
import { Flame, Activity, Clock, Timer, History } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default async function StudentCardioPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

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
