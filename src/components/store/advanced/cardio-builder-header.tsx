'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Pencil, Check, X, Flame } from 'lucide-react'

interface CardioBuilderHeaderProps {
    cardioId: string
    name: string
    description: string
    isEditing: boolean
    setIsEditing: (val: boolean) => void
    editName: string
    setEditName: (val: string) => void
    editDesc: string
    setEditDesc: (val: string) => void
    onSave: () => void
    onCancel: () => void
    contextLabel?: string
    icon?: any
    contextColor?: string
}

export function CardioBuilderHeader({
    cardioId,
    name,
    description,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editDesc,
    setEditDesc,
    onSave,
    onCancel,
    contextLabel = 'Condicionamento & Saúde',
    icon = Flame,
    contextColor
}: CardioBuilderHeaderProps) {
    return (
        <Stack
            direction={{ base: 'col', md: 'row' }}
            align={{ base: 'stretch', md: 'start' }}
            justify="between"
            gap={STORE_TOKENS.SPACING.SECTION}
            fullWidth
        >
            <Box flex1>
                {isEditing ? (
                    <GlassPanel padding={STORE_TOKENS.SPACING.CONTAINER}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>Nome do Cardio</Font>
                                <Input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel() }}
                                    placeholder="Ex: Corrida na Esteira"
                                    size="lg"
                                    autoFocus
                                />
                            </Stack>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font
                                    variant="sub-tiny"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                    }}>Descrição / Subtítulo</Font>
                                <Input
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Escape') onCancel() }}
                                    placeholder="Ex: Ritmo moderado de 60-70% da FC máx"
                                />
                            </Stack>
                            <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Button
                                    variant="outline-emerald"
                                    onClick={onSave}
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                    fullWidth={{ base: true, md: false }}
                                >
                                    <Icon icon={Check} size="xs" />
                                    Salvar
                                </Button>
                                <Button
                                    variant="outline-red"
                                    onClick={onCancel}
                                    gap={STORE_TOKENS.SPACING.ELEMENT}
                                    fullWidth={{ base: true, sm: false }}
                                >
                                    <Icon icon={X} size="xs" />
                                    Cancelar
                                </Button>
                            </Stack>
                        </Stack>
                    </GlassPanel>
                ) : (
                    <Box
                        display="flex"
                        align="start"
                        gap={STORE_TOKENS.SPACING.ELEMENT}
                        cursor="pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={icon} color={contextColor as any || STORE_TOKENS.COLORS.BRAND} size="lg" />
                                <Font
                                    variant="auxiliary"
                                    uppercase
                                    {...{
                                        color: contextColor as any || STORE_TOKENS.COLORS.BRAND,
                                    }}>{contextLabel}</Font>
                            </Inline>
                            <Inline align="center" gap={'tiny'}>
                                <Font
                                    variant="h1"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                    }}>{name}</Font>
                                <Box
                                    padding={'tiny'}
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    hoverBg={STORE_TOKENS.COLORS.BACKGROUND}
                                    display="flex"
                                    align="center"
                                    justify="center"
                                >
                                    <Icon icon={Pencil} size="sm" color={STORE_TOKENS.COLORS.BRAND} />
                                </Box>
                            </Inline>
                            <Font
                                variant="description"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                }}>{description || 'Clique para adicionar descrição'}</Font>
                        </Stack>
                    </Box>
                )}
            </Box>
        </Stack>
    );
}
