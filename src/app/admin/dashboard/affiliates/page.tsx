import { AffiliatesManagement } from '@/components/feature/admin/affiliates-management'
import { PayoutsManagement } from '@/components/feature/admin/payouts-management'
import { getAdminAffiliates, getAdminPayouts } from '@/actions/admin-affiliate-actions'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function AdminAffiliatesPage() {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()
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

    const [{ data: affiliates, error: affError }, { data: payouts, error: payError }] = await Promise.all([
        getAdminAffiliates(),
        getAdminPayouts()
    ])

    if (affError || payError) {
        return (
            <div className="p-8 text-white">
                <h1 className="text-2xl font-bold mb-4">Erro</h1>
                <p className="text-red-400">Não foi possível carregar os dados: {affError || payError}</p>
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
                    Administre taxas, visualize desempenho e gerencie pagamentos.
                </p>
            </div>

            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-6">
                    <TabsTrigger value="list" className="text-xs font-black uppercase tracking-widest px-6 data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-xl">
                        Afiliados
                    </TabsTrigger>
                    <TabsTrigger value="payouts" className="text-xs font-black uppercase tracking-widest px-6 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500 data-[state=active]:shadow-xl relative overflow-visible">
                        Saques PIX
                        {(payouts || []).filter(p => p.status === 'requested' || p.status === 'pending').length > 0 && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="mt-0 outline-none">
                    <AffiliatesManagement initialAffiliates={affiliates || []} />
                </TabsContent>

                <TabsContent value="payouts" className="mt-0 outline-none">
                    <PayoutsManagement initialPayouts={(payouts as any) || []} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
