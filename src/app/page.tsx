import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Dumbbell, User, Users, Check, Star, Zap, Shield, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <header className="h-16 sm:h-20 flex items-center border-b border-zinc-800 backdrop-blur-sm sticky top-0 z-50 bg-zinc-950/80">
        <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Logo size="lg" />
            </Link>
          </div>
          <nav className="hidden sm:flex gap-6 items-center">
            <Link className="text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors" href="/auth/login">
              Entrar
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-full px-6 text-sm">
                Começar Agora
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-xl">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                A revolução dos treinos online
              </div>
              <div className="space-y-4 max-w-[900px]">
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
                  Treinos Interativos <br className="hidden md:block" /> e Vivos.
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl leading-relaxed">
                  Transforme PDFs estáticos em experiências digitais imersivas.
                  A plataforma definitiva para Personal Trainers de elite e alunos que buscam resultados reais.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/auth/signup">
                  <Button className="h-14 px-8 text-lg bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-xl w-full sm:w-auto shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
                    Criar Conta Grátis <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="h-14 px-8 text-lg border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:text-white font-bold rounded-xl w-full sm:w-auto backdrop-blur-sm">
                    Já sou membro
                  </Button>
                </Link>
              </div>

              {/* Trust/Social Proof */}
              <div className="pt-12 flex flex-col items-center gap-3 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Usado por atletas em</p>
                <div className="flex items-center gap-6 flex-wrap justify-center">
                  {/* Placeholder logos or text */}
                  <span className="text-zinc-600 font-black text-lg">IRONBERG</span>
                  <span className="text-zinc-600 font-black text-lg">SMART FIT</span>
                  <span className="text-zinc-600 font-black text-lg">BLUEFIT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-20 bg-zinc-950 relative border-t border-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Card 1 */}
              <Card className="bg-zinc-900/50 border-zinc-800 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-0 space-y-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Users className="h-7 w-7 text-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">Para Personais</h2>
                    <p className="text-zinc-400 leading-relaxed">
                      Importe seus PDFs antigos e nossa IA os transforma em treinos interativos instantaneamente. Gerencie alunos ilimitados.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-4 border-t border-zinc-800/50">
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Importação via IA</li>
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Editor Drag & Drop</li>
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-emerald-500 mr-2" /> Feedback em tempo real</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="bg-zinc-900/50 border-zinc-800 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-0 space-y-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <User className="h-7 w-7 text-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">Para Alunos</h2>
                    <p className="text-zinc-400 leading-relaxed">
                      Chega de planilhas no WhatsApp. Execute seus treinos com timer integrado, vídeos demonstrativos e histórico de carga automático.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-4 border-t border-zinc-800/50">
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-blue-500 mr-2" /> App intuitivo</li>
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-blue-500 mr-2" /> Gráficos de evolução</li>
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-blue-500 mr-2" /> Ranking e gamificação</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="bg-zinc-900/50 border-zinc-800 p-6 rounded-3xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-0 space-y-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <TrendingUp className="h-7 w-7 text-purple-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white">Evolução Real</h2>
                    <p className="text-zinc-400 leading-relaxed">
                      Metodologia comprovada para garantir resultados. Acompanhe seu progresso, fotos e cargas semana após semana.
                    </p>
                  </div>
                  <ul className="space-y-2 pt-4 border-t border-zinc-800/50">
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-purple-500 mr-2" /> Analytics avançado</li>
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-purple-500 mr-2" /> Comparativo de fotos</li>
                    <li className="flex items-center text-sm text-zinc-300"><Check className="w-4 h-4 text-purple-500 mr-2" /> Metas personalizadas</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl text-white mb-6">
              Pronto para subir de nível?
            </h2>
            <p className="mx-auto max-w-[600px] text-zinc-400 md:text-xl mb-10">
              Junte-se a milhares de treinadores e alunos que já transformaram seus resultados com o RepTrail.
            </p>
            <Link href="/auth/signup">
              <Button className="h-14 px-10 text-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl shadow-2xl transition-all hover:scale-105">
                Começar Gratuitamente
              </Button>
            </Link>
            <p className="mt-6 text-sm text-zinc-500 font-medium">
              Sem cartão de crédito necessário • Plano gratuito disponível
            </p>
          </div>
        </section>
      </main>
      <footer className="w-full py-12 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size="md" className="opacity-50 hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-zinc-600 font-medium">
            © 2026 RepTrail Inc. Todos os direitos reservados.
          </p>
          <nav className="flex gap-6">
            <Link className="text-xs text-zinc-500 hover:text-white transition-colors" href="#">
              Termos
            </Link>
            <Link className="text-xs text-zinc-500 hover:text-white transition-colors" href="#">
              Privacidade
            </Link>
            <Link className="text-xs text-zinc-500 hover:text-white transition-colors" href="#">
              Contato
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
