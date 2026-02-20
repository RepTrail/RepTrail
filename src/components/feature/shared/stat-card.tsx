
import { Card, CardHeader } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatCardProps {
    label: string
    value: string | number
    unit?: string
    trend?: 'up' | 'down' | 'none'
    trendVal?: string
    trendLabel?: string
    icon: ReactNode
}

export function StatCard({ label, value, unit, trend, trendVal, trendLabel, icon }: StatCardProps) {
    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2rem] overflow-hidden group backdrop-blur-sm transition-all hover:border-zinc-700/50 relative">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                {icon}
            </div>
            <CardHeader className="p-8 relative z-10">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="text-emerald-500 mb-0.5">{icon}</span>
                    {label}
                </p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{value}</span>
                    <span className="text-sm font-black text-zinc-600 uppercase italic tracking-widest">{unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-6 bg-zinc-950/30 w-fit px-3 py-1.5 rounded-xl border border-zinc-800/50">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                        {trend === 'up' ? '▲' : trend === 'down' ? '▼' : ''} {trendVal}
                    </span>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{trendLabel}</span>
                </div>
            </CardHeader>
        </Card>
    )
}
