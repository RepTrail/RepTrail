"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Users, Trophy, Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { LandingBadge } from "./landing-badge";
import { fbqEvent } from "@/lib/meta-pixel";

export function HeroSection() {
    return (
        <section className="w-full pt-[80px] md:pt-[140px] pb-[60px] md:pb-[100px] px-[20px] relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center border-b border-zinc-900/50">
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-zinc-950/50 to-zinc-950 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-20 pointer-events-none" />

            {/* Floating Orbs for depth */}
            <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[150px] animate-pulse delay-1000 pointer-events-none" />

            <div className="w-full max-w-[1300px] mx-auto relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-[30px] lg:gap-[40px] animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Left Content: The Message */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                        <LandingBadge icon={Users} variant="emerald" className="py-1.5 px-4">
                            <span className="text-emerald-400 font-bold mr-1">+500</span> treinadores ativos
                        </LandingBadge>
                        <LandingBadge icon={ShieldCheck} variant="emerald" className="py-1.5 px-4 text-zinc-400">
                            Foco total em <span className="text-white font-bold ml-1">Performance</span>
                        </LandingBadge>
                    </div>

                    <div className="flex flex-col gap-8 mb-12">
                        <h1 className="text-3xl sm:text-3xl lg:text-[3.2rem] xl:text-[3.8rem] font-black tracking-normal leading-[1.1] uppercase italic">
                            <span className="block text-white">Transforme sua</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">
                                Consultoria.
                            </span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                            Aumente a <span className="text-white font-bold border-b-2 border-emerald-500/30">retenção dos seus alunos</span> e simplifique sua gestão com a plataforma preferida dos profissionais de elite.
                        </p>
                    </div>

                    <div className="flex flex-col items-center lg:items-start gap-8 w-full">
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-xl items-stretch sm:items-center">
                            <Button
                                asChild
                                onClick={() => fbqEvent("Lead", { content_name: "Hero Start Now", content_category: "Landing Page" })}
                                className="group relative overflow-hidden w-full sm:w-auto h-auto py-5 px-10 text-lg bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wider rounded-2xl transition-all hover:-translate-y-1 active:scale-95"
                            >
                                <Link href="/auth/signup" className="flex items-center justify-center gap-3">
                                    <span>Começar Agora</span>
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Montagem em 2min
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Grátis até 5 alunos
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Suporte VIP
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: The Visual Proof */}
                <div className="w-full relative group perspective-1000 mb-0 lg:mb-0">
                    {/* Background Shine */}
                    <div className="absolute -inset-20 bg-orange-500/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    {/* The Laptop */}
                    <div className="relative animate-float scale-90 sm:scale-100 transition-transform duration-700 hover:scale-[1.02]">
                        {/* Upper Screen Frame */}
                        <div className="relative mx-auto rounded-t-[1.5rem] p-[2px] bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-2xl">
                            <div className="relative bg-zinc-950 rounded-t-[1.4rem] overflow-hidden border-[6px] border-zinc-900 aspect-video w-full">
                                {/* Camera Dot */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-800 z-50 ring-1 ring-white/10" />

                                <video
                                    src="/Videos/desktop video.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-top object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                                />

                                {/* Glass Reflection overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />

                                {/* Inner Screen Shadow */}
                                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
                            </div>
                        </div>

                        {/* Bottom Case / Keyboard Area */}
                        <div className="relative mx-auto h-[12px] md:h-[18px] w-[108%] -left-[4%] bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-b-xl border-t border-zinc-700/30">
                            {/* MacBook Notch Area */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-[4px] bg-zinc-900 rounded-b-lg" />
                        </div>
                    </div>

                    {/* Floating Tech Elements */}
                    <div className="absolute -top-12 -left-4 p-4 bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl animate-float-slow hidden md:block">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Faturamento Mensal</span>
                            <span className="text-lg font-black text-orange-500 italic">R$ 12.450,00</span>
                        </div>
                    </div>

                    <div className="absolute -bottom-6 -right-4 p-4 bg-orange-500/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl shadow-2xl animate-float hidden md:block delay-300">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                                <Users className="w-4 h-4 text-zinc-950" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-emerald-400 uppercase">Novos Alunos</span>
                                <span className="text-sm font-black text-white">+12 hoje</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1300px] mx-auto mt-[80px] md:mt-[120px] relative z-10">
                <div className="absolute inset-0 bg-zinc-900/30 border border-zinc-800/50 rounded-[3rem] -z-10 backdrop-blur-sm" />

                <div className="grid grid-cols-2 lg:grid-cols-4 py-10 md:py-16 px-6 gap-8 items-center divide-x-0 lg:divide-x divide-zinc-800/50">
                    <NumberItem label="Consultorias Ativas" value="500+" icon={Trophy} />
                    <NumberItem label="Treinos Prescritos" value="100k+" icon={Star} />
                    <NumberItem label="Taxa de Retenção" value="98%" icon={ArrowRight} />
                    <NumberItem label="Média de Avaliação" value="4.9/5" icon={Star} />
                </div>
            </div>

            <div className="mt-12 flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] animate-pulse">
                SCROLL PARA EXPLORAR O FUTURO
            </div>
        </section>
    );
}

function NumberItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 group transition-all duration-300 hover:transform hover:scale-105">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                <Icon className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter group-hover:text-emerald-400 transition-colors">{value}</p>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest text-center">{label}</p>
        </div>
    );
}
