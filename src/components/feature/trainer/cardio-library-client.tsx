'use client'

import { useQuery } from '@tanstack/react-query'
import { getCardioLibrary } from '@/actions/cardio-actions'
import { getTrainerStudents } from "@/actions/trainer-actions"
import { QUERY_KEYS } from '@/lib/query-keys'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Plus } from "lucide-react"
import { UnifiedLibraryCard } from "@/components/feature/shared/unified-library-card"
import { UnifiedCreationDialog } from "@/components/feature/shared/unified-creation-dialog"

interface CardioLibraryClientProps {
    initialCardios: any[]
    initialStudents: any[]
    userId: string
}

export function CardioLibraryClient({ 
    initialCardios, 
    initialStudents, 
    userId 
}: CardioLibraryClientProps) {
    const { data: cardios = initialCardios } = useQuery({
        queryKey: QUERY_KEYS.cardio.library(userId),
        queryFn: () => getCardioLibrary(),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2 sm:space-y-5">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Biblioteca de Cardio
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        Gerencie seus modelos de cardio e atribua aos seus alunos
                    </p>
                </div>
                <div className="flex items-center gap-3 pb-4">
                    <UnifiedCreationDialog
                        title="Novo Modelo de Cardio"
                        description="Crie um template (ex: Esteira 45min) para agendar para seus alunos."
                        trigger={
                            <Button variant="outline" className="h-11 px-5 border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/30 hover:border-emerald-500/50 hover:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto flex items-center justify-center gap-2 active:scale-95 italic shadow-none">
                                <Plus className="w-4 h-4" />
                                Criar Modelo
                            </Button>
                        }
                        fields={[
                            { name: 'name', label: 'Nome do Cardio', placeholder: 'Ex: Corrida na Esteira', required: true },
                            { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Ex: Manter batimentos entre 130-140...', type: 'textarea' }
                        ]}
                        actionType="create-student-cardio"
                        successMessage="Modelo de cardio criado!"
                        footerLabel="Salvar Modelo"
                        colorScheme="emerald"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cardios.length > 0 ? (
                    cardios.map((cardio: any) => (
                        <UnifiedLibraryCard
                            key={cardio.id}
                            id={cardio.id}
                            name={cardio.name}
                            description={cardio.description}
                            studentId={userId}
                            queryKey={QUERY_KEYS.cardio.library(userId)}
                            icon={<Activity className="w-5 h-5" />}
                            type="cardio"
                            created_at={cardio.created_at}
                            assignments={cardio.assignments}
                            stats={{
                                label: 'Template',
                                value: '',
                                icon: null
                            }}
                            href={`/dashboard/trainer/cardio/${cardio.id}`}
                            colorScheme="emerald"
                            onEditLabel="Editar Protocolo"
                        />
                    ))
                ) : (
                    <Card className="col-span-full bg-zinc-900/40 border-dashed border-zinc-800 rounded-[3rem] p-20 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-6 bg-zinc-900 rounded-[2rem] text-zinc-700 border border-zinc-800">
                                <Activity className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Nenhum cardio encontrado</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Crie seu primeiro modelo de cardio para começar a atribuir.</p>
                            </div>
                            <UnifiedCreationDialog
                                title="Novo Modelo de Cardio"
                                description="Crie um template (ex: Esteira 45min) para agendar para seus alunos."
                                triggerLabel="Criar Modelo"
                                fields={[
                                    { name: 'name', label: 'Nome do Cardio', placeholder: 'Ex: Corrida na Esteira', required: true },
                                    { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Ex: Manter batimentos entre 130-140...', type: 'textarea' }
                                ]}
                                actionType="create-student-cardio"
                                successMessage="Modelo de cardio criado!"
                                footerLabel="Salvar Modelo"
                                colorScheme="emerald"
                            />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
