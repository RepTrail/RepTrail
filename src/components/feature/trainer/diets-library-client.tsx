'use client'

import { useQuery } from '@tanstack/react-query'
import { getTrainerDiets } from "@/actions/diet-actions"
import { getTrainerStudents } from "@/actions/trainer-actions"
import { getBetaTesterMode } from "@/actions/app-settings-actions"
import { QUERY_KEYS } from '@/lib/query-keys'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, FileUp, Plus } from "lucide-react"
import Link from "next/link"
import { PillButton } from "@/components/ui/pill-button"
import { UnifiedLibraryCard } from "@/components/feature/shared/unified-library-card"
import { UnifiedCreationDialog } from "@/components/feature/shared/unified-creation-dialog"

interface DietsLibraryClientProps {
    initialDiets: any[]
    initialStudents: any[]
    betaTesterMode: boolean
    userId: string
}

export function DietsLibraryClient({ 
    initialDiets, 
    initialStudents, 
    betaTesterMode,
    userId 
}: DietsLibraryClientProps) {
    const { data: diets = initialDiets } = useQuery({
        queryKey: QUERY_KEYS.diets.library(userId),
        queryFn: () => getTrainerDiets(userId),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2 sm:space-y-5">
                    <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                        Biblioteca de Dietas
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium">
                        Gerencie seus planos alimentares e atribua-os aos seus alunos.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pb-4">
                    {!betaTesterMode && (
                        <PillButton asChild variant="orange" className="w-full sm:w-auto">
                            <Link href="/dashboard/trainer/import-pdf">
                                <FileUp className="w-4 h-4" />
                                Importar PDF
                            </Link>
                        </PillButton>
                    )}
                    <UnifiedCreationDialog
                        title="Novo Modelo de Dieta"
                        description="Crie um template de dieta (Cutting, Bulking, etc) para atribuir aos seus alunos."
                        trigger={
                            <PillButton variant="emerald" className="w-full sm:w-auto">
                                <Plus className="w-4 h-4" />
                                Criar Manualmente
                            </PillButton>
                        }
                        fields={[
                            { name: 'name', label: 'Nome da Dieta', placeholder: 'Ex: Dieta para Secar (Low Carb)', required: true }
                        ]}
                        actionType="create-manual-diet"
                        successMessage="Template de dieta criado!"
                        footerLabel="Salvar Template"
                        colorScheme="emerald"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {diets.length > 0 ? (
                    diets.map((diet: any) => (
                        <UnifiedLibraryCard
                            key={diet.id}
                            id={diet.id}
                            name={diet.name}
                            description={diet.description}
                            studentId={userId}
                            queryKey={QUERY_KEYS.diets.library(userId)}
                            icon={<Utensils className="w-5 h-5 text-orange-500" />}
                            type="diet"
                            created_at={diet.created_at}
                            assignments={diet.assignments}
                            stats={{
                                label: 'Refeições',
                                value: diet.meals?.[0]?.count || 0,
                                icon: <Utensils className="w-3 h-3 text-zinc-700" />
                            }}
                            href={`/dashboard/trainer/diets/${diet.id}`}
                            onEditLabel="Editar Dieta"
                        />
                    ))
                ) : (
                    <Card className="col-span-full bg-zinc-900/40 border-dashed border-zinc-800 rounded-[3rem] p-20 text-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="p-6 bg-zinc-900 rounded-[2rem] text-zinc-700 border border-zinc-800">
                                <Utensils className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Nenhuma dieta encontrada</h3>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                    {betaTesterMode ? 'Crie uma nova dieta para começar.' : 'Importe um PDF ou crie uma nova dieta para começar.'}
                                </p>
                            </div>
                            {!betaTesterMode && (
                                <Button asChild className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-bold rounded-xl shadow-lg shadow-orange-500/20">
                                    <Link href="/dashboard/trainer/import-pdf">Importar Primeira Dieta</Link>
                                </Button>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
