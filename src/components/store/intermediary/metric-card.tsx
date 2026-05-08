import React from 'react'
import { Card, CardContent } from '../base/card'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Icon } from '../base/icon'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
    label: string
    value: string
    sub?: string
    icon: LucideIcon
    variant?: 'blue' | 'emerald' | 'amber' | 'red' | 'orange'
}

export function MetricCard({ label, value, sub, icon, variant = 'blue' }: MetricCardProps) {
    return (
        <Card variant="surface" border={variant} shadow={variant}>
            <CardContent>
                <Stack gap={5}>
                    <Stack direction="row" align="center" justify="between">
                        <Stack gap={0}>
                            <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase tracking="widest">{label}</Font>
                            <Font variant="h2" weight="black" italic uppercase tracking="tight">{value}</Font>
                        </Stack>
                        <Box bg={`${variant}/20` as any} padding={2.5} rounded="sm" border={variant}>
                            <Icon icon={icon} color={variant} size="sm" />
                        </Box>
                    </Stack>
                    {sub && (
                        <Box borderTop="white/5" paddingTop={2.5}>
                            <Font variant="sub-tiny" color="zinc-500" uppercase>{sub}</Font>
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}
