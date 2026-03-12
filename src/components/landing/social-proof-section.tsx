import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, TrendingUp, Users, Wallet } from "lucide-react";

export function SocialProofSection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/10 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px] relative z-10">
                <div className="flex flex-col items-center gap-[20px] text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                        Depoimentos e <span className="text-emerald-500">Resultados.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg">
                        Veja o que dizem os mais de 500 treinadores que já profissionalizaram sua consultoria com o RepTrail.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-[20px]">

                    {/* Testimonial 1 - Scale */}
                    <div className="w-full md:flex-1 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="flex flex-col gap-[20px]">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "Antes eu gerenciava tudo em planilhas e perdia horas no WhatsApp. Com o RepTrail, <span className="text-white font-bold">dobrei minha base para 120 alunos ativos</span> mantendo a mesma qualidade no suporte."
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">RM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[10px]">Rafael M.</p>
                                    <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">Treinador Elite • São Paulo</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
                                <Users className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wide whitespace-nowrap">120+ Alunos</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 - Revenue (Highlighted) */}
                    <div className="w-full md:flex-1 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-emerald-500/30 transition-all shadow-2xl shadow-emerald-900/10 transform md:-translate-y-4 flex flex-col justify-between relative">
                        <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-emerald-500 text-zinc-950 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest transform rotate-3 z-20">Destaque</div>
                        <div className="flex flex-col gap-[20px] relative z-10">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                            </div>
                            <p className="text-white font-medium italic text-base leading-relaxed">
                                "O marketplace é um divisor de águas. Minha página pública virou minha principal vitrine. Hoje <span className="text-emerald-400 font-bold">faturamos R$ 22k/mês</span> escalando com as ferramentas de automatização."
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-emerald-500/30">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">JP</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-xs">Júlia P.</p>
                                    <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Consultora • Rio de Janeiro</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500 px-2.5 py-1 rounded border border-emerald-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0">
                                <Wallet className="w-3 h-3 text-zinc-950" />
                                <span className="text-[9px] font-black text-zinc-950 uppercase tracking-wide whitespace-nowrap">R$ 22k/mês</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 - Retention */}
                    <div className="w-full md:flex-1 bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="flex flex-col gap-[20px]">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "A gamificação e o ranking do app viciaram meus alunos. O engajamento aumentou tanto que minha <span className="text-white font-bold">taxa de cancelamento caiu para quase zero</span> neste semestre."
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">MC</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[10px]">Marcelo C.</p>
                                    <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">Coach • Curitiba</p>
                                </div>
                            </div>
                            <div className="bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 flex items-center gap-1.5 shrink-0">
                                <TrendingUp className="w-3 h-3 text-orange-500" />
                                <span className="text-[9px] font-black text-orange-500 uppercase tracking-wide whitespace-nowrap">Churn quase 0</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
