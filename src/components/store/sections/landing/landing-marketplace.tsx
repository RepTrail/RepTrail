'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { Icon } from '@/components/store/base/icon'
import { BaseAvatar } from '@/components/store/base/avatar'
import { Badge } from '@/components/store/base/badge'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { LandingLeadModal } from './landing-lead-modal'
import { Search, Star, Trophy, Users, ShieldCheck, MessageCircle } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/advanced/landing-section'

interface Trainer {
  id: string
  full_name: string
  avatar_url: string
  plan_tier: string
  rating: number
  specialties?: string[]
  student_count?: number
  trainer_code?: string
}

interface MarketplaceSectionProps {
  initialTrainers: any[]
}

export function LandingMarketplace({ initialTrainers }: MarketplaceSectionProps) {
  const { primaryColor } = useRegistry()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredTrainers = initialTrainers.filter(trainer =>
    trainer.trainer_code && (
      trainer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.trainer_code?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleContact = (trainer: Trainer) => {
    setSelectedTrainer(trainer)
    setIsModalOpen(true)
  }

  const displayTrainers = searchTerm.trim() === ''
    ? filteredTrainers.slice(0, 3)
    : filteredTrainers

  return (
    <LandingSection id="marketplace">
      <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">
          
          {/* Header Stack */}
          <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER} textAlign="center" width={{ base: 'full', md: 'half' }} alignSelf="center">
            <Badge label="Marketplace Oficial RepTrail" icon={Users} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
            
            <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align="center">
              <span>Treine com os </span>
              <br className="hidden md:block" />
              <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                Melhores do Mercado.
              </Font>
            </Font>

            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
              Acesso exclusivo aos treinadores que estão moldando o futuro do fitness de alta performance.
            </Font>
          </Stack>

          {/* Search bar */}
          <Box width="full" maxWidth="sm" alignSelf="center">
            <Input
              placeholder="Buscar treinador por nome ou código..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              icon={<Icon icon={Search} size="md" color={STORE_TOKENS.COLORS.TEXT.MUTED} />}
              size="lg"
            />
          </Box>

          {/* Results Grid */}
          <Grid cols={1} smCols={2} lgCols={3} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
            {displayTrainers.slice(0, 12).map((trainer, index) => (
              <Box
                key={`${trainer.id}-${index}`}
                display="flex"
                direction="col"
                padding={STORE_TOKENS.PADDING.CONTAINER}
                gap={STORE_TOKENS.SPACING.CONTAINER}
                position="relative"
                bg={STORE_TOKENS.COLORS.BACKGROUND}
                bgOpacity={STORE_TOKENS.OPACITY.HIGH}
                border
                borderColor={STORE_TOKENS.COLORS.BACKGROUND}
                borderWidth={1}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                transition
                minHeight={280}
                justify="between"
              >
                {/* Top content: Avatar and Verify badge */}
                <Box display="flex" align="start" justify="between" width="full" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                  <BaseAvatar 
                    src={trainer.avatar_url} 
                    initials={trainer.full_name?.substring(0, 2).toUpperCase() || 'TR'} 
                    size="lg" 
                    variant="zinc" 
                  />

                  <Stack align="end" gap={STORE_TOKENS.SPACING.ELEMENT} shrink={0}>
                    <Box 
                      padding={STORE_TOKENS.PADDING.ELEMENT} 
                      rounded={STORE_TOKENS.RADIUS.SYSTEM}
                      bg={STORE_TOKENS.COLORS.BRAND}
                      bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                      border
                      borderColor={STORE_TOKENS.COLORS.BRAND}
                      borderOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                      display="flex"
                      align="center"
                      justify="center"
                      gap={STORE_TOKENS.SPACING.ELEMENT}
                    >
                      <Icon icon={ShieldCheck} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                      <Font variant="label-caps" color={STORE_TOKENS.COLORS.BRAND} italic>
                        Verificado
                      </Font>
                    </Box>

                    <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                      <Icon icon={Users} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                      <Font variant="tiny" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} weight="bold">
                        {trainer.student_count || (trainer.id.charCodeAt(0) % 50) + 10} alunos
                      </Font>
                    </Stack>
                  </Stack>
                </Box>

                {/* Middle content: Name and Specialties */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} zIndex={STORE_TOKENS.Z_INDEX.CONTENT} fullWidth overflow="hidden">
                  <Font variant="h4" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic truncate>
                    {trainer.full_name}
                  </Font>
                  <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} truncate>
                    {trainer.specialties?.[0] || 'Consultoria Online'}
                  </Font>
                </Stack>

                {/* Bottom details */}
                <Box 
                  display="flex" 
                  align="center" 
                  justify="between" 
                  width="full" 
                  zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                  border
                  borderColor={STORE_TOKENS.COLORS.BACKGROUND}
                  borderOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                  padding={STORE_TOKENS.PADDING.NONE}
                  gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                  <Box 
                    display="flex" 
                    align="center" 
                    gap={STORE_TOKENS.SPACING.ELEMENT} 
                    bg={STORE_TOKENS.COLORS.BACKGROUND} 
                    bgOpacity={STORE_TOKENS.OPACITY.MODAL} 
                    padding={STORE_TOKENS.PADDING.ELEMENT} 
                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                    border 
                    borderColor={STORE_TOKENS.COLORS.BACKGROUND} 
                    borderOpacity={STORE_TOKENS.OPACITY.HIGH}
                    overflow="hidden"
                  >
                    <Icon icon={Star} size="xs" color={STORE_TOKENS.COLORS.WARNING} />
                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="bold">
                      {trainer.rating ? trainer.rating.toFixed(1) : '5.0'}
                    </Font>
                  </Box>

                  <Box 
                    display="flex" 
                    align="center" 
                    gap={STORE_TOKENS.SPACING.ELEMENT} 
                    bg={STORE_TOKENS.COLORS.BACKGROUND} 
                    bgOpacity={STORE_TOKENS.OPACITY.MODAL} 
                    padding={STORE_TOKENS.PADDING.ELEMENT} 
                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                    border 
                    borderColor={STORE_TOKENS.COLORS.BACKGROUND} 
                    borderOpacity={STORE_TOKENS.OPACITY.HIGH}
                    overflow="hidden"
                    flex1
                  >
                    <Icon icon={Trophy} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                    <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="bold" truncate>
                      Top Personal
                    </Font>
                  </Box>
                </Box>

                {/* CTA button */}
                <Button
                  variant="primary"
                  size="md"
                  shine
                  fullWidth
                  onClick={() => handleContact(trainer)}
                >
                  <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={MessageCircle} size="xs" />
                    <span>Contatar</span>
                  </Stack>
                </Button>
              </Box>
            ))}
          </Grid>

          {/* Empty state search result */}
          {filteredTrainers.length === 0 && (
            <Box 
              padding={STORE_TOKENS.PADDING.EMPTY_STATE} 
              bg={STORE_TOKENS.COLORS.BACKGROUND} 
              bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
              border 
              borderColor={STORE_TOKENS.COLORS.BACKGROUND} 
              rounded={STORE_TOKENS.RADIUS.SYSTEM} 
              align="center" 
              justify="center"
            >
              <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} italic align="center">
                Nenhum treinador encontrado com este nome.
              </Font>
            </Box>
          )}

        </Stack>

      {/* Modal dialog trigger */}
      <LandingLeadModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        trainerName={selectedTrainer?.full_name}
        trainerCode={selectedTrainer?.trainer_code}
      />
    </LandingSection>
  )
}
