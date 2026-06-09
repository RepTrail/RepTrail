'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { GraduationCap } from 'lucide-react'
import { AdminAlunosSection } from '@/components/store/sections/admin-alunos-section'

export default function AdminAlunosPage() {
    return (
        <RegistryMain
            title="GESTÃO DE ALUNOS"
            subtitle="Monitoramento da base de alunos e ativação de planos automatizados."
            icon={GraduationCap}
            contextLabel="Painel Admin"
            showTabs={false}
        >
            <RegistrySection>
                <AdminAlunosSection />
            </RegistrySection>
        </RegistryMain>
    )
}
