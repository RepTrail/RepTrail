'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Font } from './font'
import { Icon } from './icon'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
    const { primaryColor } = useRegistry()
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(value ?? '')
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
    const [openUp, setOpenUp] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(o => o.value === selected)

    const activeClassesMap = {
        emerald: 'border-emerald-500/50 bg-emerald-500/5',
        orange: 'border-orange-500/50 bg-orange-500/5',
        amber: 'border-amber-500/50 bg-amber-500/5',
        blue: 'border-blue-500/50 bg-blue-500/5',
        red: 'border-red-500/50 bg-red-500/5',
        zinc: 'border-zinc-500/50 bg-zinc-500/5',
    }
    
    const activeClasses = activeClassesMap[primaryColor as keyof typeof activeClassesMap] || activeClassesMap.emerald

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        if (open && ref.current) {
            const rect = ref.current.getBoundingClientRect()
            const spaceBelow = window.innerHeight - rect.bottom
            const shouldOpenUp = spaceBelow < 250
            
            setCoords({
                top: shouldOpenUp ? rect.top : rect.bottom,
                left: rect.left,
                width: rect.width
            })
            setOpenUp(shouldOpenUp)
        }
    }, [open])

    const handleSelect = (val: string) => {
        setSelected(val)
        setOpen(false)
        onChange?.(val)
    }

    return (
        <div 
            className="flex flex-col w-full relative gap-[10px]" 
            ref={ref}
        >
            {label && (
                <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                    {label}
                </Font>
            )}

            <div className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => setOpen(v => !v)}
                    className={cn(
                        'w-full h-12 px-4 flex items-center justify-between',
                        'bg-zinc-950/40 border-2 transition-all duration-200',
                        STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
                        'text-left outline-none',
                        open
                            ? activeClasses
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
                        open && `rotate-180 text-${primaryColor}-400`
                    )} />
                </button>

                {/* Dropdown via Portal */}
                {open && typeof document !== 'undefined' && createPortal(
                    <div 
                        className={cn(
                            "fixed z-[9999] border-2 border-white/5 bg-zinc-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                            STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
                            openUp ? "origin-bottom" : "origin-top"
                        )}
                        style={{
                            top: openUp ? 'auto' : coords.top + 4,
                            bottom: openUp ? (window.innerHeight - coords.top) + 4 : 'auto',
                            left: coords.left,
                            width: coords.width
                        }}
                    >
                        {options.map((opt) => {
                            const isSelected = selected === opt.value
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt.value)}
                                    className={cn(
                                        'w-full px-4 py-3 flex items-center justify-between gap-3 transition-colors text-left',
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
                                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    )}
                                </button>
                            )
                        })}
                    </div>,
                    document.body
                )}
            </div>

            {error && (
                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.ERROR} weight="black" uppercase tracking="widest" className="pl-1">
                    {error}
                </Font>
            )}
        </div>
    )
}
