'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Badge } from '@/components/store/base/badge'
import { Button } from '@/components/store/base/button'
import { Box } from '@/components/store/base/box'
import { ActionableListCard } from './actionable-list-card'
import { Icon } from '@/components/store/base/icon'
import { Eye, Sparkles, Zap, Trash2, LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface UserListItemProps {
    name: string
    email: string
    registrationDate: string
    role: 'personal' | 'aluno'
    roleLabel: string
    initials: string
    isActionActive?: boolean
    avatarVariant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc' | 'primary'
    avatarUrl?: string | null
    onInspect?: () => void
    onAction?: () => void
    onDelete?: () => void
}

export function UserListItem({
    name,
    email,
    registrationDate,
    role,
    roleLabel,
    initials,
    isActionActive = false,
    avatarVariant = 'zinc',
    avatarUrl,
    onInspect,
    onAction,
    onDelete
}: UserListItemProps) {
    
    const actionConfig = {
        aluno: {
            icon: Sparkles,
            label: 'Ativar Auto-Treino Free',
            color: 'emerald' as const,
            outlineVariant: 'outline-emerald' as const
        },
        personal: {
            icon: Zap,
            label: 'Ativar On-Demand',
            color: 'orange' as const,
            outlineVariant: 'outline-orange' as const
        }
    }

    const currentAction = actionConfig[role]

    const hasActions = onInspect || onAction || onDelete

    return (
        <ActionableListCard
            badges={
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                    <Badge label={registrationDate} variant="glass" size="xs" />
                    <Badge 
                        label={roleLabel} 
                        variant="glass" 
                        color={role === 'personal' ? 'orange' : 'emerald'} 
                        size="xs"
                    />
                </Inline>
            }
            actions={hasActions ? (
                <>
                    {onInspect && (
                        <ActionButton 
                            icon={Eye} 
                            variant="outline-blue" 
                            onClick={onInspect} 
                        />
                    )}
                    {onAction && (
                        <ActionButton 
                            icon={currentAction.icon} 
                            variant={isActionActive ? currentAction.outlineVariant : 'outline-zinc'} 
                            onClick={onAction} 
                        />
                    )}
                    {onDelete && (
                        <ActionButton 
                            icon={Trash2} 
                            variant="outline-red" 
                            onClick={onDelete} 
                        />
                    )}
                </>
            ) : undefined}
        >
            <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                <BaseAvatar src={avatarUrl || undefined} initials={initials} variant={avatarVariant} size="md" />
                <Stack gap={0} minWidth={0}>
                    <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant={{ base: 'body-sm', md: 'body' }} color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                        {name}
                    </Font>
                    <Box fullWidth minWidth={0} overflow="hidden">
                        <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} color={STORE_TOKENS.COLORS.TEXT.DIM} lowercase>
                            {email}
                        </Font>
                    </Box>
                </Stack>
            </Inline>
        </ActionableListCard>
    )
}

function ActionButton({ 
    icon: IconComp, 
    variant, 
    onClick 
}: { 
    icon: LucideIcon, 
    variant: any, 
    onClick?: () => void
}) {
    return (
        <Button 
            variant={variant} 
            size="sm" 
            rounded={STORE_TOKENS.RADIUS.FULL} 
            isIconOnly 
            onClick={onClick}
            hoverScale={110}
            activeScale={95}
            transition
        >
            <Icon icon={IconComp} size="xs" />
        </Button>
    )
}
