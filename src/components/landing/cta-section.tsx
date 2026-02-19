import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Zap } from "lucide-react";

export function CTASection() {
    return (
        <section className="text-center py-32 bg-zinc-950 px-4 md:px-6 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />

            <div className="space-y-12 max-w-4xl mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse">
                    <Zap className="mr-2 h-3 w-3" />
                    Comece Gratuitamente
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    Pronto para <br className="hidden md:block" />
                    <span className="text-emerald-500">Elevar seu Nível?</span>
                </h2>

                <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    Não espere o ano passar. A melhor hora para começar sua transformação profissional ou física é agora.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 w-full max-w-xl mx-auto">
                    <Button
                        asChild
                        className="h-16 px-10 text-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all hover:scale-105"
                    >
                        <Link href="/auth/signup">
                            Criar Minha Conta
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-16 px-10 text-lg border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wide rounded-2xl hover:border-zinc-700 transition-all hover:scale-105"
                    >
                        <Link href="#marketplace">
                            <Search className="mr-2 h-5 w-5" />
                            Buscar Personal
                        </Link>
                    </Button>
                </div>

                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest pt-8">
                    Junte-se a mais de 10.000 usuários ativos hoje.
                </p>
            </div>
        </section>
    );
}
