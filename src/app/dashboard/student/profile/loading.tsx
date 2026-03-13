
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ShieldCheck, User, Settings, Calendar, Ruler, Activity, Target, Phone, FileText } from 'lucide-react'

export default function StudentProfileLoading() {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Header matches StudentProfilePage header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-3 pb-4 mb-2">
                    <div className="p-2 bg-zinc-900 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-zinc-800" />
                    </div>
                    <Skeleton className="h-10 w-48 rounded-xl bg-zinc-800/50" />
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-zinc-800" />
                    <Skeleton className="h-3 w-64 bg-zinc-800/50" />
                </div>
            </header>

            <div className="space-y-10">
                {/* Optional Trial Badge placeholder - only height since it might not be there */}
                <div className="h-20 w-full rounded-3xl bg-zinc-900/30 border border-zinc-800/50" />

                <div className="grid gap-10 lg:grid-cols-12">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[3rem] overflow-hidden backdrop-blur-sm shadow-2xl">
                            <CardContent className="p-10 text-center space-y-6 flex flex-col items-center">
                                {/* Avatar Upload Skeleton */}
                                <Skeleton className="w-32 h-32 rounded-full bg-zinc-800/50 border-4 border-zinc-900 shadow-xl" />

                                <div className="space-y-2 w-full flex flex-col items-center">
                                    <Skeleton className="h-7 w-48 bg-zinc-800/50 rounded-lg" />
                                    <Skeleton className="h-3 w-32 bg-zinc-800/50 rounded-md" />
                                </div>

                                <div className="pt-6 border-t border-zinc-800/50 w-full">
                                    <div className="p-4 bg-zinc-950/50 rounded-3xl border border-zinc-800 space-y-2">
                                        <Skeleton className="h-2 w-20 mx-auto bg-zinc-800/50" />
                                        <Skeleton className="h-4 w-32 mx-auto bg-zinc-800/50" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Edit Form */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[3rem] backdrop-blur-sm shadow-2xl overflow-hidden">
                            <CardHeader className="p-10 border-b border-zinc-800/50">
                                <div className="flex items-center gap-3 pb-4">
                                    <Settings className="w-5 h-5 text-zinc-800" />
                                    <Skeleton className="h-6 w-48 bg-zinc-800/50 rounded-lg" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10">
                                <div className="space-y-10">
                                    <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
                                        {/* Input Skeletons */}
                                        {[
                                            { icon: User, label: 'Nome Completo' },
                                            { icon: Calendar, label: 'Data de Nascimento' },
                                            { icon: Ruler, label: 'Altura (cm)' },
                                            { icon: Activity, label: 'Percentual de Gordura' },
                                            { icon: Target, label: 'Objetivo principal' },
                                            { icon: Phone, label: 'WhatsApp' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="w-3.5 h-3.5 text-zinc-800" />
                                                    <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                                                </div>
                                                <Skeleton className="h-14 w-full rounded-2xl bg-zinc-950 border border-zinc-800" />
                                            </div>
                                        ))}

                                        <div className="md:col-span-2 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-3.5 h-3.5 text-zinc-800" />
                                                <Skeleton className="h-2 w-32 bg-zinc-800/50" />
                                            </div>
                                            <Skeleton className="h-14 w-full rounded-2xl bg-zinc-950 border border-zinc-800" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Skeleton className="h-20 w-full rounded-2xl bg-zinc-950 border border-zinc-800" />
                                        </div>

                                        <div className="md:col-span-2 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5 text-zinc-800" />
                                                <Skeleton className="h-2 w-48 bg-zinc-800/50" />
                                            </div>
                                            <Skeleton className="h-32 w-full rounded-2xl bg-zinc-950 border border-zinc-800" />
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                        <Skeleton className="h-3 w-64 bg-zinc-800/50" />
                                        <Skeleton className="h-16 w-full md:w-48 rounded-2xl bg-zinc-800/50 shadow-xl" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
