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
import { Img } from '@/components/store/base/img'
import { Grid } from '@/components/store/base/grid'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { ShareTransformation } from '@/components/store/advanced/student-share-transformation'

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
                    gap="container"
                    fullWidth
                    position="relative"
                    zIndex={10}
                >
                    {/* Left: Avatar + Identity Stack */}
                    <Box
                        display="flex"
                        direction={{ base: 'col', md: 'row' }}
                        align="center"
                        gap="container"
                    >
                        {/* Avatar & Elite Badge */}
                        <Stack gap="element" align="center">
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
                                    color="amber"
                                    size="xs"
                                />
                            )}
                        </Stack>

                        {/* Identity Info */}
                        <Stack gap="element" align={{ base: 'center', md: 'start' }}>
                            <Font variant="h1" align={{ base: 'center', md: 'left' }} weight="black" italic uppercase color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                {trainer.full_name}
                            </Font>

                            <Stack direction="row" gap="element" wrap="wrap" justify={{ base: 'center', md: 'start' }}>
                                {trainer.location && (
                                    <Stack direction="row" gap="element" align="center">
                                        <Icon icon={MapPin} size="sm" color="emerald" />
                                        <Font variant="sub-tiny" color="SECONDARY">
                                            {trainer.location}
                                        </Font>
                                    </Stack>
                                )}
                                {trainer.cref && (
                                    <Stack direction="row" gap="element" align="center">
                                        <Icon icon={ShieldCheck} size="sm" color="emerald" />
                                        <Font variant="sub-tiny" color="SECONDARY">
                                            CREF: {trainer.cref}
                                        </Font>
                                    </Stack>
                                )}
                                <Stack direction="row" gap="element" align="center">
                                    <Icon icon={Star} size="sm" color="amber" />
                                    <Font variant="sub-tiny" color="amber" weight="black">
                                        {Number(trainer.average_rating || 0).toFixed(1)} Rating
                                    </Font>
                                </Stack>
                            </Stack>

                            {trainer.specialty && (
                                <Badge
                                    label={trainer.specialty.toUpperCase()}
                                    variant="glass"
                                    color="primary"
                                    size="xs"
                                />
                            )}

                            <Box display="flex" direction={{ base: 'col', sm: 'row' }} gap="element" fullWidth={{ base: true, sm: false }}>
                                <Box fullWidth={{ base: true, sm: false }}>
                                    {trainer.whatsapp ? (
                                        <Link
                                            href={`https://wa.me/${trainer.whatsapp?.replace(/\D/g, '')}?text=Olá ${trainer.full_name}, vi seu perfil no RepTrail e gostaria de saber mais sobre sua consultoria!`}
                                            target="_blank"
                                        >
                                            <Button variant="outline-primary" size="sm" fullWidth>
                                                <Stack direction="row" align="center" justify="center" gap="element">
                                                    <Icon icon={MessageCircle} size="sm" />
                                                    Contratar Agora
                                                </Stack>
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button disabled variant="outline-zinc" size="sm" fullWidth>
                                            <Stack direction="row" align="center" justify="center" gap="element">
                                                <Icon icon={Phone} size="sm" />
                                                Agenda Fechada
                                            </Stack>
                                        </Button>
                                    )}
                                </Box>

                                {trainer.instagram && (
                                    <Box fullWidth={{ base: true, sm: false }}>
                                        <Link
                                            href={`https://instagram.com/${trainer.instagram.replace(/^@/, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline-zinc" size="sm" fullWidth>
                                                <Stack direction="row" align="center" justify="center" gap="element">
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
                        gap="container"
                        justify={{ base: 'center', md: 'end' }}
                        width={{ base: 'full', lg: 'auto' }}
                    >
                        {/* Tab Switcher Stack */}
                        <Stack gap="element" width={{ base: 'full', md: 'auto' }} flex1>
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
                {activeTab === 'about' && (
                    <Stack gap="section" fullWidth>
                        {/* Biography Section */}
                        <RegistrySection
                            title="Biografia & Metodologia"
                            icon={ShieldCheck}
                            subtitle="Conheça a trajetória profissional e a abordagem metodológica do seu coach."
                        >
                            <GlassPanel padding="container">
                                <Font variant="body-sm" color="SECONDARY">
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
                            <Grid cols={{ base: 1, md: 3 }} gap="container">
                                {/* Card 1 */}
                                <GlassPanel padding="container">
                                    <Stack gap="element">
                                        <Box padding="element" rounded="system" bg="primary" bgOpacity={10} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Users} size="md" color="primary" />
                                        </Box>
                                        <Stack gap="none">
                                            <Font variant="h4" color="PRIMARY" weight="black" uppercase italic>Transformações</Font>
                                            <Font variant="description" color="SECONDARY">Alunos que mudaram de vida.</Font>
                                        </Stack>
                                    </Stack>
                                </GlassPanel>

                                {/* Card 2 */}
                                <GlassPanel padding="container">
                                    <Stack gap="element">
                                        <Box padding="element" rounded="system" bg="orange" bgOpacity={10} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Dumbbell} size="md" color="orange" />
                                        </Box>
                                        <Stack gap="none">
                                            <Font variant="h4" color="PRIMARY" weight="black" uppercase italic>Metodologia</Font>
                                            <Font variant="description" color="SECONDARY">Treinos periodizados com foco na evolução.</Font>
                                        </Stack>
                                    </Stack>
                                </GlassPanel>

                                {/* Card 3 */}
                                <GlassPanel padding="container">
                                    <Stack gap="element">
                                        <Box padding="element" rounded="system" bg="primary" bgOpacity={10} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Activity} size="md" color="primary" />
                                        </Box>
                                        <Stack gap="none">
                                            <Font variant="h4" color="PRIMARY" weight="black" uppercase italic>Suporte Total</Font>
                                            <Font variant="description" color="SECONDARY">Acompanhamento próximo e constante.</Font>
                                        </Stack>
                                    </Stack>
                                </GlassPanel>
                            </Grid>
                        </RegistrySection>

                        {/* Instagram Promotion Card */}
                        {trainer.instagram && (
                            <GlassPanel padding="container" position="relative" overflow="hidden">
                                <BackgroundIcon icon={Instagram} />
                                <Box
                                    display="flex"
                                    direction={{ base: 'col', md: 'row' }}
                                    align="center"
                                    justify="between"
                                    gap="container"
                                    position="relative"
                                    zIndex={10}
                                >
                                    <Stack gap="element">
                                        <Font variant="h3" weight="black" uppercase italic color="PRIMARY">
                                            Acompanhe no Instagram
                                        </Font>
                                        <Font variant="description" color="SECONDARY">
                                            Veja mais transformações e conteúdo exclusivo
                                        </Font>
                                    </Stack>
                                    <Link
                                        href={`https://instagram.com/${trainer.instagram.replace(/^@/, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline-primary" size="sm">
                                            <Stack direction="row" align="center" gap="element">
                                                Seguir
                                                <Icon icon={ExternalLink} size="xs" />
                                            </Stack>
                                        </Button>
                                    </Link>
                                </Box>
                            </GlassPanel>
                        )}
                    </Stack>
                )}

                {activeTab === 'results' && (
                    <RegistrySection
                        title="Transformações Reais"
                        icon={Trophy}
                        subtitle="Galeria de evolução corporal com resultados práticos compartilhados pelos alunos."
                    >
                        {photoPairs && photoPairs.length > 0 ? (
                            <Grid cols={{ base: 1, md: 2 }} gap="container">
                                {photoPairs.map((pair, idx) => {
                                    const oldUrl = pair.oldest.front_url || pair.oldest.back_url || pair.oldest.side_right_url || pair.oldest.side_left_url
                                    const newUrl = pair.newest.front_url || pair.newest.back_url || pair.newest.side_right_url || pair.newest.side_left_url
                                    if (!oldUrl || !newUrl) return null
                                    return (
                                        <GlassPanel key={`${pair.studentName}-${idx}`} padding="container">
                                            <Stack gap="element" fullWidth>
                                                <Font variant="h4" weight="black" uppercase italic color="PRIMARY">
                                                    {pair.studentName}
                                                </Font>
                                                <Grid cols={2} gap="element">
                                                    {/* Before Photo */}
                                                    <Box
                                                        position="relative"
                                                        rounded="system"
                                                        overflow="hidden"
                                                        bg="zinc"
                                                        bgOpacity={90}
                                                        aspectRatio="3/4"
                                                    >
                                                        <Img
                                                            src={oldUrl}
                                                            alt="Início"
                                                            fullWidth
                                                            fullHeight
                                                            objectFit="cover"
                                                            rounded="system"
                                                        />
                                                        <Box position="absolute" top={2.5} left={2.5}>
                                                            <Badge label="Início" color="orange" variant="solid" size="xs" />
                                                        </Box>
                                                    </Box>

                                                    {/* Today Photo */}
                                                    <Box
                                                        position="relative"
                                                        rounded="system"
                                                        overflow="hidden"
                                                        bg="zinc"
                                                        bgOpacity={90}
                                                        aspectRatio="3/4"
                                                        border={true}
                                                        borderColor="primary"
                                                        borderOpacity={20}
                                                    >
                                                        <Img
                                                            src={newUrl}
                                                            alt="Hoje"
                                                            fullWidth
                                                            fullHeight
                                                            objectFit="cover"
                                                            rounded="system"
                                                        />
                                                        <Box position="absolute" top={2.5} left={2.5}>
                                                            <Badge label="Hoje" color="emerald" variant="solid" size="xs" />
                                                        </Box>
                                                    </Box>
                                                </Grid>

                                                {/* Share transformation trigger below the photos comparison, spanning full width */}
                                                {oldUrl && newUrl && (
                                                    <ShareTransformation
                                                        studentName={pair.studentName}
                                                        beforeUrl={oldUrl}
                                                        afterUrl={newUrl}
                                                        beforeDate={pair.oldest.created_at}
                                                        afterDate={pair.newest.created_at}
                                                        fullWidth={true}
                                                    />
                                                )}
                                            </Stack>
                                        </GlassPanel>
                                    )
                                })}
                            </Grid>
                        ) : (
                            <EmptyState
                                variant="zinc"
                                icon={ImageIcon}
                                title="Nenhum registro"
                                description="Nenhuma transformação de aluno registrada publicamente ainda."
                            />
                        )}
                    </RegistrySection>
                )}

                {activeTab === 'reviews' && (
                    <RegistrySection
                        title="Depoimentos de Alunos"
                        icon={Star}
                        subtitle="Avaliações, feedback e experiências de quem treina e evolui diariamente."
                    >
                        {reviews && reviews.length > 0 ? (
                            <Grid cols={{ base: 1, md: 2 }} gap="container">
                                {reviews.map((review) => (
                                    <GlassPanel key={review.id} padding="container">
                                        <Stack gap="element" fullWidth>
                                            <Box display="flex" align="center" justify="between" gap="element" fullWidth>
                                                <Inline gap="element" align="center">
                                                    <BaseAvatar
                                                        initials={review.student?.full_name?.substring(0, 2).toUpperCase() || 'A'}
                                                        src={review.student?.avatar_url || undefined}
                                                        size="md"
                                                        variant="zinc"
                                                    />
                                                    <Stack gap="none">
                                                        <Font variant="body" weight="black" uppercase italic color="PRIMARY">
                                                            {review.student?.full_name || 'Aluno'}
                                                        </Font>
                                                        <Font variant="sub-tiny" color="MUTED">
                                                            {new Date(review.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                                                        </Font>
                                                    </Stack>
                                                </Inline>
                                                <Icon icon={Quote} size="md" color="zinc-800" />
                                            </Box>
                                            
                                            <Inline gap="element">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Icon
                                                        key={star}
                                                        icon={Star}
                                                        size="xs"
                                                        color={star <= review.rating ? 'amber' : 'zinc-800'}
                                                    />
                                                ))}
                                            </Inline>

                                            {review.comment && (
                                                <Font variant="body-sm" color="SECONDARY" italic>
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
    )
}
