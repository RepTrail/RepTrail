import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { CheckCircle, ArrowRight, Crown, Sparkles, Zap, Activity } from 'lucide-react'
import Link from 'next/link'

const tierInfo: Record<string, { name: string; icon: any; color: string; description: string }> = {
    on_demand: { name: 'On Demand', icon: Activity, color: 'text-zinc-400', description: 'Pague somente pelo que usar. Sem limites de crescimento!' },
    pro: { name: 'Pro', icon: Sparkles, color: 'text-emerald-400', description: 'Importação de PDF, gráficos e muito mais desbloqueados!' },
    elite: { name: 'Elite', icon: Crown, color: 'text-amber-400', description: 'Badge Elite e prioridade no ranking ativados!' },
}

export default async function PlanSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    const { session_id } = await searchParams

    if (!session_id) {
        redirect('/dashboard/trainer/plans')
    }

    let tier = 'pro'
    let customerEmail = ''

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id)
        tier = session.metadata?.tier || 'pro'
        customerEmail = session.customer_details?.email || ''
    } catch (e) {
        // Se a sessão não existir, redireciona
        redirect('/dashboard/trainer/plans')
    }

    const info = tierInfo[tier] || tierInfo.pro
    const Icon = info.icon

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
            <div className="max-w-lg w-full text-center space-y-10">

                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle className="w-14 h-14 text-emerald-500" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center">
                            <Icon className={`w-5 h-5 ${info.color}`} />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tight">
                        Pagamento Confirmado!
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Bem-vindo ao plano <span className={`font-black ${info.color}`}>{info.name}</span>
                    </p>
                    <p className="text-zinc-500 text-sm">
                        {info.description}
                    </p>
                    {customerEmail && (
                        <p className="text-zinc-600 text-xs">
                            Recibo enviado para <span className="text-zinc-400">{customerEmail}</span>
                        </p>
                    )}
                </div>

                {/* CTA */}
                <Link
                    href="/dashboard/trainer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                    Ir para o Dashboard
                    <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Separator */}
                <p className="text-zinc-700 text-xs">
                    O seu plano foi ativado automaticamente. Em caso de dúvidas, entre em contato.
                </p>
            </div>
        </div>
    )
}
