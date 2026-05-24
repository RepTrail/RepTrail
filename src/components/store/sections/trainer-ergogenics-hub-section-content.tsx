'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { ErgogenicStudentHubCard } from '@/components/store/intermediary/ergogenic-student-hub-card'
import { FlaskConical } from 'lucide-react'
import type { TrainerErgogenicHubStudent } from '@/actions/ergogenics-actions'

interface TrainerErgogenicsHubSectionContentProps {
    students?: TrainerErgogenicHubStudent[]
}

export function TrainerErgogenicsHubSectionContent({ students = [] }: TrainerErgogenicsHubSectionContentProps) {
    if (!students.length) {
        return (
            <EmptyState
                icon={FlaskConical}
                title="Nenhum aluno utiliza ergogênicos"
                description="Alunos devem habilitar o uso de ergogênicos no formulário de inscrição para aparecerem aqui."
            />
        )
    }

    return (
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {students.map((student) => (
                <ErgogenicStudentHubCard key={student.id} student={student} />
            ))}
        </Grid>
    )
}
