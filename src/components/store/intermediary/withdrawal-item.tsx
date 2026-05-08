'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Badge } from '../base/badge'
import { GlassPanel } from '../base/surface'
import { IconBox } from '../base/icon'
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    QrCode
} from 'lucide-react'

interface WithdrawalItemProps {
    id: string
    amount: string
    date: string
    status: 'pending' | 'completed' | 'rejected'
    method: string
    recipient: string
}

export function WithdrawalItem({
    id,
    amount,
    date,
    status,
    method,
    recipient
}: WithdrawalItemProps) {
    
    const statusConfig = {
        pending: {
            icon: Clock,
            label: 'Processando',
            color: 'amber' as const,
        },
        completed: {
            icon: CheckCircle2,
            label: 'Pago',
            color: 'emerald' as const,
        },
        rejected: {
            icon: AlertCircle,
            label: 'Recusado',
            color: 'red' as const,
        }
    }

    const config = statusConfig[status]

    return (
        <GlassPanel 
            padding={0} 
            className="group relative overflow-hidden transition-all duration-300 hover:border-white/20"
        >
            <Inline gap={5} align="center" className="p-5 min-h-[90px] w-full">
                {/* Transaction Icon */}
                <IconBox 
                    icon={config.icon} 
                    variant={config.color} 
                    size="md"
                    className="shrink-0"
                />

                {/* Details Area - Strictly Horizontal even on mobile */}
                <div className="flex-1 flex flex-row items-center justify-between gap-4 overflow-hidden">
                    <Stack gap={0} className="flex-1 overflow-hidden">
                        <Font weight="black" uppercase italic color="white" className="text-xs md:text-sm tracking-wider truncate">
                            Saque #{id.slice(-6).toUpperCase()}
                        </Font>
                        <Font variant="sub-tiny" color="zinc-600" className="truncate hidden sm:block">
                            {date} • {recipient}
                        </Font>
                        <Font variant="sub-tiny" color="zinc-600" className="sm:hidden">
                            {date}
                        </Font>
                    </Stack>

                    <Inline gap={{ base: 2.5, md: 5 }} align="center" className="shrink-0">
                        <Stack gap={1} align="end">
                            <Font weight="black" italic color="white" className="text-sm md:text-lg leading-none whitespace-nowrap">
                                {amount}
                            </Font>
                            <Inline gap={1} align="center">
                                <QrCode size={10} className="text-zinc-600" />
                                <Font variant="sub-tiny" color="zinc-600" uppercase weight="black">{method}</Font>
                            </Inline>
                        </Stack>

                        <Badge 
                            label={config.label} 
                            color={config.color} 
                            variant="glass" 
                            rounded="full"
                            size="xs"
                            className="hidden lg:flex"
                        />
                    </Inline>
                </div>

                {/* Hover Indicator */}
                <Box className="absolute right-0 top-0 h-full w-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Inline>
        </GlassPanel>
    )
}
