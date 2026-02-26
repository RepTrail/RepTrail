import { getCardioLibrary } from '@/actions/cardio-actions'
import { getTrainerStudents } from '@/actions/trainer-actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Activity, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'
import { UnifiedAssignDialog } from '@/components/feature/shared/unified-assign-dialog'
import { UnifiedCreationDialog } from '@/components/feature/shared/unified-creation-dialog'
import { DuplicateButton } from '@/components/feature/trainer/duplicate-button'

export default async function TrainerCardioPage() {
    const cardios = await getCardioLibrary()
    const students = await getTrainerStudents()

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                        Biblioteca de Cardio
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-orange-500" />
                        Gerencie seus modelos de cardio e atribua aos seus alunos
                    </p>
                </div>
                <div className="flex items-center gap-3">
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
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cardios.length > 0 ? (
                    cardios.map((cardio: any) => (
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

                                <div className="grid grid-cols-2 gap-2">
                                    <UnifiedAssignDialog
                                        itemId={cardio.id}
                                        students={students}
                                        type="cardio"
                                        title="Atribuir Cardio"
                                        description="Escolha um aluno e os dias da semana para este protocolo."
                                    />
                                    <div className="flex gap-2">
                                        <UnifiedDeleteButton
                                            id={cardio.id}
                                            actionType="cardio"
                                            itemName={cardio.name}
                                        />
                                        <Button asChild size="sm" className="flex-1 bg-zinc-100 text-zinc-900 hover:bg-white flex items-center justify-center gap-1.5 rounded-xl font-bold">
                                            <Link href={`/dashboard/trainer/cardio/${cardio.id}`}>
                                                Editar
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                            />
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
