'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    Activity,
    Sparkles,
    TrendingUp,
    Image as ImageIcon,
    ChevronRight,
    Dumbbell,
} from 'lucide-react'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Button } from '@/components/store/base/button'
import { GlassPanel } from '@/components/store/base/surface'
import { BackgroundIcon } from '@/components/store/base/background-icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicProfile {
    id: string
    full_name: string
    avatar_url: string | null
    created_at: string | null
}

interface TrainerData {
    id: string
    full_name: string
    avatar_url: string | null
    trainer_code?: string
}

interface StudentPublicProfileMainProps {
    profile: PublicProfile
    trainerData?: TrainerData
    evolutionContent: React.ReactNode
    historyContent: React.ReactNode
    photosContent: React.ReactNode
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
    { id: 'evolution', label: 'Evolução', icon: TrendingUp },
    { id: 'photos', label: 'Galeria', icon: ImageIcon },
] as const

type TabId = typeof TABS[number]['id']

// ─── Component ────────────────────────────────────────────────────────────────

export function StudentPublicProfileMain({
    profile,
    trainerData,
    evolutionContent,
    photosContent,
}: StudentPublicProfileMainProps) {
    const [activeTab, setActiveTab] = useState<TabId>('evolution')

    const memberYear = profile.created_at
        ? new Date(profile.created_at).getFullYear()
        : 2024

    return (
        <Stack gap="section" fullWidth>

            {/* ── Hero Card (Upgraded to Liquid Glass) ──────────────────── */}
            <GlassPanel padding="container">
                {/* Decorative background icon */}
                <BackgroundIcon icon={Dumbbell} />

                <Box
                    display="flex"
                    direction={{ base: 'col', lg: 'row' }}
                    align={{ base: 'center', lg: 'center' }}
                    justify="between"
                    gap={STORE_TOKENS.SPACING.CONTAINER}
                    fullWidth
                    position="relative"
                    zIndex={10}
                >
                    {/* Left: Avatar + Identity Stack */}
                    <Box
                        display="flex"
                        direction={{ base: 'col', md: 'row' }}
                        align="center"
                        gap={STORE_TOKENS.SPACING.CONTAINER}
                    >
                        {/* Avatar */}
                        <BaseAvatar
                            initials={profile.full_name?.charAt(0) || '?'}
                            src={profile.avatar_url || undefined}
                            size="xxl"
                            variant="primary"
                        />

                        {/* Identity Info */}
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align={{ base: 'center', md: 'start' }}>
                            <Font variant="h1" align={{ base: 'center', md: 'left' }} weight="black" italic uppercase color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                {profile.full_name}
                            </Font>

                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Badge
                                    label={`Membro desde ${memberYear}`}
                                    icon={Activity}
                                    variant="glass"
                                    color="zinc"
                                    rounded="system"
                                />
                            </Inline>
                        </Stack>
                    </Box>

                    {/* Right: Coach / Auto-Training Box + Switch Stack to its right */}
                    <Box
                        display="flex"
                        direction={{ base: 'col', md: 'row' }}
                        align="stretch"
                        gap={STORE_TOKENS.SPACING.CONTAINER}
                        justify={{ base: 'center', md: 'end' }}
                    >
                        {/* Coach Box or Auto-Training Badge (Left Side) */}
                        <Box display="flex" width={{ base: 'full', md: 'auto' }} justify="center" align="stretch">
                            {trainerData ? (
                                <Link href={`/personal/${trainerData.trainer_code || trainerData.id}`} style={{ width: '100%', display: 'flex' }}>
                                    <Box
                                        bg="primary"
                                        bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                        padding={STORE_TOKENS.PADDING.CONTAINER}
                                        cursor="pointer"
                                        transition
                                        display="flex"
                                        align="center"
                                        fullWidth
                                        border={true}
                                        borderColor="primary"
                                        borderOpacity={20}
                                    >
                                        <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                            <BaseAvatar
                                                initials={trainerData.full_name?.charAt(0) || '?'}
                                                src={trainerData.avatar_url || undefined}
                                                size="lg"
                                                variant="zinc"
                                            />
                                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Font variant="sub-tiny" weight="black" uppercase color="primary" opacity={60}>
                                                    Coach Responsável
                                                </Font>
                                                <Font variant="body" weight="black" italic uppercase color="primary">
                                                    {trainerData.full_name}
                                                </Font>
                                            </Stack>
                                            <Icon icon={ChevronRight} size="md" color="primary" />
                                        </Inline>
                                    </Box>
                                </Link>
                            ) : (
                                <Box
                                    bg="primary"
                                    bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    padding={STORE_TOKENS.PADDING.CONTAINER}
                                    display="flex"
                                    align="center"
                                    fullWidth
                                    border={true}
                                    borderColor="primary"
                                    borderOpacity={20}
                                    height="full"
                                >
                                    <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                        <Icon icon={Sparkles} size="lg" color="primary" />
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font variant="sub-tiny" weight="black" uppercase color="primary" opacity={60}>
                                                Módulo
                                            </Font>
                                            <Font variant="body" weight="black" italic uppercase color="primary">
                                                Auto Treino RepTrail
                                            </Font>
                                        </Stack>
                                    </Inline>
                                </Box>
                            )}
                        </Box>

                        {/* Tab Navigation Buttons (Stacked Vertically on the Right Side) */}
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} width={{ base: 'full', md: 'auto' }} flex1>
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id
                                return (
                                    <Button
                                        key={tab.id}
                                        variant={isActive ? 'outline-primary' : 'outline-zinc'}
                                        size="sm"
                                        onClick={() => setActiveTab(tab.id)}
                                        gap="element"
                                        fullWidth
                                        flex1={true}
                                        height="full"
                                    >
                                        <Icon icon={tab.icon} size="sm" color={isActive ? 'primary' : 'zinc-400'} />
                                        {tab.label}
                                    </Button>
                                )
                            })}
                        </Stack>
                    </Box>
                </Box>
            </GlassPanel>

            {/* ── Tab Content ───────────────────────────────── */}
            <Box fullWidth>
                {activeTab === 'evolution' && evolutionContent}
                {activeTab === 'photos' && photosContent}
            </Box>

        </Stack>
    )
}
