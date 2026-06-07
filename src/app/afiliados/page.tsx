import React from 'react'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { getPublicPlanPricing } from '@/actions/trainer-actions'
import { LandingShell } from '@/components/store/advanced/landing-shell'

// Landing Page Sections
import { AffiliateTracker } from '@/components/store/sections/landing/landing-affiliate-tracker'
import { LandingHero } from '@/components/store/sections/landing/landing-hero'
import { LandingFeatures } from '@/components/store/sections/landing/landing-features'
import { LandingSocialProof } from '@/components/store/sections/landing/landing-social-proof'
import { LandingAbout } from '@/components/store/sections/landing/landing-about'
import { LandingFAQ } from '@/components/store/sections/landing/landing-faq'
import { LandingCTA } from '@/components/store/sections/landing/landing-cta'

export const dynamic = 'force-dynamic'

export default async function AfiliadosPage() {
  const pricing = await getPublicPlanPricing()
  const freeLimit = pricing?.on_demand?.free_students_limit ?? 5
  return (
    <RegistryProvider defaultColor="amber">
      <LandingShell
        navActions={[
          { label: 'Login', href: '/afiliados/login', variant: 'outline-zinc' as const },
          { label: 'Começar agora', href: '/afiliados/cadastro', variant: 'outline-primary' as const, desktopOnly: true },
        ]}
        footerTagline="Comissão válida em todos os planos · Sem limite · Registrada automaticamente"
        footerLinks={[
          { label: 'Sou aluno', href: '/aluno' },
          { label: 'Sou personal', href: '/' },
          { label: 'Sou afiliado', href: '/afiliados/login' },
        ]}
      >
        <AffiliateTracker />
        <LandingHero role="affiliate" freeLimit={freeLimit} />
        <LandingFeatures role="affiliate" />
        <LandingSocialProof role="affiliate" />
        <LandingAbout role="affiliate" />
        <LandingFAQ role="affiliate" />
      </LandingShell>
    </RegistryProvider>
  )
}
