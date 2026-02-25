
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dumbbell, Clock } from 'lucide-react'

export default function StudentWorkoutsLoading() {
    return (
        <div className="space-y-10 animate-pulse">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                            <Dumbbell className="w-5 h-5 text-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
                    </div>
                </div>
                <Skeleton className="h-3 w-80 bg-zinc-800/50 rounded-md" />
            </div>

            {/* Workouts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
                        <CardHeader className="p-8 pb-4 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl">
                                    <Dumbbell className="w-8 h-8 text-zinc-800 shadow-inner" />
                                </div>
                                <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-2xl">
                                    <Clock className="w-3.5 h-3.5 text-zinc-800 opacity-50" />
                                    <Skeleton className="h-3 w-10 bg-zinc-800/50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-3/4 bg-zinc-800/50 rounded-lg" />
                                <Skeleton className="h-3 w-full bg-zinc-800/20" />
                                <Skeleton className="h-3 w-1/2 bg-zinc-800/20" />
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 space-y-6">
                            <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                                <div className="flex flex-col gap-1.5">
                                    <Skeleton className="h-2 w-12 bg-zinc-800/50" />
                                    <Skeleton className="h-3 w-20 bg-zinc-800/30" />
                                </div>
                                <Skeleton className="h-10 w-24 rounded-xl bg-zinc-800/50" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
