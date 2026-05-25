import { BaseAvatar } from "@/components/store/base/avatar";
import { Star } from "lucide-react";
import { SectionHeader } from "./section-header";

export function SocialProofSection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px] relative z-10">
                <SectionHeader
                    badgeIcon={Star}
                    badgeText="Resultados Reais"
                    title={<>O que dizem os <span className="text-emerald-500">Elite.</span></>}
                    subtitle="Junte-se a mais de 500 treinadores que já profissionalizaram sua consultoria."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">

                    {/* Testimonial 1 */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-emerald-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "Antes perdia horas no WhatsApp. Com o RepTrail, <span className="text-white font-bold">dobrei minha base para 120 alunos</span> mantendo o suporte impecável."
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3 pb-4">
                                <BaseAvatar initials="RM" size="sm" variant="zinc" />
                                <div>
                                    <p className="text-white font-bold uppercase text-[9px]">Rafael M.</p>
                                    <p className="text-zinc-500 text-[7px] uppercase font-bold tracking-widest">São Paulo • SP</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center justify-center">
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wide leading-none">120+ Alunos</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-emerald-500/20 p-6 rounded-3xl space-y-6 hover:border-emerald-500/40 transition-all shadow-2xl flex flex-col justify-between relative ring-1 ring-emerald-500/10">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-emerald-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-white font-medium italic text-sm leading-relaxed">
                                "O marketplace é um divisor de águas. Hoje <span className="text-emerald-400 font-bold">faturamos R$ 22k/mês</span> escalando com as automações do app."
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3 pb-4">
                                <BaseAvatar initials="JP" size="md" variant="emerald" />
                                <div>
                                    <p className="text-white font-bold uppercase text-[10px]">Júlia P.</p>
                                    <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">Rio de Janeiro • RJ</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500 px-2 py-1 rounded border border-emerald-400 flex items-center justify-center">
                                <span className="text-[8px] font-black text-zinc-950 uppercase tracking-wide leading-none">R$ 22k/mês</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-emerald-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "A gamificação viciou meus alunos. O engajamento disparou e minha <span className="text-white font-bold">taxa de cancelamento caiu</span> para quase zero."
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3 pb-4">
                                <BaseAvatar initials="MC" size="sm" variant="zinc" />
                                <div>
                                    <p className="text-white font-bold uppercase text-[9px]">Marcelo C.</p>
                                    <p className="text-zinc-500 text-[7px] uppercase font-bold tracking-widest">Curitiba • PR</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center justify-center">
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wide leading-none">Retenção 98%</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 4 */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-emerald-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "O setup foi muito rápido. Em 2 dias já estava com <span className="text-white font-bold">todos os meus templates migrados</span> e prescrevendo dietas em segundos."
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3 pb-4">
                                <BaseAvatar initials="BS" size="sm" variant="zinc" />
                                <div>
                                    <p className="text-white font-bold uppercase text-[9px]">Bruno S.</p>
                                    <p className="text-zinc-500 text-[7px] uppercase font-bold tracking-widest">Interior • SP</p>
                                </div>
                            </div>
                            <div className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center justify-center">
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-wide leading-none">Setup em 48h</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
