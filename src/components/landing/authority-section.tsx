
import { ShieldCheck, Award, Zap, CheckCircle2 } from "lucide-react";

export function AuthoritySection() {
    return (
        <section className="py-[var(--spacing-app-section)] px-[var(--spacing-app-container)] bg-surface-950 w-full relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-brand-primary/5 via-surface-950 to-surface-950" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center text-center gap-[var(--spacing-app-section)] relative z-10">
                <div className="flex flex-col items-center gap-[var(--spacing-app-item)] max-w-3xl">
                    <div className="inline-flex items-center rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                        <Award className="w-3 h-3 mr-2" />
                        Autoridade e Especialidade
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                        Desenvolvido por quem <br />
                        <span className="text-brand-primary">Vive a Performance.</span>
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Não somos apenas desenvolvedores de software. Somos entusiastas do fitness e profissionais que entendem as dores reais de quem trabalha com consultoria. O RepTrail foi criado para resolver a falta de ferramentas profissionais que realmente entregam o que prometem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-app-item)] w-full">
                    {[
                        {
                            title: "Foco total no Aluno",
                            desc: "Nossa interface foi desenhada para que o aluno nunca queira sair. Retenção é o segredo do lucro.",
                            icon: HeartPulse
                        },
                        {
                            title: "Escalabilidade Real",
                            desc: "Sistemas pensados para quem quer sair dos 10 alunos e chegar nos 1000 sem perder a qualidade.",
                            icon: Zap
                        },
                        {
                            title: "Segurança de Dados",
                            desc: "Seus dados e os dados dos seus alunos protegidos com tecnologia bancária de ponta.",
                            icon: ShieldCheck
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 hover:border-brand-primary/30 transition-all group flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <item.icon className="w-6 h-6 text-brand-primary" />
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase mb-3">{item.title}</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { HeartPulse } from "lucide-react";
