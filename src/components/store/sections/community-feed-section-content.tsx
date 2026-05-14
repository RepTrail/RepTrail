'use client'

import React from 'react'
import { Grid } from '@/components/store/base/grid'
import { CommunityFeedCard } from '@/components/store/intermediary/community-feed-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { Users } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'

/**
 * CommunityFeedSectionContent: The composite content for the Community Feed section.
 * Separated into the sections layer to maintain architectural purity.
 */
export function CommunityFeedSectionContent({ isEmpty = false }: { isEmpty?: boolean }) {
    if (isEmpty) {
        return (
            <EmptyState 
                icon={Users}
                title="FEED VAZIO"
                description="AINDA NÃO HÁ PUBLICAÇÕES NA COMUNIDADE."
            />
        )
    }

    return (
        <Grid cols={{ base: 2.5, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            <CommunityFeedCard
                imageUrl="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
                userName="MARCOS VINICIUS"
                avatarUrl="https://github.com/shadcn.png"
                statusLabel="EVOLUÇÃO ATIVA"
            />
            <CommunityFeedCard
                imageUrl="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
                userName="GABRIEL ALMEIDA"
                avatarUrl="https://github.com/shadcn.png"
                statusLabel="NOVO RECORDE"
            />
            <CommunityFeedCard
                imageUrl="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop"
                userName="LUCAS FERNANDES"
                avatarUrl="https://github.com/shadcn.png"
                statusLabel="TREINO CONCLUÍDO"
            />
        </Grid>
    )
}
