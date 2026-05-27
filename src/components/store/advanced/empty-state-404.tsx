'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import Link from 'next/link'
import { Logo } from '@/components/store/base/logo'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

/**
 * EmptyState404: Organismo premium para a rota 404 do RepTrail.
 * Nível: Advanced (Organismo).
 * Conformidade: 100% Zero-Manual-Styling (Regra 19).
 * - Sem classNames manuais.
 * - Efeitos visuais encapsulados no componente Base BackgroundEffects.
 * - Rhythm governado por tokens numéricos autorizados.
 */
export function EmptyState404() {
  return (
    <Box
      position="relative"
      fullWidth
      height="screen"
      display="flex"
      align="center"
      justify="center"
      overflow="hidden"
      bg={STORE_TOKENS.COLORS.BACKGROUND}
      zIndex={0}
    >
      {/* ─── Layer 1: Efeitos de Alta Fidelidade (Encapsulados) ───────── */}
      <BackgroundEffects variant="all" />
      {/* ─── Layer 2: bigFont (Identity Anchor) ─────────────────────── */}
      <Box
        position="absolute"
        display="flex"
        align="center"
        justify="center"
        top={150}
        zIndex={0}
      >
        <Font
          variant="massive"
          weight="black"
          italic
          align="center"
          opacity={STORE_TOKENS.OPACITY.SUBTLE}
          {...{
            color: STORE_TOKENS.COLORS.ERROR,
          }}>
          404
        </Font>
      </Box>
      {/* ─── Layer 3: Conteúdo Sistêmico ────────────────────────────── */}
      <Stack align="center" gap={STORE_TOKENS.SPACING.EMPTY_STATE} position="relative" zIndex={10}>
        <Logo color={STORE_TOKENS.COLORS.ERROR} />
        <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>

          <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Font
              variant="h1"
              weight="black"
              uppercase
              italic
              align="center"
              {...{
                color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
              }}>
              Página não encontrada
            </Font>
            <Font variant="description" align="center">
              O protocolo de navegação foi interrompido por uma rota inexistente no ecossistema RepTrail.
            </Font>
          </Stack>
        </Stack>

        <Button asChild variant="outline-red" size="lg" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
          <Link href="/dashboard">
            Voltar ao painel
          </Link>
        </Button>
      </Stack>
    </Box>
  );
}
