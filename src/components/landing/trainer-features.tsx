import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Grid, HeartPulse, UserCheck, ShieldCheck, Trophy, Camera, Users, Sparkles } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
    "Gestão de Alunos Ilimitados",
    "Bibliotecas de Treinos e Dietas",
    "Métricas de Evolução Detalhadas",
    "Feed de Atividade em Tempo Real",
    "Controle de Planos (Start / Pro / Elite)",
    "Perfil Público Customizável",
];

export function TrainerFeatures() {
    return (
        <section className="py-24 bg-zinc-950 px-4 md:px-6 relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950 opacity-40" />

            <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        <ShieldCheck className="w-3 h-3 mr-2" />
                        Para Personal Trainers
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                        Seu Escritório <br className="hidden md:block" />
                        <span className="text-emerald-500">de Alta Performance.</span>
                    </h2>

                    <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
                        Abandone as planilhas e o caos do WhatsApp. Tenha controle total sobre sua consultoria com um dashboard profissional que centraliza tudo.
                    </p>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {features.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 group">
                                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <span className="text-sm font-bold text-zinc-300 uppercase italic tracking-wide group-hover:text-emerald-400 transition-colors">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="pt-8">
                        <Link href="/auth/signup">
                            <Button className="h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-xl shadow-lg shadow-emerald-500/10 transition-all hover:scale-105">
                                Começar como Personal
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview / Mockup */}
                <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    <div className="absolute inset-0 bg-emerald-500 blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000" />

                    <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden">
                        {/* Mock Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse" />
                                <div className="space-y-1.5">
                                    <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                Elite Trainer
                            </div>
                        </div>

                        {/* Mock Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Users, label: "Alunos Ativos", value: "48" },
                                { icon: Trophy, label: "Ranking", value: "#3" },
                                { icon: HeartPulse, label: "Treinos Hoje", value: "124" },
                                { icon: Camera, label: "Check-ins", value: "15" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                                    <div className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-white italic">{stat.value}</div>
                                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mock Feed Item */}
                        <div className="space-y-3 pt-2">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">Atividade Recente</p>
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/30 border border-zinc-800/50">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0" />
                                    <div className="flex-1 space-y-1">
                                        <div className="h-2 w-24 bg-zinc-800 rounded" />
                                        <div className="h-1.5 w-16 bg-zinc-800/50 rounded" />
                                    </div>
                                    <div className="h-6 w-16 bg-emerald-500/10 rounded-lg border border-emerald-500/20" />
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
