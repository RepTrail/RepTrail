'use client'

import * as React from 'react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

interface FieldConfig {
    name: string
    label: string
    placeholder?: string
    type?: 'text' | 'textarea' | 'number' | 'days' | 'select'
    required?: boolean
    options?: { label: string, value: string }[]
}

interface UnifiedCreationDialogProps {
    trigger?: React.ReactNode
    triggerLabel?: string
    title: string
    description: string
    fields: FieldConfig[]
    actionType: 'create-student-workout' | 'create-student-diet' | 'create-student-cardio' | 'create-student-ergogenic' | 'create-manual-workout' | 'create-student'
    successMessage?: string
    footerLabel?: string
}

const WEEKDAYS = [
    { label: 'D', value: 0 },
    { label: 'S', value: 1 },
    { label: 'T', value: 2 },
    { label: 'Q', value: 3 },
    { label: 'Q', value: 4 },
    { label: 'S', value: 5 },
    { label: 'S', value: 6 },
]

export function UnifiedCreationDialog({
    trigger,
    triggerLabel = 'Criar Novo',
    title,
    description,
    fields,
    actionType,
    successMessage = 'Criado com sucesso!',
    footerLabel = 'Salvar'
}: UnifiedCreationDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
    const router = useRouter()
    const { toast } = useToast()

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
        )
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const daysField = fields.find(f => f.type === 'days')
        if (daysField && selectedDays.length === 0) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Selecione pelo menos um dia.' })
            return
        }

        setLoading(true)
        const formData = new FormData(event.currentTarget)

        if (daysField) {
            formData.append(daysField.name || 'daysOfWeek', JSON.stringify(selectedDays))
        }

        try {
            let result;
            
            // Call the appropriate server action based on actionType
            switch (actionType) {
                case 'create-student-workout':
                    const { createStudentWorkout } = await import('@/actions/student-content-actions')
                    await createStudentWorkout(formData)
                    // This action uses redirect, so we won't get here
                    break
                case 'create-student-diet':
                    const { createStudentDiet } = await import('@/actions/student-content-actions')
                    result = await createStudentDiet(formData)
                    break
                case 'create-student-cardio':
                    const { createStudentCardio } = await import('@/actions/student-content-actions')
                    result = await createStudentCardio(formData)
                    break
                case 'create-student-ergogenic':
                    const { createStudentErgogenic } = await import('@/actions/student-content-actions')
                    // Add default values for ergogenic creation
                    formData.append('dosage', '')
                    formData.append('application_days', JSON.stringify([1, 3, 5])) // Mon, Wed, Fri
                    formData.append('notes', '')
                    result = await createStudentErgogenic(formData)
                    break
                case 'create-manual-workout':
                    const { createManualWorkout } = await import('@/actions/workout-actions')
                    result = await createManualWorkout(formData)
                    break
                case 'create-student':
                    const { createStudent } = await import('@/actions/trainer-actions')
                    result = await createStudent(null, formData)
                    break
                default:
                    throw new Error('Invalid action type')
            }
            
            // If we reach here, the action didn't redirect and should have a result
            if (result && (result.success || (result && !('error' in result)))) {
                setOpen(false)
                toast({ title: successMessage })
                router.refresh()
            } else if (result && 'error' in result) {
                toast({ variant: 'destructive', title: 'Erro', description: result.error || 'Algo deu errado.' })
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-white text-zinc-900 hover:bg-zinc-200 font-bold uppercase italic tracking-tight rounded-xl h-11 transition-all active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> {triggerLabel}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] bg-zinc-950 text-white border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden p-0 border-white/5">
                <DialogHeader className="p-8 bg-zinc-900/40 border-b border-zinc-900">
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="p-8 space-y-6">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </Label>

                            {field.type === 'textarea' ? (
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className="bg-zinc-900 border-zinc-800 rounded-2xl min-h-[100px] focus:ring-purple-500/20 transition-all"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    required={field.required}
                                    className="flex h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none font-medium text-white"
                                >
                                    <option value="" disabled selected={!field.required}>{field.placeholder || "Selecione..."}</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === 'days' ? (
                                <div className="flex justify-between gap-1.5 pt-1">
                                    {WEEKDAYS.map((day) => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border-2 ${selectedDays.includes(day.value)
                                                ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/10'
                                                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                                }`}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type || 'text'}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className="bg-zinc-900 border-zinc-800 h-14 rounded-2xl focus:ring-purple-500/20 transition-all font-medium"
                                />
                            )}
                        </div>
                    ))}

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-zinc-950 hover:bg-zinc-200 h-14 rounded-2xl font-black uppercase italic tracking-tight transition-all active:scale-[0.98] shadow-xl"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                            {footerLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
