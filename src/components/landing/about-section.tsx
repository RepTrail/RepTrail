import { Zap, Layers, BarChart, ShoppingBag } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "Ecossistema Digital",
        description: "Conecte-se a uma rede integrada onde prescrição e execução acontecem em perfeita harmonia.",
    },
    {
        icon: BarChart,
        title: "Gestão Completa",
        description: "Dashboard poderoso para personal trainers controlarem alunos, pagamentos e evolução.",
    },
    {
        icon: Zap,
        title: "Sistema de Acompanhamento",
        description: "Monitoramento em tempo real de treinos, dietas, cardios e feedbacks dos alunos.",
    },
    {
        icon: ShoppingBag,
        title: "Marketplace de Elite",
        description: "A vitrine definitiva para encontrar os melhores profissionais do mercado fitness.",
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
                        Muito mais que um app de treino. Somos a infraestrutura completa para escalar consultorias esportivas e garantir resultados reais.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/30 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                <feature.icon className="w-24 h-24" />
                            </div>

                            <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 mb-6 group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-colors shadow-lg">
                                <feature.icon className="w-7 h-7 text-white group-hover:text-emerald-500 transition-colors" />
                            </div>

                            <h3 className="text-xl font-black text-white uppercase italic mb-3 tracking-wide group-hover:text-emerald-500 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-zinc-500 text-sm font-medium leading-relaxed group-hover:text-zinc-400 transition-colors">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
