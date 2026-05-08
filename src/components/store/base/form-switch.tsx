'use client'

import React, { useState } from 'react'
import { Font } from './font'
import { cn } from '@/lib/utils'
import { GlassPanel } from './surface'

interface SwitchOption {
    label: string
    value: string
}

interface FormSwitchProps {
    label?: string
    options: SwitchOption[]
    value?: string
    onChange?: (value: string) => void
    color?: 'emerald' | 'orange' | 'amber' | 'blue'
}

export function FormSwitch({
    label,
    options,
    value,
    onChange,
    color = 'emerald'
}: FormSwitchProps) {
    const [selected, setSelected] = useState(value ?? options[0]?.value)

    const colorClasses = {
        emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/10',
        orange: 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-orange-500/10',
        amber: 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-amber-500/10',
        blue: 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-blue-500/10',
    }

    const handleSelect = (val: string) => {
        setSelected(val)
        onChange?.(val)
    }

    return (
        <div className="flex flex-col gap-[10px]">
            {label && (
                <Font variant="auxiliary" color="zinc-500" weight="black" uppercase tracking="widest">
                    {label}
                </Font>
            )}
            
            <GlassPanel padding={2.5} rounded="full" border="subtle">
                <div className="flex items-center gap-2.5">
                    {options.map((opt) => {
                        const isActive = selected === opt.value
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelect(opt.value)}
                                className={cn(
                                    'flex-1 px-4 py-2 rounded-full transition-all duration-300 border-2 flex items-center justify-center',
                                    isActive
                                        ? cn("shadow-lg", colorClasses[color])
                                        : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                )}
                            >
                                <Font 
                                    variant="sub-tiny" 
                                    weight="black" 
                                    uppercase 
                                    italic 
                                    color={isActive ? color : 'zinc-500' as any}
                                    className="tracking-[0.15em] leading-none"
                                >
                                    {opt.label}
                                </Font>
                            </button>
                        )
                    })}
                </div>
            </GlassPanel>
        </div>
    )
}
