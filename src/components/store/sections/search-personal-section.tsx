'use client'

import { useState } from 'react'
import { searchTrainers } from '@/actions/student-actions'
import { Search, Trophy } from 'lucide-react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Surface } from '@/components/store/base/surface'
import { Box } from '@/components/store/base/box'
import { Grid } from '@/components/store/base/grid'
import { Input } from '@/components/store/base/input'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { RankingPodiumCard } from '@/components/store/intermediary/ranking-podium-card'
import { fbqEvent } from '@/lib/meta-pixel'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function SearchPersonalSection() {
    const [filters, setFilters] = useState({
        query: '',
        region: '',
        specialty: '',
        sortBy: 'rating' as any
    })

    const { data: trainers = [], isLoading: loading } = useQuery({
        queryKey: QUERY_KEYS.search.trainers(filters),
        queryFn: async () => {
            const results = await searchTrainers(filters)
            if (filters.query || filters.region || filters.specialty) {
                fbqEvent("Lead", {
                    content_category: "Trainer Search",
                    search_string: filters.query,
                    region: filters.region,
                    specialty: filters.specialty
                });
            }
            return results
        },
        staleTime: 1000 * 60,
    })

    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE as any, md: STORE_TOKENS.SPACING.SECTION }}>
            <RegistrySection
                title="Profissionais Disponíveis"
                subtitle={`${trainers.length} treinadores encontrados`}
                icon={Trophy}
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box width="full">
                        <Input
                            placeholder="Nome, cidade ou especialidade..."
                            icon={<Icon icon={Search} size="xs" />}
                            value={filters.query}
                            onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
                            weight="bold"
                        />
                    </Box>

                    {loading ? (
                        <Grid cols={{ base: 1, md: 2, lg: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            {[1, 2, 4, 6].map(i => (
                                <Box key={i} bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.MODAL} height={300} fullWidth rounded={STORE_TOKENS.RADIUS.SYSTEM} />
                            ))}
                        </Grid>
                    ) : (
                        <Grid cols={{ base: 1, md: 2, lg: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            {trainers.map((trainer, index) => (
                                <RankingPodiumCard
                                    key={trainer.id}
                                    trainer={{
                                        ...trainer,
                                        rating: trainer.average_rating || 0,
                                        studentCount: trainer.studentCount || 0,
                                        score: trainer.score || 0
                                    }}
                                    rank={index + 1}
                                />
                            ))}
                        </Grid>
                    )}

                    {!loading && trainers.length === 0 && (
                        <Surface variant="glass" padding={STORE_TOKENS.PADDING.EMPTY_STATE as any} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="dashed">
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                                <Surface padding={STORE_TOKENS.PADDING.CONTAINER} bg={STORE_TOKENS.COLORS.BACKGROUND} rounded={STORE_TOKENS.RADIUS.FULL} border="subtle">
                                    <Icon icon={Search} size="lg" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                                </Surface>
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Font
                                        variant="h3"
                                        weight="black"
                                        uppercase
                                        italic
                                        align="center"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                        }}>Nenhum rastro encontrado</Font>
                                    <Font
                                        variant="sub-tiny"
                                        weight="black"
                                        uppercase
                                        tracking="widest"
                                        align="center"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.DIM,
                                        }}>
                                        Não encontramos treinadores com esses critérios.
                                    </Font>
                                </Stack>
                            </Stack>
                        </Surface>
                    )}
                </Stack>
            </RegistrySection>
        </Stack>
    );
}
