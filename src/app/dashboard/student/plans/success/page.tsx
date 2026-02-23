import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { CheckCircle, ArrowRight, Dumbbell } from 'lucide-react'
import Link from 'next/link'

export default async function StudentAutoTrainingSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    const { session_id } = await searchParams

    if (!session_id) {
        redirect('/dashboard/student/plans')
    }

    let customerEmail = ''

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id)
        customerEmail = session.customer_details?.email || ''
    } catch {
        redirect('/dashboard/student/plans')
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
            <div className="max-w-lg w-full text-center space-y-10">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle className="w-14 h-14 text-emerald-500" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tight">
                        Pagamento Confirmado!
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Seu plano <span className="font-black text-emerald-400">Auto-Training</span> foi ativado.
                    </p>
                    {customerEmail && (
                        <p className="text-zinc-600 text-xs">
                            Recibo enviado para <span className="text-zinc-400">{customerEmail}</span>
                        </p>
                    )}
                </div>

                <Link
                    href="/dashboard/student"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-zinc-100 text-zinc-950 font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                    Ir para o Dashboard
                    <ArrowRight className="w-5 h-5" />
                </Link>

                <p className="text-zinc-700 text-xs">
                    Se o acesso não liberar imediatamente, atualize a página em alguns segundos.
                </p>
            </div>
        </div>
    )
}
