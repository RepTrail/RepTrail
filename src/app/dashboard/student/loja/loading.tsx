
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Search, Flame, Star, ShieldCheck } from 'lucide-react'

export default function StudentStoreLoading() {
    return (
        <div className="space-y-12 pb-20 animate-pulse">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-zinc-900 rounded-xl">
                    <ShoppingBag className="w-5 h-5 text-zinc-800" />
                </div>
                <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
            </div>

            {/* Subtitle & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-96 max-w-full bg-zinc-800/50" />
                    <Skeleton className="h-4 w-64 bg-zinc-800/30" />
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800" />
                    <div className="h-14 w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl" />
                </div>
            </div>

            {/* Hero Card Placeholder */}
            <div className="relative rounded-[3.5rem] bg-zinc-900 border border-zinc-800/50 h-[500px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10" />
                <div className="relative z-20 p-12 md:p-16 flex flex-col justify-center max-w-2xl space-y-8 h-full">
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 border border-zinc-900 w-fit rounded-full">
                        <Flame className="w-3 h-3 text-zinc-800" />
                        <Skeleton className="h-2 w-48 bg-zinc-800/50" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-20 w-80 bg-zinc-800/50 rounded-2xl" />
                        <Skeleton className="h-6 w-96 bg-zinc-800/30 rounded-lg" />
                    </div>

                    <Skeleton className="h-14 w-48 rounded-2xl bg-zinc-800/50" />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i} className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">
                        {/* Image Placeholder */}
                        <div className="relative h-72 bg-zinc-900/50 p-6 flex items-center justify-center border-b border-zinc-800/50">
                            <Skeleton className="w-32 h-32 rounded-2xl bg-zinc-800/30" />
                        </div>

                        <CardContent className="p-6 flex-1 flex flex-col gap-6">
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-3/4 bg-zinc-800/50 rounded-md" />
                                <Skeleton className="h-3 w-full bg-zinc-800/20" />
                            </div>

                            <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3 h-3 text-zinc-800" />
                                        <Skeleton className="h-2 w-24 bg-zinc-800/30" />
                                    </div>
                                    <Skeleton className="h-10 w-24 bg-zinc-800/50 rounded-lg" />
                                </div>
                                <div className="text-right space-y-2">
                                    <div className="flex gap-0.5 justify-end">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-zinc-800" />)}
                                    </div>
                                    <Skeleton className="h-2 w-10 bg-zinc-800/30 ml-auto" />
                                </div>
                            </div>

                            <Skeleton className="h-14 w-full bg-zinc-900 border border-zinc-800 rounded-xl" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
