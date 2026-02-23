import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Dumbbell, CreditCard, Sparkles, Search, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createStudentAutoTrainingCheckoutSession } from '@/actions/stripe-actions'

export default async function StudentPlansPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status, auto_training_trial_end')
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
                    relative p-8 rounded-3xl border 
                    ${isActive ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'bg-zinc-900 border-zinc-800'}
                `}>
                    {isActive && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full">
                            Plano Atual
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
                        {['Importação de PDF (Treino e Dieta)', 'Montagem de rotinas de Cardio', 'Auto-administração de Ergogênicos', 'Gráficos de Adesão e Performance', 'Execução Diária de Treinos'].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-medium text-zinc-300">{item}</span>
                            </li>
                        ))}
                    </ul>

                    {isActive ? (
                        <div className="w-full h-12 rounded-xl bg-zinc-950 text-emerald-500 flex items-center justify-center font-bold tracking-widest uppercase text-xs border border-emerald-500/20">
                            ATIVO
                        </div>
                    ) : (
                        <form action={createStudentAutoTrainingCheckoutSession}>
                            <Button className="w-full h-12 font-black uppercase tracking-widest bg-white text-zinc-950 hover:bg-zinc-200">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Assinar Agora
                            </Button>
                        </form>
                    )}
                </div>

                {/* SEEK TRAINER OPTION */}
                <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col">
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
                        <Button variant="outline" className="w-full h-12 font-black uppercase tracking-widest text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800">
                            Buscar Personal
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
