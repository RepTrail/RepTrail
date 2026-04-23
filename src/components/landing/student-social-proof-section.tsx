import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, TrendingDown, Crosshair, Zap } from "lucide-react";
import { SectionHeader } from "./section-header";

export function StudentSocialProofSection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/10 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px] relative z-10">
                <SectionHeader
                    badgeIcon={Star}
                    badgeVariant="orange"
                    badgeText="Resultados Reais"
                    title={<>A Elite que <span className="text-orange-500">Transformou.</span></>}
                    subtitle="Junte-se a milhares de alunos que saíram da estagnação para a sua melhor versão."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">

                    {/* Testimonial 1 */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-orange-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "Eu sempre desistia no meio do mês. Com o <span className="text-white font-bold">player assistido e a gamificação</span>, finalmente bati 1 ano de treino consistente e perdi 12kg."
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[8px]">LC</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[9px]">Lucas C.</p>
                                    <p className="text-zinc-500 text-[7px] uppercase font-bold tracking-widest">Curitiba • PR</p>
                                </div>
                            </div>
                            <div className="bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 flex items-center justify-center">
                                <span className="text-[8px] font-black text-orange-500 uppercase tracking-wide leading-none">-12kg Gordura</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-orange-500/20 p-6 rounded-3xl space-y-6 hover:border-orange-500/40 transition-all shadow-2xl flex flex-col justify-between relative ring-1 ring-orange-500/10">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-orange-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-white font-medium italic text-sm leading-relaxed">
                                "Encontrei meu personal no marketplace do app. O <span className="text-orange-400 font-bold">suporte dele aliado ao app</span> é outro nível. Ganhei 5kg de massa em 3 meses."
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-orange-500/30">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">AM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[10px]">Amanda M.</p>
                                    <p className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest">Belo Horizonte • MG</p>
                                </div>
                            </div>
                            <div className="bg-orange-500 px-2 py-1 rounded border border-orange-400 flex items-center justify-center">
                                <span className="text-[8px] font-black text-zinc-950 uppercase tracking-wide leading-none">+5kg Massa Magra</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-orange-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "O Auto-Treino me salvou. Viajo muito e não consigo ter personal fixo, mas com o <span className="text-white font-bold">período grátis de 7 dias</span> eu testei o player e me viciei!"
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[8px]">GT</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[9px]">Gustavo T.</p>
                                    <p className="text-zinc-500 text-[7px] uppercase font-bold tracking-widest">Lisboa • PT</p>
                                </div>
                            </div>
                            <div className="bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 flex items-center justify-center">
                                <span className="text-[8px] font-black text-orange-500 uppercase tracking-wide leading-none">Auto Treino Elite</span>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial 4 */}
                    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex gap-1 text-orange-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "O diferencial é o <span className="text-white font-bold">dashboard de evolução</span>. Ver minhas métricas e fotos lado a lado me dá um gás absurdo para continuar."
                            </p>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[8px]">RV</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-[9px]">Ricardo V.</p>
                                    <p className="text-zinc-500 text-[7px] uppercase font-bold tracking-widest">Florianópolis • SC</p>
                                </div>
                            </div>
                            <div className="bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 flex items-center justify-center">
                                <span className="text-[8px] font-black text-orange-500 uppercase tracking-wide leading-none">Evolução Monitorada</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
