
import { AffiliatesManagement } from '@/components/feature/admin/affiliates-management'
import { getAdminAffiliates } from '@/actions/admin-affiliate-actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminAffiliatesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/auth/login')
    }

    // Double check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    const { data: affiliates, error } = await getAdminAffiliates()

    if (error) {
        return (
            <div className="p-8 text-white">
                <h1 className="text-2xl font-bold mb-4">Erro</h1>
                <p className="text-red-400">Não foi possível carregar os afiliados: {error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                    Gestão de Afiliados
                </h1>
                <p className="text-zinc-500 text-sm font-medium mt-2">
                    Administre taxas, visualize desempenho e gerencie indicações.
                </p>
            </div>

            <AffiliatesManagement initialAffiliates={affiliates || []} />
        </div>
    )
}
