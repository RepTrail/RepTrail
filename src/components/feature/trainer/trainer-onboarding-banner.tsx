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
    trainerCode?: string
    stats: {
        activeStudents: number
        workoutsCount: number
        dietsCount: number
    }
}

export function TrainerOnboardingBanner({ userId, trainerCode, stats }: TrainerOnboardingBannerProps) {
    const { step, ghostData, nextStep, complete, dismiss } = useTrainerOnboarding(userId, stats)
    const [isVisible, setIsVisible] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (step !== 'idle' && step !== 'completed') {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [step])

    if (!isVisible) return null

    const studentName = ghostData?.name || 'Seu aluno'
    const studentEmail = ghostData?.email || ''
    
    // Generate Invite Link with Email Prefill
    const inviteLink = trainerCode 
        ? `${window.location.origin}/auth/signup?code=${trainerCode}${studentEmail ? `&email=${encodeURIComponent(studentEmail)}` : ''}`
        : ''

    const whatsappMessage = `Fala ${studentName.split(' ')[0]}, já deixei seu treino pronto no app 👇\n\nÉ só criar sua conta com esse email:\n${studentEmail || '(seu email)'}\n\n${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

    const handleCopy = () => {
        if (!inviteLink) return
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

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
                            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                                Vamos começar? Importe primeiro o <span className="text-zinc-100 font-bold">PDF de dieta ou treino</span> do seu aluno para ver a mágica.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button asChild className="h-12 px-8 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-widest text-xs rounded-xl shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                                <Link href="/dashboard/trainer/import-pdf">
                                    Importar PDF agora
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                            <Button variant="ghost" onClick={dismiss} className="p-2 text-zinc-600 hover:text-zinc-400 rounded-full">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )

            case 'aha_moment':
                return (
                    <div className="flex flex-col md:flex-row items-center gap-6 animate-in fade-in zoom-in duration-700">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-2xl">
                            <Zap className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-1">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">
                                🔥 <span className="text-emerald-500">{studentName.split(' ')[0]} já pode começar a treinar agora</span>
                            </h3>
                            <div className="space-y-1">
                                <p className="text-zinc-400 text-[13px] font-medium leading-relaxed">
                                    É só ele criar a conta com esse email que tudo já aparece pra ele:
                                </p>
                                <p className="text-emerald-400 font-black text-sm tracking-tight bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 inline-block">
                                    {studentEmail || '(email não informado)'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Button asChild className="flex-1 sm:flex-none h-12 px-6 bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase italic tracking-widest text-[10px] rounded-xl active:scale-95 transition-all">
                                    <Link href="/dashboard/trainer/students">
                                        Ver Perfil
                                    </Link>
                                </Button>
                                
                                <Button asChild className="flex-1 sm:flex-none h-12 px-6 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase italic tracking-widest text-[10px] rounded-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all gap-2">
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                        <ArrowRight className="w-4 h-4" />
                                        WhatsApp
                                    </a>
                                </Button>
                            </div>
                            
                            <Button 
                                variant="ghost" 
                                onClick={handleCopy}
                                className="text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-widest text-[9px] active:scale-95 px-4"
                            >
                                {copied ? 'Copiado!' : 'Copiar Link'}
                            </Button>

                            <Button variant="ghost" onClick={() => nextStep('discovery')} className="p-2 text-zinc-700 hover:text-zinc-500 rounded-full">
                                <ArrowRight className="w-5 h-5" />
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
                            <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                                Configure o <span className="text-zinc-100 font-bold">valor e data de pagamento</span> para o sistema te ajudar a cobrar e o aluno a pagar.
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
