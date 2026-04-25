import { createClient } from '@/lib/supabase/server'
import { ChevronLeft, Syringe, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { UnifiedErgogenicsModule } from '@/components/feature/shared/unified-ergogenics-module'
import { getStudentErgogenics } from '@/actions/ergogenics-actions'

export default async function StudentErgogenicsPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return <div className="p-10 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Não autorizado.</div>
    }

    // 1. Try to find real student relationship
    let effectiveStudentId = id
    let studentName = 'Aluno'
    let isPlaceholder = false
    let ergoData: any[] = []

    const { data: relationship } = await supabase
        .from('trainer_students')
        .select(`
            student_id,
            student:profiles!student_id(full_name)
        `)
        .or(`id.eq.${id},student_id.eq.${id}`)
        .eq('trainer_id', user.id)
        .maybeSingle()

    if (relationship) {
        effectiveStudentId = relationship.student_id
        studentName = (relationship.student as any)?.full_name || 'Aluno'
    } else {
        // 2. Check for placeholder
        const { data: placeholder } = await supabase
            .from('pending_student_links')
            .select('*')
            .eq('id', id)
            .eq('trainer_id', user.id)
            .maybeSingle()
        
        if (placeholder) {
            effectiveStudentId = placeholder.id
            studentName = placeholder.student_name || 'Aluno (Pendente)'
            isPlaceholder = true
        } else {
            return <div className="p-10 text-center text-zinc-500 font-bold uppercase tracking-widest text-xs">Dados não encontrados ou você não tem acesso a este aluno.</div>
        }
    }

    // Standardized fetch ensuring IDs
    const ergoResult = await getStudentErgogenics(effectiveStudentId)
    ergoData = Array.isArray(ergoResult) ? ergoResult : []

    return (
        <div className="space-y-10 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 ">
                <div className="space-y-4">
                    <Link
                        href={`/dashboard/trainer/students/${id}`}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                    >
                        <ChevronLeft className="w-3 h-3" />
                        Voltar para Aluno
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                            <Syringe className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white font-sans italic uppercase">
                                Ergogênicos & <span className="text-orange-500">Ciclos</span>
                            </h1>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Organize o protocolo farmacológico de {studentName}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pb-4w-full sm:w-auto self-end md:self-center">
                    <UnifiedCreationDialog
                        title="Nova Substância"
                        description={`Defina uma nova substância para o protocolo de ${studentName}.`}
                        trigger={
                            <Button className="flex-1 sm:flex-none h-12 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Adicionar Substância
                            </Button>
                        }
                        fields={[
                            { name: 'name', label: 'Nome da Substância', placeholder: 'Ex: Enantato de Testosterona', required: true },
                            { name: 'weekly_dosage', label: 'Dosagem Semanal Total', placeholder: '250', type: 'number', required: true, gridCols: 2, merged: true } as any,
                            {
                                name: 'unit', label: 'Unidade', type: 'select', defaultValue: 'mg', options: [
                                    { label: 'mg', value: 'mg' },
                                    { label: 'ml', value: 'ml' },
                                    { label: 'un', value: 'un' }
                                ], required: true, gridCols: 2, merged: true
                            } as any,
                            { name: 'application_days', label: 'Dias de Aplicação', type: 'days', required: true },
                            { name: 'notes', label: 'Instruções / Notas (Opcional)', placeholder: 'Ex: Aplicar no glúteo...', type: 'textarea' }
                        ]}
                        actionType="create-student-ergogenic"
                        parentId={effectiveStudentId}
                        successMessage="Substância adicionada ao protocolo!"
                        colorScheme="orange"
                        queryKey={['ergogenics', effectiveStudentId]}
                    />
                </div>
            </header>

            <UnifiedErgogenicsModule
                studentId={effectiveStudentId}
                mode="trainer"
                initialErgogenics={ergoData}
                studentName={studentName}
                colorScheme="orange"
            />
        </div>
    )
}
