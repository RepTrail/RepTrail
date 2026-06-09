'use client'

import { redirect } from 'next/navigation'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
    redirect('/admin/dashboard')

    return (
        <RegistryMain title="Redirecionando" subtitle="Aguarde..." icon={Loader2} showHeader={false}>
            {null}
        </RegistryMain>
    )
}
