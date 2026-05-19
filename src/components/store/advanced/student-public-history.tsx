'use client'

import React from 'react'
import { StudentWorkoutHistory } from '@/components/store/features(deprecated)/student-workout-history'
import { History } from 'lucide-react'
import { GlassPanel } from '@/components/store/base/surface'
import { RegistrySection } from '@/components/store/advanced/registry-section'

interface StudentPublicHistoryProps {
    history: any[]
}

export function StudentPublicHistory({ history }: StudentPublicHistoryProps) {
    return (
        <RegistrySection
            title="Histórico de Treinos"
            subtitle="Relação completa de todos os treinos executados e registrados na plataforma."
            icon={History}
        >
            {/* History Content Card using Liquid Glass */}
            <GlassPanel padding={5}>
                <StudentWorkoutHistory
                    history={history}
                    isBlocked={false}
                    mode="student"
                />
            </GlassPanel>
        </RegistrySection>
    )
}
