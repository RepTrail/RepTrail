'use client'

import { Activity } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function InactiveTrainerCard({ trainerName }: { trainerName: string | null }) {
    return (
        <RegistryMain
            title="STATUS DO PLANO"
            subtitle="Atenção necessária: seu personal trainer está inativo."
            icon={Activity}
            contextLabel="Área do Aluno"
            showTabs={false}
        >
            <Stack gap={{ base: "empty_state", md: 'section' }} className="animate-in fade-in duration-700">
                <header className="space-y-8">
                    <div className="relative group overflow-hidden p-6 sm:p-12 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-50" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 space-y-6 text-center md:text-left">
                                <div className="space-y-5">
                                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                                        Seu Personal <br /><span className="text-red-500">ficou Inativo</span>
                                    </h2>
                                    <p className="text-zinc-500 text-sm md:text-lg font-medium leading-relaxed max-w-md mx-auto md:mx-0">
                                        Infelizmente, seu personal trainer {trainerName} não utiliza mais a plataforma RepTrail.
                                        Para continuar seus treinos, você pode procurar um novo personal ou ativar o Auto-Training.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                                    <Link href="/buscar-personal"><Button className="h-16 px-10 rounded-2xl bg-white text-zinc-950 font-black uppercase italic tracking-wide text-lg">Procurar Novo Personal</Button></Link>
                                    <Link href="/dashboard/student/plans"><Button variant="outline" className="h-16 px-10 rounded-2xl text-orange-500 font-black uppercase italic tracking-widest text-lg">Ativar Auto-Training</Button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            </Stack>
        </RegistryMain>
    )
}
