'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    ShieldCheck,
    Star,
    MapPin,
    Trophy,
    MessageCircle,
    Instagram,
    Quote,
    Image as ImageIcon,
    ExternalLink,
    Users,
    Dumbbell,
    Activity,
    Phone
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
import { Grid } from '@/components/store/base/grid'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { StudentPublicPhotos } from '@/components/store/advanced/student-public-photos'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Trainer {
    id: string
    full_name: string
    avatar_url: string | null
    cref: string | null
    bio: string | null
    specialty: string | null
    whatsapp: string | null
    instagram: string | null
    location: string | null
    is_elite: boolean
    average_rating: number
    total_reviews: number
}

interface TrainerPublicProfileMainProps {
    trainer: Trainer
    reviews: any[]
    photos: any[]
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
    { id: 'about', label: 'Sobre', icon: ShieldCheck },
    { id: 'results', label: 'Resultados', icon: Trophy },
    { id: 'reviews', label: 'Avaliações', icon: Star },
] as const

type TabId = typeof TABS[number]['id']

// ─── Component ────────────────────────────────────────────────────────────────

export function TrainerPublicProfileMain({
    trainer,
    reviews,
    photos,
}: TrainerPublicProfileMainProps) {
    const [activeTab, setActiveTab] = useState<TabId>('about')

    // Process photo pairs from the flattened list of photos
    let photoPairs: { studentName: string; oldest: any; newest: any }[] = []
    if (photos && photos.length > 0) {
        const byStudent = new Map<string, any[]>()
        for (const p of photos) {
            const sid = p.student_id
            if (!byStudent.has(sid)) byStudent.set(sid, [])
            byStudent.get(sid)!.push(p)
        }
        photoPairs = Array.from(byStudent.entries())
            .filter(([, arr]) => arr.length >= 2)
            .map(([studentId, arr]) => {
                const first = arr[0]
                const last = arr[arr.length - 1]
                const studentName = first.student_name || 'Aluno'
                return {
                    studentName,
                    oldest: first,
                    newest: last
                }
            })
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
            {/* ── Hero Card (Upgraded to Liquid Glass) ──────────────────── */}
            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
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
                    zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                >
                    {/* Left: Avatar + Identity Stack */}
                    <Box
                        display="flex"
                        direction={{ base: 'col', md: 'row' }}
                        align="center"
                        gap={STORE_TOKENS.SPACING.CONTAINER}
                        fullWidth
                    >
                        {/* Avatar & Elite Badge */}
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <BaseAvatar
                                initials={trainer.full_name?.substring(0, 2).toUpperCase() || 'TR'}
                                src={trainer.avatar_url || undefined}
                                size="xxl"
                                variant="primary"
                            />
                            {trainer.is_elite && (
                                <Badge
                                    label="Elite Trainer"
                                    variant="solid"
                                    color={STORE_TOKENS.COLORS.WARNING}
                                    size="xs"
                                />
                            )}
                        </Stack>

                        {/* Identity Info */}
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align={{ base: 'center', md: 'start' }} fullWidth>
                            <Font
                                variant="h1"
                                align={{ base: 'center', md: 'left' }}
                                weight="black"
                                italic
                                uppercase
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
                                {trainer.full_name}
                            </Font>

                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap" justify={{ base: 'center', md: 'start' }}>
                                {trainer.location && (
                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                        <Icon icon={MapPin} size="sm" color={STORE_TOKENS.COLORS.SUCCESS} />
                                        <Font
                                            variant="sub-tiny"
                                            {...{
                                                color: "SECONDARY",
                                            }}>
                                            {trainer.location}
                                        </Font>
                                    </Stack>
                                )}
                                {trainer.cref && (
                                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                        <Icon icon={ShieldCheck} size="sm" color={STORE_TOKENS.COLORS.SUCCESS} />
                                        <Font
                                            variant="sub-tiny"
                                            {...{
                                                color: "SECONDARY",
                                            }}>
                                            CREF: {trainer.cref}
                                        </Font>
                                    </Stack>
                                )}
                                <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={Star} size="sm" color={STORE_TOKENS.COLORS.WARNING} />
                                    <Font
                                        variant="sub-tiny"
                                        weight="black"
                                        {...{
                                            color: "amber",
                                        }}>
                                        {Number(trainer.average_rating || 0).toFixed(1)} Rating
                                    </Font>
                                </Stack>
                            </Stack>

                            {trainer.specialty && (
                                <Badge
                                    label={trainer.specialty.toUpperCase()}
                                    variant="glass"
                                    color={STORE_TOKENS.COLORS.BRAND}
                                    size="xs"
                                />
                            )}

                            <Box display="flex" direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                <Box flex1={{ base: false, md: true }} fullWidth display="flex">
                                    {trainer.whatsapp ? (
                                        <Link
                                            href={`https://wa.me/${trainer.whatsapp?.replace(/\D/g, '')}?text=Olá ${trainer.full_name}, vi seu perfil no RepTrail e gostaria de saber mais sobre sua consultoria!`}
                                            target="_blank"
                                        >
                                            <Button variant="outline-primary" size="sm" fullWidth>
                                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Icon icon={MessageCircle} size="sm" />
                                                    Contratar
                                                </Stack>
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled variant="outline-zinc" size="sm" fullWidth>
                                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                <Icon icon={Phone} size="sm" />
                                                Agenda Fechada
                                            </Stack>
                                        </Button>
                                    )}
                                </Box>

                                {trainer.instagram && (
                                    <Box flex1={{ base: false, md: true }} fullWidth display="flex">
                                        <Link
                                            href={`https://instagram.com/${trainer.instagram.replace(/^@/, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline-zinc" size="sm" fullWidth>
                                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                    <Icon icon={Instagram} size="sm" />
                                                    Instagram
                                                </Stack>
                                            </Button>
                                        </Link>
                                    </Box>
                                )}
                            </Box>
                        </Stack>
                    </Box>

                    {/* Right Side: Tab switcher */}
                    <Box
                        display="flex"
                        direction={{ base: 'col', md: 'row' }}
                        align="stretch"
                        gap={STORE_TOKENS.SPACING.CONTAINER}
                        justify={{ base: 'center', md: 'end' }}
                        width={{ base: 'full', lg: 'auto' }}
                    >
                        {/* Tab Switcher Stack */}
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} width={{ base: 'full', md: 'auto' }} flex1>
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id
                                return (
                                    <Button
                                        key={tab.id}
                                        variant={isActive ? 'outline-primary' : 'outline-zinc'}
                                        size="sm"
                                        onClick={() => setActiveTab(tab.id)}
                                        gap={STORE_TOKENS.SPACING.ELEMENT}
                                        fullWidth
                                        flex1={true}
                                        height="full"
                                    >
                                        <Icon icon={tab.icon} size="sm" color={isActive ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.TEXT.SECONDARY} />
                                        {tab.label}
                                    </Button>
                                );
                            })}
                        </Stack>
                    </Box>
                </Box>
            </GlassPanel>
            {/* ── Tab Content ───────────────────────────────── */}
            <Box fullWidth>
                {activeTab === 'about' && (
                    <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                        {/* Biography Section */}
                        <RegistrySection
                            title="Biografia & Metodologia"
                            icon={ShieldCheck}
                            subtitle="Conheça a trajetória profissional e a abordagem metodológica do seu coach."
                        >
                            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                                <Font
                                    variant="body-sm"
                                    {...{
                                        color: "SECONDARY",
                                    }}>
                                    {trainer.bio || "Treinador focado em resultados e alta performance. Especialista em ajudar alunos a atingirem seu potencial máximo."}
                                </Font>
                            </GlassPanel>
                        </RegistrySection>

                        {/* Differentials Cards Section */}
                        <RegistrySection
                            title="Diferenciais"
                            icon={Trophy}
                            subtitle="Os pilares fundamentais que estruturam o programa de acompanhamento físico."
                        >
                            <Grid cols={{ base: 1, md: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                {/* Card 1 */}
                                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.BRAND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Users} size="md" color={STORE_TOKENS.COLORS.BRAND} />
                                        </Box>
                                        <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                            <Font
                                                variant="h4"
                                                weight="black"
                                                uppercase
                                                italic
                                                {...{
                                                    color: "PRIMARY",
                                                }}>Transformações</Font>
                                            <Font
                                                variant="description"
                                                {...{
                                                    color: "SECONDARY",
                                                }}>Alunos que mudaram de vida.</Font>
                                        </Stack>
                                    </Stack>
                                </GlassPanel>

                                {/* Card 2 */}
                                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.BRAND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Dumbbell} size="md" color={STORE_TOKENS.COLORS.BRAND} />
                                        </Box>
                                        <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                            <Font
                                                variant="h4"
                                                weight="black"
                                                uppercase
                                                italic
                                                {...{
                                                    color: "PRIMARY",
                                                }}>Metodologia</Font>
                                            <Font
                                                variant="description"
                                                {...{
                                                    color: "SECONDARY",
                                                }}>Treinos periodizados com foco na evolução.</Font>
                                        </Stack>
                                    </Stack>
                                </GlassPanel>

                                {/* Card 3 */}
                                <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Box padding={STORE_TOKENS.PADDING.ELEMENT} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.BRAND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Activity} size="md" color={STORE_TOKENS.COLORS.BRAND} />
                                        </Box>
                                        <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                            <Font
                                                variant="h4"
                                                weight="black"
                                                uppercase
                                                italic
                                                {...{
                                                    color: "PRIMARY",
                                                }}>Suporte Total</Font>
                                            <Font
                                                variant="description"
                                                {...{
                                                    color: "SECONDARY",
                                                }}>Acompanhamento próximo e constante.</Font>
                                        </Stack>
                                    </Stack>
                                </GlassPanel>
                            </Grid>
                        </RegistrySection>

                        {/* Instagram Promotion Card */}
                        {trainer.instagram && (
                            <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} position="relative" overflow="hidden">
                                <BackgroundIcon icon={Instagram} />
                                <Box
                                    display="flex"
                                    direction={{ base: 'col', md: 'row' }}
                                    align="center"
                                    justify="between"
                                    gap={STORE_TOKENS.SPACING.CONTAINER}
                                    position="relative"
                                    zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                                >
                                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Font
                                            variant="h3"
                                            weight="black"
                                            uppercase
                                            italic
                                            {...{
                                                color: "PRIMARY",
                                            }}>
                                            Acompanhe no Instagram
                                        </Font>
                                        <Font
                                            variant="description"
                                            {...{
                                                color: "SECONDARY",
                                            }}>
                                            Veja mais transformações e conteúdo exclusivo
                                        </Font>
                                    </Stack>
                                    <Box fullWidth={{ base: true, md: false }} display="flex">
                                        <Link
                                            href={`https://instagram.com/${trainer.instagram.replace(/^@/, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline-primary" size="sm" fullWidth={{ base: true, md: false }}>
                                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                                    Seguir
                                                    <Icon icon={ExternalLink} size="xs" />
                                                </Stack>
                                            </Button>
                                        </Link>
                                    </Box>
                                </Box>
                            </GlassPanel>
                        )}
                    </Stack>
                )}

                {activeTab === 'results' && (
                    <Stack gap={STORE_TOKENS.SPACING.SECTION} fullWidth>
                        {photoPairs && photoPairs.length > 0 ? (
                            photoPairs.map((pair) => (
                                <StudentPublicPhotos
                                    key={pair.oldest.student_id}
                                    studentId={pair.oldest.student_id}
                                    isOwner={false}
                                    studentName={pair.studentName}
                                    photos={photos.filter((p: any) => p.student_id === pair.oldest.student_id)}
                                    isStudentView={false}
                                />
                            ))
                        ) : (
                            <RegistrySection
                                title="Transformações Reais"
                                icon={Trophy}
                                subtitle="Galeria de evolução corporal com resultados práticos compartilhados pelos alunos."
                            >
                                <EmptyState
                                    variant="zinc"
                                    icon={ImageIcon}
                                    title="Nenhum registro"
                                    description="Nenhuma transformação de aluno registrada publicamente ainda."
                                />
                            </RegistrySection>
                        )}
                    </Stack>
                )}

                {activeTab === 'reviews' && (
                    <RegistrySection
                        title="Depoimentos de Alunos"
                        icon={Star}
                        subtitle="Avaliações, feedback e experiências de quem treina e evolui diariamente."
                    >
                        {reviews && reviews.length > 0 ? (
                            <Grid cols={{ base: 1, md: 2 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                {reviews.map((review) => (
                                    <GlassPanel key={review.id} padding={STORE_TOKENS.PADDING.CONTAINER} position="relative" overflow="hidden">
                                        <BackgroundIcon icon={Quote} />
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                                            <Box display="flex" align="center" justify="between" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                                    <BaseAvatar
                                                        initials={review.student?.full_name?.substring(0, 2).toUpperCase() || 'A'}
                                                        src={review.student?.avatar_url || undefined}
                                                        size="md"
                                                        variant="zinc"
                                                    />
                                                    <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                                        <Font
                                                            variant="body"
                                                            weight="black"
                                                            uppercase
                                                            italic
                                                            {...{
                                                                color: "PRIMARY",
                                                            }}>
                                                            {review.student?.full_name || 'Aluno'}
                                                        </Font>
                                                        <Font
                                                            variant="sub-tiny"
                                                            {...{
                                                                color: "MUTED",
                                                            }}>
                                                            {new Date(review.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                                        </Font>
                                                    </Stack>
                                                </Inline>
                                            </Box>

                                            <Inline gap={STORE_TOKENS.SPACING.ELEMENT}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Icon
                                                        key={star}
                                                        icon={Star}
                                                        size="xs"
                                                        color={star <= review.rating ? STORE_TOKENS.COLORS.WARNING : STORE_TOKENS.COLORS.TEXT.MUTED}
                                                    />
                                                ))}
                                            </Inline>

                                            {review.comment && (
                                                <Font
                                                    variant="body-sm"
                                                    italic
                                                    {...{
                                                        color: "SECONDARY",
                                                    }}>
                                                    "{review.comment}"
                                                </Font>
                                            )}
                                        </Stack>
                                    </GlassPanel>
                                ))}
                            </Grid>
                        ) : (
                            <EmptyState
                                variant="zinc"
                                icon={Star}
                                title="Sem Avaliações"
                                description="Seja o primeiro aluno a avaliar este treinador após contratá-lo."
                            />
                        )}
                    </RegistrySection>
                )}
            </Box>
        </Stack>
    );
}
