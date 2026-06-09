'use client'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AdminLogsSection } from '@/components/store/sections/admin-logs-section'
import { Activity } from 'lucide-react'

export default function AdminLogsPage() {
    return (
        <RegistryMain
            title="LOGS DE ATIVIDADE"
            subtitle="Rastro de auditoria de todas as ações realizadas no painel administrativo."
            icon={Activity}
            contextLabel="Auditoria do Sistema"
            showTabs={false}
        >
            <RegistrySection>
                <AdminLogsSection />
            </RegistrySection>
        </RegistryMain>
    );
}
