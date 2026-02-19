import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, TrendingUp, Users, Wallet } from "lucide-react";

export function SocialProofSection() {
    return (
        <section className="py-24 bg-zinc-950 px-4 md:px-6 border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950" />

            <div className="container mx-auto space-y-16 relative z-10">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                        Resultados que <span className="text-emerald-500">Falam.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg">
                        De preparadores de atletas Olympia a consultorias de emagrecimento. O RepTrail é a escolha dos campeões.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Testimonial 1 - Scale */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "Antes eu gerenciava tudo em planilhas e perdia horas. Com o RepTrail, escalei para <span className="text-white font-bold">120 alunos ativos</span> sem contratar assistente."
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">RM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[10px]">Rafael M.</p>
                                    <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">Treinador Elite</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wide">120+ Alunos</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 - Revenue (Highlighted) */}
                    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-emerald-500/30 transition-all shadow-2xl shadow-emerald-900/10 transform md:-translate-y-4 flex flex-col justify-between relative">
                        <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-emerald-500 text-zinc-950 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest transform rotate-3">Destaque</div>
                        <div className="space-y-4">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-5 h-5 fill-current" />)}
                            </div>
                            <p className="text-white font-medium italic text-base leading-relaxed">
                                "O marketplace mudou meu jogo. Minha página pública virou uma máquina de vendas. Hoje faturo <span className="text-emerald-400 font-bold">R$ 15k/mês</span> só pela plataforma."
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border-2 border-emerald-500/30">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">JP</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-xs">Júlia P.</p>
                                    <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Consultora Online</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500 px-2.5 py-1 rounded border border-emerald-400 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                <Wallet className="w-3 h-3 text-zinc-950" />
                                <span className="text-[9px] font-black text-zinc-950 uppercase tracking-wide">R$ 15k/mês</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 - Retention */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "A gamificação e o ranking fizeram meus alunos viciarem no treino. Minha taxa de cancelamento (churn) <span className="text-white font-bold">caiu 35%</span> em três meses."
                            </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">MC</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[10px]">Marcelo C.</p>
                                    <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">Coach Bodybuilding</p>
                                </div>
                            </div>
                            <div className="bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1.5">
                                <TrendingUp className="w-3 h-3 text-blue-500" />
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-wide">-35% Churn</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
