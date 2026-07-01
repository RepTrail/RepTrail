'use client'

import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Button, ButtonVariant } from '@/components/store/base/button'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface DashboardSidebarActionProps {
    href?: string
    label: string
    icon: LucideIcon
    variant: ButtonVariant
    disabled?: boolean
}

export function DashboardSidebarAction({
    href,
    label,
    icon,
    variant,
    disabled = false,
}: DashboardSidebarActionProps) {
    const content = (
        <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Icon icon={icon} size="sm" />
            <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL}>
                {label}
            </Font>
        </Stack>
    )

    if (href && !disabled) {
        return (
            <Button asChild variant={variant} size="md" rounded={STORE_TOKENS.RADIUS.SYSTEM} fullWidth>
                <Link href={href}>
                    {content}
                </Link>
            </Button>
        )
    }

    return (
        <Button
            variant={variant}
            size="md"
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            fullWidth
            disabled={disabled}
            text={content} />
    );
}