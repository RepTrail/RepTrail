'use client'

import React, { useState } from 'react'
import { Font } from './font'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface FormCheckboxProps {
    label: string
    name?: string
    description?: string
    checked?: boolean
    defaultChecked?: boolean
    onChange?: (checked: boolean) => void
    color?: 'emerald' | 'orange' | 'amber' | 'blue' | 'primary'
    error?: string
    disabled?: boolean
}

export function FormCheckbox({
    label,
    name,
    description,
    checked,
    defaultChecked,
    onChange,
    color = 'emerald',
    error,
    disabled
}: FormCheckboxProps) {
    const { primaryColor } = useRegistry()
    const [isChecked, setIsChecked] = useState(defaultChecked ?? checked ?? false)
    const resolvedColor = color === 'primary' ? primaryColor : color

    const colorMap = {
        emerald: { bg: 'bg-emerald-500 border-emerald-500', icon: 'text-white', shadow: 'shadow-emerald-500/30' },
        orange: { bg: 'bg-orange-500 border-orange-500', icon: 'text-white', shadow: 'shadow-orange-500/30' },
        amber: { bg: 'bg-amber-500 border-amber-500', icon: 'text-black', shadow: 'shadow-amber-500/30' },
        blue: { bg: 'bg-blue-500 border-blue-500', icon: 'text-white', shadow: 'shadow-blue-500/30' },
    }
    
    const activeColor = colorMap[resolvedColor as keyof typeof colorMap] || colorMap.emerald

    const handleToggle = () => {
        if (disabled) return;
        const next = !isChecked
        setIsChecked(next)
        onChange?.(next)
    }

    return (
        <div className="flex flex-col gap-1.5">
            {name && (
                <input 
                    type="checkbox" 
                    name={name} 
                    checked={isChecked} 
                    readOnly 
                    className="hidden" 
                />
            )}
            <button
                type="button"
                onClick={handleToggle}
                className={cn(
                    "flex items-center group cursor-pointer",
                    (label || description) && "gap-2.5",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            >
                {/* Checkbox Box */}
                <div className={cn(
                    'w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                    STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
                    isChecked
                        ? `${activeColor.bg} shadow-lg ${activeColor.shadow}`
                        : 'border-white/5 bg-zinc-950/40 group-hover:border-white/20'
                )}>
                    <Check className={cn(
                        'w-3 h-3 transition-all duration-200',
                        isChecked
                            ? `${activeColor.icon} scale-100 opacity-100`
                            : 'scale-0 opacity-0'
                    )} />
                </div>

                {/* Label & Description */}
                {(label || description) && (
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
                )}
            </button>

            {error && (
                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.ERROR} weight="black" uppercase tracking="widest">
                    {error}
                </Font>
            )}
        </div>
    )
}
