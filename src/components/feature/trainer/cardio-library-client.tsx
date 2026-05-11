'use client'

import { useQuery } from '@tanstack/react-query'
import { getCardioLibrary } from '@/actions/cardio-actions'
import { QUERY_KEYS } from '@/lib/query-keys'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Plus } from "lucide-react"
import { UnifiedLibraryCard } from "@/components/feature/shared/unified-library-card"
import { UnifiedCreationDialog } from "@/components/feature/shared/unified-creation-dialog"
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'

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
        queryFn: () => getCardioLibrary(userId),
        staleTime: 0,
        refetchOnMount: 'always'
    })

    return (
        <RegistryMain
            title="BIBLIOTECA DE CARDIO"
            subtitle="Gerencie seus modelos de cardio e atribua aos seus alunos."
            icon={Activity}
            contextLabel="Área do Personal"
            showTabs={false}
        >
            <Stack gap={10}>
                <div className="flex items-center justify-end w-full">
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

                <Grid gap={5} mdCols={2} lgCols={3}>
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
                        <div className="col-span-full">
                            <EmptyState 
                                icon={Activity} 
                                title="Nenhum cardio encontrado" 
                                description="Crie seu primeiro modelo de cardio para começar a atribuir." 
                            />
                        </div>
                    )}
                </Grid>
            </Stack>
        </RegistryMain>
    )
}
