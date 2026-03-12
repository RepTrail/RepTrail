import { Zap, ShieldCheck, TrendingUp, Globe2 } from "lucide-react";

const differentials = [
    {
        icon: ShieldCheck,
        title: "Sistema Operacional Completo",
        description: "Substitua planilhas, PDFs e WhatsApp bagunçado por um único ambiente profissional que centraliza toda a gestão.",
    },
    {
        icon: TrendingUp,
        title: "Escalabilidade Infinita",
        description: "Estrutura pronta para gerenciar 10, 50 ou 200 alunos com o mesmo esforço e eficiência.",
    },
    {
        icon: Globe2,
        title: "Sua Marca Global",
        description: "Tenha uma landing page de vendas profissional dentro da plataforma para atrair alunos de qualquer lugar.",
    },
    {
        icon: Zap,
        title: "Engajamento Viciante",
        description: "Sistema de ranking e níveis que incentiva a consistência real dos seus alunos, aumentando a retenção.",
    },
];

export function DifferentialsSection() {
    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-zinc-800/10 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px]">
                <div className="flex flex-col gap-[20px] items-center text-center w-full mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        Por que o <span className="text-emerald-500">RepTrail?</span>
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Desenvolvido por quem vive o esporte, para quem respira performance.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row flex-wrap gap-[30px] md:gap-[20px] justify-between w-full">
                    {differentials.map((item, idx) => (
                        <div key={idx} className="flex gap-[15px] md:gap-[20px] w-full md:w-[calc(50%-10px)] items-start group md:p-6 rounded-2xl md:rounded-3xl md:hover:bg-zinc-900/30 border border-transparent md:hover:border-zinc-800/50 transition-all duration-300">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300 shadow-lg">
                                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-zinc-400 group-hover:text-emerald-400 transition-colors duration-300" />
                            </div>
                            <div className="flex flex-col gap-[10px]">
                                <h3 className="text-xl font-black text-white uppercase italic tracking-wide group-hover:text-emerald-400 transition-colors duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
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
