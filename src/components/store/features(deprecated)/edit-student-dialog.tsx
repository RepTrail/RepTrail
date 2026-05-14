'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Settings as SettingsIcon,
    Phone,
    TrendingUp,
    DollarSign,
    Info
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface EditStudentDialogProps {
    relationshipId: string
    studentId: string
    trainerId: string
    initialData: {
        weight?: number
        body_fat?: number
        monthly_fee?: number
        payment_day?: number
        steroid_use?: boolean
        whatsapp?: string
        email?: string
        height?: number
        age?: number
        sex?: string
        activity_level?: string
        observations?: string
        isPlaceholder?: boolean
    }
    children?: React.ReactNode
}

export function EditStudentDialog({ relationshipId, studentId, trainerId, initialData, children }: EditStudentDialogProps) {
    const [open, setOpen] = useState(false)
    const [weight, setWeight] = useState(initialData.weight?.toString() || '')
    const [bodyFat, setBodyFat] = useState(initialData.body_fat?.toString() || '')
    const [height, setHeight] = useState(initialData.height?.toString() || '')
    const [age, setAge] = useState(initialData.age?.toString() || '')
    const [monthlyFee, setMonthlyFee] = useState(initialData.monthly_fee?.toString() || '')
    const [paymentDay, setPaymentDay] = useState(initialData.payment_day?.toString() || '')
    const [steroidUse, setSteroidUse] = useState(initialData.steroid_use || false)
    const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || '')
    const [email, setEmail] = useState(initialData.email || '')
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const { mutate } = useOptimisticMutation({
        actionName: 'update-student-data',
        entity: ENTITIES.STUDENT_DETAIL,
        entityId: studentId,
        queryKey: QUERY_KEYS.trainer.studentDetail(relationshipId),
        mutationFn: async () => { }, // Single-writer: no-op
        onMutate: (variables) => {
            const previousDetail = queryClient.getQueryData(QUERY_KEYS.trainer.studentDetail(relationshipId))
            queryClient.setQueryData(QUERY_KEYS.trainer.studentDetail(relationshipId), (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    ...variables,
                    student: {
                        ...old.student,
                        details: {
                            ...old.student?.details,
                            ...variables.data
                        }
                    },
                    _optimistic: true
                }
            })

            const previousList = queryClient.getQueryData(QUERY_KEYS.trainer.students(trainerId))
            queryClient.setQueryData(QUERY_KEYS.trainer.students(trainerId), (old: any) => {
                if (!old) return old;
                return (old as any[]).map(student => student.id === studentId ? { ...student, ...variables, _optimistic: true } : student)
            })

            setOpen(false)
            return { previousDetail, previousList }
        },
        onSuccess: () => {
            toast({ title: 'Sucesso!', description: 'Alterações enviadas para sincronização.' })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(QUERY_KEYS.trainer.studentDetail(relationshipId), ctx?.previousDetail)
            queryClient.setQueryData(QUERY_KEYS.trainer.students(trainerId), ctx?.previousList)
            toast({ title: 'Erro inesperado', description: 'Tente novamente em breve.', variant: 'destructive' })
        }
    })

    const handleSave = () => {
        mutate({
            relationshipId,
            studentId,
            trainerId,
            data: {
                weight: weight ? parseFloat(weight) : undefined,
                body_fat: bodyFat ? parseFloat(bodyFat) : undefined,
                height: height ? parseFloat(height) : undefined,
                age: age ? parseInt(age) : undefined,
                monthly_fee: monthlyFee ? parseFloat(monthlyFee) : undefined,
                payment_day: paymentDay ? parseInt(paymentDay) : undefined,
                steroid_use: steroidUse,
                whatsapp: whatsapp,
                email: email
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition-all">
                        <SettingsIcon className="w-4 h-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="w-[95%] sm:w-full sm:max-w-[500px] bg-zinc-950 border-zinc-800 rounded-[1.5rem] sm:rounded-[2.5rem] p-0 overflow-hidden shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
                <DialogHeader className="py-4 sm:pt-0 sm:pb-4 px-4 sm:px-0 shrink-0 border-b border-zinc-800/50 flex flex-col items-start text-left pr-14 sm:pr-0">
                    <DialogTitle className="text-lg sm:text-xl font-black italic uppercase tracking-tight text-white text-left">Editar Aluno</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-left">
                        Gerencie as métricas e configurações do aluno.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-4 sm:px-0 overflow-y-auto custom-scrollbar flex-1 space-y-4 sm:space-y-6">
                    {/* Metrics Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Métricas Principais</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="weight" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Peso (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl focus:ring-blue-500/10 h-10 text-xs text-white font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="bodyFat" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Gordura (%)</Label>
                                <Input
                                    id="bodyFat"
                                    type="number"
                                    step="0.1"
                                    value={bodyFat}
                                    onChange={(e) => setBodyFat(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl focus:ring-blue-500/10 h-10 text-xs text-white font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Complementary Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Info className="w-3 h-3 text-emerald-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Informações Complementares</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="height" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Altura (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl h-10 text-xs text-white font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="age" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Idade</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl h-10 text-xs text-white font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-3 h-3 text-amber-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Dados Financeiros</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="monthlyFee" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Mensalidade (R$)</Label>
                                <Input
                                    id="monthlyFee"
                                    type="number"
                                    step="0.01"
                                    value={monthlyFee}
                                    onChange={(e) => setMonthlyFee(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl h-10 text-xs text-white font-bold"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="paymentDay" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Vencimento (Dia)</Label>
                                <Input
                                    id="paymentDay"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={paymentDay}
                                    onChange={(e) => setPaymentDay(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl h-10 text-xs text-white font-bold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-zinc-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Contato</span>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="whatsapp" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">WhatsApp</Label>
                            <Input
                                id="whatsapp"
                                type="text"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                className="bg-zinc-900/50 border-zinc-800 rounded-xl h-10 text-xs text-white font-bold"
                                placeholder="55 11 99999-9999"
                            />
                        </div>
                        {initialData.isPlaceholder && (
                            <div className="space-y-1.5">
                                <div className="space-y-1">
                                    <Label htmlFor="email" className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email da Conta</Label>
                                    <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed px-1">
                                        Necessário para o aluno sincronizar o protocolo.
                                    </p>
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-900/50 border-orange-500/30 rounded-xl h-10 text-xs text-white font-bold"
                                />
                                <p className="text-[7px] font-black text-emerald-500/40 uppercase tracking-widest px-1">
                                    * Pode ser provisório e alterado pelo aluno depois.
                                </p>
                            </div>
                        )}
                    </div>

                    <div
                        className={cn(
                            "flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer",
                            steroidUse
                                ? "bg-orange-500/5 border-orange-500/20"
                                : "bg-zinc-900/30 border-zinc-800"
                        )}
                        onClick={() => setSteroidUse(!steroidUse)}
                    >
                        <Checkbox
                            id="steroidUse"
                            checked={steroidUse}
                            onCheckedChange={(checked) => setSteroidUse(checked === true)}
                            className="h-5 w-5 rounded-lg border-zinc-700 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <div className="grid gap-0.5 ml-3">
                            <Label className={cn("text-[10px] font-black uppercase tracking-widest cursor-pointer", steroidUse ? "text-orange-500" : "text-white")}>
                                Protocolo Hormonal
                            </Label>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Habilitar módulo de ergogênicos</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 sm:px-0 sm:py-6 shrink-0 bg-zinc-950 border-t border-zinc-800/50">
                    <Button
                        type="submit"
                        onClick={handleSave}
                        className="bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase italic tracking-widest h-12 w-full rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
