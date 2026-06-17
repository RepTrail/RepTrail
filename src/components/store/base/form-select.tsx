'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Font } from './font'
import { Icon } from './icon'
import { ChevronDown, Check } from 'lucide-react'
import { Input } from './input'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface SelectOption {
    label: string
    value: string
    description?: string
}

interface FormSelectProps {
    label?: string
    subtitle?: string
    name?: string
    options: SelectOption[]
    value?: string
    defaultValue?: string
    placeholder?: string
    onChange?: (value: string) => void
    error?: string
    isSearchable?: boolean
    searchQuery?: string
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormSelect({
    label,
    subtitle,
    name,
    options,
    value,
    defaultValue,
    placeholder = 'Selecionar...',
    onChange,
    error,
    isSearchable = false,
    searchQuery = '',
    onSearchChange
}: FormSelectProps) {
    const { primaryColor } = useRegistry()
    const [open, setOpen] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    const [animateState, setAnimateState] = useState<'closed' | 'open'>('closed')
    const [internalSelected, setInternalSelected] = useState(defaultValue ?? value ?? '')
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
    const [openUp, setOpenUp] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Sync internal state with prop if it changes
    useEffect(() => {
        if (value !== undefined) setInternalSelected(value)
    }, [value])

    const currentSelected = value !== undefined ? value : internalSelected
    const selectedOption = options.find(o => o.value === currentSelected)

    const activeClassesMap = {
        emerald: 'border-emerald-500/50 bg-emerald-500/5',
        orange: 'border-orange-500/50 bg-orange-500/5',
        amber: 'border-amber-500/50 bg-amber-500/5',
        blue: 'border-blue-500/50 bg-blue-500/5',
        red: 'border-red-500/50 bg-red-500/5',
        zinc: 'border-zinc-500/50 bg-zinc-500/5',
    }

    const activeClasses = activeClassesMap[primaryColor as keyof typeof activeClassesMap] || activeClassesMap.emerald

    const optionActiveClassesMap = {
        emerald: {
            bg: 'bg-emerald-500/10 text-emerald-400',
            icon: 'text-emerald-400'
        },
        orange: {
            bg: 'bg-orange-500/10 text-orange-400',
            icon: 'text-orange-400'
        },
        amber: {
            bg: 'bg-amber-500/10 text-amber-400',
            icon: 'text-amber-400'
        },
        blue: {
            bg: 'bg-blue-500/10 text-blue-400',
            icon: 'text-blue-400'
        },
        red: {
            bg: 'bg-red-500/10 text-red-400',
            icon: 'text-red-400'
        },
        zinc: {
            bg: 'bg-zinc-500/10 text-zinc-400',
            icon: 'text-zinc-400'
        }
    }

    const currentActiveOptionStyles = optionActiveClassesMap[primaryColor as keyof typeof optionActiveClassesMap] || optionActiveClassesMap.emerald

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            // Check if click is outside trigger AND outside any portal content
            const isOutsideTrigger = ref.current && !ref.current.contains(target)

            // Portals are children of document.body, but we can check if the target
            // has our specific dropdown data-attribute or is inside a div with it.
            const isDropdownClick = (target as HTMLElement).closest('[data-select-dropdown]')

            if (isOutsideTrigger && !isDropdownClick) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Synchronously calculate trigger position on toggle to prevent the top-left positioning glitch
    const handleToggle = () => {
        if (!open && ref.current) {
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
        setOpen(v => !v)
    }

    // Recalculate if open in case page resizes or scrolls
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

    // Mount/Unmount transitions
    useEffect(() => {
        if (open) {
            setShouldRender(true)
            const timer = setTimeout(() => {
                setAnimateState('open')
            }, 10)
            return () => clearTimeout(timer)
        } else {
            if (shouldRender) {
                setAnimateState('closed')
                const timer = setTimeout(() => {
                    setShouldRender(false)
                }, 150)
                return () => clearTimeout(timer)
            }
        }
    }, [open, shouldRender])

    // Lock page scrolling when dropdown is open to prevent background scrolling
    useEffect(() => {
        if (open) {
            const originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => {
                document.body.style.overflow = originalOverflow
            }
        }
    }, [open])

    const handleSelect = (val: string) => {
        setInternalSelected(val)
        setOpen(false)
        onChange?.(val)
    }

    return (
        <div
            className="flex flex-col w-full relative gap-[10px]"
            ref={ref}
        >
            {name && (
                <input type="hidden" name={name} value={currentSelected} />
            )}
            {(label || subtitle) && (
                <div className="flex flex-col gap-0.5">
                    {label && (
                        <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                            {label}
                        </Font>
                    )}
                    {subtitle && (
                        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>
                            {subtitle}
                        </Font>
                    )}
                </div>
            )}
            <div className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={handleToggle}
                    className={cn(
                        'w-full h-12 px-4 flex items-center justify-between',
                        'bg-zinc-950/40 border-2 transition-all duration-200',
                        STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
                        'text-left outline-none',
                        open
                            ? activeClasses
                            : 'border-white/10 hover:border-white/20',
                        error && 'border-red-500/50'
                    )}
                >
                    <Font
                        variant="body-sm"
                        weight="medium"
                        color={selectedOption ? STORE_TOKENS.COLORS.TEXT.PRIMARY : STORE_TOKENS.COLORS.TEXT.DIM}
                    >
                        {selectedOption?.label ?? placeholder}
                    </Font>
                    <span className={cn('inline-flex transition-transform duration-200', open && 'rotate-180')}>
                        <Icon
                            icon={ChevronDown}
                            size="xs"
                            color={open ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.MUTED}
                        />
                    </span>
                </button>

                {/* Dropdown via Portal */}
                {shouldRender && typeof document !== 'undefined' && createPortal(
                    <div
                        data-select-dropdown
                        onMouseDown={(e) => e.stopPropagation()}
                        className={cn(
                            "fixed z-[9999] border-2 border-white/5 bg-zinc-900 shadow-2xl overflow-hidden transition-all duration-150 ease-out",
                            STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full',
                            openUp ? "origin-bottom" : "origin-top",
                            animateState === 'open'
                                ? "opacity-100 scale-100 translate-y-0"
                                : "opacity-0 scale-95 translate-y-[-10px]"
                        )}
                        style={{
                            top: openUp ? 'auto' : coords.top + 4,
                            bottom: openUp ? (window.innerHeight - coords.top) + 4 : 'auto',
                            left: coords.left,
                            width: coords.width
                        }}
                    >
                        {options.map((opt) => {
                            const isSelected = currentSelected === opt.value
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt.value)}
                                    className={cn(
                                        'w-full px-4 py-3 flex items-center justify-between gap-3 transition-colors text-left',
                                        isSelected
                                            ? currentActiveOptionStyles.bg
                                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <Font
                                            variant="label-caps"
                                            color={isSelected ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.PRIMARY}
                                        >
                                            {opt.label}
                                        </Font>
                                        {opt?.description && (
                                            <Font
                                                variant="sub-tiny"
                                                color={STORE_TOKENS.COLORS.TEXT.DIM}
                                            >
                                                {opt?.description}
                                            </Font>
                                        )}
                                    </div>
                                    {isSelected && (
                                        <Icon
                                            icon={Check}
                                            size="xs"
                                            color={STORE_TOKENS.COLORS.BRAND}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>,
                    document.body
                )}
            </div>
            {error && (
                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.ERROR} weight="black" uppercase tracking="widest">
                    {error}
                </Font>
            )}
        </div>
    );
}
