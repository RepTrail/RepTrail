'use client'

import React from 'react'
import Link from 'next/link'
import { Box } from '@/components/store/base/box'
import { Main } from '@/components/store/base/main'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Logo } from '@/components/store/base/logo'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { GlassPanel } from '@/components/store/base/surface'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export interface LandingNavAction {
  label: string
  href: string
  variant?: 'ghost' | 'primary' | 'white' | 'outline-primary' | 'zinc' | 'outline-zinc'
  mobileOnly?: boolean
  desktopOnly?: boolean
}

export interface LandingFooterLink {
  label: string
  href: string
  isPrimary?: boolean
}

interface LandingShellProps {
  children: React.ReactNode
  /** Navigation actions in the header */
  navActions: LandingNavAction[]
  /** Optional urgency banner text above the header */
  urgencyBanner?: string
  /** Optional footer tagline text (defaults to copyright) */
  footerTagline?: string
  /** Footer links on the right side */
  footerLinks?: LandingFooterLink[]
}

/**
 * LandingShell: The master layout wrapper for all RepTrail landing pages.
 *
 * Responsibilities:
 * - Provides the background visual effects (grid + primary-color orbs) — same as dashboard
 * - Renders the sticky glassmorphism header with logo + navigation
 * - Renders the standardized GlassPanel footer
 * - Enforces consistent page-level structure across trainer / student / affiliate pages
 *
 * Architecture: Advanced component — no className, pure composition via store primitives.
 */
export function LandingShell({
  children,
  navActions,
  urgencyBanner,
  footerTagline = '© 2026 RepTrail Inc. Todos os direitos reservados.',
  footerLinks = [],
}: LandingShellProps) {
  const { primaryColor } = useRegistry()
  const desktopActions = navActions.filter(a => !a.mobileOnly)
  const mobileActions = navActions.filter(a => !a.desktopOnly)

  return (
    <Box
      display="flex"
      direction="col"
      minHeight="screen"
      bg={STORE_TOKENS.COLORS.BACKGROUND}
      bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
      width="full"
      as="div"
      position="relative"
      overflow="hidden"
    >
      {/* Background visual effects — same as dashboard main */}
      <BackgroundEffects variant="all" />
      {/* Optional urgency banner */}
      {urgencyBanner && (
        <Box
          bg={STORE_TOKENS.COLORS.BRAND}
          align="center"
          justify="center"
          width="full"
          position="relative"
          zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
          padding={STORE_TOKENS.PADDING.ELEMENT}
        >
          <Font variant="label-caps" color={STORE_TOKENS.COLORS.BLACK} align="center" tracking="widest">
            {urgencyBanner}
          </Font>
        </Box>
      )}
      {/* Sticky glassmorphism header */}
      <Box
        as="header"
        width="full"
        position="sticky"
        top={0}
        zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
      >
        <GlassPanel
          fullWidth
          rounded={STORE_TOKENS.RADIUS.NONE}
          border="subtle"
          backdropBlur="md"
          padding={STORE_TOKENS.PADDING.CONTAINER}
          display="flex"
          align="center"
          justify="center"
        >
          <Box
            width="full"
            maxWidth="landing"
            display="flex"
            align="center"
            justify="between"
          >
            {/* Logo */}
            <Link href="/">
              <Box as="span" display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} group cursor="pointer">
                <Box transition>
                  <Logo size="md" color={primaryColor as any} />
                </Box>
              </Box>
            </Link>

            {/* Desktop Navigation */}
            <Box as="nav" display={{ base: 'none', md: 'flex' }} align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
              {desktopActions.map((action, i) => (
                <Button
                  key={i}
                  asChild
                  variant={action.variant ?? 'ghost'}
                  size="md"
                  activeScale={95}
                >
                  <Link href={action.href}>
                    {action.label}
                  </Link>
                </Button>
              ))}
            </Box>

            {/* Mobile Navigation */}
            <Box display={{ base: 'flex', md: 'none' }} align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
              {mobileActions.map((action, i) => (
                <Button
                  key={i}
                  asChild
                  variant={action.variant ?? 'primary'}
                  size="md"
                  activeScale={95}
                >
                  <Link href={action.href}>
                    {action.label}
                  </Link>
                </Button>
              ))}
            </Box>
          </Box>
        </GlassPanel>
      </Box>
      {/* Main content area */}
      <Main
        flex1
        width="full"
        position="relative"
        zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
        display="flex"
        direction="col"
        gap={STORE_TOKENS.SPACING.SECTION}
        paddingY={{ base: STORE_TOKENS.PADDING.EMPTY_STATE, md: STORE_TOKENS.PADDING.SECTION }}
        paddingX={{ base: STORE_TOKENS.PADDING.CONTAINER, md: STORE_TOKENS.PADDING.NONE }}
      >
        {children}
      </Main>
      {/* Standardized GlassPanel footer */}
      <Box as="footer" width="full" position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
        <GlassPanel
          fullWidth
          rounded={STORE_TOKENS.RADIUS.NONE}
          border="subtle"
          backdropBlur="md"
          padding={STORE_TOKENS.PADDING.CONTAINER}
          display="flex"
          align="center"
          justify="center"
        >
          <Box
            width="full"
            maxWidth="landing"
            display="flex"
            direction={{ base: 'col', md: 'row' }}
            align="center"
            justify="between"
            gap={STORE_TOKENS.SPACING.CONTAINER}
          >
            {/* Logo */}
            <Link href="/">
              <Box as="span" cursor="pointer" shrink={0}>
                <Logo size="md" color={primaryColor as any} />
              </Box>
            </Link>

            {/* Copyright tagline */}
            <Font variant="label-caps" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
              {footerTagline}
            </Font>

            {/* Footer links */}
            {footerLinks.length > 0 && (
              <Box
                display="flex"
                direction="row"
                wrap="nowrap"
                justify="center"
                align="center"
                shrink={0}
                gap={STORE_TOKENS.SPACING.CONTAINER}
              >
                {footerLinks.map((link, i) => (
                  <Link key={i} href={link.href}>
                    <Font
                      variant="label-caps"
                      color={STORE_TOKENS.COLORS.TEXT.SECONDARY}
                      cursor="pointer"
                    >
                      {link.label}
                    </Font>
                  </Link>
                ))}
              </Box>
            )}
          </Box>
        </GlassPanel>
      </Box>
    </Box>
  );
}
