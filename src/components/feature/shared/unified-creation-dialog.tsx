
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
import { Plus, Loader2, ChevronDown, Calendar, X } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { cn } from '@/lib/utils'

interface FieldConfig {
    name: string
    label: string
    placeholder?: string
    type?: 'text' | 'textarea' | 'number' | 'days' | 'select' | 'date'
    required?: boolean
    options?: { label: string, value: string, color?: string }[]
    defaultValue?: string
}

interface UnifiedCreationDialogProps {
    trigger?: React.ReactNode
    triggerLabel?: string
    title: string
    description: string
    fields: FieldConfig[]
    actionType: 'create-student-workout' | 'create-student-diet' | 'create-student-cardio' | 'create-student-ergogenic' | 'create-manual-workout' | 'create-manual-diet' | 'create-student' | 'update-student-ergogenic' | 'duplicate-student-ergogenic'
    initialValues?: Record<string, any>
    id?: string
    parentId?: string
    successMessage?: string
    footerLabel?: string
    colorScheme?: 'orange' | 'emerald' | 'purple' | 'cyan'
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
    initialValues,
    id,
    parentId,
    successMessage = 'Criado com sucesso!',
    footerLabel = 'Salvar',
    colorScheme = 'orange'
}: UnifiedCreationDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Find if there's a days field and get its default value from initialValues if it exists
    const daysField = fields.find(f => f.type === 'days')
    const initialDays = initialValues?.[daysField?.name || 'application_days'] || [0, 1, 2, 3, 4, 5, 6]

    const [selectedDays, setSelectedDays] = useState<number[]>(initialDays)
    const router = useRouter()
    const { toast } = useToast()

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
        )
    }

    const schemes = {
        orange: {
            btn: 'bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-zinc-950 shadow-orange-500/20',
            accent: 'orange-500',
            ring: 'focus:ring-orange-500/20',
            border: 'focus:border-orange-500/50',
            daySelected: 'bg-orange-500 border-orange-400 text-zinc-950 shadow-orange-500/10'
        },
        emerald: {
            btn: 'bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-zinc-950 shadow-emerald-500/20',
            accent: 'emerald-500',
            ring: 'focus:ring-emerald-500/20',
            border: 'focus:border-emerald-500/50',
            daySelected: 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-emerald-500/10'
        },
        purple: {
            btn: 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 text-zinc-950 shadow-purple-500/20',
            accent: 'purple-500',
            ring: 'focus:ring-purple-500/20',
            border: 'focus:border-purple-500/50',
            daySelected: 'bg-purple-500 border-purple-400 text-zinc-950 shadow-purple-500/10'
        },
        cyan: {
            btn: 'bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 text-zinc-950 shadow-cyan-500/20',
            accent: 'cyan-500',
            ring: 'focus:ring-cyan-500/20',
            border: 'focus:border-cyan-500/50',
            daySelected: 'bg-cyan-500 border-cyan-400 text-zinc-950 shadow-cyan-500/10'
        }
    }

    const s = schemes[colorScheme]

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

            switch (actionType) {
                case 'create-student-workout':
                    const { createStudentWorkout } = await import('@/actions/student-content-actions')
                    await createStudentWorkout(formData)
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
                    result = await createStudentErgogenic(formData)
                    break
                case 'create-manual-workout':
                    const { createManualWorkout } = await import('@/actions/workout-actions')
                    result = await createManualWorkout(formData)
                    break
                case 'create-manual-diet':
                    const { createManualDiet } = await import('@/actions/diet-actions')
                    result = await createManualDiet(formData)
                    break
                case 'create-student':
                    const { createStudent } = await import('@/actions/trainer-actions')
                    result = await createStudent(null, formData)
                    break
                case 'update-student-ergogenic':
                    if (!id) throw new Error('ID is required for update')
                    const { updateErgogenic } = await import('@/actions/ergogenics-actions')
                    const updateData: any = {}
                    fields.forEach(f => {
                        const val = formData.get(f.name)
                        if (val !== null) updateData[f.name] = f.type === 'number' ? Number(val) : val
                    })
                    if (daysField) updateData[daysField.name] = selectedDays
                    result = await updateErgogenic(id, parentId || '', updateData)
                    break
                case 'duplicate-student-ergogenic':
                    const { addErgogenic } = await import('@/actions/ergogenics-actions')
                    const duplicateData: any = {}
                    fields.forEach(f => {
                        const val = formData.get(f.name)
                        if (val !== null) duplicateData[f.name] = f.type === 'number' ? Number(val) : val
                    })
                    if (daysField) duplicateData[daysField.name] = selectedDays
                    duplicateData.student_id = parentId
                    result = await addErgogenic(duplicateData)
                    break
                default:
                    throw new Error('Invalid action type')
            }

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
                    <Button className={cn("font-bold uppercase italic tracking-tight rounded-xl h-11 transition-all active:scale-95 shadow-lg", s.btn)}>
                        <Plus className="mr-2 h-4 w-4" /> {triggerLabel}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="relative">
                    <DialogTitle className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter leading-tight">{title}</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-10">
                    <div className="space-y-6">
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-3">
                                <Label htmlFor={field.name} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </Label>

                                {field.type === 'textarea' ? (
                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        defaultValue={initialValues?.[field.name]}
                                        className={cn("bg-zinc-900/50 border-zinc-800 rounded-2xl min-h-[120px] transition-all", s.ring, "focus:border-transparent")}
                                    />
                                ) : field.type === 'select' ? (
                                    <div className="space-y-4">
                                        <Select name={field.name} defaultValue={initialValues?.[field.name] || field.defaultValue} required={field.required}>
                                            <SelectTrigger className={cn("flex h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900  py-2 text-sm transition-all font-bold text-white text-left group", s.ring, s.border)}>
                                                <SelectValue placeholder={field.placeholder || "Selecione..."} />
                                            </SelectTrigger>
                                            <SelectContent position="popper" className="bg-zinc-900 border-zinc-800 text-white rounded-2xl p-2 shadow-2xl border-white/5 animate-in fade-in zoom-in duration-200">
                                                {field.options?.map(opt => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                        className={cn("rounded-xl px-3 py-2.5 font-bold transition-all cursor-pointer mb-1 last:mb-0 focus:bg-white/5", `focus:text-${s.accent}`)}
                                                    >
                                                        <div className="flex items-center gap-3 pb-4">
                                                            {opt.color && (
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color, boxShadow: `0 0 8px ${opt.color}66` }} />
                                                            )}
                                                            {opt.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : field.type === 'days' ? (
                                    <div className="flex justify-between gap-1.5 h-12 p-1.5 bg-zinc-900/40 rounded-[1.2rem] border border-zinc-800/50 shadow-inner">
                                        {WEEKDAYS.map((day) => (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => toggleDay(day.value)}
                                                className={cn(
                                                    "flex-1 rounded-[0.8rem] text-[10px] font-black transition-all active:scale-90",
                                                    selectedDays.includes(day.value)
                                                        ? s.daySelected
                                                        : "text-zinc-600 hover:text-white hover:bg-zinc-800"
                                                )}
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
                                        defaultValue={initialValues?.[field.name] ? (field.type === 'date' ? initialValues[field.name].split('T')[0] : initialValues[field.name]) : undefined}
                                        className={cn("bg-zinc-900/50 border-zinc-800 h-14 rounded-2xl transition-all font-bold ", s.ring, "focus:border-transparent")}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className={cn("w-full h-16 rounded-2xl font-black uppercase italic tracking-widest transition-all active:scale-[0.98] shadow-2xl relative overflow-hidden group", s.btn)}
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Plus className="w-5 h-5 mr-3" />}
                            <span className="relative z-10">{footerLabel}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
