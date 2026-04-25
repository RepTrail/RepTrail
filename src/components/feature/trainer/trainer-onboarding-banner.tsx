'use client'

import { useTrainerOnboarding, OnboardingStep } from '@/hooks/use-trainer-onboarding'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, FileUp, UserPlus, CheckCircle2, ArrowRight, X, Zap } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface TrainerOnboardingBannerProps {
    userId: string
    stats: {
        activeStudents: number
        workoutsCount: number
        dietsCount: number
    }
}

export function TrainerOnboardingBanner({ userId, stats }: TrainerOnboardingBannerProps) {
    const { step, nextStep, complete } = useTrainerOnboarding(userId, stats)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (step !== 'idle' && step !== 'completed') {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [step])

    if (!isVisible) return null

    const renderContent = () => {
        switch (step) {
            case 'import_diet':
                return (
                    <div className="flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-2xl">
                            <FileUp className="w-8 h-8 text-orange-500 animate-pulse" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                Passo 1: <span className="text-orange-500">Importação Inicial</span>
                            </h3>
                            <p className="text-zinc-400 text-sm font-medium">
                                Vamos começar? Importe primeiro o <span className="text-zinc-100 font-bold">PDF de dieta</span> de um aluno.
                            </p>
                        </div>
                        <Button asChild className="h-12 px-8 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-widest text-xs rounded-xl shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                            <Link href="/dashboard/trainer/import-pdf">
                                Importar PDF agora
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                )

            case 'aha_moment':
                return (
                    <div className="flex flex-col md:flex-row items-center gap-6 animate-in fade-in zoom-in duration-700">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-2xl">
                            <Zap className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                🔥 <span className="text-emerald-500">Seu Aluno já está pronto!</span>
                            </h3>
                            <p className="text-zinc-400 text-sm font-medium">
                                Você acabou de criar o protocolo completo. <br/>
                                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">(opcional) configurar pagamento depois</span>
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <Button asChild className="w-full sm:w-auto h-12 px-8 bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase italic tracking-widest text-xs rounded-xl active:scale-95 transition-all">
                                <Link href="/dashboard/trainer/students">
                                    Ver Perfil do Aluno
                                </Link>
                            </Button>
                            <Button variant="ghost" onClick={() => nextStep('discovery')} className="text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-widest text-[9px] active:scale-95">
                                Próxima Dica
                            </Button>
                        </div>
                    </div>
                )

            case 'discovery':
                return (
                    <div className="flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 shadow-2xl">
                            <Sparkles className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                Exploração <span className="text-purple-500">Guiada</span>
                            </h3>
                            <p className="text-zinc-400 text-sm font-medium">
                                Configure o <span className="text-zinc-100 font-bold">valor e data de pagamento</span> para o sistema te ajudar a cobrar.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button asChild variant="outline" className="h-12 px-8 border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-black uppercase italic tracking-widest text-xs rounded-xl transition-all">
                                <Link href="/dashboard/trainer/students">
                                    Ir para Alunos
                                </Link>
                            </Button>
                            <Button variant="ghost" onClick={complete} className="p-2 text-zinc-600 hover:text-zinc-400 rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="relative group px-2 pt-2">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-1000" />
            <Card className="relative overflow-hidden bg-zinc-950/80 border-zinc-800/50 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 md:p-8">
                <div className="absolute top-0 right-0 p-8 opacity-5 -translate-x-10 translate-y-10">
                    <Sparkles className="w-32 h-32 text-orange-500" />
                </div>
                {renderContent()}
            </Card>
        </div>
    )
}
