import { Zap, Layers, BarChart, ShoppingBag, Check } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "Gestão Centralizada",
        description: "Abandone planilhas e WhatsApp. Controle alunos ativos, pagamentos e renovações em um único painel.",
        bullets: ["Dashboard Financeiro", "Controle de Vencimentos", "Chat Integrado"]
    },
    {
        icon: Zap,
        title: "Prescrição Ágil",
        description: "Crie treinos e dietas em segundos usando nossa biblioteca inteligente ou seus próprios templates.",
        bullets: ["Bibliotecas de Exercícios", "Clonar Treinos", "Calculadora de Macros"]
    },
    {
        icon: BarChart,
        title: "Monitoramento Real",
        description: "Acompanhe a evolução do aluno com dados concretos: fotos, cargas, medidas e peso.",
        bullets: ["Gráficos de Evolução", "Comparativo de Fotos", "Histórico de Cargas"]
    },
    {
        icon: ShoppingBag,
        title: "Marketplace Oficial",
        description: "Uma página profissional sua dentro da plataforma para atrair novos alunos automaticamente.",
        bullets: ["Perfil Público SEO", "Captação de Leads", "Vitrine de Serviços"]
    },
];

export function AboutSection() {
    return (
        <section className="py-24 bg-zinc-950 px-4 md:px-6 border-b border-zinc-900">
            <div className="container mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        O que é o <span className="text-emerald-500">RepTrail?</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Muito mais que um app de treino. Somos a infraestrutura completa para escalar consultorias esportivas profissionalmente.
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
