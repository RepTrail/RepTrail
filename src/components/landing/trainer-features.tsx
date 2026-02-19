import { Button } from "@/components/ui/button";
import { HeartPulse, UserCheck, ShieldCheck, Trophy, Camera, Users } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
    { label: "Gestão Escalável", desc: "Painel completo para gerenciar de 10 a 1000 alunos." },
    { label: "Templates Próprios", desc: "Crie seus padrões de treinos e dietas para prescrição relâmpago." },
    { label: "Perfil de Vendas", desc: "Sua landing page própria para captar novos alunos." },
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

                    <div className="space-y-6 pt-4">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors shrink-0">
                                    <UserCheck className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-zinc-200 uppercase italic tracking-wide group-hover:text-emerald-400 transition-colors">
                                        {item.label}
                                    </h4>
                                    <p className="text-sm font-medium text-zinc-500 mt-1">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <Link href="/auth/signup" className="block md:inline-block">
                            <Button className="w-full md:w-auto h-14 px-8 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-wide rounded-xl shadow-lg shadow-emerald-500/10 transition-all hover:scale-105">
                                Começar como Personal
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview / Mockup */}
                <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    {/* Enhanced Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden ring-1 ring-white/10">
                        {/* Mock Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                    <span className="text-xs font-bold text-zinc-500">PT</span>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="h-3 w-32 bg-zinc-800 rounded animate-pulse" />
                                    <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                Elite Trainer
                            </div>
                        </div>

                        {/* Mock Stats Grid - Brighter */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Users, label: "Alunos Ativos", value: "48", color: "text-emerald-400" },
                                { icon: Trophy, label: "Ranking", value: "#3", color: "text-yellow-400" },
                                { icon: HeartPulse, label: "Treinos Hoje", value: "124", color: "text-blue-400" },
                                { icon: Camera, label: "Check-ins", value: "15", color: "text-purple-400" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4 hover:border-zinc-700 transition-colors">
                                    <div className="p-2.5 bg-zinc-900 rounded-xl text-zinc-500 border border-zinc-800">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className={`text-xl font-black italic ${stat.color}`}>{stat.value}</div>
                                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mock Feed Item */}
                        <div className="space-y-3 pt-2">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">Atividade Recente</p>
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-zinc-700" />
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
