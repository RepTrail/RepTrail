'use client'

import { Activity, Utensils, Dumbbell, Sparkles, TrendingUp } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { PaymentWarning } from '@/components/feature/student/payment-warning'
import { AnamnesisForm } from '@/components/feature/student/anamnesis-form'
import { AIProtocolEmptyState } from '@/components/feature/student/ai-protocol-empty-state'
import { WorkoutCard } from '@/components/feature/student/dashboard/workout-card'
import { CardioCard } from '@/components/feature/student/dashboard/cardio-card'
import { ErgogenicsCard } from '@/components/feature/student/dashboard/ergogenics-card'
import { DietCard } from '@/components/feature/student/dashboard/diet-card'
import { StudentDashboardModals } from '@/components/feature/student/student-dashboard-modals'

interface StudentDashboardClientProps {
    userId: string
    trainerRel: any
    details: any
    protocolStatus: {
        hasWorkout: boolean
        hasDiet: boolean
    }
    showAutoTrainingModal: boolean
    showAnamnesis: boolean
}

export function StudentDashboardClient({
    userId,
    trainerRel,
    details,
    protocolStatus,
    showAutoTrainingModal,
    showAnamnesis
}: StudentDashboardClientProps) {
    const tzNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const hasProtocol = protocolStatus.hasWorkout || protocolStatus.hasDiet

    return (
        <RegistryMain
            title="DASHBOARD DO ALUNO"
            subtitle="Protocolos, treinos e acompanhamento da sua evolução."
            icon={Activity}
            contextLabel="Área do Aluno"
            showTabs={false}
        >
            <Stack gap={{ base: 12.5, md: 'section' }} className="animate-in fade-in duration-500">
                <PaymentWarning relationship={trainerRel} />
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-header-gap">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Resumo Hoje</h1>
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Hoje</span>
                        <span className="text-xs font-black text-white italic uppercase">{tzNow.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
                    </div>
                </div>
                {showAnamnesis && <AnamnesisForm initialData={details} />}
                {!hasProtocol && <AIProtocolEmptyState userId={userId} />}
                {hasProtocol && (
                    <Grid gap={{ base: 12.5, md: 'section' }} lgCols={12}>
                        <Stack gap={{ base: 12.5, md: 'section' }} className="lg:col-span-8">
                            <WorkoutCard userId={userId} />
                            <CardioCard userId={userId} />
                            <ErgogenicsCard userId={userId} />
                        </Stack>
                        <Stack gap={{ base: 12.5, md: 'section' }} className="lg:col-span-4">
                            <DietCard userId={userId} hasTrainer={!!trainerRel} />
                        </Stack>
                    </Grid>
                )}
                <StudentDashboardModals userId={userId} showModal={showAutoTrainingModal} hasTrainer={!!trainerRel} />
            </Stack>
        </RegistryMain>
    )
}
