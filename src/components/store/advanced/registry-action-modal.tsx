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
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Box } from '@/components/store/base/box'
import {
    Calendar,
    Clock,
    Dumbbell,
    Utensils,
    Activity,
    FlaskConical,
    Copy,
    Trash2,
    Edit3,
    Plus,
    UserPlus,
    Timer
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

    // Update state when initialData changes or modal opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedDays(initialData?.selectedDays || [])
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
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Grid cols={{ base: 2.5, md: 2 }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Input label="DURAÇÃO (MIN)" icon={<Clock size={16} />} placeholder="30" type="number" defaultValue={initialData?.duration} />
                                <FormSelect
                                    label="INTENSIDADE"
                                    options={[
                                        { label: 'Leve', value: 'low' },
                                        { label: 'Moderada', value: 'medium' },
                                        { label: 'Alta', value: 'high' }
                                    ]}
                                    value={initialData?.intensity || 'medium'}
                                />
                            </Grid>
                        <WeekdayPicker
                            label="DIAS DA SEMANA"
                            selectedDays={selectedDays.length > 0 ? selectedDays : [1, 2, 3, 4, 5]}
                            onChange={setSelectedDays}
                        />
                    </Stack>
                )

            case 'assign_ergogenic':
            case 'edit_ergogenic':
                return (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        
                        <Input 
                            label="NOME DA SUBSTÂNCIA *" 
                            defaultValue={initialData?.item || 'Durateston'} 
                            placeholder="Ex: Durateston"
                        />

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                                DOSAGEM SEMANAL TOTAL *
                            </Font>
                            <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Input 
                                    type="number" 
                                    defaultValue={initialData?.dosage || 300}
                                    weight="black"
                                    flex1
                                />
                                <FormSwitch 
                                    options={[
                                        { label: 'MG', value: 'mg' },
                                        { label: 'ML', value: 'ml' },
                                        { label: 'UN', value: 'un' }
                                    ]}
                                    value="mg"
                                    color="primary"
                                />
                            </Stack>
                        </Stack>

                        <WeekdayPicker 
                            label="DIAS DE APLICAÇÃO *"
                            selectedDays={selectedDays.length > 0 ? selectedDays : [1, 3, 5]}
                            onChange={setSelectedDays}
                        />

                        <Textarea 
                            label="INSTRUÇÕES / NOTAS (OPCIONAL)"
                            placeholder="Ex: Aplicar no glúteo..."
                            defaultValue={initialData?.notes}
                            className="h-32"
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
            onConfirm={onConfirm}
            isLoading={isLoading}
        >
            {renderForm()}
        </Modal>
    )
}
