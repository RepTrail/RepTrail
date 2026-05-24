"use client";

import { Zap, CheckCircle2, ShieldOff, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fbqEvent } from "@/lib/meta-pixel";

export function AutoTreinoSection() {
    return (
        <section className="py-[60px] md:py-[120px] px-[20px] bg-zinc-950 w-full relative overflow-hidden border-b border-zinc-900">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-500/10 via-zinc-950 to-zinc-950 opacity-60" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-[3rem] p-8 md:p-16 backdrop-blur-md flex flex-col lg:grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center hover:border-orange-500/20 transition-all duration-500 group overflow-hidden">
                    
                    {/* Content Section */}
                    <div className="flex flex-col gap-6 text-left w-full h-full justify-center">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-black uppercase tracking-widest text-orange-500">
                                <Zap className="w-3 h-3" />
                                Módulo Auto-Treino
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
                                Treine Sozinho, <br />
                                mas com <span className="text-orange-500">Inteligência.</span>
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
                                Não precisa de um personal agora? Use nossa inteligência para <span className="text-white font-bold">prescrever seus próprios treinos</span>, controlar cargas e acompanhar sua evolução física.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide">Treinos com AI</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide">Cálculo de Macros AI</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide">Importação de PDF (AI)</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-300">
                                <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                                <span className="text-sm font-bold uppercase tracking-wide">Dietas Inteligentes</span>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                asChild
                                onClick={() => fbqEvent("Lead", { content_name: "Auto Train Start", content_category: "Landing Page Aluno" })}
                                className="group h-auto py-5 px-10 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-wider rounded-2xl transition-all hover:-translate-y-1"
                            >
                                <Link href="/auth/signup" className="flex items-center gap-3">
                                    <span>Começar meu período grátis</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Offer Badge Section */}
                    <div className="w-full relative flex justify-center lg:justify-end">
                        <div className="relative group/badge">
                            <div className="absolute -inset-10 bg-orange-500/20 rounded-full blur-[60px] opacity-0 group-hover/badge:opacity-100 transition-opacity duration-1000" />
                            <div className="relative bg-zinc-950 border-4 border-orange-500/30 rounded-[2.5rem] p-10 md:p-12 flex flex-col items-center text-center gap-6 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                                <div className="flex flex-col items-center">
                                    <span className="text-6xl md:text-8xl font-black text-white italic leading-none">07</span>
                                    <span className="text-sm md:text-base font-black text-orange-500 uppercase tracking-[0.3em]">Dias Grátis</span>
                                </div>
                                <div className="h-[2px] w-full bg-zinc-900" />
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                        <ShieldOff className="w-4 h-4 text-orange-500" />
                                        Sem Fidelidade
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                                        <CreditCard className="w-4 h-4 text-orange-500" />
                                        Sem Cartão de Crédito
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
