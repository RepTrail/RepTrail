
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dumbbell, Clock } from 'lucide-react'

/**
 * Workouts Loading Skeleton
 *
 * Two layouts exist side by side:
 *   - Trainer view (!allowManualWorkouts): header without buttons; 3-col grid of assignment
 *     cards (Dumbbell icon + clock/duration chip + workout name + description + "Programado para X" row)
 *   - Auto-training view (allowManualWorkouts): header WITH "Importar PDF" + "Criar Modelo" buttons;
 *     3-col grid of library template cards (Dumbbell icon + delete btn + workout name + exercise count +
 *     day badges + "Agendar" / "Editar" / duplicate action buttons)
 *
 * Strategy: skeleton mirrors the TRAINER ASSIGNMENT CARD layout (dominant production case).
 * Header is neutral (no action buttons). Cards replicate the exact structure of trainer cards:
 * icon box + duration badge (top-right) | title | description | divider | day/scheduled row.
 */
export default function StudentWorkoutsLoading() {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Header — neutral (no CTA buttons) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 ">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                            <Dumbbell className="w-5 h-5 text-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-52 bg-zinc-800/50 rounded-xl" />
                    </div>
                    <Skeleton className="h-4 w-80 max-w-full bg-zinc-800/30 rounded-md" />
                </div>
                {/* Placeholder for optional buttons (auto-training) */}
                <div className="hidden sm:flex items-center gap-3 pb-4">
                    <Skeleton className="h-12 w-32 rounded-xl bg-zinc-800/30" />
                    <Skeleton className="h-12 w-32 rounded-xl bg-zinc-800/40" />
                </div>
            </div>

            {/* 3-column workout card grid — matches trainer assignment card structure */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="p-8 pb-4 space-y-6">
                            {/* Icon + duration badge row */}
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                                    <Dumbbell className="w-8 h-8 text-zinc-800" />
                                </div>
                                {/* Duration chip */}
                                <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-2xl flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-zinc-800" />
                                    <Skeleton className="h-3 w-10 bg-zinc-800/50 rounded" />
                                </div>
                            </div>
                            {/* Workout name + description */}
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-3/4 bg-zinc-800/50 rounded-lg" />
                                <Skeleton className="h-3 w-full bg-zinc-800/30 rounded" />
                                <Skeleton className="h-3 w-4/5 bg-zinc-800/20 rounded" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-6">
                            {/* Divider + Programado day row */}
                            <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="h-2 w-16 bg-zinc-800/30 rounded" />
                                    <Skeleton className="h-3.5 w-24 bg-zinc-800/50 rounded" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
