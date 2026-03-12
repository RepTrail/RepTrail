
import { Button } from "@/components/ui/button";
import { Check, Flame, Dumbbell, Utensils, Activity, ArrowRight, Zap, Target, Smartphone, Search } from "lucide-react";
import Link from "next/link";

const features = [
    { icon: Smartphone, text: "Experiência Mobile-First" },
    { icon: Dumbbell, text: "Histórico de Cargas Reais" },
    { icon: Target, text: "Metas de Dieta e Macros" },
    { icon: Zap, text: "Ranking Global Gamificado" },
];

export function StudentFeatures() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full relative overflow-hidden flex flex-col items-center border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-900/10 via-zinc-950 to-zinc-950 opacity-40" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-[50px] items-center justify-between relative z-10">

                {/* Phone Mockup (Left Side on Desktop) */}
                <div className="relative group flex justify-center lg:justify-start w-full lg:w-[calc(50%-25px)] animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="absolute inset-0 bg-orange-500 blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 w-[80%] mx-auto lg:mx-0" />

                    <div className="w-[80%] sm:w-[70%] max-w-[400px] flex justify-center relative">
                        <div className="relative w-full aspect-[1170/2532] bg-zinc-950 border-[8px] sm:border-[12px] border-zinc-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-zinc-800 transform -rotate-2 transition-transform duration-500 group-hover:rotate-0">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-6 sm:h-7 bg-zinc-900 z-20 rounded-b-2xl sm:rounded-b-3xl mx-auto w-1/2 flex justify-center items-end pb-1.5 sm:pb-2">
                                <div className="w-12 h-1 bg-zinc-800 rounded-full"></div>
                            </div>

                            {/* Mock Screen Content */}
                            <video
                                src="/videos/tela de treinos dos alunos.MP4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Text Content (Right Side on Desktop) */}
                <div className="flex flex-col gap-[30px] md:gap-[50px] text-left w-full lg:w-[calc(50%-25px)] animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    <div className="flex flex-col gap-[20px] items-start text-left">
                        <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-500">
                            <Flame className="w-3 h-3 mr-2" />
                            Para Alunos
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                            Execute com <br className="hidden md:block" />
                            <span className="text-orange-500">Maestria.</span>
                        </h2>

                        <p className="text-zinc-400 text-lg leading-relaxed w-full">
                            Seu plano está traçado. Sua dieta está calculada. Seu único trabalho é executar. Acompanhe cada série, cada refeição e cada quilo perdido com precisão cirúrgica.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-[20px] text-left">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex flex-1 min-w-[200px] items-center gap-[20px] group p-3 rounded-xl hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/50 transition-colors shrink-0">
                                    <item.icon className="w-4 h-4 text-orange-500" />
                                </div>
                                <span className="text-sm font-bold text-zinc-300 uppercase italic tracking-wide group-hover:text-orange-400 transition-colors">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full">
                        <Button
                            asChild
                            className="w-full h-14 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-xl shadow-xl shadow-orange-500/10 transition-all hover:-translate-y-1 hover:shadow-orange-500/20"
                        >
                            <a href="#marketplace">
                                Encontrar meu Treinador
                                <Search className="ml-2 w-5 h-5" />
                            </a>
                        </Button>
                    </div>
                </div>

            </div>
        </section>
    );
}

