import React from 'react'
import { RegistryProvider } from '@/components/store/base/registry-context'
import { getLandingSessionInfo } from '@/lib/dal/server'
import { getPublicPlanPricing } from '@/actions/trainer-actions'
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
  const [{ user, role, isAffiliate, dashboardUrl }, pricing] = await Promise.all([
    getLandingSessionInfo(),
    getPublicPlanPricing()
  ])
  const onDemandPlan = pricing?.find((p: any) => p.slug === 'on_demand' || p.billing_type === 'on_demand')
  const feats = Array.isArray(onDemandPlan?.plan_features_dynamic) ? onDemandPlan.plan_features_dynamic[0] : onDemandPlan?.plan_features_dynamic
  const freeLimit = feats?.free_students_limit ?? 5

  const navActions = !user ? [
    { label: 'Login', href: '/auth/login', variant: 'outline-zinc' as const },
    { label: 'Começar Agora', href: '/auth/signup', variant: 'outline-primary' as const, desktopOnly: true },
  ] : [
    ...(role === 'admin' ? [{ label: 'Admin', href: '/admin', variant: 'ghost' as const, desktopOnly: true }] : []),
    ...(isAffiliate ? [{ label: 'Painel Afiliado', href: '/afiliados/login', variant: 'outline-primary' as const, desktopOnly: true }] : []),
    { label: 'Dashboard', href: dashboardUrl, variant: 'primary' as const },
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
        <LandingHero role="trainer" freeLimit={freeLimit} />
        <LandingVideoShowcase />
        <LandingAbout role="trainer" />
        <LandingAbout role="trainer-authority" />
        <LandingSocialProof role="trainer" />
        <LandingFeatures role="trainer" />
        <LandingAbout role="trainer-differentials" />
        <LandingBannerPromo role="trainer" freeLimit={freeLimit} />
        <LandingFAQ role="trainer" />
      </LandingShell>
    </RegistryProvider>
  )
}
