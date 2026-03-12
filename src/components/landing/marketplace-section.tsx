'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Trophy, Users, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import { LeadCaptureModal } from "./lead-capture-modal";

interface Trainer {
    id: string;
    full_name: string;
    avatar_url: string;
    plan_tier: string;
    rating: number;
    specialties?: string[];
    student_count?: number;
    trainer_code?: string;
}

interface MarketplaceSectionProps {
    initialTrainers: any[];
}

export function MarketplaceSection({ initialTrainers }: MarketplaceSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredTrainers = initialTrainers.filter(trainer =>
        trainer.trainer_code && (
            trainer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.trainer_code?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleContact = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setIsModalOpen(true);
    };

    const isCarousel = filteredTrainers.length > 3;
    // Duplicate array twice to ensure smooth infinite scroll if carousel is active
    const displayTrainers = isCarousel ? [...filteredTrainers, ...filteredTrainers, ...filteredTrainers] : filteredTrainers;

    return (
        <section id="marketplace" className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10 flex flex-col gap-[30px] md:gap-[50px]">
                <div className="flex flex-col items-center gap-[20px] text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <Users className="w-3.5 h-3.5 mr-2" />
                        Marketplace Oficial RepTrail
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
                        Treine com os <br className="hidden md:block" />
                        <span className="text-emerald-500 text-glow">Melhores do Mercado.</span>
                    </h2>
                    <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Acesso exclusivo aos treinadores que estão moldando o futuro do fitness de alta performance.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full relative group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 shadow-2xl transition-all focus-within:border-emerald-500/50">
                        <Search className="w-5 h-5 text-zinc-500 mr-2" />
                        <Input
                            placeholder="Buscar treinador..."
                            className="border-none bg-transparent h-12 text-white placeholder:text-zinc-600 focus-visible:ring-0 text-base md:text-lg font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Results Grid / Carousel */}
                <div className="w-full relative overflow-hidden flex justify-center">
                    <style>
                        {`
                          @keyframes infinite-scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(calc(-33.33333% - 6.66px)); }
                          }
                          .animate-carousel {
                            animation: infinite-scroll 25s linear infinite;
                          }
                        `}
                    </style>

                    <div className={`flex gap-[20px] ${isCarousel ? 'w-max animate-carousel hover:[animation-play-state:paused]' : 'flex-wrap justify-center w-full'}`}>
                        {displayTrainers.slice(0, isCarousel ? 12 : 3).map((trainer, index) => (
                            <Card
                                key={`${trainer.id}-${index}`}
                                className={`
                                    bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 group flex flex-col p-6 gap-[20px] relative shrink-0
                                    ${isCarousel ? 'w-[280px] md:w-[calc(1100px/3-13.33px)]' : 'w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-13.33px)]'}
                                `}
                            >

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                <div className="flex items-start justify-between relative z-10 w-full">
                                    <Avatar className="h-16 w-16 border-2 border-zinc-800 group-hover:border-emerald-500 transition-colors shrink-0">
                                        <AvatarImage src={trainer.avatar_url} />
                                        <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase">
                                            {trainer.full_name?.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                                            <ShieldCheck className="w-3 h-3 shrink-0" />
                                            Verificado
                                        </div>

                                        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                                            <Users className="w-3 h-3 shrink-0" />
                                            {trainer.student_count || (trainer.id.charCodeAt(0) % 50) + 10} alunos
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 relative z-10 opacity-90 group-hover:opacity-100 transition-opacity w-full overflow-hidden">
                                    <h3 className="text-xl font-black text-white italic uppercase truncate group-hover:text-emerald-400 transition-colors">
                                        {trainer.full_name}
                                    </h3>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide truncate">
                                        {trainer.specialties?.[0] || 'Consultoria Online'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50 mt-auto relative z-10 w-full gap-[10px]">
                                    <div className="flex items-center gap-2 text-zinc-300 bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/30 whitespace-nowrap">
                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />
                                        <span className="text-xs font-bold">{trainer.rating ? trainer.rating.toFixed(1) : '5.0'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-300 justify-end bg-zinc-950/50 px-2 py-1 rounded-md border border-zinc-800/30 whitespace-nowrap overflow-hidden">
                                        <Trophy className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                        <span className="text-xs font-bold truncate">Top Personal</span>
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase text-[10px] tracking-widest mt-4 shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10 shrink-0"
                                    onClick={() => handleContact(trainer)}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2 shrink-0" />
                                    Contratar Agora
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {filteredTrainers.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl">
                        <p className="text-zinc-500 font-medium italic">Nenhum treinador encontrado com este nome.</p>
                    </div>
                )}

                {filteredTrainers.length > 6 && (
                    <div className="flex justify-center pt-8">
                        <Button variant="ghost" className="text-white hover:text-emerald-500 hover:bg-zinc-900 gap-2 font-bold uppercase tracking-widest text-xs">
                            Ver todos os treinadores <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            <LeadCaptureModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                trainerName={selectedTrainer?.full_name}
                trainerCode={selectedTrainer?.trainer_code}
            />
        </section>
    );
}
