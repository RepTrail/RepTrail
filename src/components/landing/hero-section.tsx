import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export function HeroSection() {
    return (
        <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center min-h-[90vh]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />

            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-emerald-400 backdrop-blur-xl mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                    A evolução do fitness digital
                </div>

                <div className="space-y-4 max-w-4xl">
                    <h1 className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500 pb-2">
                        Eleve sua consultoria. <br className="hidden md:block" />
                        <span className="text-emerald-500">Evolua seu treino.</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-zinc-400 md:text-xl font-medium leading-relaxed">
                        A plataforma definitiva para <span className="text-white font-bold">Personal Trainers</span> e <span className="text-white font-bold">alunos</span> que levam performance a sério. Gestão, prescrição e marketplace em um único lugar.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-8">
                    <Button
                        asChild
                        className="h-14 px-8 text-base md:text-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:scale-105"
                    >
                        <Link href="#marketplace">
                            <Search className="mr-2 h-5 w-5" />
                            Encontrar Personal
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-14 px-8 text-base md:text-lg border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:text-white font-bold uppercase tracking-wide rounded-xl backdrop-blur-sm hover:border-zinc-700 transition-all"
                    >
                        <Link href="/auth/signup">
                            Sou Personal Trainer
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                {/* Metrics Preview (Static for visual impact) */}
                <div className="mt-12 flex items-center justify-center gap-8 md:gap-16 opacity-60">
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-black text-white">10k+</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Treinos Realizados</p>
                    </div>
                    <div className="h-8 w-px bg-zinc-800" />
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-black text-white">500+</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Personais Elite</p>
                    </div>
                    <div className="h-8 w-px bg-zinc-800" />
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-black text-white">4.9/5</p>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Avaliação Média</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
