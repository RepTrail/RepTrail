
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Users, Trophy, Star } from "lucide-react";

export function HeroSection() {
    return (
        <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center min-h-[90vh]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />

            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Mini Social Proof */}
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

                <div className="space-y-6 max-w-5xl">
                    <h1 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 pb-2 leading-[0.9]">
                        Sua Consultoria <br className="hidden md:block" />
                        <span className="text-emerald-500">Em Outro Nível.</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-zinc-400 md:text-xl font-medium leading-relaxed">
                        A plataforma completa para gerenciar, prescrever e escalar seu negócio fitness.
                        Do <span className="text-white font-bold">iniciante</span> ao <span className="text-emerald-400 font-bold">Elite</span>.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-4 w-full pt-8">
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button
                            asChild
                            className="h-16 px-10 text-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Link href="#marketplace">
                                <Search className="mr-2 h-5 w-5" />
                                Encontrar Personal
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-16 px-10 text-lg border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:text-white font-bold uppercase tracking-wide rounded-2xl backdrop-blur-sm hover:border-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Link href="/auth/signup">
                                Sou Personal Trainer
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-80">
                        Usado por treinadores e atletas de alta performance.
                    </p>
                </div>

                {/* Metrics Preview */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-4xl border-t border-zinc-800/50 pt-12">
                    <div className="text-center space-y-1">
                        <p className="text-3xl md:text-4xl font-black text-white italic">10k+</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                            <Trophy className="w-3 h-3 text-emerald-500" /> Treinos
                        </p>
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-3xl md:text-4xl font-black text-white italic">R$ 18k</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                            <Star className="w-3 h-3 text-emerald-500" /> Faturamento Médio
                        </p>
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-3xl md:text-4xl font-black text-white italic">98%</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                            <Users className="w-3 h-3 text-emerald-500" /> Retenção
                        </p>
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-3xl md:text-4xl font-black text-white italic">4.9</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest flex items-center justify-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Avaliação
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
