'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'

import { Card, CardContent } from '@/components/ui/card'
import { FlaskConical, Users, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { EmptyState } from '@/components/store/intermediary/empty-state'

interface ErgogenicStudent {
    id: string
    full_name: string
    avatar_url: string | null
    is_placeholder: boolean
}

interface TrainerErgogenicsHubClientProps {
    ergogenicStudents: ErgogenicStudent[]
}

export function TrainerErgogenicsHubClient({ ergogenicStudents }: TrainerErgogenicsHubClientProps) {
    return (
        <RegistryMain
            title="PROTOCOLO ERGOGÊNICOS"
            subtitle="Gerencie protocolos farmacológicos e suplementação avançada de seus alunos."
            icon={FlaskConical}
            contextLabel="Área do Personal"
            showTabs={false}
        >
            <Stack gap={10}>
                {ergogenicStudents.length > 0 ? (
                    <Grid gap={STORE_TOKENS.SPACING.CONTAINER} mdCols={2} lgCols={3}>
                        {ergogenicStudents.map((item) => (
                            <Card key={item.id} className="bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700 transition-all group overflow-hidden rounded-3xl">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-zinc-800 group-hover:border-orange-500/30 transition-all">
                                            <AvatarImage src={item.avatar_url || undefined} />
                                            <AvatarFallback className="bg-zinc-950 text-zinc-500 font-bold uppercase italic text-xs">
                                                {item.full_name?.substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-0.5">
                                            <h3 className="text-sm font-black text-white uppercase italic tracking-wide group-hover:text-orange-500 transition-colors">
                                                {item.full_name}
                                            </h3>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
                                                Protocolo Ativo {item.is_placeholder && "(Pendente)"}
                                            </p>
                                        </div>
                                    </div>
                                    <Button asChild variant="ghost" size="icon" className="rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:bg-orange-500 group-hover:text-zinc-950 transition-all active:scale-95">
                                        <Link href={`/dashboard/trainer/students/${item.id}/ergogenics`}>
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                ) : (
                    <EmptyState 
                        icon={FlaskConical} 
                        title="Nenhum aluno utiliza ergogênicos" 
                        description="Alunos devem habilitar o uso de ergogênicos no formulário de inscrição para aparecerem aqui." 
                    />
                )}
            </Stack>
        </RegistryMain>
    )
}
