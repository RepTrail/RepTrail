'use client'

import React from 'react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { GlassPanel } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'

export interface ContractInfoCardProps {
    label: string
    value: React.ReactNode
}

export function ContractInfoCard({ label, value }: ContractInfoCardProps) {
    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                <Font
                    variant="label-caps"
                    {...{
                        color: "SECONDARY",
                    }}>
                    {label}
                </Font>
                <Font
                    variant="h2"
                    {...{
                        color: "PRIMARY",
                    }}>
                    {value}
                </Font>
            </Stack>
        </GlassPanel>
    )
}
