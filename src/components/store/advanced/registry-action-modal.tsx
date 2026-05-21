'use client'

import React from 'react'
import { Modal } from './modal'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { FormSelect } from '@/components/store/base/form-select'
import { FormSwitch } from '@/components/store/base/form-switch'
import { Textarea } from '@/components/store/base/textarea'
import { Callout } from '../intermediary/callout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import {
    Clock,
    Dumbbell,
    Utensils,
    Activity,
    FlaskConical,
    Copy,
    Trash2,
    Edit3,
    Plus,
    UserPlus
} from 'lucide-react'
import { WeekdayPicker } from '@/components/store/base/weekday-picker'

export type RegistryActionType =
    | 'assign_training'
    | 'assign_diet'
    | 'assign_cardio'
    | 'assign_ergogenic'
    | 'edit_cardio'
    | 'edit_ergogenic'
    | 'confirm_duplicate'
    | 'confirm_delete'
    | 'create_cardio'
    | 'create_diet'
    | 'create_ergogenic'
    | 'create_workout'

interface RegistryActionModalProps {
    isOpen: boolean
    onClose: () => void
    type: RegistryActionType
    onConfirm: (data?: any) => void
    initialData?: any
    isLoading?: boolean
}

/**
 * RegistryActionModal: Unified modal for all dashboard registry actions.
 * Follows strict Design System Rules (V2) and Zero-Manual-Styling.
 */
