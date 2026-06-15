'use client'

import React, { useState, useEffect } from 'react'
import { useCardioDetails, useQueryClient } from '@/lib/dal'
import { useToast } from '@/components/store/hooks/use-toast'
import { useOptimisticMutation } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { GlassPanel } from '@/components/store/base/surface'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { ArrowLeft, Clock, Activity, Flame, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { CardioBuilderHeader } from './cardio-builder-header'

interface CardioBuilderSmartProps {
    cardio: any
    students?: any[]
    backHref?: string
    contextLabel?: string
    icon?: any
    contextColor?: string
}

export function CardioBuilderSmart({
    cardio: initialCardio,
    students = [],
    backHref = '/dashboard/student/cardio',
    contextLabel = 'Condicionamento & SaÃºde',
    icon = Flame,
    contextColor = 'orange'
}: CardioBuilderSmartProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const queryKey = QUERY_KEYS.cardio.detail(initialCardio.id)

    const { data: cardioData } = useCardioDetails(initialCardio.id)

    const cardio = cardioData as any | null

    const [isEditingMeta, setIsEditingMeta] = useState(false)
    const [editName, setEditName] = useState(cardio?.name || '')
    const [editDesc, setEditDesc] = useState(cardio?.description || '')
    const [editDuration, setEditDuration] = useState<number>(cardio?.duration_minutes || 30)
    const [editIntensity, setEditIntensity] = useState<string>(cardio?.suggested_intensity || 'Moderada')

    useEffect(() => {
        if (!isEditingMeta && cardio) {
            setEditName(cardio.name)
            setEditDesc(cardio?.description || '')
            setEditDuration(cardio.duration_minutes || 30)
            setEditIntensity(cardio.suggested_intensity || 'Moderada')
        }
    }, [cardio?.name, cardio?.description, cardio?.duration_minutes, cardio?.suggested_intensity, isEditingMeta])

    // MUTATION FOR METADATA AND PARAMS
    const { mutate: mutateMeta } = useOptimisticMutation({
        actionName: 'update-cardio',
        entity: ENTITIES.CARDIO,
        entityId: cardio?.id || '',
        queryKey,
        mutationFn: async (variables: { id: string, name: string, description: string, duration: number, intensity: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, (old: any) => ({ 
                ...old, 
                name: variables.name,
                description: variables?.description,
                duration_minutes: variables.duration,
                suggested_intensity: variables.intensity
            }))
            return { previous }
        },
        onSuccess: () => {
            setIsEditingMeta(false)
            toast({
                title: "Sucesso",
                description: "Protocolo de cardio atualizado!"
            })
        }
    })

    const handleSave = () => {
        if (!editName.trim()) {
            toast({
                title: "Erro",
                description: "O nome do cardio nÃ£o pode ser vazio.",
                variant: "destructive"
            })
            return
        }
        mutateMeta({
            id: cardio.id,
            name: editName,
            description: editDesc,
            duration: editDuration,
            intensity: editIntensity
        })
    }

    if (!cardio) return null

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            {/* Back Button */}
            {backHref && (
                <Box shrink={0}>
                    <Link href={backHref}>
                        <Button variant="outline-zinc" size="sm" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={ArrowLeft} size="xs" />
                            Voltar
                        </Button>
                    </Link>
                </Box>
            )}
            {/* Premium Header */}
            <CardioBuilderHeader
                cardioId={cardio.id}
                name={cardio.name}
                description={cardio?.description || ''}
                isEditing={isEditingMeta}
                setIsEditing={setIsEditingMeta}
                editName={editName}
                setEditName={setEditName}
                editDesc={editDesc}
                setEditDesc={setEditDesc}
                onSave={handleSave}
                onCancel={() => {
                    setEditName(cardio.name)
                    setEditDesc(cardio?.description || '')
                    setEditDuration(cardio.duration_minutes || 30)
                    setEditIntensity(cardio.suggested_intensity || 'Moderada')
                    setIsEditingMeta(false)
                }}
                contextLabel={contextLabel}
                icon={icon}
                contextColor={contextColor}
            />
            {/* Cardio Settings Panel */}
            <GlassPanel padding={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Activity} color={STORE_TOKENS.COLORS.BRAND} size="md" />
                        <Font
                            variant="heading"
                            uppercase
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                            }}>
                            ConfiguraÃ§Ã£o do Protocolo
                        </Font>
                    </Inline>

                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Box flex1>
                                <Input
                                    label="DURAÃ‡ÃƒO PROGRAMADA (MINUTOS)"
                                    icon={<Icon icon={Clock} size="xs" />}
                                    type="number"
                                    value={editDuration}
                                    onChange={e => setEditDuration(parseInt(e.target.value) || 0)}
                                    placeholder="Ex: 30"
                                />
                            </Box>
                            <Box flex1>
                                <FormSelect
                                    label="INTENSIDADE SUGERIDA"
                                    options={[
                                        { label: 'Leve', value: 'Leve' },
                                        { label: 'Moderada', value: 'Moderada' },
                                        { label: 'Alta', value: 'Alta' },
                                        { label: 'MÃ¡xima', value: 'MÃ¡xima' }
                                    ]}
                                    value={editIntensity}
                                    onChange={setEditIntensity}
                                />
                            </Box>
                        </Inline>
                    </Stack>

                    <Box display="flex" justify="end" fullWidth>
                        <Button 
                            variant="primary" 
                            onClick={handleSave} 
                            gap={STORE_TOKENS.SPACING.ELEMENT}
                            shine
                        >
                            <Icon icon={Sparkles} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                            <Font
                                weight="bold"
                                {...{
                                    color: "black",
                                }}>SALVAR AJUSTES</Font>
                        </Button>
                    </Box>
                </Stack>
            </GlassPanel>
        </Stack>
    );
}
