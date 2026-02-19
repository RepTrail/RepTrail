import { Zap, Shield, Repeat, Globe } from "lucide-react";

const differentials = [
    {
        icon: Shield,
        title: "Profissionalismo",
        description: "Sua marca merece uma casa própria. Personalize seu perfil e transmita autoridade.",
    },
    {
        icon: Repeat,
        title: "Escalabilidade",
        description: "Multiplique seus alunos sem aumentar a carga horária. Ferramentas de automação que trabalham por você.",
    },
    {
        icon: Globe,
        title: "Alcance Global",
        description: "Sem barreiras geográficas. Atenda alunos de qualquer lugar do mundo com a mesma qualidade.",
    },
    {
        icon: Zap,
        title: "Gamificação Real",
        description: "Engaje seus alunos com rankings, níveis e conquistas que tornam o treino viciante.",
    },
];

export function DifferentialsSection() {
    return (
        <section className="py-24 bg-zinc-950 px-4 md:px-6 relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-800/10 via-zinc-950 to-zinc-950" />

            <div className="container mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        Por que o <span className="text-emerald-500">RepTrail?</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Desenvolvido por quem vive o esporte, para quem respira performance.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {differentials.map((item, idx) => (
                        <div key={idx} className="flex gap-6 items-start group">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                                <item.icon className="w-8 h-8 text-zinc-500 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-wide group-hover:text-emerald-500 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-500 text-sm font-medium leading-relaxed group-hover:text-zinc-400 transition-colors">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
