'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Badge } from '@/components/store/base/badge'
import { Inline } from '@/components/store/base/layout'
import { ActionableListCard } from './actionable-list-card'
import { Star, ArrowRight, Users } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import Link from 'next/link'

interface RankingListItemProps {
    trainer: {
        full_name: string
        avatar_url?: string
        rating?: number
        studentCount: number
        trainer_code?: string | null
    }
    rank: number
}

/**
 * RankingListItem: Specialized list item for trainer rankings.
 * Reuses the ActionableListCard pattern for Registry consistency.
 */
export function RankingListItem({ trainer, rank }: RankingListItemProps) {
    return (
        <ActionableListCard
            badges={
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                    <Badge 
                        label={`${Number(trainer.rating || 0).toFixed(1)} Rating`}
                        icon={Star}
                        variant="glass"
                        size="xs"
                    />
                    <Badge 
                        label={`${trainer.studentCount} Alunos`}
                        icon={Users}
                        variant="glass"
                        color="orange"
                        size="xs"
                    />
                </Inline>
            }
            actions={
                trainer.trainer_code ? (
                    <Link href={`/personal/${trainer.trainer_code}`}>
                        <Button
                            variant="outline-zinc"
                            rounded="full"
                            isIconOnly
                            size="sm"
                            transition
                        >
                            <Icon icon={ArrowRight} size="xs" />
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="outline-zinc"
                        rounded="full"
                        isIconOnly
                        size="sm"
                        transition
                        disabled
                    >
                        <Icon icon={ArrowRight} size="xs" />
                    </Button>
                )
            }
        >
            <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                {/* Rank Badge Style */}
                <Box width={10} shrink={0} display="flex" justify="center">
                    <Font 
                        variant="h4" 
                        weight="black" 
                        color="zinc-700" 
                        italic 
                        tracking="tight"
                    >
                        #{rank}
                    </Font>
                </Box>

                <BaseAvatar 
                    initials={trainer.full_name.substring(0, 2).toUpperCase()} 
                    src={trainer.avatar_url} 
                    size="md" 
                />

                <Stack gap="none" minWidth={0}>
                    <Font 
                        {...STORE_TOKENS.TYPOGRAPHY.HEADING} 
                        variant={{ base: 'body-sm', md: 'body' }} 
                        color={STORE_TOKENS.COLORS.TEXT.PRIMARY}
                    >
                        {trainer.full_name}
                    </Font>
                    <Font 
                        variant="sub-tiny" 
                        weight="black" 
                        color="zinc-600" 
                        uppercase 
                        italic 
                        tracking="widest"
                    >
                        Treinador Certificado
                    </Font>
                </Stack>
            </Inline>
        </ActionableListCard>
    )
}
