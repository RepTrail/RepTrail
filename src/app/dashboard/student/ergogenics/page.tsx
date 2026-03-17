import { createClient } from '@/lib/supabase/server'
import { getStudentErgogenics, getErgogenicLogs } from '@/actions/ergogenics-actions'
import { redirect } from 'next/navigation'
import { Activity, Plus, Syringe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { UnifiedErgogenicsModule } from '@/components/feature/shared/unified-ergogenics-module'

export default async function ErgogenicsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: trainerRel } = await supabase
        .from('trainer_students')
        .select('trainer_id')
        .eq('student_id', user.id)
        .eq('active', true)
        .maybeSingle()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status, full_name')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'

    // Verify if steroid_use is enabled
    const { data: details } = await supabase
        .from('student_details')
        .select('steroid_use')
        .eq('id', user.id)
        .single()

    if (!details?.steroid_use) {
        redirect('/dashboard/student')
    }

    const { data: ergogenics } = await getStudentErgogenics(user.id)
    const { data: logs } = await getErgogenicLogs(user.id)

    // Mode is 'trainer' if they are doing auto-training (they manage their own protocol)
    // Mode is 'student' if they have a real trainer (they only log intake)
    const viewMode = trainerRel ? 'student' : 'trainer'

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 ">
                <div className="space-y-5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                            Meus <span className="text-orange-500">Ergogênicos</span>
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium max-w-md">
                        {viewMode === 'trainer'
                            ? 'Gerencie seu protocolo farmacológico, dosagens e agendamentos de aplicação.'
                            : 'Acompanhe e registre suas substâncias e dosagens prescritas pelo seu treinador.'}
                    </p>
                </div>

                {viewMode === 'trainer' && (
                    <div className="flex-1 sm:flex-none">
                        <UnifiedCreationDialog
                            title="Nova Substância"
                            description="Adicione uma nova substância ao seu protocolo farmacológico."
                            trigger={
                                <Button className="flex-1 sm:flex-none h-12 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Adicionar Substância
                                </Button>
                            }
                            fields={[
                                { name: 'name', label: 'Nome da Substância', placeholder: 'Ex: Enantato de Testosterona', required: true },
                                { name: 'weekly_dosage', label: 'Dosagem Semanal Total', placeholder: '250', type: 'number', required: true, gridCols: 2 },
                                {
                                    name: 'unit', label: 'Unidade', type: 'switch', defaultValue: 'mg', options: [
                                        { label: 'mg', value: 'mg' },
                                        { label: 'ml', value: 'ml' }
                                    ], required: true, gridCols: 2
                                },
                                { name: 'application_days', label: 'Dias de Aplicação', type: 'days', required: true },
                                { name: 'notes', label: 'Instruções / Notas (Opcional)', placeholder: 'Ex: Aplicar no glúteo...', type: 'textarea' }
                            ]}
                            actionType="create-student-ergogenic"
                            successMessage="Substância adicionada ao protocolo!"
                            colorScheme="orange"
                        />
                    </div>
                )}
            </header>

            <UnifiedErgogenicsModule
                studentId={user.id}
                mode={viewMode}
                initialErgogenics={ergogenics || []}
                initialLogs={logs || []}
                colorScheme="orange"
                studentName={profile?.full_name}
            />
        </div>
    )
}
