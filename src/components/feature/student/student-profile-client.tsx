'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getStudentProfile, getStudentTrainer } from '@/actions/student-actions'
import { ShieldCheck } from 'lucide-react'
import { StudentProfileForm } from '@/components/feature/student/student-profile-form'

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
        <div className="max-w-7xl mx-auto flex flex-col gap-section-gap">
            <header className="space-y-5">
                <div className="flex items-center gap-3 pb-4">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Meu <span className="text-orange-500">Perfil</span>
                    </h1>
                </div>
                <p className="text-zinc-500 text-sm font-medium max-w-md flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Configurações da conta e dados físicos
                </p>
            </header>

            <StudentProfileForm profile={profile} hasTrainer={!!trainerRel} />
        </div>
    )
}
