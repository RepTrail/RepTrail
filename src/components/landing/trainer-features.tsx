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
        <section className="py-[var(--spacing-app-section)] px-[var(--spacing-app-container)] w-full bg-surface-950 relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-brand-primary/10 via-surface-950 to-surface-950 opacity-40" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-[var(--spacing-app-section)] items-center justify-between relative z-10">
                <div className="order-2 lg:order-1 flex flex-col gap-[var(--spacing-app-item)] md:gap-[40px] w-full lg:w-[calc(50%-25px)] animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="flex flex-col gap-[var(--spacing-app-item)] items-start text-left">
                        <div className="inline-flex items-center rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                            <ShieldCheck className="w-3 h-3 mr-2" />
                            Para Personal Trainers
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                            Simplifique sua <br className="hidden md:block" />
                            <span className="text-brand-primary">Gestão de Alunos.</span>
                        </h2>

                        <p className="text-zinc-400 text-lg leading-relaxed w-full">
                            Com o RepTrail, você pode gerenciar seus pagamentos, renovações automáticas e CRM de alunos de forma eficiente, eliminando a confusão das planilhas.
                        </p>
                    </div>

                    <div className="flex flex-col gap-[var(--spacing-app-item)]">
                        {features.map((item, idx) => (
                            <div key={idx} className="flex gap-[var(--spacing-app-item)] group text-left">
                                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 group-hover:border-brand-primary/50 transition-colors shrink-0">
                                    <UserCheck className="w-5 h-5 text-brand-primary" />
                                </div>
                                <div className="flex flex-col gap-[4px]">
                                    <h4 className="text-base font-black text-zinc-200 uppercase italic tracking-wide group-hover:text-brand-primary transition-colors">
                                        {item.label}
                                    </h4>
                                    <p className="text-sm font-medium text-zinc-500">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full pt-4">
                        <Button asChild size="lg" className="w-full font-black">
                            <Link href="/auth/signup">
                                Quero simplificar minha gestão agora
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Dashboard Preview / Video */}
                <div className="order-1 lg:order-2 relative group flex justify-center lg:justify-end w-full lg:w-[calc(50%-25px)] animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-emerald-800 rounded-[3rem] blur-[80px] opacity-20 group-hover:opacity-40 transition duration-1000 w-[80%] mx-auto" />

                    <div className="w-[80%] sm:w-[70%] max-w-[400px] flex justify-center relative">
                        <div className="relative w-full aspect-[1170/2532] bg-surface-950 border-[8px] sm:border-[12px] border-zinc-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-zinc-800 transform rotate-2 transition-transform duration-500 group-hover:rotate-0">
                            {/* Notch */}
                            <div className="absolute top-0 inset-x-0 h-6 sm:h-7 bg-zinc-900 z-20 rounded-b-2xl sm:rounded-b-3xl mx-auto w-1/2 flex justify-center items-end pb-1.5 sm:pb-2">
                                <div className="w-12 h-1 bg-zinc-800 rounded-full"></div>
                            </div>

                            <video
                                src="/Videos/landing page do personal.MP4"
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
