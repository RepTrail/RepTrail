'use client';

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Ruler, Weight, User, ArrowRight, Target, Check } from "lucide-react"
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

// Design System Imports
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Grid } from '@/components/store/base/grid'
import { Input } from '@/components/store/base/input'
import { FormSwitch } from '@/components/store/base/form-switch'
import { FormSelect } from '@/components/store/base/form-select'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { STORE_TOKENS } from "@/components/store/constants/tokens"

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
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="subtle">
            <form onSubmit={handleSubmit}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    
                    {/* Basic Info */}
                    <Grid mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Input 
                            label="IDADE"
                            icon={<Icon icon={User} size="xs" />}
                            value={studentAge ? `${studentAge} anos` : '--'}
                            disabled
                            placeholder="--"
                        />
                        <Input
                            label="ALTURA (CM)"
                            icon={<Icon icon={Ruler} size="xs" />}
                            type="number"
                            placeholder="Ex: 180"
                            value={formData.height}
                            onChange={e => setFormData(prev => ({ ...prev, height: e.target.value }))}
                        />
                        <Input
                            label="PESO (KG)"
                            icon={<Icon icon={Weight} size="xs" />}
                            type="number"
                            placeholder="Ex: 80"
                            value={formData.weight}
                            onChange={e => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        />
                    </Grid>

                    {/* Navy Seal Measurements */}
                    <Box 
                        padding={STORE_TOKENS.PADDING.CONTAINER} 
                        bg={STORE_TOKENS.COLORS.SUCCESS as any} 
                        bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                        border 
                        borderColor={STORE_TOKENS.COLORS.SUCCESS as any} 
                        borderOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                        position="relative" 
                        overflow="hidden" 
                    >
                        <Box position="absolute" pin="right" top={0} padding={STORE_TOKENS.PADDING.CONTAINER} opacity={STORE_TOKENS.OPACITY.SUBTLE}>
                            <Icon icon={Target} size="xl" color={STORE_TOKENS.COLORS.SUCCESS} />
                        </Box>

                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} position="relative" zIndex={10}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap">
                                    <Font variant="tiny" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} italic uppercase tracking="widest">
                                        Medições Antropométricas
                                    </Font>
                                    <Badge label="Precisão Máxima" color="emerald" variant="glass" size="xs" />
                                </Stack>
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold" italic>
                                    Insira suas medidas exatas com fita métrica para o cálculo de elite.
                                </Font>
                            </Stack>

                            <Grid mdCols={3} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                <Input
                                    label="PESCOÇO (CM)"
                                    type="number"
                                    placeholder="Ex: 40"
                                    value={formData.neck_cm}
                                    onChange={e => setFormData(prev => ({ ...prev, neck_cm: e.target.value }))}
                                />
                                <Input
                                    label="CINTURA - UMBIGO (CM)"
                                    type="number"
                                    placeholder="Ex: 82"
                                    value={formData.waist_cm}
                                    onChange={e => setFormData(prev => ({ ...prev, waist_cm: e.target.value }))}
                                />
                                {formData.sex === 'female' && (
                                    <Input
                                        label="QUADRIL (CM)"
                                        type="number"
                                        placeholder="Ex: 95"
                                        value={formData.hip_cm}
                                        onChange={e => setFormData(prev => ({ ...prev, hip_cm: e.target.value }))}
                                    />
                                )}
                            </Grid>
                        </Stack>
                    </Box>

                    {/* Sex & Activity & Status Grid */}
                    <Grid mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <FormSwitch
                                label="GÊNERO BIOLÓGICO"
                                options={[
                                    { label: 'MASCULINO', value: 'male' },
                                    { label: 'FEMININO', value: 'female' }
                                ]}
                                value={formData.sex}
                                onChange={(v) => setFormData(prev => ({ ...prev, sex: v }))}
                                color="emerald"
                            />

                            <FormSelect
                                label="NÍVEL DE ATIVIDADE"
                                value={formData.activity_level}
                                onChange={(v) => setFormData(prev => ({ ...prev, activity_level: v }))}
                                options={[
                                    { value: 'sedentary', label: 'Sedentário (Nenhum exercício)' },
                                    { value: 'light', label: 'Leve (1-3 dias/semana)' },
                                    { value: 'moderate', label: 'Moderado (3-5 dias/semana)' },
                                    { value: 'active', label: 'Intenso (6-7 dias/semana)' },
                                    { value: 'athlete', label: 'Elite (Atleta prof.)' }
                                ]}
                            />
                        </Stack>

                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} justify="end">
                            {/* Navy Seal Result Card */}
                            <Box 
                                padding={STORE_TOKENS.PADDING.CONTAINER} 
                                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                                border 
                                transition 
                                bg={calculatedBF ? (STORE_TOKENS.COLORS.SUCCESS as any) : (STORE_TOKENS.COLORS.BACKGROUND as any)}
                                bgOpacity={calculatedBF ? STORE_TOKENS.OPACITY.LOW : STORE_TOKENS.OPACITY.SUBTLE}
                                borderColor={calculatedBF ? (STORE_TOKENS.COLORS.SUCCESS as any) : (STORE_TOKENS.COLORS.DIVIDER.STANDARD as any)}
                                borderOpacity={calculatedBF ? STORE_TOKENS.OPACITY.MEDIUM : undefined}
                                opacity={calculatedBF ? STORE_TOKENS.OPACITY.FULL : STORE_TOKENS.OPACITY.MODAL}
                            >
                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    <Stack direction="row" align="center" justify="between">
                                        <Font variant="sub-tiny" weight="black" color={STORE_TOKENS.COLORS.TEXT.MUTED} uppercase tracking="widest">
                                            Estimativa Navy Seal
                                        </Font>
                                        {calculatedBF && <Icon icon={Check} color={STORE_TOKENS.COLORS.SUCCESS} size="sm" />}
                                    </Stack>

                                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Stack direction="row" align="baseline" gap={0}>
                                            <Font variant="h3" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} italic>
                                                {calculatedBF || '--.-'}
                                            </Font>
                                            <Font variant="body" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} italic>
                                                %
                                            </Font>
                                        </Stack>
                                        
                                        <Box display={{ base: 'none', lg: 'block' }} padding={0}>
                                            <Box width="px" height="full" bg={STORE_TOKENS.COLORS.WHITE as any} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} />
                                        </Box>

                                        <Box flex1 display={{ base: 'none', lg: 'block' }}>
                                            <Stack gap={0}>
                                                <Font 
                                                    variant="h3" 
                                                    weight="black" 
                                                    color={
                                                        !calculatedBF ? STORE_TOKENS.COLORS.TEXT.MUTED : 
                                                        parseFloat(calculatedBF) < 10 ? 'emerald' : 
                                                        parseFloat(calculatedBF) < 15 ? 'blue' : 
                                                        parseFloat(calculatedBF) < 20 ? 'amber' : 'red'
                                                    } 
                                                    uppercase 
                                                    italic
                                                >
                                                    {calculatedBF ? (parseFloat(calculatedBF) < 10 ? 'ELITE' : parseFloat(calculatedBF) < 15 ? 'ATLETA' : parseFloat(calculatedBF) < 20 ? 'FITNESS' : 'INICIANTE') : 'Aguardando Medições'}
                                                </Font>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Box>

                            <Button 
                                type="submit" 
                                disabled={!calculatedBF} 
                                variant="primary" 
                                size="lg" 
                                fullWidth 
                                gap={2.5}
                                className="whitespace-normal text-center leading-tight"
                            >
                                Salvar Dados Antropométricos
                                <ArrowRight size={16} className="shrink-0" />
                            </Button>
                        </Stack>
                    </Grid>

                </Stack>
            </form>
        </Surface>
    );
}

