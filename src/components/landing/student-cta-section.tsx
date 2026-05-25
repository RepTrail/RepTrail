"use client";

import Link from "next/link";
import { Button } from "@/components/store/base/button";
import { ArrowRight, Search, Zap, CheckCircle2, Trophy } from "lucide-react";
import { fbqEvent } from "@/lib/meta-pixel";

export function StudentCTASection() {
    return (
        <section className="text-center py-[60px] md:py-[120px] px-[20px] bg-zinc-950 w-full relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px] relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                <div className="flex flex-col items-center gap-[20px] max-w-4xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-500 animate-pulse">
                        <Zap className="mr-2 h-3 w-3" />
                        A Hora de Começar é Agora
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-tight">
                        Seu Melhor Físico <br className="hidden md:block" />
                        <span className="text-orange-500">Começa Aqui.</span>
                    </h2>

                    <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Junte-se a milhares de alunos que já transformaram seus treinos com o acompanhamento profissional e a tecnologia do RepTrail.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-[20px] w-full max-w-2xl mx-auto pt-8">
                    <div className="flex flex-col gap-[20px] w-full justify-center">
                        <Button
                            asChild
                            onClick={() => fbqEvent("Lead", { content_name: "Student Footer Signup", content_category: "Landing Page Aluno" })}
                            variant="orange"
                            size="lg"
                            hoverScale={105}
                            activeScale={95}
                            fullWidth={true}
                            shine
                        >
                            <Link href="/auth/signup" className="flex flex-col sm:flex-row items-center justify-center text-center leading-[1.1] sm:leading-tight py-1">
                                <span>Criar minha conta grátis</span>
                                <ArrowRight className="mt-2 sm:mt-0 sm:ml-2 h-5 w-5 shrink-0" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline-zinc"
                            size="lg"
                            hoverScale={105}
                            activeScale={95}
                            fullWidth={true}
                        >
                            <a href="#marketplace" className="flex items-center justify-center">
                                <Search className="mr-2 h-5 w-5 shrink-0" />
                                Buscar um Treinador
                            </a>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> 7 dias de Auto Treino Grátis</span>
                        <span className="hidden sm:inline text-zinc-700">•</span>
                        <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-orange-500" /> Ranking Global</span>
                        <span className="hidden sm:inline text-zinc-700">•</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Cancele quando quiser</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
