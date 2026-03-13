
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Activity, Flame, History } from 'lucide-react'

/**
 * Cardio Loading Skeleton
 *
 * Since loading.tsx is static (no auth context), we approximate:
 * - Header: always identical between trainer/auto-training views
 * - Main content: matches the TRAINER layout (CardioInfoCard — full-width vertical cards
 *   with icon, title, intensity bar, duration badge, day badges, kcal stat, notes block)
 *   This is also the closest match to the auto-training card height-wise.
 * - Sidebar: "Dicas de Cardio" — identical in both views, rendered faithfully.
 */
export default function StudentCardioLoading() {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Header - same for trainer & auto-training */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 ">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                            <Activity className="w-5 h-5 text-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-56 bg-zinc-800/50 rounded-xl" />
                    </div>
                    <Skeleton className="h-4 w-80 max-w-full bg-zinc-800/30 rounded-md" />
                </div>
                {/* Placeholder for optional "Criar Modelo" button (auto-training only) */}
                <Skeleton className="h-12 w-36 rounded-xl bg-zinc-800/40 hidden sm:block" />
            </header>

            <div className="grid gap-10 lg:grid-cols-12 ">
                {/* Main content col — mirrors trainer's "Sessões Pendentes" layout */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Section title */}
                    <div className="flex items-center gap-2 px-2">
                        <Activity className="w-4 h-4 text-zinc-800" />
                        <Skeleton className="h-3 w-36 bg-zinc-800/50 rounded" />
                    </div>

                    {/* CardioInfoCard skeletons — full-width, tall cards matching the real component */}
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <Card key={i} className="bg-zinc-900/40 border-zinc-800/50 rounded-[2.5rem] overflow-hidden">
                                <div className="p-8 space-y-6">
                                    {/* Top row: icon + title + intensity + kcal stat */}
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="space-y-4 flex-1">
                                            {/* Name + intensity bar */}
                                            <div className="flex items-center gap-3 pb-4">
                                                <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800">
                                                    <Activity className="w-6 h-6 text-zinc-800" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-7 w-48 bg-zinc-800/50 rounded-lg" />
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3].map((d) => (
                                                                <div key={d} className="w-3 h-1 rounded-full bg-zinc-800" />
                                                            ))}
                                                        </div>
                                                        <Skeleton className="h-2 w-28 bg-zinc-800/30 rounded" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Duration + day badges */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                                                    <Skeleton className="h-3.5 w-3.5 rounded-sm bg-zinc-800" />
                                                    <Skeleton className="h-3 w-20 bg-zinc-800/50 rounded" />
                                                </div>
                                                {[1, 2, 3].map((d) => (
                                                    <div key={d} className="px-3 py-1.5 bg-zinc-950/30 rounded-xl border border-zinc-800/30">
                                                        <Skeleton className="h-3 w-8 bg-zinc-800/40 rounded" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Kcal stat box */}
                                        <div className="flex flex-col items-center gap-1 p-3 bg-zinc-950/30 rounded-2xl border border-zinc-800/50 min-w-[80px]">
                                            <Flame className="w-4 h-4 text-zinc-800" />
                                            <Skeleton className="h-2 w-12 bg-zinc-800/30 rounded" />
                                            <Skeleton className="h-5 w-10 bg-zinc-800/50 rounded mt-1" />
                                        </div>
                                    </div>

                                    {/* Notes / Instruções do Treinador block */}
                                    <div className="p-6 rounded-3xl bg-zinc-950/40 border border-zinc-800/50 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-3.5 w-3.5 rounded-sm bg-zinc-800/50" />
                                            <Skeleton className="h-2.5 w-36 bg-zinc-800/30 rounded" />
                                        </div>
                                        <Skeleton className="h-3 w-full bg-zinc-800/20 rounded ml-4" />
                                        <Skeleton className="h-3 w-3/4 bg-zinc-800/20 rounded ml-4" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar — "Dicas de Cardio" — identical in both layouts */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center gap-2 px-2">
                        <History className="w-4 h-4 text-zinc-800" />
                        <Skeleton className="h-3 w-28 bg-zinc-800/50 rounded" />
                    </div>
                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[2.5rem] p-8 space-y-6">
                        {/* Intensidade */}
                        <div className="space-y-2">
                            <Skeleton className="h-2.5 w-20 bg-zinc-800/40 rounded" />
                            <Skeleton className="h-3 w-full bg-zinc-800/20 rounded" />
                            <Skeleton className="h-3 w-4/5 bg-zinc-800/20 rounded" />
                        </div>
                        {/* Hidratação */}
                        <div className="space-y-2">
                            <Skeleton className="h-2.5 w-24 bg-zinc-800/40 rounded" />
                            <Skeleton className="h-3 w-full bg-zinc-800/20 rounded" />
                            <Skeleton className="h-3 w-3/4 bg-zinc-800/20 rounded" />
                        </div>
                        {/* Metabolismo */}
                        <div className="pt-4 border-t border-zinc-800 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-zinc-800" />
                            <Skeleton className="h-2.5 w-28 bg-zinc-800/30 rounded" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
