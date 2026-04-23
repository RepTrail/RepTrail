import { PlayCircle, Award, BarChart3, Search, Check, Smartphone, Camera, Beef } from "lucide-react";

const features = [
    {
        icon: PlayCircle,
        title: "Treinos e Dietas com AI",
        description: "Gere treinos complexos e planos alimentares personalizados em segundos usando nossa inteligência artificial de elite.",
        bullets: ["Geração via AI", "Macros Automáticos", "Personalização Total"]
    },
    {
        icon: Camera,
        title: "Análise de Evolução por AI",
        description: "Use nossa visão computacional para analisar sua composição corporal e progresso físico automaticamente através de fotos.",
        bullets: ["Análise de Composição", "Detecção de Progresso", "Relatórios Inteligentes"]
    },
    {
        icon: Beef,
        title: "Nutrição Inteligente",
        description: "Ajuste sua dieta em tempo real com nossa IA, que recalcula seus macros baseada no seu gasto calórico diário.",
        bullets: ["Ajuste Dinâmico", "Sugestões de Refeições", "Monitoramento de Micronutrientes"]
    },
    {
        icon: Search,
        title: "Marketplace de Treinadores",
        description: "Encontre o personal trainer ideal para o seu objetivo, seja ele emagrecimento, hipertrofia ou performance.",
        bullets: ["Chat com Treinador", "Filtro por Especialidade", "Vagas em Consultorias"]
    },
];

export function StudentAboutSection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 border-b border-zinc-900 w-full">
            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px]">
                <div className="flex flex-col items-center gap-[20px] text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        Treino de <span className="text-orange-500">Próxima Geração.</span>
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                        Mais do que um app, somos seu parceiro de evolução. Tenha acesso à <span className="text-white">tecnologia de elite</span> usada pelos maiores atletas para monitorar cada detalhe do seu progresso.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-[20px] w-full justify-between">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col w-full md:w-[calc(50%-10px)] group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 hover:border-orange-500/30 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                                <feature.icon className="w-24 h-24" />
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 mb-6 group-hover:border-orange-500/50 group-hover:text-orange-500 transition-colors shadow-lg shrink-0 z-10">
                                <feature.icon className="w-7 h-7 text-white group-hover:text-orange-500 transition-colors" />
                            </div>

                            <h3 className="text-xl font-black text-white uppercase italic mb-3 tracking-wide group-hover:text-orange-500 transition-colors z-10">
                                {feature.title}
                            </h3>

                            <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-6 flex-grow group-hover:text-zinc-400 transition-colors z-10">
                                {feature.description}
                            </p>

                            <ul className="flex flex-col gap-[10px] pt-4 border-t border-zinc-800/50 z-10">
                                {feature.bullets.map((bullet, i) => (
                                    <li key={i} className="flex items-center gap-[10px] text-xs font-bold text-zinc-500 uppercase tracking-wide group-hover:text-orange-500/80 transition-colors">
                                        <Check className="w-3 h-3 text-orange-500 shrink-0" />
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
