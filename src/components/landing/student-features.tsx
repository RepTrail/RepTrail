
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
        <section className="py-24 bg-zinc-950 px-4 md:px-6 relative overflow-hidden flex flex-col items-center border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-900/10 via-zinc-950 to-zinc-950 opacity-40" />

            <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Phone Mockup (Left Side on Desktop) */}
                <div className="order-2 lg:order-1 relative group flex justify-center lg:justify-end animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="absolute inset-0 bg-orange-500 blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000" />

                    <div className="relative w-[300px] h-[600px] bg-zinc-950 border-[8px] border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-zinc-800 transform rotate-1 transition-transform group-hover:rotate-0 duration-500">
                        {/* Mock Header */}
                        <div className="absolute top-0 w-full h-24 bg-zinc-900 flex items-end justify-center pb-4 z-20 rounded-b-[2rem]">
                            <span className="w-16 h-1.5 bg-zinc-800 rounded-full"></span>
                        </div>

                        {/* Mock Screen Content */}
                        <div className="pt-28 px-6 pb-8 h-full bg-zinc-950 flex flex-col gap-6 overflow-hidden">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white italic uppercase">Treino B</h3>
                                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded">Ativo</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Dorsal & Bíceps • Foco Hipertrofia</p>
                            </div>

                            {/* Exercise Card */}
                            <div className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center">
                                        <Dumbbell className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Puxada Alta</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">4 Séries • 10-12 Reps</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-zinc-950 p-2 rounded-xl text-center border border-zinc-800">
                                        <span className="text-[8px] text-zinc-600 block uppercase font-bold">Carga Anterior</span>
                                        <span className="text-sm font-black text-zinc-400 italic strike-through decoration-zinc-600">60kg</span>
                                    </div>
                                    <div className="bg-orange-500/10 p-2 rounded-xl text-center border border-orange-500/20">
                                        <span className="text-[8px] text-orange-500 block uppercase font-bold">Nova Carga</span>
                                        <span className="text-sm font-black text-white italic">64kg</span>
                                    </div>
                                    <div className="bg-emerald-500/20 p-2 rounded-xl text-center border border-emerald-500/20 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Diet Snap */}
                            <div className="bg-zinc-900/60 p-4 rounded-3xl border border-zinc-800 flex items-center gap-4 opacity-70 scale-95 border-l-4 border-l-green-500">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Utensils className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-zinc-300 text-xs uppercase">Pré-Treino</h4>
                                        <span className="text-[8px] font-bold text-green-500 uppercase">Consumido</span>
                                    </div>
                                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Carboidratos + Creatina</p>
                                </div>
                            </div>
                        </div>

                        {/* Navbar Mock */}
                        <div className="absolute bottom-0 w-full h-20 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around px-6">
                            <div className="text-orange-500"><Dumbbell className="w-6 h-6" /></div>
                            <div className="text-zinc-600"><Utensils className="w-6 h-6" /></div>
                            <div className="text-zinc-600"><Activity className="w-6 h-6" /></div>
                        </div>
                    </div>
                </div>

                {/* Text Content (Right Side on Desktop) */}
                <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-500 mx-auto lg:mx-0">
                        <Flame className="w-3 h-3 mr-2" />
                        Para Alunos
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                        Execute com <br className="hidden md:block" />
                        <span className="text-orange-500">Maestria.</span>
                    </h2>

                    <p className="text-zinc-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                        Seu plano está traçado. Sua dieta está calculada. Seu único trabalho é executar. Acompanhe cada série, cada refeição e cada quilo perdido com precisão cirúrgica.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 group p-3 rounded-xl hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/50 transition-colors">
                                    <item.icon className="w-4 h-4 text-orange-500" />
                                </div>
                                <span className="text-sm font-bold text-zinc-300 uppercase italic tracking-wide group-hover:text-orange-400 transition-colors">
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex justify-center lg:justify-start">
                        <Button
                            asChild
                            className="w-full sm:w-auto h-14 px-8 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-xl shadow-xl shadow-orange-500/10 transition-all hover:-translate-y-1 hover:shadow-orange-500/20"
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

