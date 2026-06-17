'use client'

import React, { useState } from 'react'
import { Font } from './font'
import { cn } from '@/lib/utils'
import { GlassPanel } from './surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Box } from './box'
import { useRegistry } from '@/components/store/base/registry-context'

export type SwitchOption = {
    label: string
    value: string
}

export type FormSwitchProps = {
    label?: string
    subtitle?: string
    options: SwitchOption[]
    value?: string
    onChange?: (value: string) => void
    color?: 'emerald' | 'orange' | 'amber' | 'blue' | 'primary'
    flex1?: boolean
    width?: string | number | { base: string | number, md?: string | number, lg?: string | number }
}

export function FormSwitch({
    label,
    subtitle,
    options,
    value,
    onChange,
    color = 'emerald',
    flex1,
    width
}: FormSwitchProps) {
    const { primaryColor } = useRegistry()
    const [selected, setSelected] = useState(value ?? options[0]?.value)

    const resolvedColor = color === 'primary' ? primaryColor as 'emerald' | 'orange' | 'amber' | 'blue' : color

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
        <Box 
            display="flex" 
            direction="col" 
            gap={STORE_TOKENS.SPACING.ELEMENT} 
            fullWidth={!width} 
            flex1={flex1}
            width={width as any}
        >
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
            <GlassPanel padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.FULL} border="subtle" fullWidth>
                <Box
                    display="flex"
                    align="center"
                    justify="start"
                    gap={STORE_TOKENS.SPACING.ELEMENT}
                    padding={STORE_TOKENS.PADDING.ELEMENT}
                    fullWidth
                    overflow="auto"
                    noScrollbar
                    {...{ className: 'snap-x snap-mandatory scroll-smooth' } as any}
                >
                    {options.map((opt) => {
                        const isActive = selected === opt.value
                        return (
                            <Box
                                key={opt.value}
                                as="button"
                                type="button"
                                onClick={() => handleSelect(opt.value)}
                                flex="none"
                                flex1={true}
                                shrink={0}
                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                rounded={STORE_TOKENS.RADIUS.FULL}
                                transition
                                display="flex"
                                align="center"
                                justify="center"
                                {...{ className: cn(
                                    'border-2 whitespace-nowrap snap-center',
                                    isActive
                                        ? cn("shadow-lg", colorClasses[resolvedColor])
                                        : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                ) } as any}
                            >
                                <Font
                                    variant="auxiliary"
                                    weight="black"
                                    uppercase
                                    color={isActive ? resolvedColor : STORE_TOKENS.COLORS.TEXT.MUTED as any}
                                >
                                    {opt.label}
                                </Font>
                            </Box>
                        );
                    })}
                </Box>
            </GlassPanel>
        </Box>
    );
}
