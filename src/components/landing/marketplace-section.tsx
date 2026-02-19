'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Trophy, Users, ShieldCheck, ArrowRight } from "lucide-react";
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
        trainer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainer.trainer_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleContact = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setIsModalOpen(true);
    };

    return (
        <section id="marketplace" className="py-24 bg-zinc-950 px-4 md:px-6 border-b border-zinc-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/10 via-zinc-950 to-zinc-950" />

            <div className="container mx-auto relative z-10 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        <Users className="w-3 h-3 mr-2" />
                        Marketplace Oficial
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                        Encontre seu <span className="text-emerald-500">Parceiro de Treino.</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Conecte-se com os melhores profissionais do mercado. Busque por nome, especialidade ou ranking.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 shadow-2xl transition-all focus-within:border-emerald-500/50">
                        <Search className="w-5 h-5 text-zinc-500 mr-2" />
                        <Input
                            placeholder="Buscar treinador..."
                            className="border-none bg-transparent h-10 text-white placeholder:text-zinc-600 focus-visible:ring-0 text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTrainers.slice(0, 8).map((trainer) => (
                        <Card key={trainer.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden flex flex-col p-6 space-y-4">

                            <div className="flex items-start justify-between">
                                <Avatar className="h-16 w-16 border-2 border-zinc-800 group-hover:border-emerald-500 transition-colors">
                                    <AvatarImage src={trainer.avatar_url} />
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-bold uppercase">
                                        {trainer.full_name?.substring(0, 2)}
                                    </AvatarFallback>
                                </Avatar>

                                {trainer.plan_tier === 'elite' && (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Elite
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white italic uppercase truncate group-hover:text-emerald-500 transition-colors">
                                    {trainer.full_name}
                                </h3>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide truncate">
                                    {trainer.specialties?.[0] || 'Alta Performance'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-800/50 mt-auto">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    <span className="text-xs font-bold">{trainer.rating ? trainer.rating.toFixed(1) : '5.0'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400 justify-end">
                                    <Trophy className="w-3.5 h-3.5 text-zinc-600" />
                                    <span className="text-xs font-bold">Top Rank</span>
                                </div>
                            </div>

                            <Button
                                className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold uppercase text-[10px] tracking-widest mt-4"
                                onClick={() => handleContact(trainer)}
                            >
                                Entrar em Contato
                            </Button>
                        </Card>
                    ))}
                </div>

                {filteredTrainers.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl">
                        <p className="text-zinc-500 font-medium italic">Nenhum treinador encontrado com este nome.</p>
                    </div>
                )}

                {filteredTrainers.length > 8 && (
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
            />
        </section>
    );
}
