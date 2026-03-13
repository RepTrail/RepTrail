
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Syringe, Clock, History } from 'lucide-react'

/**
 * Ergogenics Loading Skeleton
 *
 * The page has a single, near-identical layout for both trainer/auto-training students.
 * The only difference: auto-training students see an "Adicionar Substância" button in the header
 * and edit/delete buttons on cards. The skeleton omits both to stay neutral.
 *
 * Layout:
 * 1. Page header: orange Syringe icon + title + optional button
 * 2. Module section: "Aplicações de Hoje — [weekday]" heading + 2-col card grid
 *    Each card: syringe icon | (edit/delete icons for auto-training) | name | day pills | dosage | action button
 * 3. History section: history icon heading + list of log rows (icon | name + detail | date | time)
 */
export default function StudentErgogenicsLoading() {
    return (
        <div className="space-y-10 pb-10 animate-pulse">
            {/* Page header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 ">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                            <Syringe className="w-5 h-5 text-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-60 bg-zinc-800/50 rounded-xl" />
                    </div>
                    <Skeleton className="h-4 w-80 max-w-full bg-zinc-800/30 rounded-md" />
                </div>
                {/* Optional "Adicionar Substância" button (auto-training only) */}
                <Skeleton className="h-12 w-44 rounded-xl bg-zinc-800/40 hidden sm:block" />
            </header>

            <div className=" space-y-12">
                {/* Section: "Aplicações de Hoje" */}
                <div className="space-y-6">
                    {/* Section heading */}
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-zinc-800" />
                        <Skeleton className="h-3 w-40 bg-zinc-800/50 rounded" />
                    </div>

                    {/* 2-col ergogenic card grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <Card key={i} className="bg-zinc-900/50 border-zinc-800 rounded-[2rem] overflow-hidden">
                                <CardHeader className="p-6 pb-4">
                                    <div className="flex items-start justify-between">
                                        {/* Syringe icon */}
                                        <div className="bg-zinc-800 p-2 rounded-lg">
                                            <Syringe className="w-5 h-5 text-zinc-800" />
                                        </div>
                                        {/* Phantom delete/edit icons (auto-training mode) */}
                                        <div className="flex gap-1">
                                            <div className="p-2 rounded-lg bg-zinc-800/40 w-9 h-9" />
                                            <div className="p-2 rounded-lg bg-zinc-800/40 w-9 h-9" />
                                        </div>
                                    </div>
                                    {/* Substance name */}
                                    <Skeleton className="mt-4 h-6 w-3/4 bg-zinc-800/50 rounded-lg" />
                                    {/* Notes / subtitle */}
                                    <Skeleton className="mt-2 h-3 w-1/2 bg-zinc-800/30 rounded-md" />
                                </CardHeader>
                                <CardContent className="p-6 pt-2 space-y-6">
                                    {/* Application days + dosage row */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-2 w-24 bg-zinc-800/40 rounded" />
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                                <div key={d} className="w-7 h-7 rounded-lg bg-zinc-950/50 border border-zinc-800/50" />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Action button (check/register intake) */}
                                    <div className="pt-6 border-t border-zinc-800/50">
                                        <Skeleton className="h-10 w-full bg-zinc-800/50 rounded-xl" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Section: History */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-zinc-800" />
                        <Skeleton className="h-3 w-32 bg-zinc-800/50 rounded" />
                    </div>

                    <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[2.5rem] overflow-hidden">
                        <CardContent className="p-0">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-6 flex items-center justify-between border-b border-zinc-900 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800">
                                            <Syringe className="w-4 h-4 text-zinc-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32 bg-zinc-800/50 rounded" />
                                            <Skeleton className="h-2.5 w-24 bg-zinc-800/30 rounded" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <Skeleton className="h-3 w-16 bg-zinc-800/50 ml-auto rounded" />
                                        <Skeleton className="h-2 w-12 bg-zinc-800/30 ml-auto rounded" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
