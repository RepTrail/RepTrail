
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Utensils, Sparkles, ArrowLeft } from 'lucide-react'

export default function DietBuilderLoading() {
    return (
        <div className="max-w-5xl mx-auto  sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
            {/* Header / Totals Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3 pb-4">
                        <Skeleton className="h-10 w-64 bg-zinc-800/50 rounded-xl" />
                        <Skeleton className="h-8 w-8 bg-zinc-800/30 rounded-xl" />
                    </div>
                    <Skeleton className="h-3 w-48 bg-zinc-800/20 rounded-md" />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl min-w-[80px] space-y-2">
                                <Skeleton className="h-2 w-12 mx-auto bg-zinc-800/50" />
                                <Skeleton className="h-6 w-16 mx-auto bg-zinc-800/30" />
                            </div>
                        ))}
                    </div>
                    <div className="w-full sm:w-auto h-[68px] px-6 bg-zinc-900/50 border border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-1">
                        <Sparkles className="w-5 h-5 text-zinc-800" />
                        <Skeleton className="h-2 w-20 bg-zinc-800/50" />
                    </div>
                </div>
            </div>

            {/* Meal Cards Skeleton */}
            <div className="space-y-6">
                {[1, 2].map((meal) => (
                    <Card key={meal} className="bg-zinc-950 border-zinc-800 overflow-hidden shadow-xl">
                        <div className="p-4 bg-zinc-900/40 border-b border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-zinc-800 p-2.5 rounded-xl border border-zinc-700/50">
                                    <Utensils className="w-4 h-4 text-zinc-800" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32 bg-zinc-800/50" />
                                    <Skeleton className="h-2 w-24 bg-zinc-800/30" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="hidden md:flex gap-3 mr-4">
                                    <Skeleton className="h-2 w-12 bg-zinc-800/30" />
                                    <Skeleton className="h-2 w-12 bg-zinc-800/30" />
                                    <Skeleton className="h-2 w-12 bg-zinc-800/30" />
                                </div>
                                <Skeleton className="h-8 w-8 bg-zinc-800/50 rounded-lg" />
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="p-3 lg:p-4 border-b border-zinc-900/40 flex items-start lg:items-end gap-2 lg:gap-3">
                                    <div className="shrink-0 mt-7 lg:mt-0 lg:mb-2.5 flex items-center justify-center">
                                        <div className="h-4 w-4 bg-zinc-800/30 rounded" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-12 gap-2 lg:gap-4 items-end">
                                        <div className="col-span-12 lg:col-span-5 space-y-2">
                                            <Skeleton className="h-2 w-16 bg-zinc-800/50" />
                                            <Skeleton className="h-9 w-full bg-zinc-900/80 rounded-xl" />
                                        </div>
                                        <div className="col-span-4 lg:col-span-2 space-y-2">
                                            <Skeleton className="h-2 w-12 bg-zinc-800/50" />
                                            <Skeleton className="h-9 w-full bg-zinc-900/80 rounded-xl" />
                                        </div>
                                        <div className="col-span-8 lg:col-span-3 grid grid-cols-3 gap-1.5">
                                            <div className="space-y-2">
                                                <Skeleton className="h-2 w-8 bg-zinc-800/50" />
                                                <Skeleton className="h-9 w-full bg-zinc-900/80 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="h-2 w-8 bg-zinc-800/50" />
                                                <Skeleton className="h-9 w-full bg-zinc-900/80 rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Skeleton className="h-2 w-8 bg-zinc-800/50" />
                                                <Skeleton className="h-9 w-full bg-zinc-900/80 rounded-xl" />
                                            </div>
                                        </div>
                                        <div className="col-span-12 lg:col-span-2 flex items-center justify-end gap-1.5 mt-1 lg:mt-0">
                                            <Skeleton className="h-9 w-8 bg-zinc-900/80 rounded-xl" />
                                            <Skeleton className="h-9 w-8 bg-zinc-900/80 rounded-xl" />
                                            <Skeleton className="h-9 w-8 bg-zinc-900/80 rounded-xl" />
                                            <Skeleton className="h-9 w-8 bg-zinc-900/80 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-4 bg-zinc-900/20">
                                <Skeleton className="h-10 w-full bg-zinc-900/50 rounded-xl" />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* New Meal Form Skeleton */}
                <div className="bg-zinc-900/30 p-8 rounded-2xl border-2 border-dashed border-zinc-800/50 flex flex-col md:flex-row gap-6 items-end mt-12">
                    <div className="flex-1 space-y-3 w-full">
                        <Skeleton className="h-2 w-32 bg-zinc-800/50" />
                        <Skeleton className="h-11 w-full bg-zinc-950/80 border border-zinc-800 rounded-xl" />
                    </div>
                    <Skeleton className="h-11 w-48 bg-zinc-800/50 rounded-xl" />
                </div>

                {/* Footer Skeleton */}
                <div className="pt-12 flex justify-center border-t border-zinc-800/30">
                    <div className="flex items-center gap-2 px-6 h-12">
                        <ArrowLeft className="w-4 h-4 text-zinc-800" />
                        <Skeleton className="h-4 w-48 bg-zinc-800/50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
