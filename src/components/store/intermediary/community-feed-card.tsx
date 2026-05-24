'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { BaseAvatar } from '@/components/store/base/avatar'
import { GlassPanel } from '@/components/store/base/surface'
import { ChevronRight } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Button } from '@/components/store/base/button'
import { Img } from '@/components/store/base/img'
import { Image as ImageIcon } from 'lucide-react'

interface CommunityFeedCardProps {
    imageUrl: string
    userName: string
    avatarUrl?: string
    statusLabel?: string
    onAction?: () => void
}

export function CommunityFeedCard({
    imageUrl,
    userName,
    avatarUrl,
    statusLabel = 'EVOLUÇÃO ATIVA',
    onAction
}: CommunityFeedCardProps) {
    return (
        <Box
            position="relative"
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            overflow="hidden"
            cursor="pointer"
            onClick={onAction}
            group
            aspectRatio="3/4"
            display="flex"
            direction="col"
        >
            {/* Background Image */}
            <Box position="absolute" pin="inset" zIndex={0}>
                <Img
                    src={imageUrl}
                    alt={userName}
                    fallbackIcon={ImageIcon}
                    fullWidth
                    fullHeight
                    objectFit="cover"
                    hoverScale={105}
                    transition
                />
            </Box>

            {/* Base Overlay (Cinematic Darkening) */}
            <Box
                position="absolute"
                pin="inset"
                zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                bg={STORE_TOKENS.COLORS.BLACK}
                bgOpacity={20}
                groupHoverOpacity={10}
                transition
            />
            
            {/* Bottom Gradient (Ensures Footer Readability) */}
            <Box
                position="absolute"
                pin="inset"
                top="auto"
                height="50%"
                zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                bgGradient="bottom-dark"
            />

            {/* Content Container */}
            <Stack
                position="relative"
                zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
                fullHeight
                justify="between"
                padding={STORE_TOKENS.SPACING.CONTAINER}
            >
                <Box alignSelf="start">
                    <Badge
                        variant="dot"
                        color={STORE_TOKENS.COLORS.SUCCESS}
                        label={statusLabel}
                        size="sm"
                    />
                </Box>

                {/* Bottom Profile Panel */}
                <GlassPanel
                    padding={STORE_TOKENS.PADDING.ELEMENT}
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    variant="glass"
                >
                    <Stack direction="row" align="center" justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <BaseAvatar
                                src={avatarUrl}
                                initials={userName.substring(0, 2).toUpperCase()}
                                size="sm"
                            />
                            <Stack gap="none">
                                <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} lineClamp={1}>
                                    {userName}
                                </Font>
                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL} variant="tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>
                                    VER PERFIL COMPLETO
                                </Font>
                            </Stack>
                        </Stack>

                        {/* Action Button */}
                        <Button
                            variant="emerald"
                            size="sm"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            isIconOnly
                            shrink={0}
                        >
                            <Icon icon={ChevronRight} size="xs" color={STORE_TOKENS.COLORS.BLACK} />
                        </Button>
                    </Stack>
                </GlassPanel>
            </Stack>
        </Box>
    )
}
