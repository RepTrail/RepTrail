'use client'

import React from 'react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { TrainerStudentErgogenicsHeaderActions } from '@/components/store/advanced/trainer-student-ergogenics-header-actions'
import { TrainerStudentErgogenicsSmart } from '@/components/store/advanced/trainer-student-ergogenics-smart'

interface TrainerStudentErgogenicsShellProps {
    effectiveStudentId: string
    studentName: string
    betaTesterMode?: boolean
}

export function TrainerStudentErgogenicsShell({
    effectiveStudentId,
    studentName,
    betaTesterMode = false,
}: TrainerStudentErgogenicsShellProps) {
    const subtitle = `Organize o protocolo farmacológico de ${studentName.toUpperCase()}`

    return (
        <RegistryMain
            title="ERGOGÊNICOS & CICLOS"
            subtitle={subtitle}
            icon="FlaskConical"
            contextLabel="Protocolo do Aluno"
            showTabs={false}
            rightElement={
                <TrainerStudentErgogenicsHeaderActions
                    effectiveStudentId={effectiveStudentId}
                    studentName={studentName}
                    betaTesterMode={betaTesterMode}
                />
            }
        >
            <TrainerStudentErgogenicsSmart effectiveStudentId={effectiveStudentId} />
        </RegistryMain>
    )
}
