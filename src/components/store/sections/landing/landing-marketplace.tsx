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
import { RankingPodiumCard } from '@/components/store/intermediary/ranking-podium-card'
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
              Treine com os{' '}
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
          <Grid cols={1} mdCols={2} lgCols={3} gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
            {displayTrainers.slice(0, 12).map((trainer, index) => (
              <RankingPodiumCard 
                key={`${trainer.id}-${index}`}
                rank={index + 1}
                trainer={{
                  full_name: trainer.full_name,
                  avatar_url: trainer.avatar_url,
                  region: trainer.specialties?.[0] || 'CONSULTORIA',
                  rating: trainer.rating || 5.0,
                  studentCount: trainer.student_count || ((trainer.id.charCodeAt(0) % 50) + 10),
                  score: (trainer.student_count || ((trainer.id.charCodeAt(0) % 50) + 10)) * 12,
                  trainer_code: trainer.trainer_code
                }}
              />
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
