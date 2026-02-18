'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Play,
    Pause,
    Square,
    Timer,
    Activity,
    ChevronRight,
    Flame,
    Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import {
    startCardioSession,
    updateCardioSession,
    finishCardioSession,
    getActiveCardioSession
} from '@/actions/cardio-actions'
import { useToast } from '@/hooks/use-toast'

interface CardioPlayerProps {
    assignment: any
}

export function CardioPlayer({ assignment }: CardioPlayerProps) {
    const { toast } = useToast()
    const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle')
    const [seconds, setSeconds] = useState(0)
    const [logId, setLogId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const syncRef = useRef<NodeJS.Timeout | null>(null)
    // Duration in seconds for progress bar
    const targetSeconds = assignment.duration_minutes * 60
    const progress = Math.min((seconds / targetSeconds) * 100, 100)

    // Regressive timer: Target - Seconds Elapsed
    const remainingSeconds = Math.max(targetSeconds - seconds, 0)
    const isFinished = remainingSeconds === 0 && status !== 'idle'

    useEffect(() => {
        checkActiveSession()
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (syncRef.current) clearInterval(syncRef.current)
        }
    }, [])

    async function checkActiveSession() {
        setLoading(true)
        const active = await getActiveCardioSession()
        if (active && active.assigned_cardio_id === assignment.id) {
            setLogId(active.id)
            setSeconds(active.elapsed_seconds)
            setStatus(active.is_running ? 'running' : 'paused')
            if (active.is_running) {
                startTimer()
            }
            startSync()
        }
        setLoading(false)
    }

    function startTimer() {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setSeconds(prev => {
                if (prev >= targetSeconds) {
                    // Auto-finish or just keep going? The user said "Timer regressivo configurável".
                    // I'll keep it at target but allow the user to conclude.
                    return prev + 1
                }
                return prev + 1
            })
        }, 1000)
    }

    function stopTimer() {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
    }

    function startSync() {
        if (syncRef.current) clearInterval(syncRef.current)
        syncRef.current = setInterval(() => {
            syncProgress()
        }, 15000) // Sync every 15 seconds
    }

    async function syncProgress() {
        if (!logId) return
    }

    // Effect to handle sync when state changes
    useEffect(() => {
        if (logId && (status === 'running' || status === 'paused')) {
            const timeout = setTimeout(() => {
                updateCardioSession(logId, seconds, status === 'running')
            }, 5000)
            return () => clearTimeout(timeout)
        }
    }, [seconds, status, logId])

    async function handleStart() {
        if (!logId) {
            const res = await startCardioSession(assignment.id)
            if (res.success && res.logId) {
                setLogId(res.logId)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: 'Erro ao iniciar sessão'
                })
                return
            }
        }

        setStatus('running')
        startTimer()
        startSync()
    }

    async function handlePause() {
        setStatus('paused')
        stopTimer()
        if (logId) {
            await updateCardioSession(logId, seconds, false)
        }
    }

    async function handleStop() {
        if (remainingSeconds > 0) {
            if (!confirm('Deseja concluir o cardio antes do tempo?')) return
        } else {
            if (!confirm('Deseja finalizar este cardio?')) return
        }

        if (logId) {
            const res = await finishCardioSession(logId)
            if (res.success) {
                toast({
                    title: 'Parabéns!',
                    description: 'Cardio finalizado! Bom trabalho.'
                })
                setStatus('idle')
                setSeconds(0)
                setLogId(null)
                stopTimer()
                if (syncRef.current) clearInterval(syncRef.current)
            }
        }
    }

    function formatTime(s: number) {
        const mins = Math.floor(s / 60)
        const secs = s % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (loading) return (
        <div className="h-40 bg-zinc-900/50 rounded-3xl animate-pulse flex items-center justify-center">
            <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Carregando Player...</span>
        </div>
    )

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-t-zinc-700/10">
            <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-orange-500" />
                            <h3 className="text-xl font-black text-white italic uppercase">{assignment.cardio?.name || 'Cardio'}</h3>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {assignment.duration_minutes} min • Intensidade: {assignment.suggested_intensity}
                        </p>
                    </div>
                    {status !== 'idle' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Ativo</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">
                        {remainingSeconds > 0 ? "Tempo Restante" : "Tempo Concluído"}
                    </div>
                    <div className={`text-7xl font-black italic tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] ${remainingSeconds === 0 && status !== 'idle' ? 'text-emerald-500' : 'text-white'}`}>
                        {formatTime(remainingSeconds > 0 ? remainingSeconds : seconds)}
                    </div>
                    <Progress value={progress} className="h-2 bg-zinc-800 rounded-full w-full max-w-xs" indicatorClassName="bg-gradient-to-r from-orange-500 to-amber-500" />
                </div>

                <div className="flex items-center justify-center gap-6">
                    {status === 'running' ? (
                        <Button
                            size="icon"
                            onClick={handlePause}
                            className="w-20 h-20 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white border-2 border-zinc-700 shadow-xl transition-all active:scale-95"
                        >
                            <Pause className="w-8 h-8 fill-current" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            onClick={handleStart}
                            className="w-24 h-24 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all active:scale-95 border-8 border-zinc-950"
                        >
                            <Play className="w-10 h-10 fill-current ml-1" />
                        </Button>
                    )}

                    {(status === 'running' || status === 'paused') && (
                        <Button
                            size="icon"
                            onClick={handleStop}
                            className="w-16 h-16 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-2 border-red-500/20 transition-all active:scale-95"
                        >
                            <Square className="w-6 h-6 fill-current" />
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col items-center text-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Queima Est.</span>
                        <span className="text-sm font-black text-white italic">~{Math.round(seconds * 0.12)} kcal</span>
                    </div>
                    <div className="p-4 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col items-center text-center gap-1">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Intensidade</span>
                        <span className="text-sm font-black text-white italic">{assignment.suggested_intensity}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
