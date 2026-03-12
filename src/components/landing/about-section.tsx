import { Zap, Layers, BarChart, ShoppingBag, Check } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "O sistema de gestão de back-office",
        description: "Elimine a confusão das planilhas e gerencie seus pagamentos, renovações automáticas e CRM de alunos de forma eficiente.",
        bullets: ["Faturamento Mensal", "Lembretes Automáticos", "Pipeline de Vendas"]
    },
    {
        icon: Zap,
        title: "Crie treinos personalizados",
        description: "Crie treinos complexos e dietas personalizadas em segundos, usando seus próprios templates na sua estrutura.",
        bullets: ["Templates Personalizados", "Cálculo Nutricional", "Biblioteca 1k+ Exercícios"]
    },
    {
        icon: BarChart,
        title: "Monitore a evolução de seus alunos",
        description: "Tome decisões baseadas em dados e monitore a evolução real de seus alunos com comparativos de fotos, métricas corporais e carga progressiva.",
        bullets: ["Dashboards de Evolução", "Relatórios Trimestrais", "Checkpoint de Resultados"]
    },
    {
        icon: ShoppingBag,
        title: "Aumente suas vendas",
        description: "Aumente suas vendas e capte novos leads com sua vitrine profissional dentro de nosso marketplace oficial.",
        bullets: ["Página Pública Premium", "Lead Capture Modal", "SEO para Treinadores"]
    },
];

export function AboutSection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 border-b border-zinc-900 w-full">
            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px]">
                <div className="flex flex-col gap-[20px] text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        Infraestrutura <span className="text-emerald-500">Professional.</span>
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                        Não somos apenas um app de treino. Entregamos o ecossistema completo para você profissionalizar sua consultoria e focar no que realmente importa: <span className="text-white">o resultado do seu aluno.</span>
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-[20px] w-full justify-between">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col w-full md:w-[calc(50%-10px)] group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                                <feature.icon className="w-24 h-24" />
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 mb-6 group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors shadow-lg shrink-0 z-10">
                                <feature.icon className="w-7 h-7 text-white group-hover:text-emerald-500 transition-colors" />
                            </div>

                            <h3 className="text-xl font-black text-white uppercase italic mb-3 tracking-wide group-hover:text-emerald-500 transition-colors z-10">
                                {feature.title}
                            </h3>

                            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6 flex-grow group-hover:text-zinc-400 transition-colors z-10">
                                {feature.description}
                            </p>

                            <ul className="flex flex-col gap-[10px] pt-4 border-t border-zinc-800/50 z-10">
                                {feature.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-center gap-[10px] text-xs font-bold text-zinc-500 uppercase tracking-wide group-hover:text-emerald-500/80 transition-colors">
                                        <Check className="w-3 h-3 text-emerald-500 shrink-0" />
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
