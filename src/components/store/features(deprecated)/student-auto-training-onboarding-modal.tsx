'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Upload, BarChart3, Users, Zap, CheckCircle } from 'lucide-react'

interface AutoTrainingOnboardingModalProps {
    isOpen: boolean
    onAccept: () => Promise<void>
    onReject: () => void
    onClose?: () => void
}

export function AutoTrainingOnboardingModal({ isOpen, onAccept, onReject, onClose }: AutoTrainingOnboardingModalProps) {
    const [accepted, setAccepted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleAccept = async () => {
        setLoading(true)
        // If we want the modal to NOT show up again after accepting, we should set it to SEEN (true)
        // But the user said click should trigger the popup.
        await onAccept()
        setLoading(false)
    }

    const features = [
        {
            icon: Upload,
            title: 'Importe Facilmente',
            description: 'Importe PDFs de treino e dieta do seu personal via nossa plataforma'
        },
        {
            icon: BarChart3,
            title: 'Acompanhe Progressão',
            description: 'Registre e analise histórico completo de treinos e métricas de evolução'
        },
        {
            icon: Users,
            title: 'Comunidade',
            description: 'Participe do feed social de alunos e conecte com outros users'
        },
        {
            icon: Zap,
            title: 'Auto-Avaliação',
            description: 'Acompanhe todas as suas métricas - peso, BF, e performance'
        }
    ]

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && (onClose ? onClose() : onReject())}>
            <DialogContent className="max-w-2xl">
                <DialogHeader className="space-y-4 shrink-0">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                            <Zap className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-black text-orange-500 uppercase tracking-wider">Teste Grátis - 7 Dias</span>
                        </div>
                        <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tight">
                            Bem-vindo ao Plano <span className="text-orange-500">Auto-Training</span>
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-zinc-400 text-base font-medium">
                        Você está entrando em um teste grátis de 7 dias! Explore todas as funcionalidades e siga seu programa com total controle.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6 flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div key={index} className="p-4 rounded-system bg-zinc-800/50 border border-zinc-700/50 space-y-3">
                                    <div className="flex items-center gap-3 pb-4">
                                        <div className="p-2 bg-orange-500/10 rounded-system">
                                            <Icon className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <h4 className="font-black text-white text-sm uppercase tracking-wide">{feature.title}</h4>
                                    </div>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-4 rounded-system bg-blue-500/5 border border-blue-500/20 space-y-3">
                        <h4 className="font-black text-blue-400 text-sm uppercase tracking-wide flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Incluso no Seu Teste:
                        </h4>
                        <ul className="space-y-2 text-zinc-300 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-black mt-0.5">✓</span>
                                <span>Sistema completo de importação de PDFs (treino + dieta)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-black mt-0.5">✓</span>
                                <span>Registro e acompanhamento de treinos com histórico</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-black mt-0.5">✓</span>
                                <span>Métricas de evolução (peso, BF, cargas)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-black mt-0.5">✓</span>
                                <span>Acesso completo ao feed social (comunidade RepTrail)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-500 font-black mt-0.5">✓</span>
                                <span>Auto-avaliação e análise de progressão</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-system bg-zinc-800/30 border border-zinc-700/50 space-y-3">
                        <p className="text-zinc-400 text-sm">
                            Após os 7 dias de teste, você pode continuar com um plano de <span className="font-black text-orange-500">R$ 10,90/mês</span> ou conectar-se com um personal trainer da plataforma.
                        </p>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-system bg-zinc-800/30 border border-zinc-700/50">
                        <Checkbox
                            id="accept-terms"
                            checked={accepted}
                            onCheckedChange={(checked) => setAccepted(checked as boolean)}
                            className="mt-1"
                        />
                        <label
                            htmlFor="accept-terms"
                            className="text-sm text-zinc-300 font-medium cursor-pointer leading-relaxed"
                        >
                            Entendo que estou entrando em um teste grátis de 7 dias do plano Auto-Training e que poderei gerenciar minha assinatura a qualquer momento.
                        </label>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 shrink-0 pt-4 border-t border-zinc-800/60 bg-zinc-900">
                    <Button
                        variant="ghost"
                        onClick={onReject}
                        className="flex-1 h-12 rounded-system bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 font-black uppercase tracking-wide transition-all"
                    >
                        Pular por Agora
                    </Button>
                    <Button
                        onClick={handleAccept}
                        disabled={!accepted || loading}
                        className="flex-1 h-12 rounded-system bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wide transition-all disabled:opacity-50"
                    >
                        {loading ? 'Ativando...' : 'Aceitar e Usar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

