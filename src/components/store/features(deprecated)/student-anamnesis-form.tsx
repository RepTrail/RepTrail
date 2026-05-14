'use client';
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Ruler, Weight, User, Activity, ArrowRight, Target, Check } from "lucide-react"
import { Badge } from '@/components/ui/badge'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'

export function AnamnesisForm({ initialData }: { initialData?: any }) {
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return null
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    const studentAge = initialData?.birth_date ? calculateAge(initialData.birth_date) : initialData?.age

    const [formData, setFormData] = useState({
        sex: initialData?.sex || 'male',
        activity_level: initialData?.activity_level || 'moderate',
        height: initialData?.height || '',
        weight: initialData?.weight || initialData?.current_weight || initialData?.starting_weight || '',
        neck_cm: initialData?.neck_cm || '',
        waist_cm: initialData?.waist_cm || '',
        hip_cm: initialData?.hip_cm || '',
    })

    const [calculatedBF, setCalculatedBF] = useState<string | null>(null)

    useEffect(() => {
        const h = parseFloat(formData.height)
        const neck = parseFloat(formData.neck_cm)
        const waist = parseFloat(formData.waist_cm)
        const hip = parseFloat(formData.hip_cm)

        if (formData.sex === 'male') {
            if (!h || !waist || !neck || waist <= neck) {
                setCalculatedBF(null)
                return
            }
            const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450
            setCalculatedBF(Math.max(2, bf).toFixed(1))
        } else {
            if (!h || !waist || !neck || !hip || (waist + hip) <= neck) {
                setCalculatedBF(null)
                return
            }
            const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450
            setCalculatedBF(Math.max(2, bf).toFixed(1))
        }
    }, [formData])

    const { mutate } = useOptimisticMutation({
        actionName: 'update-student-profile',
        entity: ENTITIES.STUDENT_DETAIL,
        entityId: initialData?.id || 'me',
        queryKey: QUERY_KEYS.student.metrics(initialData?.id || 'me'),
        mutationFn: async (variables: { obj: any }) => variables,
        onMutate: (variables) => {
            const previousMetrics = queryClient.getQueryData(QUERY_KEYS.student.metrics(initialData?.id))
            queryClient.setQueryData(QUERY_KEYS.student.metrics(initialData?.id), (old: any) => {
                if(!old) return old
                return { ...old, ...variables.obj, _optimistic: true }
            })
            return { previousMetrics }
        },
        onSuccess: () => {
            toast({ title: "Protocolo Atualizado!", description: "Suas métricas de elite foram calculadas e salvas." })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(QUERY_KEYS.student.metrics(initialData?.id), ctx?.previousMetrics)
            toast({ variant: "destructive", title: "Erro inesperado", description: "Falha ao sincronizar métricas." })
        }
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const obj = {
            ...formData,
            body_fat: calculatedBF
        }
        mutate({ obj })
    }

    return (
        <Box padding={{ base: 5, md: 12.5 }} bg="zinc" bgOpacity={95} border borderColor="zinc" rounded="system" className="shadow-2xl">
            <form onSubmit={handleSubmit}>
                <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                    {/* Basic Info */}
                    <Grid cols={{ base: 2.5, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest" className="flex items-center gap-2">
                                <User className="w-3 h-3" /> Idade
                            </Font>
                            <Box 
                                height={16} 
                                bg="zinc" 
                                bgOpacity={20} 
                                border 
                                borderColor="zinc" 
                                rounded="system" 
                                className="flex items-center px-6 opacity-70 cursor-not-allowed"
                            >
                                <Font variant="heading" weight="black" italic color="zinc-400" className="text-xl">
                                    {studentAge ? `${studentAge} anos` : '--'}
                                </Font>
                            </Box>
                        </Stack>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest" className="flex items-center gap-2">
                                <Ruler className="w-3 h-3" /> Altura (cm)
                            </Font>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 175"
                                value={formData.height}
                                onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                className="h-16 bg-zinc-900/20 border border-zinc-900 focus:border-zinc-700 rounded-system font-black italic text-xl px-6 text-zinc-300"
                                required
                            />
                        </Stack>
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest" className="flex items-center gap-2">
                                <Weight className="w-3 h-3" /> Peso (kg)
                            </Font>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 80"
                                value={formData.weight}
                                onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                className="h-16 bg-zinc-900/20 border border-zinc-900 focus:border-zinc-700 rounded-system font-black italic text-xl px-6 text-zinc-300"
                                required
                            />
                        </Stack>
                    </Grid>

                    {/* Navy Seal Measurements */}
                    <Box 
                        padding={{ base: 5, md: 7.5 }} 
                        bg="emerald" 
                        bgOpacity={5} 
                        border 
                        borderColor="emerald" 
                        rounded="system" 
                        position="relative" 
                        overflow="hidden" 
                        group
                    >
                        <Box position="absolute" pin="right" top={0} padding={STORE_TOKENS.PADDING.CONTAINER} opacity={10} groupHoverOpacity={10} transition>
                            <Target className="w-32 h-32 text-emerald-500" />
                        </Box>

                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} position="relative" zIndex={10}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Font variant="tiny" weight="black" color="white" italic uppercase tracking="widest">
                                        Medições Antropométricas
                                    </Font>
                                    <Badge variant="outline" className="border-none bg-emerald-500 text-zinc-950 text-[8px] font-black uppercase h-5 px-2 whitespace-nowrap">Precisão Máxima</Badge>
                                </div>
                                <Font variant="sub-tiny" color="zinc-500" weight="bold" italic>
                                    Insira suas medidas exatas com fita métrica para o cálculo de elite.
                                </Font>
                            </Stack>

                            <Grid cols={{ base: 2.5, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">Pescoço (cm)</Font>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="Ex: 40"
                                        value={formData.neck_cm}
                                        onChange={e => setFormData(prev => ({ ...prev, neck_cm: e.target.value }))}
                                        className="h-16 bg-zinc-950 border-emerald-500/20 focus:border-emerald-500/50 rounded-system font-black italic text-xl px-6"
                                        required
                                    />
                                </Stack>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">Cintura - Umbigo (cm)</Font>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="Ex: 82"
                                        value={formData.waist_cm}
                                        onChange={e => setFormData(prev => ({ ...prev, waist_cm: e.target.value }))}
                                        className="h-16 bg-zinc-950 border-emerald-500/20 focus:border-emerald-500/50 rounded-system font-black italic text-xl px-6"
                                        required
                                    />
                                </Stack>
                                {formData.sex === 'female' && (
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">Quadril (cm)</Font>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="Ex: 95"
                                            value={formData.hip_cm}
                                            onChange={e => setFormData(prev => ({ ...prev, hip_cm: e.target.value }))}
                                            className="h-16 bg-zinc-950 border-emerald-500/20 focus:border-emerald-500/50 rounded-system font-black italic text-xl px-6"
                                            required
                                        />
                                    </Stack>
                                )}
                            </Grid>
                        </Stack>
                    </Box>

                    <Grid cols={{ base: 2.5, md: 2 }} gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                        {/* Sex & Activity */}
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Gênero Biológico</Font>
                                <RadioGroup
                                    value={formData.sex}
                                    onValueChange={v => setFormData(prev => ({ ...prev, sex: v }))}
                                    className="flex gap-4"
                                >
                                    <div className="flex-1">
                                        <RadioGroupItem value="male" id="male" className="peer sr-only" />
                                        <label
                                            htmlFor="male"
                                            className="flex items-center justify-center w-full h-16 bg-zinc-900/30 border border-zinc-800 rounded-system cursor-pointer hover:bg-zinc-800 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-500/5 transition-all text-[9px] sm:text-[10px] font-black uppercase italic tracking-widest text-zinc-500 peer-data-[state=checked]:text-emerald-500 px-2 text-center"
                                        >
                                            Masculino
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <RadioGroupItem value="female" id="female" className="peer sr-only" />
                                        <label
                                            htmlFor="female"
                                            className="flex items-center justify-center w-full h-16 bg-zinc-900/30 border border-zinc-800 rounded-system cursor-pointer hover:bg-zinc-800 peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-500/5 transition-all text-[9px] sm:text-[10px] font-black uppercase italic tracking-widest text-zinc-500 peer-data-[state=checked]:text-pink-500 px-2 text-center"
                                        >
                                            Feminino
                                        </label>
                                    </div>
                                </RadioGroup>
                            </Stack>

                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">Nível de Atividade</Font>
                                <Select
                                    value={formData.activity_level}
                                    onValueChange={v => setFormData(prev => ({ ...prev, activity_level: v }))}
                                >
                                    <SelectTrigger className="h-16 bg-zinc-900/30 border-zinc-800 rounded-system font-black italic uppercase text-[11px] tracking-widest px-6">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-950 border-zinc-900 text-white">
                                        <SelectItem value="sedentary" className="font-bold uppercase text-[10px] tracking-wider py-4">Sedentário (Nenhum exercício)</SelectItem>
                                        <SelectItem value="light" className="font-bold uppercase text-[10px] tracking-wider py-4">Leve (1-3 dias/semana)</SelectItem>
                                        <SelectItem value="moderate" className="font-bold uppercase text-[10px] tracking-wider py-4">Moderado (3-5 dias/semana)</SelectItem>
                                        <SelectItem value="active" className="font-bold uppercase text-[10px] tracking-wider py-4">Intenso (6-7 dias/semana)</SelectItem>
                                        <SelectItem value="athlete" className="font-bold uppercase text-[10px] tracking-wider py-4">Elite (Atleta prof.)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Stack>
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} justify="end">
                            <Box 
                                padding={{ base: 5, md: 7.5 }} 
                                rounded="system" 
                                border 
                                transition 
                                className={cn(
                                    "duration-700",
                                    calculatedBF ? 'bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5' : 'bg-zinc-900/10 border-zinc-800 opacity-50'
                                )}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">Estimativa Navy Seal</Font>
                                    {calculatedBF && <Check className="w-5 h-5 text-emerald-500" />}
                                </div>

                                <div className="flex items-center gap-4">
                                    <Font variant="heading" weight="black" color="white" italic className="text-7xl tracking-tighter tabular-nums">
                                        {calculatedBF || '--.-'}<Font color="emerald" className="text-3xl ml-1">%</Font>
                                    </Font>
                                    <div className="flex-1 border-l border-zinc-800 pl-6 hidden lg:block">
                                        <Font variant="sub-tiny" weight="bold" color="zinc-500" uppercase tracking="widest" className="mb-1">Status Metabólico</Font>
                                        <Font variant="tiny" weight="black" color="white" uppercase italic>
                                            {calculatedBF ? (parseFloat(calculatedBF) < 10 ? 'Elite' : parseFloat(calculatedBF) < 15 ? 'Atleta' : parseFloat(calculatedBF) < 20 ? 'Fitness' : 'Iniciante') : 'Aguardando Medições'}
                                        </Font>
                                    </div>
                                </div>
                            </Box>

                            <Button
                                type="submit"
                                disabled={!calculatedBF}
                                className="w-full relative h-auto py-4 sm:py-5 sm:px-8 rounded-system sm:rounded-system bg-white hover:bg-emerald-500 hover:text-white text-zinc-950 transition-all shadow-xl active:scale-95 group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] transition-transform duration-1000 group-hover:translate-x-[100%]" />

                                <div className="flex flex-col items-center justify-center w-full relative z-10 sm:flex-row sm:justify-between gap-2 sm:gap-4">
                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                                        <Font variant="tiny" weight="black" uppercase italic className="leading-none sm:text-base md:text-lg">
                                            Salvar Dados
                                        </Font>
                                        <Font variant="sub-tiny" weight="bold" color="zinc-500" uppercase tracking="widest" className="group-hover:text-emerald-100 transition-colors mt-1">
                                            Antropométricos
                                        </Font>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors">
                                        <ArrowRight className="w-5 h-5 text-zinc-900 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </Button>
                        </Stack>
                    </Grid>
                </Stack>
            </form>
        </Box>
    );
}

import { cn } from '@/lib/utils'
import { STORE_TOKENS } from "../constants/tokens";

