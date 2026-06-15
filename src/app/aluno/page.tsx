import React from 'react'
import { RegistryProvider } from '@/components/store/base/registry-context'
import { getLandingSessionInfo } from '@/lib/dal/server'
import { getPublicPlanPricing, getTrainerRanking } from '@/actions/trainer-actions'
import { LandingShell } from '@/components/store/advanced/landing-shell'

// Landing Page Sections
import { AffiliateTracker } from '@/components/store/sections/landing/landing-affiliate-tracker'
import { LandingHero } from '@/components/store/sections/landing/landing-hero'
import { LandingVideoShowcase } from '@/components/store/sections/landing/landing-video-showcase'
import { LandingAbout } from '@/components/store/sections/landing/landing-about'
import { LandingFeatures } from '@/components/store/sections/landing/landing-features'
import { LandingSocialProof } from '@/components/store/sections/landing/landing-social-proof'
import { LandingBannerPromo } from '@/components/store/sections/landing/landing-banner-promo'
import { LandingMarketplace } from '@/components/store/sections/landing/landing-marketplace'
import { LandingFAQ } from '@/components/store/sections/landing/landing-faq'
import { LandingCTA } from '@/components/store/sections/landing/landing-cta'

export const dynamic = 'force-dynamic'

export default async function StudentLandingPage() {
  const [trainers, { user, role, dashboardUrl }, pricing] = await Promise.all([
    getTrainerRanking(),
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
    { label: 'Acessar Dashboard', href: dashboardUrl, variant: 'primary' as const, desktopOnly: true },
  ]

  const mobileNavActions = !user ? [
    { label: 'Começar', href: '/auth/signup', variant: 'primary' as const },
  ] : [
    { label: 'Dashboard', href: dashboardUrl, variant: 'primary' as const },
  ]

  return (
    <RegistryProvider defaultColor="orange">
      <LandingShell
        navActions={navActions}
        footerTagline="© 2026 RepTrail Inc. Todos os direitos reservados."
        footerLinks={[
          { label: 'Sou Personal', href: '/' },
          { label: 'Sou Afiliado', href: '/afiliados', isPrimary: true },
        ]}
      >
        <AffiliateTracker />
        <LandingHero role="student" freeLimit={freeLimit} />
        <LandingVideoShowcase />
        <LandingBannerPromo role="student" freeLimit={freeLimit} />
        <LandingFeatures role="student" />
        <LandingSocialProof role="student" />
        <LandingAbout role="student" />
        <LandingMarketplace initialTrainers={trainers} />
        <LandingFAQ role="student" />
      </LandingShell>
    </RegistryProvider>
  )
}
