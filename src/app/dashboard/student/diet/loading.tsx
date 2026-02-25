
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Utensils, Flame } from 'lucide-react'

export default function StudentDietLoading() {
    return (
        <div className="space-y-10 pb-20 animate-pulse">
            {/* Header Section */}
            <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-zinc-900 rounded-xl">
                        <Utensils className="w-5 h-5 text-zinc-800" />
                    </div>
                    <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
                </div>
                <Skeleton className="h-3 w-80 bg-zinc-800/50 rounded-md" />
            </div>

            {/* Diet Adherence Main Skeleton */}
            <div className="max-w-3xl mx-auto">
                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-sm p-8 space-y-10">
                    {/* Diet Info Header in Adherence */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Utensils className="w-4 h-4 text-zinc-800" />
                                    <Skeleton className="h-6 w-32 bg-zinc-800/50" />
                                </div>
                                <Skeleton className="h-3 w-48 bg-zinc-800/30" />
                            </div>
                            <Skeleton className="h-8 w-14 rounded-lg bg-zinc-800/50" />
                        </div>
                        <Skeleton className="h-4 w-full rounded-full bg-zinc-950 border border-zinc-900" />
                    </div>

                    {/* Macro Grid */}
                    <div className="grid grid-cols-6 gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-3xl">
                        <div className="h-14 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                        <div className="h-14 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                        <div className="h-14 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                        <div className="h-14 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-3" />
                        <div className="h-14 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 col-span-6 sm:col-span-3" />
                    </div>

                    {/* Meal Items */}
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-zinc-950/20 border border-zinc-900 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-12 h-12 rounded-2xl bg-zinc-800/50" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32 bg-zinc-800/50" />
                                        <Skeleton className="h-2 w-48 bg-zinc-800/30" />
                                    </div>
                                </div>
                                <Skeleton className="w-6 h-6 rounded-lg bg-zinc-800/50" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hydration Card */}
            <div className="p-8 bg-zinc-900/40 backdrop-blur-sm rounded-3xl border border-zinc-800/50 text-center space-y-4 shadow-2xl">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-zinc-800" />
                        <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                    </div>
                </div>
                <Skeleton className="h-3 w-80 mx-auto bg-zinc-800/30" />
            </div>
        </div>
    )
}
