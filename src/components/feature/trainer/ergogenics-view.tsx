'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, FlaskConical } from "lucide-react"
import { UnifiedDeleteButton } from "@/components/feature/shared/unified-delete-button"
import { ErgogenicForm } from "@/components/feature/shared/ergogenic-form"
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface Ergogenic {
    id: string
    name: string
    weekly_dosage: number
    unit: 'ml' | 'mg'
    application_days: number[]
    notes?: string
    start_date: string
    end_date?: string
}

const DAYS = [
    { label: 'DOM', value: 0 },
    { label: 'SEG', value: 1 },
    { label: 'TER', value: 2 },
    { label: 'QUA', value: 3 },
    { label: 'QUI', value: 4 },
    { label: 'SEX', value: 5 },
    { label: 'SAB', value: 6 },
]

interface TrainerErgogenicsViewProps {
    studentId: string
    initialData: Ergogenic[]
}

export function TrainerErgogenicsView({ studentId, initialData }: TrainerErgogenicsViewProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [isAdding, setIsAdding] = useState(false)

    // Local-First: Consume from cache
    const { data: ergogenics = initialData } = useQuery({
        queryKey: QUERY_KEYS.ergogenics.all(studentId),
        queryFn: async () => initialData, // In a real app this would fetch, here we rely on initial + cache updates
        initialData
    })

    const { mutate: addMutate } = useOptimisticMutation({
        actionName: 'add-ergogenic',
        entity: ENTITIES.ERGOGENIC,
        entityId: 'new',
        queryKey: QUERY_KEYS.ergogenics.all(studentId),
        mutationFn: async (variables) => variables, // 🔴 HARD BLOCK
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(QUERY_KEYS.ergogenics.all(studentId))
            queryClient.setQueryData(QUERY_KEYS.ergogenics.all(studentId), (old: any) => {
                const newItem = {
                    id: crypto.randomUUID(),
                    ...variables,
                    created_at: new Date().toISOString(),
                    _optimistic: true
                }
                return [newItem, ...(old || [])]
            })
            setIsAdding(false)
            return { previous }
        },
        onSuccess: () => {
            toast({ title: 'Adicionado com sucesso!', description: 'Substância adicionada ao protocolo.' })
        }
    })

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                        <FlaskConical className="w-6 h-6 text-emerald-500" />
                        Protocolo de Ergogênicos
                    </h2>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Gerencie as doses semanais e dias de aplicação</p>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-11 px-6 shadow-lg shadow-emerald-500/10 transition-all active:scale-95 flex gap-2">
                        <Plus className="w-4 h-4" /> ADICIONAR SUBSTÂNCIA
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="bg-zinc-950 border-emerald-500/20 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
                    <CardHeader className="bg-emerald-500/[0.03] border-b border-zinc-900/50 pb-6">
                        <CardTitle className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Nova Substância</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ErgogenicForm 
                            onSubmit={(data) => addMutate({ ...data, student_id: studentId })}
                            onCancel={() => setIsAdding(false)}
                            colorScheme="emerald"
                        />
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ergogenics.map(e => (
                    <Card key={e.id} className="bg-zinc-900/20 border-zinc-800 hover:border-zinc-700 transition-all rounded-3xl group overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{e.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                            {e.weekly_dosage} {e.unit} / Semana
                                        </div>
                                    </div>
                                </div>
                                 <UnifiedDeleteButton
                                    id={e.id}
                                    actionType="ergogenic"
                                    itemName={e.name}
                                    onSuccess={() => {
                                        queryClient.setQueryData(QUERY_KEYS.ergogenics.all(studentId), (old: any) => 
                                            (old || []).filter((item: any) => item.id !== e.id)
                                        )
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-[10px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Dias de Aplicação</Label>
                                    <div className="flex gap-1.5">
                                        {DAYS.map(day => (
                                            <div
                                                key={day.value}
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all ${(e.application_days || []).includes(day.value)
                                                    ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 scale-110 z-10'
                                                    : 'bg-zinc-950 border-zinc-900 text-zinc-700'
                                                    }`}
                                            >
                                                {day.label[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-900/50">
                                        <Label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Dose Dia</Label>
                                        <p className="text-sm font-black text-emerald-500 italic uppercase">
                                            {(e.weekly_dosage / Math.max((e.application_days || []).length, 1)).toFixed(2)} {e.unit}
                                        </p>
                                    </div>
                                    <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-900/50">
                                        <Label className="text-[9px] text-zinc-600 uppercase font-black tracking-widest block mb-1">Status</Label>
                                        <p className="text-sm font-black text-white italic uppercase">Ativo</p>
                                    </div>
                                </div>

                                {e.notes && (
                                    <div className="bg-zinc-950/20 p-4 rounded-2xl border border-dashed border-zinc-800">
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">"{e.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {ergogenics.length === 0 && !isAdding && (
                    <div className="md:col-span-2 py-20 bg-zinc-900/10 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group">
                        <div className="p-5 bg-zinc-900 rounded-[1.5rem] border border-zinc-800 transition-all group-hover:scale-110 group-hover:border-zinc-700 group-hover:bg-zinc-800">
                            <FlaskConical className="w-10 h-10 text-zinc-600" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-zinc-400 font-black uppercase italic tracking-tight">Nenhum ergogênico configurado</p>
                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Clique em "Adicionar Substância" para começar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
