'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FlaskConical } from 'lucide-react'
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { EditErgogenicDialog } from '@/components/feature/student/edit-ergogenic-dialog'
import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'

export function AutoTrainingErgogenicsManager({
    ergogenics,
}: {
    ergogenics: any[]
}) {
    const [studentId, setStudentId] = useState<string | null>(null)

    useEffect(() => {
        const getSession = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setStudentId(user.id)
        }
        getSession()
    }, [])

    if (!studentId) return null
    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase flex items-center gap-3">
                        <FlaskConical className="w-8 h-8 text-emerald-500" />
                        Ergogênicos
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerencie protocolos farmacológicos e suplementação avançada.
                    </p>
                </div>
                <UnifiedCreationDialog
                    title="Adicionar Protocolo"
                    description="Registre um novo ergogênico ou suplemento."
                    actionType="create-student-ergogenic"
                    fields={[
                        { name: 'name', label: 'Nome', type: 'text', placeholder: 'Ex: Testosterona' },
                        { name: 'weekly_dosage', label: 'Dosagem Semanal', type: 'number', placeholder: 'Ex: 250' },
                        { name: 'unit', label: 'Unidade', type: 'text', placeholder: 'Ex: mg' }
                    ]}
                />
            </div>

            {ergogenics.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ergogenics.map((e: any) => (
                        <Card key={e.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 transition-all group overflow-hidden rounded-3xl">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-zinc-950 border-2 border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/30 transition-all">
                                        <FlaskConical className="w-6 h-6 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-wide group-hover:text-emerald-500 transition-colors">
                                            {e.name}
                                        </h3>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
                                            {e.weekly_dosage || 0} {e.unit || 'ml'} semanais
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <EditErgogenicDialog ergogenic={e} />
                                    <UnifiedDeleteButton
                                        id={e.id}
                                        actionType="ergogenic"
                                        itemName={e.name}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                    <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                        <FlaskConical className="w-10 h-10 text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Nenhum protocolo encontrado</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                            Crie seu primeiro protocolo para começar.
                        </p>
                    </div>
                    <UnifiedCreationDialog
                        title="Adicionar Protocolo"
                        description="Registre um novo ergogênico ou suplemento."
                        actionType="create-student-ergogenic"
                        fields={[
                            { name: 'name', label: 'Nome', type: 'text', placeholder: 'Ex: Testosterona' },
                            { name: 'weekly_dosage', label: 'Dosagem Semanal', type: 'number', placeholder: 'Ex: 250' },
                            { name: 'unit', label: 'Unidade', type: 'text', placeholder: 'Ex: mg' }
                        ]}
                    />
                </div>
            )}
        </div>
    )
}
