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
import { Settings as SettingsIcon, Loader2, Phone, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import { updateStudentData } from '@/actions/student-actions'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

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
    }
    children?: React.ReactNode
}

export function EditStudentDialog({ relationshipId, studentId, trainerId, initialData, children }: EditStudentDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [weight, setWeight] = useState(initialData.weight?.toString() || '')
    const [bodyFat, setBodyFat] = useState(initialData.body_fat?.toString() || '')
    const [monthlyFee, setMonthlyFee] = useState(initialData.monthly_fee?.toString() || '')
    const [paymentDay, setPaymentDay] = useState(initialData.payment_day?.toString() || '')
    const [steroidUse, setSteroidUse] = useState(initialData.steroid_use || false)
    const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || '')
    const router = useRouter()
    const { toast } = useToast()

    const handleSave = async () => {
        setLoading(true)
        try {
            const result = await updateStudentData(relationshipId, studentId, trainerId, {
                weight: weight ? parseFloat(weight) : undefined,
                body_fat: bodyFat ? parseFloat(bodyFat) : undefined,
                monthly_fee: monthlyFee ? parseFloat(monthlyFee) : undefined,
                payment_day: paymentDay ? parseInt(paymentDay) : undefined,
                steroid_use: steroidUse,
                whatsapp: whatsapp
            })

            if (result.success) {
                toast({
                    title: 'Sucesso!',
                    description: 'Informações do aluno atualizadas.',
                })
                setOpen(false)
                router.refresh()
            } else {
                toast({
                    title: 'Erro ao atualizar',
                    description: result.error,
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Erro inesperado',
                description: 'Tente novamente em breve.',
                variant: 'destructive'
            })
        } finally {
            setLoading(false)
        }
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold italic uppercase tracking-tight">Editar Aluno</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                        Atualize as métricas e dados financeiros.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Metrics Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Métricas Atuais</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Peso (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/10 h-12 text-zinc-200"
                                    placeholder="75.0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bodyFat" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Gordura (%)</Label>
                                <Input
                                    id="bodyFat"
                                    type="number"
                                    step="0.1"
                                    value={bodyFat}
                                    onChange={(e) => setBodyFat(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/10 h-12 text-zinc-200"
                                    placeholder="15.0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Dados Financeiros</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="monthlyFee" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Mensalidade (R$)</Label>
                                <Input
                                    id="monthlyFee"
                                    type="number"
                                    step="0.01"
                                    value={monthlyFee}
                                    onChange={(e) => setMonthlyFee(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10 h-12 text-zinc-200"
                                    placeholder="180.00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="paymentDay" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Vencimento (Dia)</Label>
                                <Input
                                    id="paymentDay"
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={paymentDay}
                                    onChange={(e) => setPaymentDay(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10 h-12 text-zinc-200"
                                    placeholder="10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Settings Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <SettingsIcon className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Contato & Outros</span>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">WhatsApp (com DDD)</Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <Input
                                    id="whatsapp"
                                    type="text"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    className="bg-zinc-900/50 border-zinc-800 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/10 h-12 text-zinc-200 pl-11"
                                    placeholder="55 11 99999-9999"
                                />
                            </div>
                        </div>

                        <div 
                            className={cn(
                                "flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer group",
                                steroidUse 
                                    ? "bg-orange-500/5 border-orange-500/20 shadow-lg shadow-orange-500/5" 
                                    : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-700"
                            )}
                            onClick={() => setSteroidUse(!steroidUse)}
                        >
                            <Checkbox
                                id="steroidUse"
                                checked={steroidUse}
                                onCheckedChange={(checked) => setSteroidUse(checked === true)}
                                className="border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white h-5 w-5 rounded-md"
                            />
                            <div className="grid gap-1 leading-none">
                                <Label
                                    htmlFor="steroidUse"
                                    className={cn(
                                        "text-xs font-black uppercase tracking-widest cursor-pointer transition-colors",
                                        steroidUse ? "text-orange-500" : "text-zinc-200"
                                    )}
                                >
                                    Uso de Ergogênicos
                                </Label>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">
                                    Habilitar controle de protocolo hormonal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter className="pt-2">
                    <Button
                        type="submit"
                        disabled={loading}
                        onClick={handleSave}
                        className="bg-zinc-100 text-zinc-950 hover:bg-white font-black uppercase italic tracking-widest h-14 px-8 w-full transition-all shadow-xl active:scale-95 rounded-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Alterações'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
