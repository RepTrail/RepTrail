'use client'

import React from 'react'
import Link from 'next/link'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { RatingModal } from '@/components/store/features(deprecated)/student-rating-modal'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { BaseAvatar } from '@/components/store/base/avatar'
import { GlassPanel } from '@/components/store/base/surface'
import { Button } from '@/components/store/base/button'
import {
    ShieldCheck, Star, MapPin, MessageCircle, Trophy,
    Dumbbell, Utensils, Activity, ArrowRight, Phone
} from 'lucide-react'

interface MeuPersonalSectionContentProps {
    trainer: any
    trainerRel: any
    existingReview?: any
}

export function MeuPersonalSectionContent({ trainer, trainerRel, existingReview }: MeuPersonalSectionContentProps) {
    return (
        <RegistrySection>
            <Stack gap={5}>
                {/* Perfil do Personal */}
                <GlassPanel padding={5} rounded="system">
                    <Stack direction={{ base: 'col', md: 'row' }} gap={5} align="center">
                        {/* Left: Avatar & Badge */}
                        <Stack gap={2.5} align="center">
                            <BaseAvatar
                                initials={trainer.full_name?.substring(0, 2).toUpperCase() || 'TR'}
                                src={trainer.avatar_url}
                                size="xxl"
                                variant="zinc"
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

                        {/* Right: Info details */}
                        <Stack gap={5} flex1 align={{ base: 'center', md: 'start' }} fullWidth>
                            <Stack gap={2.5} align={{ base: 'center', md: 'start' }}>
                                <Font variant="h2" color="PRIMARY">
                                    {trainer.full_name}
                                </Font>
                                <Stack direction="row" gap={2.5} wrap="wrap" justify={{ base: 'center', md: 'start' }}>
                                    {trainer.location && (
                                        <Stack direction="row" gap={2.5} align="center">
                                            <Icon icon={MapPin} size="sm" color="emerald" />
                                            <Font variant="sub-tiny" color="SECONDARY">
                                                {trainer.location}
                                            </Font>
                                        </Stack>
                                    )}
                                    {trainer.cref && (
                                        <Stack direction="row" gap={2.5} align="center">
                                            <Icon icon={ShieldCheck} size="sm" color="emerald" />
                                            <Font variant="sub-tiny" color="SECONDARY">
                                                CREF: {trainer.cref}
                                            </Font>
                                        </Stack>
                                    )}
                                    <Stack direction="row" gap={2.5} align="center">
                                        <Icon icon={Star} size="sm" color="amber" />
                                        <Font variant="sub-tiny" color="amber" weight="black">
                                            {Number(trainer.average_rating || 0).toFixed(1)}
                                        </Font>
                                        {trainer.total_reviews > 0 && (
                                            <Font variant="sub-tiny" color="MUTED">
                                                ({trainer.total_reviews} avaliações)
                                            </Font>
                                        )}
                                    </Stack>
                                </Stack>
                            </Stack>

                            {trainer.bio && (
                                <Font variant="body-sm" color="SECONDARY">
                                    {trainer.bio}
                                </Font>
                            )}

                            {trainer.specialty && (
                                <Badge
                                    label={trainer.specialty.toUpperCase()}
                                    variant="glass"
                                    color="primary"
                                    size="xs"
                                />
                            )}

                            {/* CTAs */}
                            <Stack direction={{ base: 'col', md: 'row' }} gap={2.5} fullWidth>
                                {trainer.whatsapp ? (
                                    <Box fullWidth={{ base: true, md: false }} display="block">
                                        <Link
                                            href={`https://wa.me/${trainer.whatsapp?.replace(/\D/g, '')}?text=Olá ${trainer.full_name}, tenho uma dúvida sobre meu treino!`}
                                            target="_blank"
                                            style={{ display: 'block', width: '100%' }}
                                        >
                                            <Button variant="outline-primary" size="sm" fullWidth>
                                                <Stack direction="row" align="center" justify="center" gap={2.5}>
                                                    <Icon icon={MessageCircle} size="sm" />
                                                    Falar no WhatsApp
                                                </Stack>
                                            </Button>
                                        </Link>
                                    </Box>
                                ) : (
                                    <Button disabled variant="outline-zinc" size="sm" fullWidth={{ base: true, md: false }}>
                                        <Stack direction="row" align="center" justify="center" gap={2.5}>
                                            <Icon icon={Phone} size="sm" />
                                            Contato Indisponível
                                        </Stack>
                                    </Button>
                                )}

                                {trainer.trainer_code ? (
                                    <Box fullWidth={{ base: true, md: false }} display="block">
                                        <Link href={`/personal/${trainer.trainer_code.toUpperCase().trim()}`} style={{ display: 'block', width: '100%' }}>
                                            <Button variant="outline-zinc" size="sm" fullWidth>
                                                <Stack direction="row" align="center" justify="center" gap={2.5}>
                                                    Ver Perfil Completo
                                                    <Icon icon={ArrowRight} size="xs" />
                                                </Stack>
                                            </Button>
                                        </Link>
                                    </Box>
                                ) : (
                                    <Button disabled variant="outline-zinc" size="sm" fullWidth={{ base: true, md: false }}>
                                        Perfil Indisponível
                                    </Button>
                                )}

                                <Box fullWidth={{ base: true, md: false }} display="block">
                                    <RatingModal
                                        trainerId={trainer.id}
                                        trainerName={trainer.full_name}
                                        initialRating={existingReview?.rating}
                                        initialComment={existingReview?.comment}
                                        trigger={
                                            <Button variant="outline-zinc" size="sm" fullWidth>
                                                <Stack direction="row" align="center" justify="center" gap={2.5}>
                                                    {existingReview ? 'Editar Avaliação' : 'Avaliar Treinador'}
                                                    <Icon icon={Star} size="xs" color="amber" />
                                                </Stack>
                                            </Button>
                                        }
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                    </Stack>
                </GlassPanel>

                {/* Quick Links Grid */}
                <Grid gap={STORE_TOKENS.SPACING.CONTAINER} cols={{ base: 1, md: 3 }}>
                    <Box width="full">
                        <Link href="/dashboard/student/workouts" style={{ display: 'block', width: '100%' }}>
                            <GlassPanel padding={5} rounded="system" cursor="pointer" transition>
                                <Stack gap={5}>
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Box padding={2.5} rounded="system" bg="primary" bgOpacity={10} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Dumbbell} size="md" color="primary" />
                                        </Box>
                                        <Stack gap={0}>
                                            <Font variant="label-caps" color="SECONDARY">Treinos</Font>
                                            <Font variant="h4" color="PRIMARY">Meus Treinos</Font>
                                        </Stack>
                                    </Stack>
                                    
                                    <Button variant="outline-primary" fullWidth size="sm">
                                        Acessar Treinos
                                    </Button>
                                </Stack>
                            </GlassPanel>
                        </Link>
                    </Box>

                    <Box width="full">
                        <Link href="/dashboard/student/diet" style={{ display: 'block', width: '100%' }}>
                            <GlassPanel padding={5} rounded="system" cursor="pointer" transition>
                                <Stack gap={5}>
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Box padding={2.5} rounded="system" bg="amber" bgOpacity={10} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Utensils} size="md" color="amber" />
                                        </Box>
                                        <Stack gap={0}>
                                            <Font variant="label-caps" color="SECONDARY">Dieta</Font>
                                            <Font variant="h4" color="PRIMARY">Minha Dieta</Font>
                                        </Stack>
                                    </Stack>
                                    
                                    <Button variant="outline-amber" fullWidth size="sm">
                                        Ver Alimentação
                                    </Button>
                                </Stack>
                            </GlassPanel>
                        </Link>
                    </Box>

                    <Box width="full">
                        <Link href="/dashboard/student/cardio" style={{ display: 'block', width: '100%' }}>
                            <GlassPanel padding={5} rounded="system" cursor="pointer" transition>
                                <Stack gap={5}>
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Box padding={2.5} rounded="system" bg="blue" bgOpacity={10} width="10" height="10" display="flex" align="center" justify="center">
                                            <Icon icon={Activity} size="md" color="blue" />
                                        </Box>
                                        <Stack gap={0}>
                                            <Font variant="label-caps" color="SECONDARY">Cardio</Font>
                                            <Font variant="h4" color="PRIMARY">Meus Cardios</Font>
                                        </Stack>
                                    </Stack>
                                    
                                    <Button variant="outline-blue" fullWidth size="sm">
                                        Iniciar Cardio
                                    </Button>
                                </Stack>
                            </GlassPanel>
                        </Link>
                    </Box>
                </Grid>

                {/* Contract Info */}
                {(trainerRel.monthly_fee || trainerRel.payment_day) && (
                    <Grid gap={5} cols={{ base: 1, md: 2 }}>
                        {trainerRel.monthly_fee && (
                            <GlassPanel padding={5} rounded="system">
                                <Stack gap={0}>
                                    <Font variant="label-caps" color="SECONDARY">MENSALIDADE</Font>
                                    <Font variant="h2" color="PRIMARY">R$ {Number(trainerRel.monthly_fee).toFixed(2)}</Font>
                                </Stack>
                            </GlassPanel>
                        )}
                        {trainerRel.payment_day && (
                            <GlassPanel padding={5} rounded="system">
                                <Stack gap={0}>
                                    <Font variant="label-caps" color="SECONDARY">VENCIMENTO</Font>
                                    <Font variant="h2" color="PRIMARY">Dia {trainerRel.payment_day}</Font>
                                </Stack>
                            </GlassPanel>
                        )}
                    </Grid>
                )}
            </Stack>
        </RegistrySection>
    )
}
