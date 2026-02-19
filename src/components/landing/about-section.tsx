import { Zap, Layers, BarChart, ShoppingBag, Check } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "Gestão de Back-Office",
        description: "Elimine a confusão das planilhas. Gerencie pagamentos, renovações automáticas e CRM de alunos em um único painel de comando.",
        bullets: ["Faturamento Mensal", "Lembretes Automáticos", "Pipeline de Vendas"]
    },
    {
        icon: Zap,
        title: "Motor de Prescrição",
        description: "Prescreva treinos complexos e dietas milimetricamente calculadas em segundos usando seus próprios templates salvos.",
        bullets: ["Templates Personalizados", "Cálculo Nutricional", "Biblioteca 1k+ Exercícios"]
    },
    {
        icon: BarChart,
        title: "Análise de Performance",
        description: "Tome decisões baseadas em dados. Monitore a evolução real com comparativos de fotos, métricas corporais e carga progressiva.",
        bullets: ["Dashboards de Evolução", "Relatórios Trimestrais", "Checkpoint de Resultados"]
    },
    {
        icon: ShoppingBag,
        title: "Máquina de Vendas",
        description: "Sua vitrine profissional dentro do nosso marketplace oficial. Capture leads e converta novos alunos organicamente.",
        bullets: ["Página Pública Premium", "Lead Capture Modal", "SEO para Treinadores"]
    },
];

export function AboutSection() {
    return (
        <section className="py-24 bg-zinc-950 px-4 md:px-6 border-b border-zinc-900">
            <div className="container mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        Infraestrutura <span className="text-emerald-500">Professional.</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        Não somos apenas um app de treino. Entregamos o ecossistema completo para você profissionalizar sua consultoria e focar no que realmente importa: <span className="text-white">o resultado do seu aluno.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                                <feature.icon className="w-24 h-24" />
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 mb-6 group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors shadow-lg shrink-0">
                                <feature.icon className="w-7 h-7 text-white group-hover:text-emerald-500 transition-colors" />
                            </div>

                            <h3 className="text-xl font-black text-white uppercase italic mb-3 tracking-wide group-hover:text-emerald-500 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6 flex-grow group-hover:text-zinc-400 transition-colors">
                                {feature.description}
                            </p>

                            <ul className="space-y-2 pt-4 border-t border-zinc-800/50">
                                {feature.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wide group-hover:text-emerald-500/80 transition-colors">
                                        <Check className="w-3 h-3 text-emerald-500" />
                                        {bullet}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
