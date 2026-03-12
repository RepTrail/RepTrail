
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Users, Trophy, Star } from "lucide-react";

export function HeroSection() {
    return (
        <section className="w-full py-[var(--spacing-app-section)] px-[var(--spacing-app-container)] relative overflow-hidden bg-surface-950 flex flex-col items-center justify-center border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/20 via-surface-950 to-surface-950" />

            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10 flex flex-col items-center text-center gap-[var(--spacing-app-item)] md:gap-[40px] animate-in fade-in slide-in-from-bottom-8 duration-1000">

                <div className="flex flex-col items-center gap-[var(--spacing-app-item)] w-full">
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 backdrop-blur-xl mb-4 hover:border-brand-primary/30 transition-colors">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[8px] text-zinc-500 font-bold">
                                    <Users className="w-3 h-3 text-zinc-500" />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-medium text-zinc-300">
                            <span className="text-brand-primary font-bold">+500</span> treinadores ativos hoje
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-[var(--spacing-app-item)] w-full">
                        <h1 className="text-4xl min-[380px]:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 pb-2 leading-[0.85] uppercase italic text-center">
                            Transforme sua <span className="text-brand-primary">Consultoria</span> <br />
                            <span className="text-white">de Educação Física.</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-zinc-400 md:text-xl lg:text-2xl font-medium leading-relaxed">
                            Aumente a <span className="text-white font-bold">retenção dos seus alunos</span> e <span className="text-brand-primary font-bold">simplifique sua gestão</span> com o RepTrail. <br />
                            A plataforma mais completa para profissionais de alta performance.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-[var(--spacing-app-item)] w-full pt-8">
                        <div className="flex flex-col gap-[16px] w-full max-w-2xl mx-auto items-center px-4">
                            <Button
                                asChild
                                size="hero"
                                suppressHydrationWarning
                                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-zinc-950 shadow-brand-primary/20 hover:scale-[1.01] whitespace-normal"
                            >
                                <Link href="/auth/signup" suppressHydrationWarning className="flex items-center justify-center h-full text-center leading-tight">
                                    <span className="px-1">Quero começar a transformar minha consultoria agora</span>
                                    <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                suppressHydrationWarning
                                className="w-full h-auto min-h-[4rem] rounded-2xl"
                            >
                                <a href="#marketplace" suppressHydrationWarning className="flex items-center justify-center h-full text-center">
                                    <Search className="mr-2 h-4 w-4 shrink-0" />
                                    Buscar Treinador
                                </a>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] opacity-80">
                            <div className="w-8 h-[1px] bg-zinc-800" />
                            A escolha de +500 treinadores de alta performance
                            <div className="w-8 h-[1px] bg-zinc-800" />
                        </div>
                    </div>

                    {/* Metrics Preview */}
                    <div className="mt-[30px] md:mt-[50px] grid grid-cols-2 sm:grid-cols-4 gap-[var(--spacing-app-item)] w-full border-t border-zinc-800/50 pt-[var(--spacing-app-section)] items-center">
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">10k+</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Trophy className="w-4 h-4 text-brand-primary" /> Treinos
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">R$ 18k</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Star className="w-4 h-4 text-brand-primary" /> Faturamento Médio
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">98%</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Users className="w-4 h-4 text-brand-primary" /> Retenção
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">4.9</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Star className="w-4 h-4 text-brand-accent fill-brand-accent" /> Avaliação
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

