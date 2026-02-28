import { createClient } from '@/lib/supabase/server'
import { getStudentCardioAssignments, getCardioLibrary } from '@/actions/cardio-actions'
import { CardioInfoCard } from '@/components/feature/student/cardio-info-card'
import { Flame, Activity, History, Calendar, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { DuplicateButton } from '@/components/feature/trainer/duplicate-button'
import { UnifiedAssignDialog } from '@/components/feature/shared/unified-assign-dialog'
import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'
import { cn } from "@/lib/utils"

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

    const assignments = await getStudentCardioAssignments(user.id)
    const cardios = isAutoTrainingActive ? await getCardioLibrary() : []

    // Create a map of cardioId to assigned days
    const cardioDaysMap = assignments.reduce((acc: any, assignment: any) => {
        if (!acc[assignment.cardio_id]) {
            acc[assignment.cardio_id] = []
        }
        if (assignment.day_of_week !== undefined && assignment.day_of_week !== null) {
            acc[assignment.cardio_id].push(assignment.day_of_week)
        } else if (assignment.days_of_week && Array.isArray(assignment.days_of_week)) {
            acc[assignment.cardio_id].push(...assignment.days_of_week)
        }
        return acc
    }, {})

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
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

                {isAutoTrainingActive && !trainerRel && (
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <UnifiedCreationDialog
                            title="Novo Modelo de Cardio"
                            description="Crie um template (ex: Esteira 45min) para agendar para seus auto-treinos."
                            trigger={
                                <Button className="flex-1 sm:flex-none h-12 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Criar Modelo
                                </Button>
                            }
                            fields={[
                                { name: 'name', label: 'Nome do Cardio', placeholder: 'Ex: Corrida na Esteira', required: true },
                                { name: 'duration_minutes', label: 'Duração (min)', placeholder: '30', type: 'number', required: true },
                                {
                                    name: 'suggested_intensity', label: 'Intensidade Sugerida', type: 'select', defaultValue: 'Moderada', options: [
                                        { label: 'Leve', value: 'Leve', color: '#10b981' },
                                        { label: 'Moderada', value: 'Moderada', color: '#f59e0b' },
                                        { label: 'Alta', value: 'Alta', color: '#ef4444' },
                                        { label: 'Máxima', value: 'Máxima', color: '#a855f7' }
                                    ], required: true
                                },
                                { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Ex: 45 minutos em ritmo moderado', type: 'textarea' }
                            ]}
                            actionType="create-student-cardio"
                            successMessage="Modelo de cardio criado com sucesso!"
                            colorScheme="orange"
                        />
                    </div>
                )}
            </header>

            <div className="grid gap-10 lg:grid-cols-12 px-4">
                <div className="lg:col-span-8 space-y-10">
                    {trainerRel ? (
                        /* Trainer View: read-only sessions */
                        <div className="space-y-8">
                            <div className="px-2">
                                <h2 className="text-[12px] font-black text-zinc-100 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Activity className="w-4 h-4 text-orange-500" />
                                    Sessões Pendentes
                                </h2>
                            </div>
                            {assignments.length > 0 ? (
                                <div className="space-y-6">
                                    {assignments.map((assignment: any) => (
                                        <CardioInfoCard key={assignment.id} assignment={assignment} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center border-dashed border border-zinc-800 rounded-3xl">
                                    <Activity className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase">Nenhum cardio prescrito pelo seu personal.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Auto-Training View: editable library */
                        <div className="space-y-8">
                            <div className="grid gap-6 md:grid-cols-2">
                                {isAutoTrainingActive && (
                                    <>
                                        {cardios.length > 0 ? (
                                            cardios.map((cardio: any) => {
                                                const assignedDays = cardioDaysMap[cardio.id] || []
                                                const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

                                                return (
                                                    <Card key={cardio.id} className="bg-zinc-900/50 border-zinc-800 text-zinc-100 hover:border-orange-500/30 transition-all group rounded-[2rem] overflow-hidden">
                                                        <CardHeader className="pb-2">
                                                            <div className="flex items-start justify-between">
                                                                <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
                                                                    <Activity className="w-5 h-5" />
                                                                </div>
                                                                <UnifiedDeleteButton
                                                                    id={cardio.id}
                                                                    actionType="cardio"
                                                                    itemName={cardio.name}
                                                                    className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                                />
                                                            </div>
                                                            <CardTitle className="mt-4 text-lg font-black italic uppercase tracking-tight">{cardio.name}</CardTitle>
                                                            <CardDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest line-clamp-2">
                                                                {cardio.description || "Sem descrição."}
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            {assignedDays.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 mb-6">
                                                                    {(Array.from(new Set(assignedDays)) as number[]).sort((a: number, b: number) => a - b).map((day: number) => (
                                                                        <span key={day} className="flex items-center shrink-0 gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase rounded-[0.5rem] border border-orange-500/20">
                                                                            <Calendar className="w-2.5 h-2.5" />
                                                                            {dayNames[day]}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center gap-2">
                                                                <UnifiedAssignDialog
                                                                    title="Agendar Cardio"
                                                                    description="Escolha os dias da semana para este protocolo."
                                                                    itemId={cardio.id}
                                                                    fixedStudentId={user.id}
                                                                    type="cardio"
                                                                    initialDays={Array.from(new Set(assignedDays))}
                                                                    trigger={
                                                                        <Button
                                                                            className="flex-1 min-w-0 h-9 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-1.5 px-3"
                                                                        >
                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                            <span className="truncate">Agendar</span>
                                                                        </Button>
                                                                    }
                                                                />
                                                                <Button asChild variant="outline" className="flex-1 min-w-0 h-9 bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700 flex items-center justify-center gap-1.5 rounded-xl font-black text-[10px] uppercase italic tracking-widest border-white/5 px-3">
                                                                    <Link href={`/dashboard/student/cardio/${cardio.id}`}>
                                                                        <span className="truncate">Editar</span>
                                                                    </Link>
                                                                </Button>
                                                                <DuplicateButton id={cardio.id} type="cardio" className="h-9 w-9" />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            })
                                        ) : (
                                            <div className="col-span-full py-10 text-center border-dashed border border-zinc-800 rounded-3xl">
                                                <p className="text-zinc-500 text-[10px] font-bold uppercase">Sua biblioteca está vazia.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

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
