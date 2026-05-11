'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useRegistry } from '../advanced/registry-context'

interface BackgroundEffectsProps {
    variant?: 'grid' | 'orbs' | 'all'
}

/**
 * BackgroundEffects: Componente Base que encapsula os efeitos visuais de alta fidelidade.
 * Unifica a lógica de grid e light orbs do sistema para evitar className em organismos Advanced.
 */
export function BackgroundEffects({ variant = 'all' }: BackgroundEffectsProps) {
    const { primaryColor } = useRegistry()

    const lightColorMap = {
        blue: 'from-blue-500/20',
        red: 'from-red-500/20',
        amber: 'from-amber-500/20',
        emerald: 'from-emerald-500/20',
        orange: 'from-orange-500/20',
        zinc: 'from-zinc-500/20'
    }

    const orbColorMap = {
        blue: 'bg-blue-500/10',
        red: 'bg-red-500/10',
        amber: 'bg-amber-500/10',
        emerald: 'bg-emerald-500/10',
        orange: 'bg-orange-500/10',
        zinc: 'bg-zinc-500/10'
    }

    const showGrid = variant === 'grid' || variant === 'all'
    const showOrbs = variant === 'orbs' || variant === 'all'

    return (
        <>
            {showGrid && (
                <div
                    className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white_0%,transparent_90%)] opacity-[0.22] pointer-events-none z-0"
                />
            )}

            {showOrbs && (
                <>
                    <div
                        className={cn(
                            "absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 z-0",
                            `bg-gradient-to-br ${lightColorMap[primaryColor as keyof typeof lightColorMap]} to-transparent`
                        )}
                    />

                    <div
                        className={cn(
                            "absolute bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[180px] animate-pulse pointer-events-none transition-colors duration-1000 z-0",
                            orbColorMap[primaryColor as keyof typeof orbColorMap]
                        )}
                    />
                </>
            )}
        </>
    )
}
