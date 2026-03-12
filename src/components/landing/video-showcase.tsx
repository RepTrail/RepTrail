'use client';

import { PlayCircle } from "lucide-react";
import { useState } from "react";

const videos = [
    {
        src: "/Videos/dash inicial do aluno.MP4",
        title: "Monitore o Progresso",
        desc: "Acompanhe o progresso de seu aluno em uma visão moderna e intuitiva, identificando áreas de melhoria.",
        borderColorClass: "hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]",
        titleColorClass: "group-hover:text-orange-500"
    },
    {
        src: "/Videos/tela minha evolução.MP4",
        title: "Veja a Evolução",
        desc: "Monitore a evolução real dos seus alunos com dados, fotos e métricas corporais precisas.",
        borderColorClass: "hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
        titleColorClass: "group-hover:text-emerald-500"
    },
    {
        src: "/Videos/feed de alunos e perfil publico do aluno.MP4",
        title: "Conecte-se com Alunos",
        desc: "Aumente a retenção através da conexão e motivação, criando uma comunidade engajada.",
        borderColorClass: "hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]",
        titleColorClass: "group-hover:text-orange-500"
    }
];

export function VideoShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full relative overflow-hidden border-b border-zinc-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950 to-zinc-950 opacity-40" />

            <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-[30px] md:gap-[50px] relative z-10">
                <div className="flex flex-col items-center gap-[20px] text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                        <PlayCircle className="w-3 h-3 mr-2" />
                        RepTrail em Ação
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                        Tecnologia <span className="text-emerald-500">Imersiva.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg">
                        Veja na prática como a plataforma revoluciona a experiência de treino, engajamento e acompanhamento dos seus alunos.
                    </p>
                </div>

                <div className="w-full mx-auto relative overflow-hidden md:overflow-visible">
                    <div
                        className="flex flex-row gap-[20px] md:justify-between items-start w-full transition-transform duration-500 ease-out md:!transform-none"
                        style={{ transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 20}px))` }}
                    >
                        {videos.map((vid, idx) => (
                            <div key={idx} className="flex flex-col gap-[20px] group items-center shrink-0 w-full md:w-[calc(33.333%-13.33px)]">
                                <div className="w-[80%] md:w-full mx-auto flex flex-col items-center">
                                    <div className={`relative w-full aspect-[1170/2532] bg-zinc-950 border-[8px] border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-zinc-800 transition-all duration-500 ${vid.borderColorClass}`}>
                                        {/* Notch */}
                                        <div className="absolute top-0 inset-x-0 h-5 bg-zinc-900 z-20 rounded-b-xl mx-auto w-1/2 flex justify-center items-end pb-1.5">
                                            <div className="w-8 h-1 bg-zinc-800 rounded-full"></div>
                                        </div>
                                        <video
                                            src={vid.src}
                                            autoPlay={idx === 0} // Only first video starts autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="none" // Essential for memory management
                                            className="w-full h-full object-cover"
                                            ref={(el) => {
                                                if (!el) return;
                                                // Simplified control: if not active in mobile carousel, pause
                                                // Using window check for responsive behavior
                                                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                                    if (idx === activeIndex) el.play().catch(() => { });
                                                    else el.pause();
                                                } else {
                                                    // On desktop, keep initial active playing
                                                    if (idx === 0) el.play().catch(() => { });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="text-center space-y-1 mt-4">
                                        <h3 className={`text-lg font-black text-white italic uppercase transition-colors ${vid.titleColorClass}`}>
                                            {vid.title}
                                        </h3>
                                        <p className="text-xs font-medium text-zinc-500">
                                            {vid.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Navigation Bullets */}
                    <div className="flex md:hidden items-center justify-center gap-3 mt-8">
                        {videos.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-emerald-500 w-8' : 'bg-zinc-700 hover:bg-zinc-500'}`}
                                aria-label={`Ir para a demonstração ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
