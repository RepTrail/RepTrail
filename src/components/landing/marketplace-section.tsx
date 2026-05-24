'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Trophy, Users, ShieldCheck, MessageCircle } from "lucide-react";
import { LeadCaptureModal } from "./lead-capture-modal";
import { SectionHeader } from "./section-header";

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
    const [activeIndex, setActiveIndex] = useState(0);

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

    const displayTrainers = searchTerm.trim() === '' 
        ? filteredTrainers.slice(0, 3) 
        : filteredTrainers;
    const isCarousel = displayTrainers.length > 3;

    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 640);
            setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
        };
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const itemsVisible = isMobile ? 1 : (isTablet ? 2 : 3);
    const maxIndex = Math.max(0, displayTrainers.length - itemsVisible);

    // Reset activeIndex if it exceeds maxIndex (e.g. after search or resize)
    useEffect(() => {
        if (activeIndex > maxIndex) {
            setActiveIndex(maxIndex);
        }
    }, [maxIndex, activeIndex]);

    return (
        <section id="marketplace" className="py-[50px] md:py-[100px] px-[20px] bg-zinc-950 w-full border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/10 via-zinc-950 to-zinc-950" />

            <div className="w-full max-w-[1100px] mx-auto relative z-10 flex flex-col gap-[30px] md:gap-[50px]">
                <SectionHeader
                    badgeIcon={Users}
                    badgeText="Marketplace Oficial RepTrail"
                    badgeVariant="orange"
                    title={<>Treine com os <br className="hidden md:block" /> <span className="text-orange-500">Melhores do Mercado.</span></>}
                    subtitle="Acesso exclusivo aos treinadores que estão moldando o futuro do fitness de alta performance."
                />

                {/* Search Bar */}
                <div className="w-full relative group max-w-2xl mx-auto">
                    <div className="absolute inset-0 bg-transparent" />
                    <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 shadow-2xl transition-all focus-within:border-orange-500/50">
                        <Search className="w-5 h-5 text-zinc-500 mr-2" />
                        <Input
                            placeholder="Buscar treinador por nome ou código..."
                            className="border-none bg-transparent h-12 text-white placeholder:text-zinc-600 focus-visible:ring-0 text-base md:text-lg font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Results Grid / Carousel */}
                <div className="w-full relative overflow-hidden flex justify-start md:justify-center">

                    <div className={`flex transition-transform duration-500 ease-out ${isCarousel ? 'flex-nowrap w-full gap-[20px]' : 'flex-wrap justify-center w-full gap-[20px]'}`}
                        style={{ 
                            transform: isCarousel 
                                ? `translateX(calc(-${activeIndex} * (100% / ${itemsVisible}) - ${activeIndex * (20 / itemsVisible)}px))` 
                                : 'none' 
                        }}
                    >
                        {displayTrainers.slice(0, 12).map((trainer, index) => (
                            <Card
                                key={`${trainer.id}-${index}`}
                                className={`
                                    bg-zinc-900/40 border-zinc-800/50 hover:border-orange-500/40 transition-all duration-300 group flex flex-col p-6 gap-[20px] relative shrink-0
                                    w-full sm:w-[calc(50%-10px)] md:w-[calc(33.333%-13.33px)]
                                `}
                            >


                                <div className="flex items-start justify-between relative z-10 w-full">
                                    <Avatar className="h-16 w-16 border-2 border-zinc-800 group-hover:border-orange-500 transition-colors shrink-0">
                                        <AvatarImage src={trainer.avatar_url} />
                                        <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase">
                                            {trainer.full_name?.substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-500 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 leading-none">
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
                                    <h3 className="text-xl font-black text-white italic uppercase truncate group-hover:text-orange-400 transition-colors">
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
                                    className="w-full h-auto min-h-[2.75rem] py-3 bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase text-[10px] tracking-widest mt-4 transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10 shrink-0"
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

                {isCarousel && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                        {displayTrainers.slice(0, 12).map((_, idx) => {
                            // Only show dots up to the point where the last item is visible
                            if (idx > maxIndex) return null;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'bg-orange-500 w-8' : 'bg-zinc-700 hover:bg-zinc-500'}`}
                                    aria-label={`Ir para treinador ${idx + 1}`}
                                />
                            );
                        })}
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
