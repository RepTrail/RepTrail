'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AdminPersonaisSection } from '@/components/store/sections/admin-personais-section'
import { UserCheck } from 'lucide-react'

export default function AdminPersonaisPage() {
    return (
        <RegistryMain
            title="GESTÃO DE PERSONAIS"
            subtitle="Administração de profissionais parceiros e planos On-Demand."
            icon={UserCheck}
            contextLabel="Painel Admin"
            showTabs={false}
        >
            <RegistrySection>
                <AdminPersonaisSection />
            </RegistrySection>
        </RegistryMain>
    )
}
