import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { GlassPanel } from '../base/surface'
import { Box } from '../base/box'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    label: string
    value: string
    description?: string
    icon: LucideIcon
    color?: 'emerald' | 'orange' | 'amber' | 'red' | 'blue'
}

/**
 * StatsCard: A high-fidelity card for displaying metrics and financial data.
 * Ideal for Admin and Affiliate dashboards.
 */
export function StatsCard({
    label,
    value,
    description,
    icon,
    color = 'emerald'
}: StatsCardProps) {
    const colorMap = {
        emerald: 'bg-emerald-500/10 text-emerald-500',
        orange: 'bg-orange-500/10 text-orange-500',
        amber: 'bg-amber-500/10 text-amber-500',
        red: 'bg-red-500/10 text-red-500',
        blue: 'bg-blue-500/10 text-blue-500'
    }

    return (
        <GlassPanel padding={5} group>
            <Stack gap={5} align="start">
                {/* Icon Header */}
                <Box 
                    padding={2.5} 
                    rounded="system" 
                    className={colorMap[color]}
                >
                    <Icon icon={icon} size="sm" />
                </Box>

                {/* Content Body */}
                <Stack gap={1} fullWidth align="stretch">
                    <Font 
                        variant="sub-tiny" 
                        weight="black" 
                        uppercase 
                        color="zinc-500" 
                        tracking="widest"
                    >
                        {label}
                    </Font>
                    
                    <Font 
                        variant="heading" 
                        weight="black" 
                        italic 
                    >
                        {value}
                    </Font>

                    {description && (
                        <Font 
                            variant="sub-tiny" 
                            weight="bold" 
                            uppercase 
                            color="zinc-600" 
                            tracking="wide"
                        >
                            {description}
                        </Font>
                    )}
                </Stack>
            </Stack>
        </GlassPanel>
    )
}
