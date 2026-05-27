'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Search } from 'lucide-react'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * AffiliateReferrersList: Manages the display of users who registered via an affiliate link.
 * - Handles the mapping of referral items and domain-specific empty states.
 * - Responsibility: Affiliate network list management.
 */
export function AffiliateReferrersList() {
    // In a real scenario, these would come from props or a query
    const referrers = [
        {
            name: "Marcos Vinicius",
            email: "marcos@reptrail.com.br",
            registrationDate: "08/05/2024",
            role: "personal",
            roleLabel: "PERSONAL TRAINER",
            initials: "MV",
            avatarVariant: "primary"
        },
        {
            name: "Ana Beatriz",
            email: "ana.bia@gmail.com",
            registrationDate: "há 2 horas",
            role: "aluno",
            roleLabel: "ALUNO PREMIUM",
            initials: "AB",
            avatarVariant: 'primary'
        }
    ]

    if (referrers.length === 0) {
        return (
            <Box padding={STORE_TOKENS.PADDING.NONE}>
                <EmptyState
                    icon={Search}
                    title="Nenhum indicado ainda"
                    description="Compartilhe seu link nas redes sociais para começar a construir sua rede."
                />
            </Box>
        );
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            {referrers.map((ref) => (
                <UserListItem
                    key={ref.email}
                    {...ref as any}
                />
            ))}
        </Stack>
    )
}
