'use client';

import { PlayCircle } from "lucide-react";
import { useState } from "react";

const videos = [
    {
        src: "/Videos/dash inicial do aluno.MP4",
        title: "Monitore o Progresso",
        desc: "Acompanhe o progresso de seu aluno em uma visão moderna e intuitiva, identificando áreas de melhoria."
    },
    {
        src: "/Videos/tela minha evolução.MP4",
        title: "Veja a Evolução",
        desc: "Monitore a evolução real dos seus alunos com dados, fotos e métricas corporais precisas."
    },
    {
        src: "/Videos/feed de alunos e perfil publico do aluno.MP4",
        title: "Conecte-se com Alunos",
        desc: "Aumente a retenção através da conexão e motivação, criando uma comunidade engajada."
    }
];

export function VideoShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-[100px] md:py-[200px] px-[20px] bg-zinc-950 w-full relative overflow-hidden border-b border-zinc-900/50">
            {/* Main Background Light - Top Right */}
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15),transparent_70%)] blur-[120px] pointer-events-none" />
            
            {/* Subtle Texture - Light Dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />
            
            {/* Secondary Bottom Glow for contrast */}
            <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-[60px] md:gap-[80px] relative z-10">
                <div className="flex flex-col items-center gap-[24px] text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000">
                    <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        RepTrail em Ação
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.95]">
                        Tecnologia <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">Imersiva.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg md:text-xl max-w-xl">
                        Veja na prática como a plataforma revoluciona a experiência de treino, engajamento e acompanhamento dos seus alunos.
                    </p>
                </div>

                <div className="w-full mx-auto relative overflow-hidden md:overflow-visible">
                    <div
                        className="flex flex-row gap-[24px] md:justify-between items-start w-full transition-transform duration-500 ease-out md:!transform-none"
                        style={{ transform: `translateX(calc(-${activeIndex * 100}% - ${activeIndex * 24}px))` }}
                    >
                        {videos.map((vid, idx) => (
                            <div key={idx} className="flex flex-col gap-[32px] group items-center shrink-0 w-full md:w-[calc(33.333%-16px)] transition-all duration-700 hover:-translate-y-4">
                                <div className="w-[85%] md:w-full mx-auto flex flex-col items-center relative">
                                    {/* Background Glow on Hover */}
                                    <div className="absolute -inset-10 bg-orange-500/0 group-hover:bg-orange-500/10 rounded-[4rem] blur-[80px] transition-all duration-1000 pointer-events-none" />

                                    <div className="relative w-full aspect-[1170/2532] bg-zinc-950 border-[10px] border-zinc-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5 transition-all duration-500 group-hover:scale-[1.03] group-hover:border-zinc-800/80 group-hover:shadow-orange-500/10">
                                        {/* Notch */}
                                        <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 z-20 rounded-b-2xl mx-auto w-[40%] flex justify-center items-end pb-1.5">
                                            <div className="w-10 h-1.5 bg-zinc-800 rounded-full"></div>
                                        </div>
                                        <video
                                            src={vid.src}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            preload="auto"
                                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                            ref={(el) => {
                                                if (!el) return;
                                                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                                    if (idx === activeIndex) el.play().catch(() => { });
                                                    else el.pause();
                                                } else {
                                                    el.play().catch(() => { });
                                                }
                                            }}
                                        />
                                        {/* Screen Reflection */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
                                    </div>
                                    
                                    <div className="text-center space-y-2 mt-8 relative z-10 transition-transform duration-500 group-hover:translate-y-2">
                                        <h3 className="text-xl font-black text-white italic uppercase tracking-wider group-hover:text-orange-500 transition-colors">
                                            {vid.title}
                                        </h3>
                                        <p className="text-sm font-medium text-zinc-500 max-w-xs mx-auto leading-relaxed">
                                            {vid.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Navigation Bullets */}
                    <div className="flex md:hidden items-center justify-center gap-4 mt-12">
                        {videos.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`h-2.5 rounded-full transition-all duration-500 ${activeIndex === idx ? 'bg-orange-500 w-10 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-zinc-800 w-2.5 hover:bg-zinc-700'}`}
                                aria-label={`Ir para a demonstração ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
