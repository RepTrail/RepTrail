import React from 'react'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { getLandingSessionInfo } from '@/lib/dal/server'
import { LandingShell } from '@/components/store/advanced/landing-shell'

// Landing Page Sections
import { AffiliateTracker } from '@/components/store/sections/landing/landing-affiliate-tracker'
import { LandingHero } from '@/components/store/sections/landing/landing-hero'
import { LandingVideoShowcase } from '@/components/store/sections/landing/landing-video-showcase'
import { LandingAbout } from '@/components/store/sections/landing/landing-about'
import { LandingFeatures } from '@/components/store/sections/landing/landing-features'
import { LandingSocialProof } from '@/components/store/sections/landing/landing-social-proof'
import { LandingBannerPromo } from '@/components/store/sections/landing/landing-banner-promo'
import { LandingFAQ } from '@/components/store/sections/landing/landing-faq'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const { user, role, isAffiliate, dashboardUrl } = await getLandingSessionInfo()

  const navActions = !user ? [
    { label: 'Login', href: '/auth/login', variant: 'outline-zinc' as const },
    { label: 'Começar Agora', href: '/auth/signup', variant: 'outline-primary' as const, desktopOnly: true },
  ] : [
    ...(role === 'admin' ? [{ label: 'Admin', href: '/admin', variant: 'ghost' as const, desktopOnly: true }] : []),
    ...(isAffiliate ? [{ label: 'Painel Afiliado', href: '/afiliados/login', variant: 'outline-primary' as const, desktopOnly: true }] : []),
    { label: 'Acessar Dashboard', href: dashboardUrl, variant: 'primary' as const, desktopOnly: true },
  ]

  const mobileNavActions = !user ? [
    { label: 'Login', href: '/auth/login', variant: 'zinc' as const },
  ] : [
    ...(role === 'admin' ? [{ label: 'Adm', href: '/admin', variant: 'outline-zinc' as const }] : []),
    ...(isAffiliate ? [{ label: 'Afiliado', href: '/afiliados/login', variant: 'outline-primary' as const }] : []),
    { label: 'Dashboard', href: dashboardUrl, variant: 'primary' as const },
  ]

  return (
    <RegistryProvider defaultColor="emerald">
      <LandingShell
        navActions={navActions}
        urgencyBanner="⚡️ Implementação assistida: Restam apenas 4 vagas para este mês. ⚡️"
        footerTagline="© 2026 RepTrail Inc. Todos os direitos reservados."
        footerLinks={[
          { label: 'Sou Aluno', href: '/aluno' },
          { label: 'Sou Afiliado', href: '/afiliados', isPrimary: true },
        ]}
      >
        <AffiliateTracker />
        <LandingHero role="trainer" />
        <LandingVideoShowcase />
        <LandingAbout role="trainer" />
        <LandingAbout role="trainer-authority" />
        <LandingSocialProof role="trainer" />
        <LandingFeatures role="trainer" />
        <LandingAbout role="trainer-differentials" />
        <LandingBannerPromo role="trainer" />
        <LandingFAQ role="trainer" />
      </LandingShell>
    </RegistryProvider>
  )
}
