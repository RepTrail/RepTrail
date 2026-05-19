'use client';
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { User } from 'lucide-react'
import { StudentProfileForm } from './student-profile-form'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'

import { STORE_TOKENS } from "../constants/tokens";

interface StudentProfileClientProps {
    userId: string
}

export function StudentProfileClient({ userId }: StudentProfileClientProps) {
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.student.details(userId),
        queryFn: () => getStudentProfile(userId),
        staleTime: Infinity
    })

    const { data: trainerRel } = useQuery({
        queryKey: QUERY_KEYS.profile.trainer(userId),
        queryFn: () => getStudentTrainer(userId),
        staleTime: Infinity
    })

    if (!profile) return null

    return (
        <RegistryMain
            title="MEU PERFIL"
            subtitle="Configurações da conta e dados físicos."
            icon={User}
            contextLabel="Conta & Segurança"
            showTabs={false}
        >
            <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE}>
                <StudentProfileForm profile={profile} hasTrainer={!!trainerRel} />
            </Stack>
        </RegistryMain>
    );
}
