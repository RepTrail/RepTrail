import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Dumbbell, CreditCard, Sparkles, Search, Check, Zap, ArrowRight, ShieldCheck, Trophy, Target } from 'lucide-react'
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
        <div className="max-w-5xl mx-auto space-y-16 py-10 px-4">
            {/* Header Section */}
            <div className="text-center space-y-6 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

                <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-none">
                    {isActive ? 'Seu Plano Ativo' : 'Escolha sua Jornada'}
                </h1>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs max-w-xl mx-auto leading-relaxed">
                    {isActive
                        ? 'Treinamento de elite ativado. Continue sua evolução rumo ao topo.'
                        : 'Acesse ferramentas profissionais de treinamento ou encontre o mentor ideal para acelerar seus resultados.'}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-10">
                {/* AUTO TRAINING PLAN - THE PREMIUM CARD */}
                <div className={`
                    relative group p-10 rounded-[2.5rem] border transition-all duration-500
                    ${isActive
                        ? 'bg-zinc-900/40 border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.15)]'}
                 overflow-hidden`}>

                    {/* Background Glow Effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {isActive && (
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 font-black uppercase tracking-[0.2em] text-[9px] py-2 px-6 rounded-b-2xl shadow-xl shadow-emerald-500/20 z-20">
                            Plano Ativo
                        </div>
                    )}

                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-7 h-7 text-emerald-500" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                                Alta Performance
                            </span>
                        </div>

                        <div>
                            <h3 className="text-3xl font-black italic uppercase text-white tracking-tight">
                                Auto Treino
                            </h3>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter text-white">R$ 10,90</span>
                                <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">/ mensal</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-800 pb-2">O que você ganha:</p>
                            <ul className="space-y-4">
                                {[
                                    'Importação IA de PDFs (Treino/Dieta)',
                                    'Player de Treino Profissional',
                                    'Gestão de Cardio & Ergogênicos',
                                    'Métricas de Performance Avançadas',
                                    'Personalização de Rotinas Solitárias'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 group/item">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/item:bg-emerald-500/20 transition-colors">
                                            <Check className="w-3 h-3 text-emerald-500" strokeWidth={4} />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-400 group-hover/item:text-zinc-200 transition-colors">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4">
                            {isActive ? (
                                <div className="space-y-6">
                                    <div className="w-full py-5 rounded-2xl bg-zinc-950/50 border border-emerald-500/10 backdrop-blur-sm text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Gestão de Cobrança</p>
                                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Status: Ativo via Asaas</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <CancelSubscriptionButton />
                                    </div>
                                </div>
                            ) : (
                                <StudentPaymentButtons />
                            )}
                        </div>
                    </div>
                </div>

                {/* SEEK TRAINER OPTION - THE SECONDARY CARD */}
                <div className="relative group p-10 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-900 hover:border-orange-500/20 transition-all duration-500 flex flex-col overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/5 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 space-y-8 flex-1">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                                <Search className="w-7 h-7 text-orange-500" />
                            </div>
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/5 px-3 py-1 rounded-full border border-orange-500/10">
                                Consultoria Especializada
                            </span>
                        </div>

                        <div>
                            <h3 className="text-3xl font-black italic uppercase text-white tracking-tight">
                                Com Personal
                            </h3>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-5xl font-black tracking-tighter text-white">Gratuito</span>
                                <span className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Acesso ao App</span>
                            </div>
                        </div>

                        <div className="space-y-5 flex-1">
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest border-b border-zinc-800 pb-2">Como funciona:</p>
                            <ul className="space-y-4">
                                {[
                                    'Acesso Gratuito à Plataforma',
                                    'Busca por Treinadores de Elite',
                                    'Receba Treinos & Dietas Direto do App',
                                    'Chat & Suporte Individual (Opcional)',
                                    'Gestão Profissional do seu Personal'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                            <Trophy className="w-3 h-3 text-orange-500" />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-400">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link href="/buscar-personal" className="block w-full pt-4">
                            <Button className="w-full h-14 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-500 font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl">
                                Buscar Personal
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Trust Section */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16 border-t border-zinc-900/50">
                <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Pagamento Seguro</p>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Criptografia Ponta a Ponta</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                        <CreditCard className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Sem Fidelidade</p>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Cancele quando quiser</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 group cursor-default">
                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 group-hover:border-amber-500/30 transition-colors">
                        <Target className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Zero Taxas extras</p>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Valor fixo garantido</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
