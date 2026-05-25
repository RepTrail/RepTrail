import { StudentHeroSection } from '@/components/landing/student-hero-section'
import { StudentAboutSection } from '@/components/landing/student-about-section'
import { AutoTreinoSection } from '@/components/landing/auto-treino-section'
import { StudentFeatures } from '@/components/landing/student-features'
import { VideoShowcase } from '@/components/landing/video-showcase'
import { MarketplaceSection } from '@/components/landing/marketplace-section'
import { StudentSocialProofSection } from '@/components/landing/student-social-proof-section'
import { StudentFAQSection } from '@/components/landing/student-faq-section'
import { Logo } from '@/components/store/base/logo'
import Link from 'next/link'
import { Button } from '@/components/store/base/button'
import { getTrainerRanking } from '@/actions/trainer-actions'
import { AffiliateTracker } from '@/components/landing/affiliate-tracker'
import { createClient } from '@/lib/supabase/server'
import { StudentCTASection } from '@/components/landing/student-cta-section'

export const dynamic = 'force-dynamic'

export default async function StudentLandingPage() {
  const trainers = await getTrainerRanking()
  const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  let role = null

  if (user) {
    const { data: userData } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    role = userData?.role
  }

  const dashboardUrl = role === 'admin' ? '/admin' :
    role === 'trainer' ? '/dashboard/trainer' :
      '/dashboard/student'

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500/30" suppressHydrationWarning>
      <AffiliateTracker />
      <header className="h-20 flex items-center border-b border-zinc-900/50 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/80 supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="container mx-auto flex items-center justify-between px-5 sm:px-6 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="group-hover:scale-105 transition-transform">
                <Logo size="md" />
              </div>
            </Link>
            
            {/* Navigation links removed to simplify header */}
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            {!user ? (
              <>
                <Link href="/auth/login" className="text-xs font-black text-zinc-400 hover:text-orange-500 uppercase tracking-[0.2em] transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup">
                  <Button variant="emerald" size="sm" hoverScale={105} activeScale={95}>
                    Começar Agora
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href={dashboardUrl}>
                  <Button variant="emerald" size="sm" hoverScale={105} activeScale={95}>
                    Acessar Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden flex items-center gap-3">
            {!user ? (
              <Link href="/auth/signup" className="text-[10px] font-black text-zinc-950 bg-emerald-500 uppercase tracking-widest px-4 py-2 rounded-xl border border-emerald-400 select-none active:scale-95 transition-all">
                Começar
              </Link>
            ) : (
              <Link href={dashboardUrl} className="text-[10px] font-black text-zinc-950 bg-emerald-500 uppercase tracking-widest px-4 py-2 rounded-xl border border-emerald-400 select-none active:scale-95 transition-all">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <StudentHeroSection />
        <VideoShowcase />
        <div id="auto-treino">
          <AutoTreinoSection />
        </div>
        <StudentFeatures />
        <StudentSocialProofSection />
        <StudentAboutSection />
        <MarketplaceSection initialTrainers={trainers} />
        <StudentFAQSection />
        <StudentCTASection />
      </main>

      <footer className="py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
          <Link href="/" className="opacity-50 hover:opacity-100 transition-opacity block">
            <Logo size="md" />
          </Link>
          <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest text-center order-3 md:order-2">
            © 2026 RepTrail Inc. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-6 order-2 md:order-3">
            <Link href="/" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Sou Personal</Link>
            <Link href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Termos</Link>
            <Link href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
