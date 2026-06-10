import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/store/base/tooltip'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Lock } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface PremiumLockTooltipProps {
    children: React.ReactNode
    locked: boolean
    tooltipText: string
    enabled?: boolean
}

export function PremiumLockTooltip({ children, locked, tooltipText, enabled = true }: PremiumLockTooltipProps) {
    if (!enabled || !locked) return <>{children}</>

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <span tabIndex={0} className="inline-block cursor-not-allowed w-full">
                        <div className="pointer-events-none w-full">
                            {children}
                        </div>
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px] p-3 border-amber-500/20 bg-zinc-900">
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Icon icon={Lock} size="xs" color="amber" />
                            <Font variant="body-sm" weight="bold" color="amber">Recurso Premium</Font>
                        </Stack>
                        <Font variant="description" color="zinc-300">{tooltipText}</Font>
                    </Stack>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
