import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Dumbbell, CreditCard, Sparkles, Search, Check, Zap, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CancelSubscriptionButton } from '@/components/feature/subscription/cancel-subscription-button'
import { StudentPaymentButtons } from '@/components/feature/student/payment-buttons'

export const dynamic = 'force-dynamic'

export default async function StudentPlansPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status, auto_training_trial_end, asaas_subscription_id')
        .eq('id', user.id)
        .single()

    const now = new Date()
    let isActive = false;
    let isTrial = false;
    let isExpired = false;

    if (profile?.auto_training_status === 'active') {
        isActive = true;
    } else if (profile?.auto_training_status === 'trial' && profile.auto_training_trial_end) {
        if (now <= new Date(profile.auto_training_trial_end)) {
            isTrial = true;
            isActive = true;
        } else {
            isExpired = true;
        }
    } else if (profile?.auto_training_status === 'expired' || profile?.auto_training_status === 'disabled') {
        isExpired = true;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                    {isActive ? 'Seu Plano Atual' : 'Seu Período Gratuito Acabou'}
                </h1>
                <p className="text-zinc-500 font-medium max-w-xl mx-auto">
                    {isActive
                        ? 'Você está aproveitando os recursos do RepTrail. Treine no seu ritmo e registre tudo!'
                        : 'Para continuar executando treinos, importando PDFs e evoluindo solo, assine o plano Auto Treino ou encontre um Personal.'}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-10">
                {/* AUTO TRAINING PLAN */}
                <div className={`
                    relative p-8 rounded-3xl border transition-all duration-300
                    ${isActive ? 'bg-emerald-500/5 border-emerald-500/30 shadow-2xl' : 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/20'}
                `}>
                    {isActive && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full shadow-lg">
                            Plano Atual Ativo
                        </div>
                    )}
                    <h3 className="text-2xl font-black italic uppercase flex items-center gap-3">
                        <Dumbbell className={isActive ? 'text-emerald-500' : 'text-zinc-400'} />
                        Auto Treino
                    </h3>
                    <div className="mt-4 flex items-end gap-1 mb-8">
                        <span className="text-4xl font-black tracking-tighter text-white">R$ 10,90</span>
                        <span className="text-zinc-500 font-bold mb-1">/ mês</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {['Importação de PDF (Treino e Dieta)', 'Montagem de rotinas de Cardio', 'Administração de Ergogênicos', 'Gráficos de Adesão e Performance', 'Execução Diária de Treinos'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className={`text-sm font-medium ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>{item}</span>
                            </li>
                        ))}
                    </ul>

                    {isActive ? (
                        <div className="space-y-4">
                            <div className="w-full py-4 rounded-xl flex flex-col items-center justify-center text-center px-4 bg-zinc-950 border border-emerald-500/10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    Plano Ativo
                                </span>
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                    Assinatura via Asaas
                                </span>
                            </div>
                            <div className="flex justify-center w-full">
                                <CancelSubscriptionButton />
                            </div>
                        </div>
                    ) : (
                        <StudentPaymentButtons />
                    )}
                </div>

                {/* SEEK TRAINER OPTION */}
                <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col hover:border-orange-500/20 transition-all">
                    <h3 className="text-2xl font-black italic uppercase flex items-center gap-3">
                        <Search className="text-orange-500" />
                        Com Personal
                    </h3>
                    <div className="mt-4 flex items-end gap-1 mb-8">
                        <span className="text-4xl font-black tracking-tighter text-white">Gratuito</span>
                        <span className="text-zinc-500 font-bold mb-1">pelo app</span>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                        {['Navegue pelo aplicativo gratuitamente', 'Procure por um Personal Trainer no Feed', 'Interaja com a comunidade de Alunos'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-zinc-600 shrink-0" />
                                <span className="text-sm font-medium text-zinc-400">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <Link href="/buscar-personal" className="w-full">
                        <Button variant="outline" className="w-full h-14 font-black uppercase tracking-widest text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800 rounded-2xl">
                            Buscar Personal
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-center opacity-30 hover:opacity-100 transition-opacity pb-8">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pagamento Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sem Fidelidade</span>
                </div>
            </div>
        </div>
    )
}
