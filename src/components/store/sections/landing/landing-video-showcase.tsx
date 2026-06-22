'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { useRegistry } from '@/components/store/base/registry-context'
import { fbqEvent } from '@/lib/meta-pixel'
import { PlayCircle } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { LandingSection } from '@/components/store/intermediary/landing-section'
import { IphoneMockup } from '@/components/store/base/iphone-mockup'
import { YouTubePlayer } from '@/components/store/base/youtube-player'

const videos = [
  {
    videoId: 'B_4iuITMREk',
    title: 'Monitore o Progresso',
    desc: 'Acompanhe o progresso de seu aluno em uma visão moderna e intuitiva, identificando áreas de melhoria.'
  },
  {
    videoId: '91KoFgJICUc',
    title: 'Veja a Evolução',
    desc: 'Monitore a evolução real dos seus alunos com dados, fotos e métricas corporais precisas.'
  },
  {
    videoId: 'pSXoWjCMxv4',
    title: 'Conecte-se com Alunos',
    desc: 'Aumente a retenção através da conexão e motivação, criando uma comunidade engajada.'
  }
]

export function LandingVideoShowcase() {
  const { primaryColor: _primaryColor } = useRegistry()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fbqEvent('ViewContent', { content_name: 'Video Showcase Landing' })
  }, [])

  return (
    <LandingSection>
      <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth align="center">
          
          {/* Header Stack */}
          <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER} textAlign="center" width={{ base: 'full', md: 'half' }} alignSelf="center">
            <Badge label="RepTrail em Ação" icon={PlayCircle} color={STORE_TOKENS.COLORS.BRAND} variant="solid" />
            <Font variant="h2" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align="center">
              <Font variant="h2" display="inline">Tecnologia </Font>
              <Font variant="h2" color={STORE_TOKENS.COLORS.BRAND} uppercase italic display="inline">
                Imersiva.
              </Font>
            </Font>
            <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
              Veja na prática como a plataforma revoluciona a experiência de treino, engajamento e acompanhamento dos seus alunos.
            </Font>
          </Stack>

          {/* Carousel Wrapper */}
          <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            <Box 
              display="flex" 
              direction="row"
              gap={STORE_TOKENS.SPACING.SECTION}
              width="full"
              transition
              style={{ 
                transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 50}px))` 
              }}
            >
              {videos.map((vid, idx) => (
                <Box 
                  key={idx} 
                  display="flex"
                  direction="col"
                  gap={STORE_TOKENS.SPACING.CONTAINER}
                  align="center"
                  shrink={0}
                  width={{ base: 'full', md: 'auto' }}
                  flex1={{ base: false, md: true }}
                  transition
                >
                  <Box position="relative" display="flex" direction="col" align="center" gap={STORE_TOKENS.SPACING.CONTAINER} width="full">
                    <Box position="relative" width="full" maxWidth="sm" transition>
                      <IphoneMockup>
                        <YouTubePlayer videoId={vid.videoId} iframeClassName="w-[135%] h-[105%] max-w-none" />
                      </IphoneMockup>
                    </Box>   {/* Captions */}
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" textAlign="center" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
                      <Font variant="h4" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic>
                        {vid.title}
                      </Font>
                      <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                        {vid.desc}
                      </Font>
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Mobile Navigation Bullets */}
            <Box display={{ base: 'flex', md: 'none' }} align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
              {videos.map((_, idx) => (
                <Box
                  key={idx}
                  as="button"
                  onClick={() => setActiveIndex(idx)}
                  height={10}
                  rounded={STORE_TOKENS.RADIUS.FULL}
                  bg={activeIndex === idx ? STORE_TOKENS.COLORS.BRAND : STORE_TOKENS.COLORS.BACKGROUND}
                  bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
                  border={activeIndex !== idx}
                  borderColor={STORE_TOKENS.COLORS.BACKGROUND}
                  cursor="pointer"
                  width={activeIndex === idx ? '10' : '10'}
                />
              ))}
            </Box>
          </Stack>
        </Stack>
    </LandingSection>
  )
}
