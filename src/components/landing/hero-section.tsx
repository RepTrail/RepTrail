
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Users, Trophy, Star } from "lucide-react";

export function HeroSection() {
    return (
        <section className="w-full py-[50px] md:py-[100px] px-[20px] relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />

            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10 flex flex-col items-center text-center gap-[30px] md:gap-[50px] animate-in fade-in slide-in-from-bottom-8 duration-1000">

                <div className="flex flex-col items-center gap-[20px] w-full">
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 backdrop-blur-xl mb-4 hover:border-emerald-500/30 transition-colors">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[8px] text-zinc-500 font-bold">
                                    <Users className="w-3 h-3" />
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-medium text-zinc-300">
                            <span className="text-emerald-400 font-bold">+500</span> treinadores ativos hoje
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-[20px] w-full">
                        <h1 className="text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 pb-2 leading-[0.85] uppercase italic text-center">
                            Transforme sua <span className="text-emerald-500">Consultoria</span> <br />
                            <span className="text-white">de Educação Física.</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-zinc-400 md:text-xl lg:text-2xl font-medium leading-relaxed">
                            Aumente a <span className="text-white font-bold">retenção dos seus alunos</span> e <span className="text-emerald-500 font-bold">simplifique sua gestão</span> com o RepTrail. <br />
                            A plataforma mais completa para profissionais de alta performance.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-[20px] w-full pt-8">
                        <div className="flex flex-col gap-[16px] w-full max-w-2xl mx-auto items-center px-4">
                            <Button
                                asChild
                                suppressHydrationWarning
                                className="w-full h-auto min-h-[4.5rem] py-4 px-8 text-base md:text-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-2xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:-translate-y-1 hover:scale-[1.01] whitespace-normal"
                            >
                                <Link href="/auth/signup" suppressHydrationWarning className="flex items-center justify-center h-full text-center leading-tight">
                                    <span className="px-1">Quero transformar minha consultoria agora</span>
                                    <ArrowRight className="ml-2 h-5 w-5 shrink-0" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                suppressHydrationWarning
                                className="w-full h-auto min-h-[4rem] py-4 px-6 text-sm md:text-base border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 font-black uppercase italic tracking-wide rounded-2xl backdrop-blur-sm transition-all hover:-translate-y-1 shadow-2xl"
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
                    <div className="mt-[30px] md:mt-[50px] grid grid-cols-2 sm:grid-cols-4 gap-[30px] w-full border-t border-zinc-800/50 pt-[50px] md:pt-[100px] items-center">
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">10k+</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Trophy className="w-4 h-4 text-emerald-500" /> Treinos
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">R$ 18k</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Star className="w-4 h-4 text-emerald-500" /> Faturamento Médio
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">98%</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Users className="w-4 h-4 text-emerald-500" /> Retenção
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-[4px] w-full">
                            <p className="text-3xl md:text-5xl font-black text-white italic">4.9</p>
                            <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Avaliação
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

