import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/store/base/tooltip'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Lock } from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface PremiumLockTooltipProps {
    children: React.ReactNode
    locked: boolean
    tooltipText: string
    enabled?: boolean
}

export function PremiumLockTooltip({ children, locked, tooltipText, enabled = true }: PremiumLockTooltipProps) {
    if (!enabled || !locked) return { children }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Box as="span" display="inline-block" cursor="not-allowed" fullWidth tabIndex={0}>
                        <Box pointerEvents="none" fullWidth>
                            {children}
                        </Box>
                    </Box>
                </TooltipTrigger>
                <TooltipContent side="top" variant="transparent">
                    <Box padding="element" border borderColor="amber" borderOpacity={20} bg="zinc" rounded={STORE_TOKENS.RADIUS.SYSTEM} maxWidth="sm">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Lock} size="xs" color="amber" />
                                <Font variant="body-sm" weight="bold" color="amber">Recurso Premium</Font>
                            </Stack>
                            <Font variant="description" color="zinc-400">{tooltipText}</Font>
                        </Stack>
                    </Box>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
