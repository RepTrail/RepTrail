'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Button } from '../base/button'
import { BackgroundEffects } from '../base/background-effects'
import Link from 'next/link'
import { Logo } from '../base/logo'

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
      bg="zinc"
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
          variant="bigFont"
          weight="black"
          uppercase
          italic
          align="center"
          color="red"
          opacity={10}
        >
          404
        </Font>
      </Box>

      {/* ─── Layer 3: Conteúdo Sistêmico ────────────────────────────── */}
      <Stack align="center" gap={10} position="relative" zIndex={10}>
        <Logo color="red" />
        <Stack align="center" gap={2.5}>

          <Stack align="center" gap={1}>
            <Font
              variant="h1"
              weight="black"
              uppercase
              italic
              align="center"
              color="white"
            >
              Página não encontrada
            </Font>
            <Font variant="description" align="center" maxWidth="md">
              O protocolo de navegação foi interrompido por uma rota inexistente no ecossistema RepTrail.
            </Font>
          </Stack>
        </Stack>

        <Button asChild variant="outline-red" size="lg" padding={5} rounded="system">
          <Link href="/dashboard">
            Voltar ao painel
          </Link>
        </Button>
      </Stack>
    </Box>
  )
}
