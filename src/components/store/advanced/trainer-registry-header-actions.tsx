'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileUp, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { UnifiedCreationDialog } from '@/components/store/features(deprecated)/unified-creation-dialog'
import { QUERY_KEYS } from '@/lib/query-keys'

type TrainerLibraryVariant = 'workout' | 'diet' | 'cardio' | 'ergogenic'

interface TrainerRegistryHeaderActionsProps {
    userId: string
    betaTesterMode?: boolean
    variant?: TrainerLibraryVariant
}

const VARIANT_CONFIG: Record<TrainerLibraryVariant, {
    createTitle: string
    createDescription: string
    createFields: { name: string; label: string; placeholder: string; required?: boolean; type?: 'textarea' }[]
    actionType: 'create-manual-workout' | 'create-manual-diet' | 'create-student-cardio' | 'create-student-ergogenic'
    successMessage: string
    footerLabel: string
    createLabel: string
    showImportPdf: boolean
    showCreate: boolean
    libraryKey?: (userId: string) => readonly unknown[]
}> = {
    workout: {
        createTitle: 'Novo Modelo de Treino',
        createDescription: 'Crie um template que poderá ser atribuído para vários alunos.',
        createFields: [
            { name: 'name', label: 'Nome do Treino', placeholder: 'Ex: Hipertrofia A - Peito/Tríceps', required: true },
            { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Instruções gerais, foco do treino, etc.', type: 'textarea' },
        ],
        actionType: 'create-manual-workout',
        successMessage: 'Template de treino criado!',
        footerLabel: 'Salvar Template',
        createLabel: 'Criar Manualmente',
        showImportPdf: true,
        showCreate: true,
        libraryKey: (userId) => QUERY_KEYS.workouts.library(userId),
    },
    diet: {
        createTitle: 'Novo Modelo de Dieta',
        createDescription: 'Crie um template de dieta (Cutting, Bulking, etc) para atribuir aos seus alunos.',
        createFields: [
            { name: 'name', label: 'Nome da Dieta', placeholder: 'Ex: Dieta para Secar (Low Carb)', required: true },
        ],
        actionType: 'create-manual-diet',
        successMessage: 'Template de dieta criado!',
        footerLabel: 'Salvar Template',
        createLabel: 'Criar Manualmente',
        showImportPdf: true,
        showCreate: true,
        libraryKey: (userId) => QUERY_KEYS.diets.library(userId),
    },
    cardio: {
        createTitle: 'Novo Modelo de Cardio',
        createDescription: 'Crie um template (ex: Esteira 45min) para agendar para seus alunos.',
        createFields: [
            { name: 'name', label: 'Nome do Cardio', placeholder: 'Ex: Corrida na Esteira', required: true },
            { name: 'description', label: 'Descrição (Opcional)', placeholder: 'Ex: Manter batimentos entre 130-140...', type: 'textarea' },
        ],
        actionType: 'create-student-cardio',
        successMessage: 'Modelo de cardio criado!',
        footerLabel: 'Salvar Modelo',
        createLabel: 'Criar Modelo',
        showImportPdf: true,
        showCreate: true,
        libraryKey: (userId) => QUERY_KEYS.cardio.library(userId),
    },
    ergogenic: {
        createTitle: '',
        createDescription: '',
        createFields: [],
        actionType: 'create-student-ergogenic',
        successMessage: '',
        footerLabel: '',
        createLabel: '',
        showImportPdf: true,
        showCreate: false,
    },
}

function DirectCreateButton({ 
    variant, 
    label, 
    actionType 
}: { 
    variant: TrainerLibraryVariant, 
    label: string, 
    actionType: string 
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleCreate = () => {
        startTransition(async () => {
            try {
                let res;
                if (actionType === 'create-manual-workout') {
                    const { createManualWorkout } = await import('@/actions/workout-actions')
                    res = await createManualWorkout({ name: 'Novo Treino' })
                } else if (actionType === 'create-manual-diet') {
                    const { createManualDiet } = await import('@/actions/diet-actions')
                    res = await createManualDiet({ name: 'Nova Dieta' })
                }
                
                if (res?.success && res.data?.id) {
                    if (actionType === 'create-manual-workout') {
                        router.push(`/dashboard/trainer/workouts/${res.data.id}`)
                    } else if (actionType === 'create-manual-diet') {
                        router.push(`/dashboard/trainer/diets/${res.data.id}`)
                    }
                }
            } catch (err) {
                console.error(err)
            }
        })
    }

    return (
        <Button variant="outline-emerald" shine fullWidth={{ base: true, lg: false }} onClick={handleCreate} disabled={isPending}>
            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                {isPending ? <Icon icon={Loader2} size="xs" color="emerald" spin /> : <Icon icon={Plus} size="xs" color="emerald" />}
                <span>{isPending ? 'Criando...' : label}</span>
            </Stack>
        </Button>
    )
}

/**
 * TrainerRegistryHeaderActions
 * DS header actions for trainer library pages (import PDF + manual create).
 * Pattern: outline-orange (import) + outline-emerald (create).
 */
export function TrainerRegistryHeaderActions({
    userId,
    betaTesterMode = false,
    variant = 'workout',
}: TrainerRegistryHeaderActionsProps) {
    const config = VARIANT_CONFIG[variant]

    const shouldUseDirectCreate = variant === 'workout' || variant === 'diet'

    return (
        <Stack
            direction={{ base: 'col', lg: 'row' }}
            align={{ base: 'stretch', lg: 'center' }}
            gap={STORE_TOKENS.SPACING.ELEMENT}
            fullWidth
        >
            {config.showImportPdf && !betaTesterMode && (
                <Button variant="outline-orange" asChild shine fullWidth={{ base: true, lg: false }}>
                    <Link href="/dashboard/trainer/import-pdf">
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={FileUp} size="xs" color="orange" />
                            <span>Importar PDF</span>
                        </Stack>
                    </Link>
                </Button>
            )}
            {config.showCreate && config.libraryKey && (
                shouldUseDirectCreate ? (
                    <DirectCreateButton 
                        variant={variant} 
                        label={config.createLabel} 
                        actionType={config.actionType} 
                    />
                ) : (
                    <UnifiedCreationDialog
                        title={config.createTitle}
                        description={config.createDescription}
                        trigger={
                            <Button variant="outline-emerald" shine fullWidth={{ base: true, lg: false }}>
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Plus} size="xs" color="emerald" />
                                    <span>{config.createLabel}</span>
                                </Stack>
                            </Button>
                        }
                        fields={config.createFields}
                        actionType={config.actionType}
                        successMessage={config.successMessage}
                        footerLabel={config.footerLabel}
                        colorScheme="emerald"
                        queryKey={config.libraryKey(userId)}
                    />
                )
            )}
        </Stack>
    )
}
