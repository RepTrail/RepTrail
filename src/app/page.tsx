import { HeroSection } from '@/components/landing/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { TrainerFeatures } from '@/components/landing/trainer-features'
import { StudentFeatures } from '@/components/landing/student-features'
import { VideoShowcase } from '@/components/landing/video-showcase'
import { MarketplaceSection } from '@/components/landing/marketplace-section'
import { DifferentialsSection } from '@/components/landing/differentials-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { GuaranteeSection } from '@/components/landing/guarantee-section'
import { FAQSection } from '@/components/landing/faq-section'
import { AuthoritySection } from '@/components/landing/authority-section'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { AffiliateTracker } from '@/components/landing/affiliate-tracker'
import { createClient } from '@/lib/supabase/server'

import { CTASection } from '@/components/landing/cta-section'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const trainers = await getTrainerRanking()
  const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let role = null
  let isAffiliate = false

  if (user) {
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    role = userData?.role

    const { count } = await supabase.from('affiliates').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
    isAffiliate = Boolean(count && count > 0)
  }

  const dashboardUrl = role === 'admin' ? '/admin' :
    role === 'trainer' ? '/dashboard/trainer' :
      '/dashboard/student'

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500/30" suppressHydrationWarning>
      <AffiliateTracker />
      <header className="h-20 flex items-center border-b border-zinc-900/50 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/80 supports-[backdrop-filter]:bg-zinc-950/60">
        {/* Header */}
        <div className="container mx-auto flex items-center justify-between px-5 sm:px-6 md:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="md" className="group-hover:scale-105 transition-transform" />
          </Link>

          <nav className="hidden md:flex gap-6 items-center">
            {!user ? (
              <>
                <Link href="/auth/login" className="text-xs font-black text-zinc-400 hover:text-orange-500 uppercase tracking-[0.2em] transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs px-6 h-10 transition-all hover:scale-105 active:scale-95 leading-none">
                    Começar Agora
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" className="text-xs font-black text-zinc-400 hover:text-white uppercase tracking-widest hover:bg-zinc-900">
                      Admin
                    </Button>
                  </Link>
                )}

                {isAffiliate && (
                  <Link href="/afiliados/login">
                    <Button variant="ghost" className="text-xs font-black text-orange-500/80 hover:text-orange-500 uppercase tracking-widest hover:bg-orange-500/10">
                      Painel Afiliado
                    </Button>
                  </Link>
                )}

                <Link href={dashboardUrl}>
                  <Button className="bg-emerald-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs px-6 h-10 transition-all hover:scale-105 active:scale-95">
                    Acessar Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Login/Dashboard Link */}
          <div className="md:hidden flex items-center gap-3">
            {!user ? (
              <Link href="/auth/login" className="text-[10px] font-black text-zinc-400 hover:text-orange-500 uppercase tracking-[0.2em] transition-colors bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 select-none active:scale-95 transition-all">
                Login
              </Link>
            ) : (
              <>
                {role === 'admin' && (
                  <Link href="/admin" className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-400">
                    <span className="text-[10px] font-black uppercase">Adm</span>
                  </Link>
                )}
                {isAffiliate && (
                  <Link href="/afiliados/login" className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500">
                    <span className="text-[10px] font-black uppercase">Afiliado</span>
                  </Link>
                )}
                <Link href={dashboardUrl} className="text-[10px] font-black text-zinc-950 bg-emerald-500 uppercase tracking-widest transition-colors px-4 py-2 rounded-xl border border-orange-400 select-none active:scale-95 transition-all">
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Urgency Banner */}
        <div className="bg-emerald-500 py-2  text-center">
          <p className="text-[10px] md:text-xs font-black uppercase italic tracking-widest text-zinc-950 leading-none">
            ⚡️ Implementação assistida: Restam apenas <span className="underline">4 vagas</span> para este mês. ⚡️
          </p>
        </div>
        <HeroSection />
        <VideoShowcase />
        <AboutSection />
        <AuthoritySection />
        <SocialProofSection />
        <TrainerFeatures />
        <DifferentialsSection />
        <GuaranteeSection />
        <FAQSection />
        <CTASection />
      </main>

      <footer className="py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto  flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
          <Link href="/" className="opacity-50 hover:opacity-100 transition-opacity block">
            <Logo size="md" />
          </Link>
          <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest text-center order-3 md:order-2">
            © 2026 RepTrail Inc. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-6 order-2 md:order-3">
            <Link href="/afiliados/login" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors" suppressHydrationWarning>Sou afiliado</Link>
            <Link href="/afiliados" className="text-[10px] font-bold text-orange-500/60 uppercase tracking-widest hover:text-orange-500 transition-colors" suppressHydrationWarning>Quero me tornar afiliado</Link>
            <Link href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Termos</Link>
            <Link href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
