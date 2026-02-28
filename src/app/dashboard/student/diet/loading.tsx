
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Utensils, Flame } from 'lucide-react'

/**
 * Diet Loading Skeleton
 *
 * Two very different layouts exist:
 *   - Trainer view: DietAdherence inside max-w-3xl — card with header (name + macros progress %),
 *     progress bar, macro grid (6 cols: calorias, proteínas, carbos, gorduras, fibras),
 *     then accordion meal list rows.
 *   - Auto-training view: header with two CTA buttons, 3-col grid of diet template cards,
 *     hydration card at bottom.
 *
 * Strategy: skeleton represents the TRAINER VIEW (DietAdherence) which is what the
 * majority of users with active subscriptions see. It's also the richer UI.
 * We keep the header neutral (no CTA buttons shown in skeleton) to avoid showing
 * phantom buttons that auto-training users won't have at all.
 */
export default function StudentDietLoading() {
    return (
        <div className="space-y-12 pb-20 animate-pulse">
            {/* Header — neutral, covers both views */}
            <header className="px-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-900 rounded-xl">
                        <Utensils className="w-5 h-5 text-zinc-800" />
                    </div>
                    <Skeleton className="h-10 w-52 bg-zinc-800/50 rounded-xl" />
                </div>
                <Skeleton className="h-4 w-72 bg-zinc-800/30 rounded-md mt-4" />
            </header>

            {/* DietAdherence Skeleton — max-w-3xl centered, mirrors trainer view */}
            <div className="max-w-3xl mx-auto px-4">
                <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-8 space-y-8">
                        {/* Card header: diet name + % progress */}
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Utensils className="w-4 h-4 text-zinc-800" />
                                        <Skeleton className="h-6 w-44 bg-zinc-800/50 rounded-lg" />
                                    </div>
                                    <Skeleton className="h-3 w-40 bg-zinc-800/30 rounded" />
                                </div>
                                <div className="flex items-center gap-6">
                                    {/* "Calcular Macros" optional button */}
                                    <Skeleton className="h-10 w-36 rounded-xl bg-zinc-800/30" />
                                    {/* % number */}
                                    <div className="flex items-baseline gap-1">
                                        <Skeleton className="h-9 w-10 bg-zinc-800/50 rounded-md" />
                                        <Skeleton className="h-3 w-3 bg-zinc-800/30 rounded" />
                                    </div>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <Skeleton className="h-3 w-full rounded-full bg-zinc-950 border border-zinc-900" />
                        </div>

                        {/* Macro grid — 6 cols: Calorias(3/2), Proteínas(3/2), Carbos(3/2), Gorduras(3/3), Fibras(6/3) */}
                        <div className="grid grid-cols-6 gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-3xl">
                            {/* Calorias col-span-3 sm:col-span-2 */}
                            <div className="col-span-3 sm:col-span-2 flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 gap-2">
                                <Skeleton className="h-2.5 w-14 bg-zinc-800/40 rounded" />
                                <Skeleton className="h-7 w-16 bg-zinc-800/50 rounded-md" />
                            </div>
                            {/* Proteínas */}
                            <div className="col-span-3 sm:col-span-2 flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 gap-2">
                                <Skeleton className="h-2.5 w-14 bg-zinc-800/40 rounded" />
                                <Skeleton className="h-7 w-12 bg-zinc-800/50 rounded-md" />
                            </div>
                            {/* Carbos */}
                            <div className="col-span-3 sm:col-span-2 flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 gap-2">
                                <Skeleton className="h-2.5 w-12 bg-zinc-800/40 rounded" />
                                <Skeleton className="h-7 w-12 bg-zinc-800/50 rounded-md" />
                            </div>
                            {/* Gorduras col-span-3 sm:col-span-3 */}
                            <div className="col-span-3 sm:col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 gap-2">
                                <Skeleton className="h-2.5 w-16 bg-zinc-800/40 rounded" />
                                <Skeleton className="h-7 w-12 bg-zinc-800/50 rounded-md" />
                            </div>
                            {/* Fibras col-span-6 sm:col-span-3 */}
                            <div className="col-span-6 sm:col-span-3 flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 gap-2">
                                <Skeleton className="h-2.5 w-12 bg-zinc-800/40 rounded" />
                                <Skeleton className="h-7 w-12 bg-zinc-800/50 rounded-md" />
                            </div>
                        </div>

                        {/* Meal accordion rows — collapsed state (circle + name + time + items + macro mini chips) */}
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-5 rounded-3xl bg-zinc-950/20 border border-zinc-900"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Circle checkbox placeholder */}
                                        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-zinc-900 border border-zinc-800" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-28 bg-zinc-800/50 rounded" />
                                            <Skeleton className="h-2.5 w-36 bg-zinc-800/30 rounded" />
                                        </div>
                                    </div>
                                    {/* Macro mini + chevron */}
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:flex gap-3 opacity-50">
                                            {['P', 'C', 'G', 'F'].map((m) => (
                                                <Skeleton key={m} className="h-3 w-8 bg-zinc-800/30 rounded" />
                                            ))}
                                        </div>
                                        <Skeleton className="w-5 h-5 rounded-full bg-zinc-800/30" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Hydration card — present in both layouts */}
            <div className="px-4">
                <div className="p-8 bg-zinc-900/40 backdrop-blur-sm rounded-3xl border border-zinc-800/50 text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-zinc-800" />
                            <Skeleton className="h-2.5 w-28 bg-zinc-800/40 rounded" />
                        </div>
                    </div>
                    <Skeleton className="h-3 w-72 mx-auto bg-zinc-800/30 rounded-md" />
                </div>
            </div>
        </div>
    )
}