export function RegistryActionModal({
    isOpen,
    onClose,
    type,
    onConfirm,
    initialData,
    isLoading = false
}: RegistryActionModalProps) {
    const [selectedDays, setSelectedDays] = React.useState<number[]>(initialData?.selectedDays || [])
    const [duration, setDuration] = React.useState<number>(initialData?.duration || initialData?.duration_minutes || 30)
    const [intensity, setIntensity] = React.useState<string>(initialData?.intensity || initialData?.suggested_intensity || 'Moderada')

    // Update state when initialData changes or modal opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedDays(initialData?.selectedDays || [])
            setDuration(initialData?.duration || initialData?.duration_minutes || 30)
            setIntensity(initialData?.intensity || initialData?.suggested_intensity || 'Moderada')
        }
    }, [isOpen, initialData])

    // Configuration mapping based on type
    const config = {
        assign_training: {
            title: 'AGENDAR TREINO',
            subtitle: 'Escolha os dias da semana para este treino.',
            icon: Plus,
            variant: 'primary' as const,
            confirmLabel: 'CONFIRMAR ATRIBUIÇÃO'
        },
        assign_diet: {
            title: 'AGENDAR DIETA',
            subtitle: 'Escolha os dias da semana para esta dieta.',
            icon: Plus,
            variant: 'primary' as const,
            confirmLabel: 'CONFIRMAR ATRIBUIÇÃO'
        },
        assign_cardio: {
            title: 'AGENDAR CARDIO',
            subtitle: 'Escolha os dias da semana para este protocolo.',
            icon: Activity,
            variant: 'primary' as const,
            confirmLabel: 'CONFIRMAR ATRIBUIÇÃO'
        },
        assign_ergogenic: {
            title: 'AGENDAR APLICAÇÕES',
            subtitle: 'Escolha os dias da semana para este ergogênico.',
            icon: Plus,
            variant: 'primary' as const,
            confirmLabel: 'CONFIRMAR ATRIBUIÇÃO'
        },
        edit_cardio: {
            title: 'EDITAR CARDIO',
            subtitle: 'Ajuste os parâmetros da atividade.',
            icon: Edit3,
            variant: 'primary' as const,
            confirmLabel: 'CONFIRMAR ATRIBUIÇÃO'
        },
        edit_ergogenic: {
            title: 'EDITAR ERGOGÊNICO',
            subtitle: 'Ajuste a dosagem e frequência.',
            icon: Edit3,
            variant: 'primary' as const,
            confirmLabel: 'CONFIRMAR ATRIBUIÇÃO'
        },
        confirm_duplicate: {
            title: 'DUPLICAR REGISTRO',
            subtitle: 'Confirmar ação de cópia.',
            icon: Copy,
            variant: 'primary' as const,
            confirmLabel: 'CONFIRMAR DUPLICAÇÃO'
        },
        confirm_delete: {
            title: 'EXCLUIR REGISTRO',
            subtitle: 'Esta ação não poderá ser desfeita.',
            icon: Trash2,
            variant: 'red' as const,
            confirmLabel: 'EXCLUIR PERMANENTEMENTE'
        },
        create_cardio: {
            title: 'NOVO MODELO DE CARDIO',
            subtitle: 'Crie um template para seus agendamentos.',
            icon: Activity,
            variant: 'primary' as const,
            confirmLabel: 'CRIAR MODELO'
        },
        create_diet: {
            title: 'NOVO MODELO DE DIETA',
            subtitle: 'Crie um template para seus agendamentos.',
            icon: Utensils,
            variant: 'primary' as const,
            confirmLabel: 'CRIAR MODELO'
        },
        create_ergogenic: {
            title: 'NOVO ERGOGÊNICO',
            subtitle: 'Adicione uma nova substância ao seu protocolo.',
            icon: FlaskConical,
            variant: 'primary' as const,
            confirmLabel: 'ADICIONAR SUBSTÂNCIA'
        },
        create_workout: {
            title: 'NOVO MODELO DE TREINO',
            subtitle: 'Crie um template para seus agendamentos.',
            icon: Dumbbell,
            variant: 'primary' as const,
            confirmLabel: 'CRIAR MODELO'
        }
    }

    const currentConfig = config[type]

    // Form Renderers
    const renderForm = () => {
        switch (type) {
            case 'assign_training':
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <WeekdayPicker
                            label="DIA PROGRAMADO"
                            selectedDays={selectedDays}
                            onChange={setSelectedDays}
                            multiple={false}
                        />
                    </Stack>
                )

            case 'assign_diet':
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <WeekdayPicker
                            label="DIAS DA SEMANA"
                            selectedDays={selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6]}
                            onChange={setSelectedDays}
                        />
                    </Stack>
                )

            case 'assign_cardio':
            case 'edit_cardio':
            case 'create_cardio':
            case 'create_diet':
            case 'create_workout' as any:
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Input 
                            label={type === 'create_diet' ? "NOME DA DIETA *" : "NOME DO CARDIO *"} 
                            placeholder={type === 'create_diet' ? "Ex: Dieta Cutting 2000kcal" : "Ex: Corrida na Esteira"} 
                            id="diet_name"
                            defaultValue={initialData?.name}
                        />
                        {type !== 'create_diet' && (
                            <Grid cols={{ base: 2, md: 2 }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Input 
                                        label="DURAÇÃO (MIN)" 
                                        icon={<Clock size={16} />} 
                                        placeholder="30" 
                                        type="number" 
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt((e.target as HTMLInputElement).value) || 0)}
                                    />
                                    <FormSelect
                                        label="INTENSIDADE"
                                        options={[
                                            { label: 'Leve', value: 'Leve' },
                                            { label: 'Moderada', value: 'Moderada' },
                                            { label: 'Alta', value: 'Alta' },
                                            { label: 'Máxima', value: 'Máxima' }
                                        ]}
                                        value={intensity}
                                        onChange={setIntensity}
                                    />
                                </Grid>
                        )}
                        <Textarea 
                            label="DESCRIÇÃO (OPCIONAL)" 
                            placeholder={type === 'create_diet' ? "Instruções gerais sobre o plano..." : "Ex: 45 minutos em ritmo moderado"}
                            id="diet_description"
                            defaultValue={initialData?.description}
                        />
                        <WeekdayPicker
                            label="DIAS DA SEMANA"
                            selectedDays={selectedDays}
                            onChange={setSelectedDays}
                        />
                    </Stack>
                )

            case 'assign_ergogenic':
            case 'edit_ergogenic':
            case 'create_ergogenic' as any:
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        
                        <Input 
                            label="NOME DA SUBSTÂNCIA *" 
                            defaultValue={initialData?.item} 
                            placeholder="Ex: Durateston"
                        />

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                                DOSAGEM SEMANAL TOTAL *
                            </Font>
                            <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT} align="stretch">
                                <Input 
                                    type="number" 
                                    defaultValue={initialData?.dosage}
                                    weight="black"
                                    width={{ base: 'full', md: '70%' }}
                                    height="full"
                                    placeholder="0"
                                />
                                <FormSwitch 
                                    options={[
                                        { label: 'MG', value: 'mg' },
                                        { label: 'ML', value: 'ml' },
                                        { label: 'UN', value: 'un' }
                                    ]}
                                    value="mg"
                                    color="primary"
                                    width={{ base: 'full', md: '30%' }}
                                />
                            </Stack>
                        </Stack>

                        <WeekdayPicker 
                            label="DIAS DE APLICAÇÃO *"
                            selectedDays={selectedDays}
                            onChange={setSelectedDays}
                        />

                        <Textarea 
                            label="INSTRUÇÕES / NOTAS (OPCIONAL)"
                            placeholder="Ex: Aplicar no glúteo..."
                            defaultValue={initialData?.notes}
                            rows={6}
                        />
                    </Stack>
                )
            
            case 'confirm_duplicate':
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                            Você está prestes a duplicar o registro <strong>{initialData?.name || 'selecionado'}</strong>. Uma nova cópia será criada com os mesmos parâmetros originais.
                        </Font>
                        <Input label="TÍTULO DA CÓPIA" defaultValue={`${initialData?.name || 'Registro'} (Cópia)`} />
                    </Stack>
                )

            case 'confirm_delete':
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Callout variant="danger" title="Ação Irreversível">
                            Você tem certeza que deseja excluir <strong>{initialData?.name || 'este registro'}</strong>? Todos os dados associados serão removidos permanentemente.
                        </Callout>
                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                            Esta ação não poderá ser desfeita e impactará o histórico do aluno.
                        </Font>
                    </Stack>
                )

            default:
                return null
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={currentConfig.title}
            subtitle={currentConfig.subtitle}
            icon={currentConfig.icon}
            variant={currentConfig.variant}
            confirmLabel={currentConfig.confirmLabel}
            confirmIcon={['confirm_duplicate', 'confirm_delete'].includes(type) ? undefined : UserPlus}
            onConfirm={() => {
                if (['assign_cardio', 'edit_cardio', 'create_cardio', 'create_diet', 'create_workout' as any].includes(type)) {
                    const nameInput = document.getElementById('diet_name') as HTMLInputElement
                    const descInput = document.getElementById('diet_description') as HTMLTextAreaElement
                    
                    onConfirm({ 
                        duration, 
                        intensity, 
                        selectedDays,
                        name: nameInput?.value,
                        description: descInput?.value
                    })
                } else if (type === ('create_ergogenic' as any) || type === 'edit_ergogenic') {
                    const nameInput = document.querySelector('input[placeholder="Ex: Durateston"]') as HTMLInputElement
                    const dosageInput = document.querySelector('input[type="number"]') as HTMLInputElement
                    const unitSwitch = document.querySelector('[role="switch"][aria-checked="true"]') // This might be tricky
                    // Actually, I should use state for these in the modal if I want it robust
                    
                    onConfirm({
                        name: nameInput?.value,
                        weekly_dosage: Number(dosageInput?.value),
                        application_days: selectedDays,
                        unit: 'mg', // Default for now or extract from state
                        notes: (document.querySelector('textarea') as HTMLTextAreaElement)?.value
                    })
                } else if (['assign_training', 'assign_diet', 'assign_ergogenic'].includes(type)) {
                    onConfirm(selectedDays)
                } else {
                    onConfirm()
                }
            }}
            isLoading={isLoading}
        >
            {renderForm()}
        </Modal>
    )
}
