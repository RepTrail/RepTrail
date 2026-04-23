'use client'

import { Activity, Plus, Syringe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UnifiedErgogenicsModule } from '@/components/feature/shared/unified-ergogenics-module'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../lib/query-keys'
import { getStudentErgogenics, getErgogenicLogs, addErgogenic } from '@/actions/ergogenics-actions'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ErgogenicForm } from '@/components/feature/shared/ergogenic-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface ErgogenicsPageClientProps {
    userId: string
}

import { useRealtimeSync } from '@/hooks/use-realtime-sync'

export function ErgogenicsPageClient({ userId }: ErgogenicsPageClientProps) {
    // 1. Data Fetching via TanStack Query (Hydrated)
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: trainerLink } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: 1000 * 60 * 5
    })

    const { data: ergogenicsData = [] } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        queryFn: async () => {
            const res = await getStudentErgogenics(userId)
            return (res as any[]) || []
        },
        staleTime: 1000 * 60 * 5
    })

    const { data: logsData = [] } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.logs(userId),
        queryFn: async () => {
            const res = await getErgogenicLogs(userId)
            return (res as any[]) || []
        },
        staleTime: 1000 * 60 * 5
    })

    // 2. Realtime Synchronization
    useRealtimeSync({
        table: 'ergogenics',
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        filter: `student_id=eq.${userId}`
    })

    useRealtimeSync({
        table: 'ergogenic_logs',
        queryKey: QUERY_KEYS.ergogenics.logs(userId),
        filter: `student_id=eq.${userId}`
    })

    const ergogenics = Array.isArray(ergogenicsData) ? ergogenicsData : []
    const logs = Array.isArray(logsData) ? logsData : []
    const viewMode = trainerLink ? 'student' : 'trainer'

    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { mutate: addMutate } = useOptimisticMutation({
        actionName: 'add-ergogenic',
        entity: ENTITIES.ERGOGENIC,
        queryKey: QUERY_KEYS.ergogenics.all(userId),
        mutationFn: async (variables) => variables,
        updateFn: (old: any, variables: any) => {
            const newItem = {
                ...variables,
                created_at: new Date().toISOString(),
                _optimistic: true
            }
            return [newItem, ...(Array.isArray(old) ? old : [])]
        },
        onMutate: () => {
            setIsDialogOpen(false)
        },
        onSuccess: () => {
            toast({ title: 'Adicionado com sucesso!', description: 'Substância adicionada ao seu protocolo.' })
        }
    })

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 ">
                <div className="space-y-5">
                    <div className="flex items-center gap-3 pb-4">
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
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex-1 sm:flex-none h-12 px-6 bg-orange-500 hover:bg-orange-400 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" />
                                    Adicionar Substância
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader className="pb-6 border-b border-zinc-900/50">
                                    <DialogTitle className="text-xl font-black text-white italic uppercase tracking-tighter">
                                        Nova <span className="text-orange-500">Substância</span>
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="pt-8">
                                    <ErgogenicForm 
                                        onSubmit={(data) => addMutate({ ...data, student_id: userId })}
                                        onCancel={() => setIsDialogOpen(false)}
                                        colorScheme="orange"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </header>

            <UnifiedErgogenicsModule
                studentId={userId}
                mode={viewMode}
                initialErgogenics={ergogenics}
                initialLogs={logs}
                colorScheme="orange"
                studentName={profile?.full_name}
            />
        </div>
    )
}
