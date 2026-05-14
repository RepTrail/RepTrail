'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Dumbbell,
    Utensils,
    Activity,
    TrendingUp,
    Camera,
    Eye,
    Clock,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'

interface ActivityItem {
    type: string
    name: string
    timestamp: string
    formattedDate: string
    relativeTime: string
}

interface StudentRecentActivitiesProps {
    activities: ActivityItem[]
}

const ICON_MAP: Record<string, React.ReactNode> = {
    workout: <Dumbbell className="w-4 h-4 text-amber-500" />,
    meal: <Utensils className="w-4 h-4 text-amber-500" />,
    cardio: <Activity className="w-4 h-4 text-amber-500" />,
    weight: <TrendingUp className="w-4 h-4 text-amber-500" />,
    photo: <Camera className="w-4 h-4 text-amber-500" />,
}

const TYPE_LABEL: Record<string, string> = {
    workout: 'Treino',
    meal: 'Refeição',
    cardio: 'Cardio',
    weight: 'Peso',
    photo: 'Foto',
}

function ActivityRow({ item, isLast }: { item: ActivityItem; isLast: boolean }) {
    return (
        <div className={`flex items-center gap-4 py-3.5 ${!isLast ? 'border-b border-zinc-800/50' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                {ICON_MAP[item.type] || <Eye className="w-4 h-4 text-amber-500" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white italic uppercase tracking-tight truncate">
                    {item.name}
                </p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                    {TYPE_LABEL[item.type] || item.type} • {item.formattedDate}
                </p>
            </div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
                {item.relativeTime}
            </span>
        </div>
    )
}

export function StudentRecentActivities({ activities }: StudentRecentActivitiesProps) {
    const [expanded, setExpanded] = useState(false)

    const preview = activities.slice(0, 4)
    const extra = activities.slice(4)
    const hasMore = extra.length > 0

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm">
            <CardHeader className="bg-zinc-900/60 border-b border-zinc-800/50 py-5 flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-[10px] font-black text-amber-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Clock className="w-3.5 h-3.5" />
                    Atividades Recentes
                </CardTitle>
                {hasMore && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(v => !v)}
                        className="h-7 border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl text-[9px] uppercase font-black tracking-widest px-3 gap-1.5 transition-all"
                    >
                        {expanded ? (
                            <>Recolher <ChevronUp className="w-3 h-3" /></>
                        ) : (
                            <>Ver mais <ChevronDown className="w-3 h-3" /></>
                        )}
                    </Button>
                )}
            </CardHeader>

            <CardContent className="px-7 py-2">
                {activities.length === 0 ? (
                    <div className="flex items-center gap-4 py-6">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <Eye className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
                            Nenhuma atividade registrada
                        </p>
                    </div>
                ) : (
                    <>
                        {preview.map((item, i) => (
                            <ActivityRow
                                key={`${item.type}-${item.timestamp}-${i}`}
                                item={item}
                                isLast={!expanded && i === preview.length - 1}
                            />
                        ))}

                        {expanded && extra.map((item, i) => (
                            <ActivityRow
                                key={`extra-${item.type}-${item.timestamp}-${i}`}
                                item={item}
                                isLast={i === extra.length - 1}
                            />
                        ))}
                    </>
                )}
            </CardContent>
        </Card>
    )
}
