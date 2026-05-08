'use client'

import React, { useState } from 'react'
import { Font } from './font'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormCheckboxProps {
    label: string
    description?: string
    checked?: boolean
    onChange?: (checked: boolean) => void
    color?: 'emerald' | 'orange' | 'amber' | 'blue'
    error?: string
}

export function FormCheckbox({
    label,
    description,
    checked = false,
    onChange,
    color = 'emerald',
    error
}: FormCheckboxProps) {
    const [isChecked, setIsChecked] = useState(checked)

    const colorMap = {
        emerald: { bg: 'bg-emerald-500 border-emerald-500', icon: 'text-white', shadow: 'shadow-emerald-500/30' },
        orange: { bg: 'bg-orange-500 border-orange-500', icon: 'text-white', shadow: 'shadow-orange-500/30' },
        amber: { bg: 'bg-amber-500 border-amber-500', icon: 'text-black', shadow: 'shadow-amber-500/30' },
        blue: { bg: 'bg-blue-500 border-blue-500', icon: 'text-white', shadow: 'shadow-blue-500/30' },
    }

    const handleToggle = () => {
        const next = !isChecked
        setIsChecked(next)
        onChange?.(next)
    }

    return (
        <div className="flex flex-col gap-1.5">
            <button
                type="button"
                onClick={handleToggle}
                className="flex items-start gap-3 group cursor-pointer"
            >
                {/* Checkbox Box */}
                <div className={cn(
                    'w-5 h-5 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all duration-200 mt-0.5',
                    isChecked
                        ? `${colorMap[color].bg} shadow-lg ${colorMap[color].shadow}`
                        : 'border-white/5 bg-zinc-950/40 group-hover:border-white/20'
                )}>
                    <Check className={cn(
                        'w-3 h-3 transition-all duration-200',
                        isChecked
                            ? `${colorMap[color].icon} scale-100 opacity-100`
                            : 'scale-0 opacity-0'
                    )} />
                </div>

                {/* Label & Description */}
                <div className="flex flex-col gap-0.5 text-left">
                    <span className={cn(
                        'text-[11px] font-black uppercase tracking-widest transition-colors',
                        isChecked ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                    )}>
                        {label}
                    </span>
                    {description && (
                        <span className="text-[10px] text-zinc-600 normal-case font-normal tracking-normal leading-relaxed">
                            {description}
                        </span>
                    )}
                </div>
            </button>

            {error && (
                <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest" className="pl-8">
                    {error}
                </Font>
            )}
        </div>
    )
}
