
import { Skeleton } from "@/components/ui/skeleton"
import { ProductSkeleton } from "../loading"
import { ArrowLeft, Search, Filter, Tag, ChevronDown } from 'lucide-react'

export default function StoreExploreLoading() {
    return (
        <div className="space-y-10 pb-20 animate-pulse">
            {/* Header / Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-zinc-900 border border-zinc-800 w-12 h-12 flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48 bg-zinc-800/50 rounded-lg" />
                        <Skeleton className="h-2 w-32 bg-zinc-800/20" />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl justify-end">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800" />
                        <div className="h-12 w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl" />
                    </div>

                    <div className="flex gap-2">
                        <div className="h-12 min-w-[140px] bg-zinc-900/50 border border-zinc-800/50 rounded-2xl flex items-center justify-between px-6">
                            <Filter className="w-3.5 h-3.5 text-zinc-800" />
                            <ChevronDown className="w-4 h-4 text-zinc-800" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3 pb-4">
                    <div className="flex -space-x-2">
                        <div className="w-2 h-8 bg-orange-500/20 transform -skew-x-12" />
                        <div className="w-2 h-8 bg-orange-500/5 transform -skew-x-12" />
                    </div>
                    <Skeleton className="h-3 w-32 bg-zinc-800/30" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}
