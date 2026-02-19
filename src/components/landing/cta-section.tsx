
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Zap, CheckCircle2 } from "lucide-react";

export function CTASection() {
    return (
        <section className="text-center py-32 bg-zinc-950 px-4 md:px-6 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />

            <div className="space-y-12 max-w-4xl mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">
                    <Zap className="mr-2 h-3 w-3" />
                    Última chance para Evoluir
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    O Próximo Nível da <br className="hidden md:block" />
                    <span className="text-emerald-500">Sua Consultoria.</span>
                </h2>

                <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    Não espere mais. Junte-se a treinadores Elite que já escalaram seus resultados com o RepTrail.
                </p>

                <div className="flex flex-col items-center gap-6 pt-8 w-full max-w-xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-6 w-full justify-center px-4 md:px-0">
                        <Button
                            asChild
                            className="w-full md:w-auto h-16 px-10 text-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all hover:-translate-y-1"
                        >
                            <Link href="/auth/signup">
                                Começar Agora
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full md:w-auto h-16 px-10 text-lg border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 font-black uppercase italic tracking-widest rounded-2xl transition-all hover:-translate-y-1 shadow-2xl backdrop-blur-sm"
                        >
                            <a href="#marketplace">
                                <Search className="mr-2 h-5 w-5" />
                                Buscar Personal
                            </a>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sem fidelidade</span>
                        <span className="hidden sm:inline text-zinc-700">•</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cancele quando quiser</span>
                        <span className="hidden sm:inline text-zinc-700">•</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Setup Grátis</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
