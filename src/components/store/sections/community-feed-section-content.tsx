'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { actions, useQuery, useQueryClient, subscribeToPublicFeed } from '@/lib/dal'
import { Grid } from '@/components/store/base/grid'
import { CommunityFeedCard } from '@/components/store/intermediary/community-feed-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { Users, TrendingUp } from 'lucide-react'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { QUERY_KEYS } from '@/lib/query-keys'

/**
 * CommunityFeedSectionContent: The composite content for the Community Feed section.
 * Separated into the sections layer to maintain architectural purity.
 */
export function CommunityFeedSectionContent({ isEmpty = false }: { isEmpty?: boolean }) {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { data: result, isLoading } = useQuery({
        queryKey: QUERY_KEYS.public.feed,
        queryFn: async () => actions.getPublicFeed(),
        staleTime: 1000 * 60 * 5 // 5 minutes
    })

    // Realtime invalidation for the public feed
    useEffect(() => {
        return subscribeToPublicFeed(() => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.public.feed })
        })
    }, [queryClient])

    const publicPhotos = (result?.success ? result.data : []) ?? []

    if (isLoading) {
        return <EmptyState icon={TrendingUp} title="CARREGANDO..." description="BUSCANDO FEED DE ALUNOS." />
    }

    if (isEmpty || publicPhotos.length === 0) {
        return (
            <EmptyState 
                icon={Users}
                title="FEED VAZIO"
                description="NENHUM ALUNO COMPARTILHOU SUA EVOLUÇÃO PUBLICAMENTE AINDA."
            />
        )
    }

    return (
        <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {publicPhotos.map((photo: any) => {
                const mainUrl = photo.front_url || photo.side_right_url || photo.back_url;
                if (!mainUrl) return null;

                return (
                    <CommunityFeedCard
                        key={photo.id}
                        imageUrl={mainUrl}
                        userName={photo.student?.full_name || 'ALUNO REPTRAIL'}
                        avatarUrl={photo.student?.avatar_url}
                        statusLabel="EVOLUÇÃO ATIVA"
                        onAction={() => router.push(`/aluno/${photo.student_id}`)}
                    />
                )
            })}
        </Grid>
    )
}
