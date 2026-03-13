
'use client'

import { useState } from 'react'
import { ActivityItem } from '@/actions/trainer-actions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dumbbell,
    Utensils,
    Activity as ActivityIcon,
    TrendingUp,
    Camera,
    ChevronDown,
    Zap,
    Sparkles,
    Trophy,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    BedDouble
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
    activities: ActivityItem[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const visibleActivities = isExpanded ? activities : activities.slice(0, 8)

    const getTypeStyles = (type: string, subType?: string) => {
        switch (type) {
            case 'workout':
                if (subType === 'started') return { icon: <Dumbbell className="w-4 h-4" />, color: 'bg-blue-500/10 text-blue-500', label: 'Iniciou' }
                if (subType === 'success') return { icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-emerald-500/10 text-emerald-500', label: 'Sucesso' }
                if (subType === 'partial') return { icon: <ActivityIcon className="w-4 h-4" />, color: 'bg-amber-500/10 text-amber-500', label: 'Parcial' }
                if (subType === 'fail') return { icon: <XCircle className="w-4 h-4" />, color: 'bg-red-500/10 text-red-500', label: 'Falhou' }
                if (subType === 'note') return { icon: <Zap className="w-4 h-4" />, color: 'bg-purple-500/10 text-purple-500', label: 'Nota' }
                return { icon: <Dumbbell className="w-4 h-4" />, color: 'bg-emerald-500/10 text-emerald-500', label: 'Treinou' }
            case 'meal':
                return { icon: <Utensils className="w-4 h-4" />, color: 'bg-orange-500/10 text-orange-500', label: 'Dieta' }
            case 'cardio':
                if (subType === 'started') return { icon: <ActivityIcon className="w-4 h-4" />, color: 'bg-blue-500/10 text-blue-500', label: 'Iniciou' }
                return { icon: <Zap className="w-4 h-4" />, color: 'bg-emerald-500/10 text-emerald-500', label: 'Cardio' }
            case 'weight':
                return { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-indigo-500/10 text-indigo-500', label: 'Peso' }
            case 'photo':
                return { icon: <Camera className="w-4 h-4" />, color: 'bg-pink-500/10 text-pink-500', label: 'Foto' }
            case 'ergogenic':
                return { icon: <Sparkles className="w-4 h-4" />, color: 'bg-amber-500/10 text-amber-500', label: 'Ergo' }
            case 'milestone':
                return { icon: <Trophy className="w-4 h-4" />, color: 'bg-yellow-500/10 text-yellow-500', label: 'Meta 100%' }
            case 'alert':
                return { icon: <BedDouble className="w-4 h-4 text-orange-400" />, color: 'bg-orange-500/10 text-orange-400', label: 'Modo Ilha' }
            default:
                return { icon: <ActivityIcon className="w-4 h-4" />, color: 'bg-zinc-500/10 text-zinc-500', label: 'Atividade' }
        }
    }

    const formatRelativeTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const diff = Date.now() - date.getTime()
        const mins = Math.floor(diff / 60000)
        const hours = Math.floor(mins / 60)
        const days = Math.floor(hours / 24)

        if (mins < 1) return 'Agora mesmo'
        if (mins < 60) return `Há ${mins} min`
        if (hours < 24) return `Há ${hours} hr`
        return `Há ${days} d`
    }

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-zinc-800/50">
                <div className="flex items-center gap-3 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <ActivityIcon className="w-5 h-5 text-orange-500" />
                    </div>
                    <CardTitle className="text-xl font-black text-white italic uppercase tracking-tight">Atividade Recente</CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Ver Menos' : 'Ver Todos'}
                    <ChevronDown className={cn("ml-2 w-3 h-3 transition-transform duration-300", isExpanded && "rotate-180")} />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    isExpanded ? "max-h-[800px] overflow-y-auto" : "max-h-[400px] overflow-hidden"
                )}>
                    {activities.length > 0 ? (
                        <div className="divide-y divide-zinc-800/30">
                            {visibleActivities.map((activity) => {
                                const { icon, color, label } = getTypeStyles(activity.type, activity.subType)
                                return (
                                    <div key={activity.id} className="p-6 flex items-center gap-4 hover:bg-zinc-800/20 transition-colors group">
                                        <Avatar className="h-10 w-10 border border-zinc-800 group-hover:scale-105 transition-transform shrink-0">
                                            <AvatarImage src={activity.studentAvatar || ''} />
                                            <AvatarFallback className="bg-zinc-800 text-zinc-500 font-black uppercase">
                                                {activity.studentName.substring(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs font-black text-white truncate uppercase italic tracking-tight">{activity.studentName}</span>
                                                <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0", color)}>
                                                    {label}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">
                                                {activity.contentName}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" />
                                                {formatRelativeTime(activity.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center space-y-3">
                            <Clock className="w-8 h-8 text-zinc-800 mx-auto" />
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                Nenhuma atividade registrada hoje.
                            </p>
                        </div>
                    )}
                </div>
                {!isExpanded && activities.length > 8 && (
                    <div className="p-4 bg-gradient-to-t from-zinc-900 to-transparent flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white hover:bg-zinc-800"
                            onClick={() => setIsExpanded(true)}
                        >
                            + {activities.length - 8} outras atividades
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
