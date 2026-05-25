import { Button } from "@/components/store/base/button";
import Link from "next/link";
import { ShieldCheck, ArrowRight, UserCheck, Sparkles } from "lucide-react";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

const features = [
    { 
        label: "Importação AI 5min", 
        desc: "Traga o protocolo do seu aluno de qualquer PDF para o app em segundos usando nossa IA.",
        icon: Sparkles
    },
    { label: "Gestão Escalável", desc: "Painel completo para gerenciar de 10 a 1000 alunos.", icon: UserCheck },
    { label: "Templates Próprios", desc: "Crie seus padrões de treinos e dietas para prescrição relâmpago.", icon: UserCheck },
    { label: "Perfil de Vendas", desc: "Sua landing page própria para captar novos alunos.", icon: UserCheck },
];

export function TrainerFeatures() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] w-full bg-zinc-950 relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950 opacity-40" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-[50px] items-center justify-between relative z-10">
                <div className="order-2 lg:order-1 flex flex-col gap-[30px] md:gap-[50px] w-full lg:w-[calc(50%-25px)] animate-in fade-in slide-in-from-left-8 duration-1000">
                    <SectionHeader 
                        align="left"
                        badgeIcon={ShieldCheck}
                        badgeText="Para Personal Trainers"
                        title={<>Simplifique sua <span className="text-emerald-500">Gestão de Alunos.</span></>}
                        subtitle="Com o RepTrail, você pode gerenciar seus pagamentos, renovações automáticas e CRM de alunos de forma eficiente, eliminando a confusão das planilhas."
                    />

                    <div className="flex flex-col gap-[20px]">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex gap-[20px] group text-left">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors shrink-0">
                                    <item.icon className={cn(
                                        "w-5 h-5 text-emerald-500",
                                        item.label.includes("AI") && "animate-pulse"
                                    )} />
                                </div>
                                <div className="flex flex-col gap-[4px]">
                                    <h4 className="text-base font-black text-zinc-200 uppercase italic tracking-wide group-hover:text-emerald-400 transition-colors">
                                        {item.label}
                                    </h4>
                                    <p className="text-sm font-medium text-zinc-500">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full">
                        <Button
                            asChild
                            variant="emerald"
                            size="lg"
                            hoverScale={105}
                            activeScale={95}
                            fullWidth={true}
                            shine
                        >
                            <Link href="/auth/signup" className="flex flex-col sm:flex-row items-center justify-center text-center leading-tight">
                                <span>Quero simplificar minha gestão agora</span>
                                <ArrowRight className="mt-2 sm:mt-0 sm:ml-2 w-5 h-5 shrink-0" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Dashboard Preview / Video */}
                <div className="order-1 lg:order-2 relative group flex justify-center lg:justify-end w-full lg:w-[calc(50%-25px)] animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    {/* Enhanced Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[3rem] blur-[80px] opacity-20 group-hover:opacity-40 transition duration-1000 w-[80%] mx-auto" />

                    <div className="w-[80%] sm:w-[70%] max-w-[400px] flex justify-center relative">
                        <div className="relative w-full aspect-[1170/2532] bg-zinc-950 border-[8px] sm:border-[12px] border-zinc-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-zinc-800 transform rotate-2 transition-transform duration-500 group-hover:rotate-0">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-6 sm:h-7 bg-zinc-900 z-20 rounded-b-2xl sm:rounded-b-3xl mx-auto w-1/2 flex justify-center items-end pb-1.5 sm:pb-2">
                                <div className="w-12 h-1 bg-zinc-800 rounded-full"></div>
                            </div>

                            <video
                                src="/Videos/landing-page-do-personal.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="w-full h-full object-cover"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
