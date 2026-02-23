import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Loading() {
    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Navigation Header */}
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest italic">Carregando...</span>
                    </div>
                </div>
            </div>

            {/* Hero Section Skeleton */}
            <div className="max-w-6xl mx-auto px-6 pt-12">
                <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900/40 border border-white/5 p-8 md:p-12 mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                        <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-zinc-800" />
                        <div className="flex-1 text-center md:text-left space-y-4">
                            <Skeleton className="h-12 w-64 bg-zinc-800 mx-auto md:mx-0" />
                            <Skeleton className="h-6 w-48 bg-zinc-800 mx-auto md:mx-0" />
                            <Skeleton className="h-14 w-56 bg-zinc-800 mx-auto md:mx-0 rounded-2xl" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48 bg-zinc-800" />
                        <Skeleton className="h-[400px] w-full bg-zinc-900/40 rounded-[2.5rem]" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-8 w-48 bg-zinc-800" />
                        <Skeleton className="h-[400px] w-full bg-zinc-900/40 rounded-[2.5rem]" />
                    </div>
                </div>
            </div>
        </div>
    )
}
