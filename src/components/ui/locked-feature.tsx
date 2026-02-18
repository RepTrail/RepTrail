'use client'

import { Lock } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface LockedFeatureProps {
    isLocked: boolean
    requiredTier: 'pro' | 'elite'
    children: React.ReactNode
    message?: string
}

export function LockedFeature({ isLocked, requiredTier, children, message }: LockedFeatureProps) {
    const defaultMessage = requiredTier === 'pro'
        ? 'Disponível nos planos PRO e ELITE'
        : 'Disponível apenas no plano ELITE'

    if (!isLocked) {
        return <>{children}</>
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="relative">
                        {/* Render children with reduced opacity */}
                        <div className="opacity-40 pointer-events-none select-none">
                            {children}
                        </div>

                        {/* Lock overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 backdrop-blur-[2px] rounded-xl border border-zinc-800/50">
                            <div className="flex flex-col items-center gap-2 text-zinc-400">
                                <Lock className="w-6 h-6" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {requiredTier === 'pro' ? 'PRO' : 'ELITE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-xs">
                    <p className="text-sm font-medium">{message || defaultMessage}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
