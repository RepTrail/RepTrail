"use client";

import Link from "next/link";
import { Button } from "@/components/store/base/button";
import { ArrowRight, Search, Zap, Trophy, Star, CheckCircle2, Smartphone, Dumbbell, PlayCircle } from "lucide-react";
import { LandingBadge } from "./landing-badge";
import { fbqEvent } from "@/lib/meta-pixel";

export function StudentHeroSection() {
    return (
        <section className="w-full pt-[80px] md:pt-[140px] pb-[60px] md:pb-[100px] px-[20px] relative overflow-hidden bg-zinc-950 flex flex-col items-center justify-center border-b border-zinc-900/50">
            {/* Dynamic Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-zinc-950/50 to-zinc-950 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-20 pointer-events-none" />

            {/* Floating Orbs for depth */}
            <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse delay-1000 pointer-events-none" />

            <div className="w-full max-w-[1300px] mx-auto relative z-10 flex flex-col-reverse lg:grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-[40px] lg:gap-[60px] animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Left Content: The Message */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                        <LandingBadge icon={Zap} variant="orange" className="py-1.5 px-4">
                            Sua melhor fase começa <span className="text-white font-bold ml-1">Agora</span>
                        </LandingBadge>
                        <LandingBadge icon={Smartphone} variant="emerald" className="py-1.5 px-4 text-zinc-400">
                            Experiência <span className="text-white font-bold ml-1">Mobile Pro</span>
                        </LandingBadge>
                    </div>

                    <div className="flex flex-col gap-8 mb-12">
                        <h1 className="text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-[4rem] font-black tracking-normal leading-[1.1] uppercase italic">
                            <span className="block text-white text-2xl sm:text-3xl mb-2">Treine no seu Ritmo.</span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                                Supere seus Limites.
                            </span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                            Acesse treinos personalizados, acompanhe cada carga e veja sua evolução em tempo real com o <span className="text-white font-bold border-b-2 border-orange-500/30">player de treino mais avançado</span> do mercado.
                        </p>
                    </div>

                    <div className="flex flex-col items-center lg:items-start gap-8 w-full">
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-xl items-stretch sm:items-center">
                            <Button
                                asChild
                                onClick={() => fbqEvent("Lead", { content_name: "Student Hero Signup", content_category: "Landing Page Aluno" })}
                                variant="emerald"
                                size="lg"
                                hoverScale={105}
                                activeScale={95}
                                fullWidth={{ base: true, sm: false }}
                                shine
                            >
                                <Link href="/auth/signup" className="flex items-center justify-center gap-3">
                                    <span>Criar Minha Conta</span>
                                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline-zinc"
                                size="lg"
                                hoverScale={105}
                                activeScale={95}
                                fullWidth={{ base: true, sm: false }}
                            >
                                <a href="#marketplace" className="flex items-center justify-center gap-3">
                                    <Search className="h-5 w-5" />
                                    Achar um Personal
                                </a>
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 opacity-60">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Auto-Treino Inteligente
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Player Interativo
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Grátis para Começar
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content: The Mobile Mockup */}
                <div className="w-full relative group perspective-1000 mb-12 lg:mb-0 flex justify-center">
                    {/* Background Shine */}
                    <div className="absolute -inset-20 bg-emerald-500/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    {/* The Phone */}
                    <div className="relative animate-float scale-90 sm:scale-100 transition-transform duration-700 hover:scale-[1.02] w-full max-w-[320px]">
                        <div className="relative aspect-[1170/2532] bg-zinc-950 border-[10px] border-zinc-900 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 z-20 rounded-b-2xl mx-auto w-[40%] flex justify-center items-end pb-1.5">
                                <div className="w-10 h-1.5 bg-zinc-800 rounded-full"></div>
                            </div>

                            <video
                                src="/Videos/dash-inicial-do-aluno.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-500"
                            />

                            {/* Glass Reflection overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Floating Labels */}
                        <div className="absolute -top-12 -right-8 p-4 bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl animate-float-slow hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <Dumbbell className="w-4 h-4 text-zinc-950" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Auto Treino</span>
                                    <span className="text-xs font-black text-white italic">Intensidade Máxima</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-1/2 -left-12 p-3 bg-orange-500/20 backdrop-blur-xl border border-orange-500/20 rounded-2xl shadow-2xl animate-float hidden md:block delay-300">
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4 text-orange-500" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Auto Treino</span>
                                </div>
                                <span className="text-[8px] font-bold text-orange-500 uppercase">7 Dias Grátis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-[1300px] mx-auto mt-[80px] md:mt-[120px] relative z-10">
                <div className="absolute inset-0 bg-zinc-900/30 border border-zinc-800/50 rounded-[3rem] -z-10 backdrop-blur-sm" />

                <div className="grid grid-cols-2 lg:grid-cols-4 py-10 md:py-16 px-6 gap-8 items-center divide-x-0 lg:divide-x divide-zinc-800/50">
                    <NumberItem label="Alunos Ativos" value="50k+" icon={Trophy} />
                    <NumberItem label="Treinos Concluídos" value="1.2M+" icon={Dumbbell} />
                    <NumberItem label="Check-ins Hoje" value="4.5k+" icon={Zap} />
                    <NumberItem label="Nota Média App" value="4.9/5" icon={Star} />
                </div>
            </div>

            <div className="mt-12 flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] animate-pulse">
                DESCUBRA O PLAYER DE TREINO
            </div>
        </section>
    );
}

function NumberItem({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 group transition-all duration-300 hover:transform hover:scale-105">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                <Icon className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter group-hover:text-orange-400 transition-colors">{value}</p>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest text-center">{label}</p>
        </div>
    );
}
