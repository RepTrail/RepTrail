import { HeroSection } from '@/components/landing/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { TrainerFeatures } from '@/components/landing/trainer-features'
import { StudentFeatures } from '@/components/landing/student-features'
import { MarketplaceSection } from '@/components/landing/marketplace-section'
import { DifferentialsSection } from '@/components/landing/differentials-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { CTASection } from '@/components/landing/cta-section'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getTrainerRanking } from '@/actions/trainer-actions'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const trainers = await getTrainerRanking()

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Header */}
      <header className="h-20 flex items-center border-b border-zinc-900/50 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/80 supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo size="lg" className="group-hover:scale-105 transition-transform" />
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="#marketplace" className="text-xs font-black text-zinc-400 hover:text-emerald-500 uppercase tracking-[0.2em] transition-colors">
              Encontrar Personal
            </Link>
            <Link href="/auth/login" className="text-xs font-black text-zinc-400 hover:text-emerald-500 uppercase tracking-[0.2em] transition-colors">
              Login
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs px-6 h-10 shadow-lg shadow-white/5 transition-all hover:scale-105 active:scale-95">
                Criar Conta
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <TrainerFeatures />
        <StudentFeatures />
        <MarketplaceSection initialTrainers={trainers} />
        <DifferentialsSection />
        <SocialProofSection />
        <CTASection />
      </main>

      <footer className="py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="opacity-50 hover:opacity-100 transition-opacity">
            <Logo size="md" />
          </div>
          <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">
            © 2026 RepTrail Inc. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Termos</Link>
            <Link href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
