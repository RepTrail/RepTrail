'use client'

import { Trophy, Star, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/store/base/surface"
import { BaseAvatar } from "@/components/store/base/avatar"
import { Button } from "@/components/store/base/button"
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Grid } from '@/components/store/base/grid'
import Link from 'next/link'
import { STORE_TOKENS } from "@/components/store/constants/tokens";

interface TrainerRanking {
    id: string
    full_name: string
    avatar_url?: string
    trainer_code?: string
    region?: string
    rating?: number
    studentCount: number
    score: number
}

export function PodiumCard({ trainer, rank }: { trainer: TrainerRanking, rank: number }) {
    return (
        <Card
            bg={STORE_TOKENS.COLORS.BACKGROUND}
            bgOpacity={STORE_TOKENS.OPACITY.SURFACE}
            border="subtle"
            shadow="xl"
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            overflow="hidden"
            transition
            group
            hoverBorder="orange"
            fullHeight
        >
            <Box
                position="absolute"
                top={0}
                right={0}
                padding={STORE_TOKENS.PADDING.CONTAINER}
                opacity={STORE_TOKENS.OPACITY.LOW}
                groupHoverOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                transition
            >
                <Icon
                    icon={Trophy}
                    size="100"
                    // eslint-disable-next-line no-restricted-syntax
                    color={rank === 2 ? STORE_TOKENS.COLORS.TEXT.SECONDARY : STORE_TOKENS.COLORS.BRAND}
                />
            </Box>
            <CardContent>
                <Stack align="center" justify="center" gap={STORE_TOKENS.SPACING.CONTAINER} position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT} fullWidth>
                    <Box position="relative">
                        <Box
                            position="absolute"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            opacity={STORE_TOKENS.OPACITY.SUBTLE}
                            groupHoverOpacity={STORE_TOKENS.OPACITY.HIGH}
                            transition
                        />
                        <BaseAvatar
                            src={trainer.avatar_url}
                            initials={trainer.full_name?.substring(0, 2).toUpperCase() || 'TR'}
                            size="xxl"
                            variant="orange"
                        />
                        <Box
                            position="absolute"
                            bottom={-8}
                            right={-8}
                            width={48}
                            height={48}
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            shadow="xl"
                            bg={STORE_TOKENS.COLORS.BACKGROUND}
                            bgOpacity={STORE_TOKENS.OPACITY.FULL}
                            border
                            borderColor={STORE_TOKENS.COLORS.BACKGROUND}
                            borderOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                            display="flex"
                            align="center"
                            justify="center"
                        >
                            <Font
                                variant="h3"
                                weight="black"
                                italic
                                uppercase
                                {...{
                                    color: rank === 2 ? 'zinc-400' : 'orange',
                                }}>
                                #{rank}
                            </Font>
                        </Box>
                    </Box>

                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" fullWidth>
                        <Stack gap={STORE_TOKENS.SPACING.NONE} align="center" fullWidth>
                            <Font
                                variant="h3"
                                weight="black"
                                italic
                                uppercase
                                tracking="tight"
                                lineClamp={1}
                                {...{
                                    color: "PRIMARY",
                                }}>
                                {trainer.full_name}
                            </Font>

                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.NONE}>
                                <Icon icon={MapPin} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                                <Font
                                    variant="label-caps"
                                    {...{
                                        color: "MUTED",
                                    }}>
                                    {trainer.region || 'Brasil'}
                                </Font>
                            </Stack>
                        </Stack>

                        <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Box
                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                bg={STORE_TOKENS.COLORS.BRAND}
                                bgOpacity={STORE_TOKENS.OPACITY.LOW}
                                border
                                borderColor={STORE_TOKENS.COLORS.BRAND}
                                borderOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            >
                                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.NONE}>
                                    <Icon icon={Star} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                                    <Font
                                        variant="sub-tiny"
                                        weight="black"
                                        {...{
                                            color: "orange",
                                        }}>
                                        {Number(trainer.rating || 0).toFixed(1)}
                                    </Font>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>

                    <Box width="full" height="px" bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} />

                    <Grid cols={2} gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                        <Stack gap={STORE_TOKENS.SPACING.NONE} align="start">
                            <Font
                                variant="tiny"
                                weight="bold"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: "DIM",
                                }}>Alunos</Font>
                            <Font
                                variant="h3"
                                weight="black"
                                italic
                                {...{
                                    color: "white",
                                }}>{trainer.studentCount}</Font>
                        </Stack>
                        <Stack gap={STORE_TOKENS.SPACING.NONE} align="end" textAlign="right">
                            <Font
                                variant="tiny"
                                weight="bold"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: "DIM",
                                }}>Impacto</Font>
                            <Font
                                variant="h3"
                                weight="black"
                                italic
                                {...{
                                    color: "orange",
                                }}>Score {Math.round(trainer.score / 10)}</Font>
                        </Stack>
                    </Grid>

                    {trainer.trainer_code ? (
                        <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`}>
                            <Button
                                variant="white"
                                size="lg"
                                fullWidth
                                paddingY={STORE_TOKENS.PADDING.CONTAINER}
                                gap={STORE_TOKENS.SPACING.ELEMENT}
                            >
                                Ver Perfil
                                <Icon icon={ArrowRight} size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            disabled
                            variant="zinc"
                            size="lg"
                            fullWidth
                            paddingY={STORE_TOKENS.PADDING.CONTAINER}
                        >
                            Sem código
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}

export function RankingRow({ trainer, rank }: { trainer: TrainerRanking, rank: number }) {
    return (
        <Box
            display="flex"
            align="center"
            padding={{ base: STORE_TOKENS.PADDING.ELEMENT, md: STORE_TOKENS.PADDING.CONTAINER }}
            hoverBg={STORE_TOKENS.COLORS.BACKGROUND}
            hoverBgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
            transition
            group
            fullWidth
        >
            <Box width={{ base: '10', md: '10' }} shrink={0}>
                <Font
                    variant="h3"
                    weight="black"
                    italic
                    {...{
                        color: "zinc-700",
                    }}>
                    #{rank}
                </Font>
            </Box>
            <Stack flex1 direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} minWidth={0}>
                <BaseAvatar
                    src={trainer.avatar_url}
                    initials={trainer.full_name?.substring(0, 2).toUpperCase() || 'TR'}
                    size="lg"
                    variant="zinc"
                />
                <Stack gap={STORE_TOKENS.SPACING.NONE} flex1 minWidth={0}>
                    <Font
                        variant={{ base: 'body', md: 'heading' }}
                        weight="black"
                        italic
                        uppercase
                        truncate
                        {...{
                            color: "white",
                        }}>
                        {trainer.full_name}
                    </Font>
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.NONE} wrap="wrap">
                        <Icon icon={Star} size="xs" color={STORE_TOKENS.COLORS.BRAND} opacity={STORE_TOKENS.OPACITY.MODAL} />
                        <Font
                            variant="tiny"
                            weight="black"
                            uppercase
                            tracking="widest"
                            {...{
                                color: "MUTED",
                            }}>
                            {Number(trainer.rating || 0).toFixed(1)} Rating
                        </Font>
                    </Stack>
                </Stack>
            </Stack>
            <Box display={{ base: 'none', md: 'flex' }} align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.NONE} align="center">
                    <Font
                        variant="tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "DIM",
                        }}>Alunos</Font>
                    <Font
                        variant="heading"
                        weight="black"
                        italic
                        {...{
                            color: "zinc-400",
                        }}>{trainer.studentCount}</Font>
                </Stack>
                {trainer.trainer_code ? (
                    <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`}>
                        <Button
                            variant="outline-zinc"
                            size="md"
                            gap={STORE_TOKENS.SPACING.ELEMENT}
                        >
                            Ver Perfil
                            <Icon icon={ArrowRight} size="xs" />
                        </Button>
                    </Link>
                ) : (
                    <Button
                        disabled
                        variant="outline-zinc"
                        size="md"
                    >
                        Sem código
                    </Button>
                )}
            </Box>
        </Box>
    );
}
