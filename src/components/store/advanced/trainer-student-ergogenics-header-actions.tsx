'use client'

import React from 'react'
import Link from 'next/link'
import { FileUp, Plus } from 'lucide-react'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { UnifiedCreationDialog } from '@/components/store/advanced/unified-creation-dialog'

import { QUERY_KEYS } from '@/lib/query-keys'

const ERGOGENIC_CREATE_FIELDS = [
    { name: 'name', label: 'Nome da Substância', placeholder: 'Ex: Enantato de Testosterona', required: true },
    { name: 'weekly_dosage', label: 'Dosagem Semanal Total', placeholder: '250', type: 'number' as const, required: true, gridCols: 2 as const, merged: true },
    {
        name: 'unit',
        label: 'Unidade',
        type: 'select' as const,
        defaultValue: 'mg',
        options: [
            { label: 'mg', value: 'mg' },
            { label: 'ml', value: 'ml' },
            { label: 'un', value: 'un' },
        ],
        required: true,
        gridCols: 2 as const,
        merged: true,
    },
    { name: 'application_days', label: 'Dias de Aplicação', type: 'days' as const, required: true },
    { name: 'notes', label: 'Instruções / Notas (Opcional)', placeholder: 'Ex: Aplicar no glúteo...', type: 'textarea' as const },
]

interface TrainerStudentErgogenicsHeaderActionsProps {
    effectiveStudentId: string
    studentName: string
    betaTesterMode?: boolean
}

/**
 * Header actions for trainer student ergogenics protocol page.
 */
export function TrainerStudentErgogenicsHeaderActions({
    effectiveStudentId,
    studentName,
    betaTesterMode = false,
}: TrainerStudentErgogenicsHeaderActionsProps) {
    return (
        <Stack
            direction={{ base: 'col', lg: 'row' }}
            align={{ base: 'stretch', lg: 'center' }}
            gap={STORE_TOKENS.SPACING.ELEMENT}
            fullWidth
        >
            {!betaTesterMode && (
                <Button variant="outline-orange" asChild shine fullWidth={{ base: true, lg: false }}>
                    <Link href="/dashboard/trainer/import-pdf">
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={FileUp} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                            Importar PDF
                        </Stack>
                    </Link>
                </Button>
            )}
            <UnifiedCreationDialog
                title="Nova Substância"
                description={`Defina uma nova substância para o protocolo de ${studentName}.`}
                trigger={
                    <Button variant="outline-emerald" shine fullWidth={{ base: true, lg: false }}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Plus} size="xs" color={STORE_TOKENS.COLORS.SUCCESS} />
                            Adicionar Substância
                        </Stack>
                    </Button>
                }
                fields={ERGOGENIC_CREATE_FIELDS}
                actionType="create-student-ergogenic"
                parentId={effectiveStudentId}
                successMessage="Substância adicionada ao protocolo!"
                footerLabel="Adicionar Substância"
                colorScheme="emerald"
                queryKey={QUERY_KEYS.ergogenics.all(effectiveStudentId)}
            />
        </Stack>
    );
}
