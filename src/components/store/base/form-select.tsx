'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Font } from './font'
import { Icon } from './icon'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
    label: string
    value: string
    description?: string
}

interface FormSelectProps {
    label?: string
    options: SelectOption[]
    value?: string
    placeholder?: string
    onChange?: (value: string) => void
    error?: string
}

export function FormSelect({
    label,
    options,
    value,
    placeholder = 'Selecionar...',
    onChange,
    error
}: FormSelectProps) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(value ?? '')
    const ref = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(o => o.value === selected)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (val: string) => {
        setSelected(val)
        setOpen(false)
        onChange?.(val)
    }

    return (
        <div 
            className={cn(
                "flex flex-col gap-[10px] w-full transition-all duration-200",
                open ? "relative z-[1000]" : "relative z-0"
            )} 
            ref={ref}
        >
            {label && (
                <Font variant="auxiliary" color="zinc-500" weight="black" uppercase tracking="widest">
                    {label}
                </Font>
            )}

            {/* Relative wrapper anchors the dropdown to the trigger */}
            <div className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => setOpen(v => !v)}
                    className={cn(
                        'w-full h-12 px-4 flex items-center justify-between',
                        'bg-zinc-950/40 border-2 transition-all duration-200 rounded-[5px]',
                        'text-left outline-none',
                        open
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-white/5 hover:border-white/10',
                        error && 'border-red-500/50'
                    )}
                >
                    <span className={cn(
                        'text-sm font-medium',
                        selectedOption ? 'text-white' : 'text-zinc-600'
                    )}>
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <ChevronDown className={cn(
                        'w-4 h-4 text-zinc-500 transition-transform duration-200',
                        open && 'rotate-180 text-emerald-400'
                    )} />
                </button>

                {/* Dropdown — anchored below trigger */}
                {open && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-[1000] rounded-[5px] border-2 border-white/5 bg-zinc-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {options.map((opt) => {
                            const isSelected = selected === opt.value
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt.value)}
                                    className={cn(
                                        'w-full px-4 py-3 flex items-start justify-between gap-3 transition-colors text-left',
                                        isSelected
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[11px] font-black uppercase tracking-widest">
                                            {opt.label}
                                        </span>
                                        {opt.description && (
                                            <span className="text-[10px] text-zinc-600 normal-case font-normal tracking-normal">
                                                {opt.description}
                                            </span>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            {error && (
                <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest" className="pl-1">
                    {error}
                </Font>
            )}
        </div>
    )
}
