import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { AffiliateTracker } from '@/components/landing/affiliate-tracker'
import {
    ArrowRight, CheckCircle2, Star, TrendingUp, Users,
    MousePointerClick, DollarSign, BarChart2, Zap, Shield,
    MessageCircle, ChevronDown, Megaphone, Infinity
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AffiliadosPage() {
    return (
        <div className="flex flex-col min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">
            <AffiliateTracker />

            {/* Header */}
            <header className="h-20 flex items-center border-b border-zinc-900/50 backdrop-blur-md sticky top-0 z-50 bg-zinc-950/80">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo size="lg" className="group-hover:scale-105 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/afiliados/login" className="text-[10px] font-black text-zinc-400 hover:text-amber-400 uppercase tracking-[0.2em] transition-colors hidden md:block">
                            Já sou afiliado
                        </Link>
                        <Link href="/afiliados/cadastro" className="hidden md:block">
                            <Button className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs px-6 h-10 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95">
                                Começar agora
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* ── HERO ─────────────────────────────────────────── */}
                <section className="relative py-24 md:py-36 px-4 overflow-hidden">
                    {/* Glow BG */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-zinc-950 to-zinc-950" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full" />

                    <div className="container mx-auto text-center relative z-10 max-w-4xl space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2">
                            <Megaphone className="w-4 h-4 text-amber-400" />
                            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Programa de Afiliados RepTrail</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
                            Ganhe{' '}
                            <span className="text-amber-400 relative">
                                10%
                                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-amber-500/40 rounded-full" />
                            </span>
                            {' '}de tudo<br />
                            <span className="text-zinc-300">que seus indicados</span>{' '}
                            <span className="text-white">gastarem</span>
                            {' '}— para sempre!
                        </h1>

                        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Sem limites de comissão. Válido em todos os planos do RepTrail.
                            <br />
                            <span className="text-zinc-200 font-semibold">Transforme sua rede de contatos em uma renda recorrente hoje mesmo.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full">
                            <Link href="/afiliados/cadastro" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-14 px-10 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase italic tracking-[0.1em] rounded-2xl shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 text-base gap-3">
                                    Quero me tornar afiliado
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                            <p className="text-[11px] text-zinc-500 font-medium sm:hidden">
                                Cadastro em menos de 1 minuto · Sem custo
                            </p>
                            <p className="hidden sm:block text-[11px] text-zinc-500 font-medium">
                                Cadastro em menos de 1 minuto · Sem custo · Sem burocracia
                            </p>
                        </div>

                        {/* Social proof mini */}
                        <div className="flex items-center justify-center gap-6 pt-4">
                            {[
                                { value: '10%', label: 'Comissão recorrente' },
                                { value: '∞', label: 'Sem limite de ganhos' },
                                { value: '30d', label: 'Validade do cookie' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-black text-amber-400">{stat.value}</div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── COMO FUNCIONA ─────────────────────────────────── */}
                <section className="py-24 px-4 border-t border-zinc-900 relative">
                    <div className="absolute inset-0 bg-zinc-900/20" />
                    <div className="container mx-auto relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Como funciona</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                                Simples como <span className="text-amber-400">1, 2, 3, 4</span>
                            </h2>
                            <p className="text-zinc-500">Do cadastro ao primeiro pagamento em poucos passos.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {[
                                {
                                    step: '01',
                                    icon: <Zap className="w-6 h-6" />,
                                    title: 'Crie sua conta',
                                    desc: 'Cadastro em menos de 1 minuto. Só nome, email e senha.',
                                    color: 'text-amber-400',
                                    bg: 'from-amber-500/10 to-transparent',
                                    border: 'border-amber-500/20',
                                },
                                {
                                    step: '02',
                                    icon: <MousePointerClick className="w-6 h-6" />,
                                    title: 'Compartilhe seu link',
                                    desc: 'Link exclusivo com seu token. Envie para personal trainers, colegas, grupos fitness.',
                                    color: 'text-blue-400',
                                    bg: 'from-blue-500/10 to-transparent',
                                    border: 'border-blue-500/20',
                                },
                                {
                                    step: '03',
                                    icon: <Users className="w-6 h-6" />,
                                    title: 'Indicados se cadastram',
                                    desc: 'O sistema registra automaticamente quem veio pelo seu link. Cookie válido por 30 dias.',
                                    color: 'text-purple-400',
                                    bg: 'from-purple-500/10 to-transparent',
                                    border: 'border-purple-500/20',
                                },
                                {
                                    step: '04',
                                    icon: <DollarSign className="w-6 h-6" />,
                                    title: 'Receba 10% recorrente',
                                    desc: 'Cada pagamento dos seus indicados gera 10% pra você. Para sempre, sem limite.',
                                    color: 'text-emerald-400',
                                    bg: 'from-emerald-500/10 to-transparent',
                                    border: 'border-emerald-500/20',
                                },
                            ].map((item) => (
                                <div key={item.step} className={`relative bg-gradient-to-b ${item.bg} border ${item.border} rounded-3xl p-6 space-y-4 group hover:scale-[1.02] transition-transform`}>
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 bg-zinc-900 rounded-2xl border border-zinc-800 ${item.color}`}>
                                            {item.icon}
                                        </div>
                                        <span className="text-[11px] font-black text-zinc-700 tabular-nums">{item.step}</span>
                                    </div>
                                    <h3 className="font-black text-white text-lg">{item.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── DEPOIMENTO ────────────────────────────────────── */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-3xl">
                        <div className="bg-gradient-to-br from-amber-500/5 to-zinc-900 border border-amber-500/20 rounded-3xl p-10 text-center space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-3xl rounded-full" />
                            <div className="flex gap-1 justify-center">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 text-amber-400 fill-current" />)}
                            </div>
                            <p className="text-xl md:text-2xl text-white font-medium italic leading-relaxed relative z-10">
                                "Eu comecei indicando meus colegas e, em menos de um mês, já tinha uma{' '}
                                <span className="text-amber-400 font-black">renda extra consistente</span>{' '}
                                sem esforço. O painel mostra tudo em tempo real."
                            </p>
                            <div className="flex items-center justify-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm">
                                    MR
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold text-sm">Mateus R.</p>
                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Afiliado RepTrail · São Paulo</p>
                                </div>
                                <div className="ml-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                                    <DollarSign className="w-3 h-3 text-amber-400" />
                                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wide">R$ 1.8k /mês</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── BENEFÍCIOS ────────────────────────────────────── */}
                <section className="py-24 px-4 border-t border-zinc-900">
                    <div className="container mx-auto max-w-5xl">
                        <div className="text-center mb-16 space-y-4">
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Por que se tornar afiliado?</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                                Benefícios que <span className="text-amber-400">fazem sentido</span>
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: <Infinity className="w-6 h-6 text-amber-400" />,
                                    title: 'Ganhos recorrentes e ilimitados',
                                    desc: 'Você não precisa se preocupar com teto de comissão ou regras complicadas. 10% de tudo, para sempre.',
                                },
                                {
                                    icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
                                    title: 'Funciona em todos os planos',
                                    desc: 'Do plano Start ao Elite, sua comissão incide em qualquer cobrança dos seus indicados na plataforma.',
                                },
                                {
                                    icon: <BarChart2 className="w-6 h-6 text-purple-400" />,
                                    title: 'Dashboard exclusivo em tempo real',
                                    desc: 'Acompanhe cliques, cadastros, conversões e ganhos em um painel dedicado e moderno.',
                                },
                                {
                                    icon: <Shield className="w-6 h-6 text-emerald-400" />,
                                    title: 'Zero impacto no seu trabalho',
                                    desc: 'Continue usando o RepTrail como personal ou aluno normalmente. Ser afiliado é uma função adicional.',
                                },
                                {
                                    icon: <MousePointerClick className="w-6 h-6 text-orange-400" />,
                                    title: 'Tracking automático por cookie',
                                    desc: 'Seu token fica salvo no navegador por 30 dias. Qualquer cadastro nessa janela é atribuído a você.',
                                },
                                {
                                    icon: <MessageCircle className="w-6 h-6 text-pink-400" />,
                                    title: 'Monetize seu networking',
                                    desc: 'Cada contato do mundo fitness que você indicar é uma oportunidade de renda extra contínua.',
                                },
                            ].map((b) => (
                                <div key={b.title} className="flex gap-4 p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors group">
                                    <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 h-fit group-hover:scale-110 transition-transform shrink-0">
                                        {b.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-white">{b.title}</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{b.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FAQ ───────────────────────────────────────────── */}
                <section className="py-24 px-4 border-t border-zinc-900 bg-zinc-900/20">
                    <div className="container mx-auto max-w-2xl">
                        <div className="text-center mb-16 space-y-4">
                            <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest">Dúvidas Frequentes</span>
                            <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                                Perguntas & <span className="text-amber-400">Respostas</span>
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    q: 'Como funciona a comissão?',
                                    a: 'Você recebe 10% de tudo que seus indicados gastarem, de forma recorrente, sem limite de valor. A comissão é registrada automaticamente no seu painel a cada pagamento.',
                                },
                                {
                                    q: 'Quanto tempo dura o token do meu link?',
                                    a: 'O token é salvo como cookie no navegador e é válido por 30 dias. Qualquer cadastro realizado dentro dessa janela é automaticamente associado a você.',
                                },
                                {
                                    q: 'Posso ser afiliado e personal ao mesmo tempo?',
                                    a: 'Sim! Ser afiliado é uma função complementar e não interfere no seu acesso como personal ou aluno. Você tem um painel dedicado separado do dashboard principal.',
                                },
                                {
                                    q: 'Preciso vender algo diretamente?',
                                    a: 'Não! Basta compartilhar seu link único. O sistema cuida de todo o tracking, associação de cadastros e cálculo de comissões automaticamente.',
                                },
                                {
                                    q: 'Quando posso sacar meus ganhos?',
                                    a: 'Você pode solicitar um saque a partir de R$ 50,00 acumulados na sua carteira, via PIX ou transferência bancária.',
                                },
                            ].map((item, i) => (
                                <details key={i} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-zinc-200 hover:text-white transition-colors">
                                        {item.q}
                                        <ChevronDown className="w-4 h-4 text-zinc-500 group-open:rotate-180 transition-transform shrink-0" />
                                    </summary>
                                    <div className="px-6 pb-6">
                                        <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA FINAL ─────────────────────────────────────── */}
                <section className="py-24 px-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-900/20 via-zinc-950 to-zinc-950" />
                    <div className="container mx-auto text-center relative z-10 max-w-3xl space-y-8">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2">
                            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">🚀 Não espere mais</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
                            Comece a ganhar<br />
                            <span className="text-amber-400">neste exato momento</span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
                            Seu networking no mundo fitness tem valor. O RepTrail só precisa de <strong className="text-zinc-200">1 minuto do seu tempo</strong> para transformar isso em renda recorrente.
                        </p>
                        <Link href="/afiliados/cadastro" className="w-full md:w-auto block">
                            <Button className="w-full md:w-auto h-14 px-8 md:px-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase italic tracking-[0.1em] rounded-2xl shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 text-sm md:text-base gap-3">
                                <span className="md:hidden">Criar Conta</span>
                                <span className="hidden md:inline">Criar minha conta de afiliado</span>
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div className="flex items-center justify-center gap-8 pt-4">
                            {['Gratuito', 'Sem burocracia', 'Saque via PIX'].map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-10 bg-zinc-950 border-t border-zinc-900">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <Link href="/" className="opacity-50 hover:opacity-100 transition-opacity block">
                        <Logo size="sm" />
                    </Link>
                    <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest text-center">
                        Comissão válida em todos os planos · Sem limite · Registrada automaticamente
                    </p>
                    <div className="flex gap-4">
                        <Link href="/afiliados/login" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-amber-400 transition-colors">Sou afiliado</Link>
                        <Link href="#" className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-zinc-400 transition-colors">Termos</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
