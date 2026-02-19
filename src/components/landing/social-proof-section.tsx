import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function SocialProofSection() {
    return (
        <section className="py-24 bg-zinc-950 px-4 md:px-6 border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950 to-zinc-950" />

            <div className="container mx-auto space-y-16">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">
                        Resultados que <span className="text-emerald-500">Falam.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg">
                        De preparadores de atletas Olympia a consultorias de emagrecimento. O RepTrail é a escolha dos campeões.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl space-y-6 hover:border-zinc-700 transition-colors">
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-zinc-300 italic text-sm leading-relaxed">
                                "A organização que o RepTrail trouxe para minha consultoria foi absurda. Tripliquei meu número de alunos e reduzi meu tempo de gestão pela metade."
                            </p>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-zinc-700">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase text-[10px]">PT</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-bold uppercase text-xs">Carlos M.</p>
                                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Personal Trainer Elite</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
