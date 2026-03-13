'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AIProtocolGenerator } from './ai-protocol-generator'
import { Sparkles, Dumbbell, Utensils, Zap, X } from 'lucide-react'

export function AIProtocolEmptyState() {
    const [showForm, setShowForm] = useState(false)

    if (showForm) {
        return (
            <div className="relative bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] p-8">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />

                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3 pb-4">
                        <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black italic uppercase tracking-tight text-white">Protocolo com IA</h2>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Personalizado para você</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowForm(false)}
                        className="text-zinc-600 hover:text-white rounded-xl hover:bg-zinc-800 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <AIProtocolGenerator />
            </div>
        )
    }

    return (
        <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-center group">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-[2rem] md:rounded-[3rem]" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8 max-w-lg mx-auto">
                {/* Icon cluster */}
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                    <div className="absolute inset-0 bg-orange-500/10 rounded-[1.5rem] md:rounded-[2rem] border border-orange-500/20 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-orange-400/80" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center">
                        <Utensils className="w-4 h-4 text-zinc-400" />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white leading-tight">
                        Você ainda não tem <br />
                        <span className="text-orange-500">um protocolo ativo</span>
                    </h2>
                    <p className="text-zinc-400 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                        Deixa a IA montar seu treino, cardio e dieta do zero — 100% personalizado com base no seu perfil e preferências.
                    </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2">
                    {['Treino', 'Cardio', 'Dieta', 'Macros'].map(f => (
                        <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-zinc-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            <Zap className="w-2.5 h-2.5 text-orange-500" />
                            {f}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <Button
                    onClick={() => setShowForm(true)}
                    className="min-h-14 h-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-2xl shadow-orange-500/30 text-base md:text-lg active:scale-95 leading-tight"
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Protocolo com IA
                </Button>

                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    Gratuito · Leva menos de 2 minutos
                </p>
            </div>
        </div>
    )
}
