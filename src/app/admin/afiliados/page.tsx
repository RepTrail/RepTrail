'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { useAuthUser } from '@/lib/dal'

import { RegistryMain } from '@/components/store/advanced/registry-main'
import { HeartHandshake } from 'lucide-react'
import { AdminAffiliatesContent } from '@/components/store/sections/admin-affiliates-content'

/**
 * AdminAfiliadosPage: Standardized entry point.
 * Logic is decoupled into AdminAffiliatesContent section.
 */


export default function AdminAfiliadosPage() {
    const { data: adminUser } = useAuthUser()

    return (
        <RegistryMain
                    title="GESTÃO DE AFILIADOS"
                    subtitle="Administração de parceiros comerciais, comissões e indicações."
                    icon={HeartHandshake}
                    contextLabel="Painel Admin"
                    showTabs={false}
                >
                    <AdminAffiliatesContent />
        </RegistryMain>
    );
}

