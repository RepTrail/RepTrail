
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Star, ShieldCheck, Flame, Search } from 'lucide-react'

export function ProductSkeleton() {
    return (
        <Card className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden pointer-events-none">
            {/* Badge Indicator Placeholder */}
            <div className="absolute top-4 left-4 z-20">
                <div className="bg-zinc-800/40 w-16 h-6 rounded transform -skew-x-12" />
            </div>

            {/* Image Placeholder */}
            <div className="relative h-72 bg-zinc-900/50 p-6 flex items-center justify-center border-b border-zinc-800/50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
                <Skeleton className="w-40 h-60 rounded-2xl bg-zinc-800/20" />
            </div>

            <CardContent className="p-6 flex-1 flex flex-col gap-5">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4 bg-zinc-800/50 rounded-md" />
                    <div className="space-y-1">
                        <Skeleton className="h-2 w-full bg-zinc-800/10" />
                        <Skeleton className="h-2 w-2/3 bg-zinc-800/10" />
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-zinc-900" />
                            <Skeleton className="h-2 w-24 bg-emerald-500/10" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <Skeleton className="h-3 w-4 bg-zinc-800/20" />
                            <Skeleton className="h-10 w-20 bg-zinc-800/40 rounded-lg" />
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <div className="flex gap-0.5 justify-end">
                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-2.5 h-2.5 text-zinc-900" />)}
                        </div>
                        <Skeleton className="h-2 w-10 bg-zinc-800/20 ml-auto" />
                        <Skeleton className="h-2 w-16 bg-zinc-800/10 ml-auto" />
                    </div>
                </div>

                <Skeleton className="h-14 w-full bg-zinc-900 border border-zinc-800/50 rounded-xl" />
            </CardContent>
        </Card>
    )
}

export default function StudentStoreLoading() {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Header Section */}
            <div className="flex items-center gap-3 ">
                <div className="p-2 bg-orange-500 rounded-xl">
                    <ShoppingBag className="w-5 h-5 text-zinc-950/20" />
                </div>
                <div className="flex items-center gap-2 overflow-hidden flex-wrap">
                    <Skeleton className="h-8 md:h-10 w-32 rounded-xl bg-zinc-800/60" />
                    <Skeleton className="h-8 md:h-10 w-24 rounded-xl bg-orange-500/20" />
                </div>
            </div>

            {/* Subtitle & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-96 max-w-full bg-zinc-800/40" />
                    <Skeleton className="h-3 w-64 bg-zinc-800/20" />
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800" />
                    <div className="h-14 w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl" />
                </div>
            </div>

            {/* Hero Card Placeholder */}
            <div className="relative rounded-[3.5rem] bg-zinc-900 border border-zinc-800/50 h-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.05),transparent_50%)]" />
                <div className="relative z-20 p-12 md:p-16 flex flex-col justify-center max-w-2xl space-y-8 h-full">
                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950/50 border border-zinc-900/50 w-fit rounded-full">
                        <Flame className="w-3 h-3 text-orange-500/30" />
                        <Skeleton className="h-2 w-32 md:w-48 bg-zinc-800/40" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-10 md:h-16 w-60 md:w-80 bg-zinc-800/40 rounded-xl md:rounded-2xl" />
                            <Skeleton className="h-10 md:h-16 w-72 md:w-96 bg-orange-500/20 rounded-xl md:rounded-2xl" />
                        </div>
                        <Skeleton className="h-4 w-56 md:w-72 bg-zinc-800/20 rounded-lg" />
                    </div>

                    <Skeleton className="h-14 w-48 rounded-2xl bg-orange-500/20 border border-orange-500/10" />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
