'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Textarea } from '@/components/store/base/textarea'
import { FormSelect } from '@/components/store/base/form-select'
import { FormCheckbox } from '@/components/store/base/form-checkbox'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import {
    User,
    Calendar,
    Ruler,
    Activity,
    Target,
    Phone,
    Save
} from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'

/**
 * StudentProfileForm: Advanced component encapsulating the profile editing interface.
 * Extracted from StudentProfileSectionContent.
 * Preserves the 2-column grid and all form element configurations.
 */
export function StudentProfileForm({
    userId,
    profile
}: {
    userId?: string
    profile?: any
}) {
    const queryClient = useQueryClient()
    const [displayBirthDate, setDisplayBirthDate] = useState(() => {
        if (!profile?.details?.birth_date) return ''
        const [year, month, day] = profile.details.birth_date.split('-')
        return `${day}/${month}/${year}`
    })

    const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '')
        if (value.length > 8) value = value.slice(0, 8)

        let formatted = value
        if (value.length > 2) {
            formatted = value.slice(0, 2) + '/' + value.slice(2)
        }
        if (value.length > 4) {
            formatted = formatted.slice(0, 5) + '/' + formatted.slice(5)
        }

        setDisplayBirthDate(formatted)
    }

    const { mutate, isPending } = useOptimisticMutation({
        actionName: 'update-student-profile',
        entity: ENTITIES.STUDENT_DETAIL,
        entityId: profile?.id || 'me',
        queryKey: QUERY_KEYS.student.details(profile?.id || 'me'),
        mutationFn: async () => {}, // Handled by sync engine
        onMutate: (variables) => {
            const previousDetails = queryClient.getQueryData(QUERY_KEYS.student.details(profile?.id))
            const previousDetail = queryClient.getQueryData(QUERY_KEYS.trainer.studentDetail(profile?.id))

            queryClient.setQueryData(QUERY_KEYS.student.details(profile?.id), (old: any) => {
                if(!old) return old
                return { ...old, ...variables.obj, _optimistic: true }
            })
            
            queryClient.setQueryData(QUERY_KEYS.trainer.studentDetail(profile?.id), (old: any) => {
                if(!old) return old
                return { ...old, ...variables.obj, _optimistic: true }
            })

            return { previousDetails, previousDetail }
        },
        onSuccess: () => {
            toast({ title: 'Perfil Atualizado', description: 'Suas informações foram salvas e estão sendo sincronizadas.' })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(QUERY_KEYS.student.details(profile?.id), ctx?.previousDetails)
            queryClient.setQueryData(QUERY_KEYS.trainer.studentDetail(profile?.id), ctx?.previousDetail)
            toast({ title: 'Erro inesperado', description: 'Tente novamente.', variant: 'destructive' })
        }
    })

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formDataObj = new FormData(e.currentTarget)
        
        // Extract birth date from DD/MM/AAAA to YYYY-MM-DD
        const bDateRaw = (formDataObj.get('birth_date_display') as string)?.replace(/\D/g, '')
        let birth_date = profile?.details?.birth_date
        if (bDateRaw?.length === 8) {
            const day = bDateRaw.slice(0, 2)
            const month = bDateRaw.slice(2, 4)
            const year = bDateRaw.slice(4, 8)
            birth_date = `${year}-${month}-${day}`
        }

        const obj = {
            data: {
                full_name: formDataObj.get('full_name') as string,
                whatsapp: formDataObj.get('whatsapp') as string,
                height: parseFloat(formDataObj.get('height') as string) || 0,
                body_fat: parseFloat(formDataObj.get('body_fat') as string) || 0,
                goal: formDataObj.get('goal') as string,
                activity_level: formDataObj.get('activity_level') as string,
                observations: formDataObj.get('observations') as string,
                steroid_use: formDataObj.get('steroid_use') === 'on',
                birth_date
            },
            studentId: profile?.id
        }
        mutate({ ...obj, userId: profile?.id })
    }

    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <form onSubmit={handleSubmit}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    {/* Form Grid */}
                    <Grid mdCols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Input 
                            label="NOME COMPLETO"
                            icon={<User size={16} />}
                            placeholder="Ex: João Silva" 
                            name="full_name"
                            defaultValue={profile?.full_name || profile?.name}
                        />

                        <Input 
                            label="DATA DE NASCIMENTO"
                            icon={<Calendar size={16} />}
                            placeholder="DD/MM/AAAA" 
                            name="birth_date_display"
                            value={displayBirthDate}
                            onChange={handleBirthDateChange}
                        />

                        <Input 
                            label="ALTURA (CM)"
                            icon={<Ruler size={16} />}
                            type="number"
                            placeholder="Ex: 180" 
                            name="height"
                            defaultValue={profile?.details?.height}
                        />

                        <Input 
                            label="PERCENTUAL DE GORDURA (BF %)"
                            icon={<Activity size={16} />}
                            type="number"
                            placeholder="Ex: 15.5" 
                            name="body_fat"
                            step="0.1"
                            defaultValue={profile?.details?.body_fat}
                        />

                        <Input 
                            label="OBJETIVO PRINCIPAL"
                            icon={<Target size={16} />}
                            placeholder="Ex: Hipertrofia Máxima" 
                            name="goal"
                            defaultValue={profile?.details?.goal}
                        />

                        <Input 
                            label="WHATSAPP (COM DDD)"
                            icon={<Phone size={16} />}
                            placeholder="Ex: 55 11 99999-9999" 
                            name="whatsapp"
                            defaultValue={profile?.whatsapp}
                        />

                        <Box mdColSpan={2}>
                            <FormSelect 
                                label="NÍVEL DE ATIVIDADE"
                                name="activity_level"
                                options={[
                                    { value: 'sedentary', label: 'Sedentário' },
                                    { value: 'light', label: 'Levemente Ativo' },
                                    { value: 'moderate', label: 'Moderado' },
                                    { value: 'active', label: 'Muito Ativo' },
                                    { value: 'athlete', label: 'Atleta / Extremo' },
                                ]}
                                defaultValue={profile?.details?.activity_level || 'moderate'}
                            />
                        </Box>

                        <Box mdColSpan={2}>
                            <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} border="none" rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                                <FormCheckbox 
                                    label="USO DE ERGOGÊNICOS / HORMÔNIOS"
                                    description="Esta informação é importante para que seu treinador ajuste seu protocolo corretamente."
                                    name="steroid_use"
                                    defaultChecked={profile?.details?.steroid_use}
                                />
                            </Surface>
                        </Box>

                        <Box mdColSpan={2}>
                            <Textarea 
                                label="OBSERVAÇÕES MÉDICAS / IMPORTANTES"
                                placeholder="Ex: Lesão no ombro direito, asma..." 
                                name="observations"
                                defaultValue={profile?.details?.observations}
                            />
                        </Box>
                    </Grid>

                    <Box height="px" bg="white" bgOpacity={5} fullWidth />

                    {/* Footer */}
                    <Stack direction={{ base: 'col', md: 'row' }} align="center" justify="between" gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box flex1>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold" uppercase tracking="tight">
                                Após salvar, algumas informações podem levar alguns segundos para atualizar em todo o sistema.
                            </Font>
                        </Box>
                        <Button type="submit" variant="outline-emerald" size="lg" fullWidth={{ base: true, md: false }} disabled={isPending}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="body-sm" weight="black" uppercase italic>{isPending ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}</Font>
                                <Icon icon={Save} size="xs" />
                            </Stack>
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Surface>
    )
}

