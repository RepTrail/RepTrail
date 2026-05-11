'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { BaseAvatar } from '../base/avatar'
import { Badge } from '../base/badge'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { ActionableListCard } from './actionable-list-card'
import { Icon } from '../base/icon'
import { Eye, Sparkles, Zap, Trash2, LucideIcon } from 'lucide-react'

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
                <Inline gap={2.5} align="center">
                    <Badge label={registrationDate} variant="glass" size="xs" />
                    <Badge 
                        label={roleLabel} 
                        variant="glass" 
                        color={role === 'personal' ? 'orange' : 'emerald'} 
                        rounded="full" 
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
            <Inline gap={5} align="center">
                <BaseAvatar src={avatarUrl || undefined} initials={initials} variant={avatarVariant} size="md" />
                <Stack gap={0} minWidth={0}>
                    <Font weight="black" uppercase italic color="white" variant={{ base: 'body-sm', md: 'body' }} tracking="wider" truncate display="block">{name}</Font>
                    <Box fullWidth minWidth={0} overflow="hidden">
                        <Font variant="sub-tiny" color="zinc-600" lowercase truncate display="block">{email}</Font>
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
            rounded="full" 
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
