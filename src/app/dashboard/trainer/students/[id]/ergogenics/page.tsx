import { createClient } from '@/lib/supabase/server'
import { TrainerErgogenicsView } from '@/components/feature/trainer/ergogenics-view'
import { ChevronLeft, FlaskConical } from 'lucide-react'
import Link from 'next/link'

export default async function StudentErgogenicsPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = await createClient()

    // Get relationship to find student_id
    const { data: relationship } = await supabase
        .from('trainer_students')
        .select('student_id')
        .eq('id', id)
        .single()

    if (!relationship) {
        return <div className="p-10 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Dados não encontrados.</div>
    }

    const { data: ergogenics } = await supabase
        .from('ergogenics')
        .select('*')
        .eq('student_id', relationship.student_id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col gap-6 pb-2 border-b border-zinc-800/50">
                <Link
                    href={`/dashboard/trainer/students/${id}`}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                >
                    <ChevronLeft className="w-3 h-3" />
                    Voltar para Aluno
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <FlaskConical className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white font-sans italic uppercase">
                            Ergogênicos & Ciclos
                        </h1>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Organize o protocolo farmacológico do aluno</p>
                    </div>
                </div>
            </div>

            <TrainerErgogenicsView
                studentId={relationship.student_id}
                initialData={ergogenics || []}
            />
        </div>
    )
}
