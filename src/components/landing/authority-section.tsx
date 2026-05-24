
import { ShieldCheck, Award, Zap, HeartPulse } from "lucide-react";
import { SectionHeader } from "./section-header";

export function AuthoritySection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center text-center gap-[30px] md:gap-[50px] relative z-10">
                <SectionHeader 
                    badgeIcon={Award}
                    badgeText="Autoridade e Especialidade"
                    title={<>Desenvolvido por quem <span className="text-emerald-500">Vive a Performance.</span></>}
                    subtitle="Não somos apenas desenvolvedores de software. Somos entusiastas do fitness e profissionais que entendem as dores reais de quem trabalha com consultoria. O RepTrail foi criado para resolver a falta de ferramentas profissionais que realmente entregam o que prometem."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] w-full mt-10">
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
                        <div key={idx} className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 hover:border-emerald-500/30 transition-all group flex flex-col items-start md:items-center text-left md:text-center">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <item.icon className="w-6 h-6 text-emerald-500" />
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
