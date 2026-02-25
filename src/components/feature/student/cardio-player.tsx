'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Play,
    Pause,
    Square,
    Activity,
    Flame,
    Zap,
    CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from "@/components/ui/progress"
import {
    startCardioSession,
    updateCardioSession,
    finishCardioSession,
    getActiveCardioSession
} from '@/actions/cardio-actions'
import { useToast } from '@/hooks/use-toast'

import { useQueryClient } from '@tanstack/react-query'

interface CardioPlayerProps {
    assignment: any
    isCompleted?: boolean
}

export function CardioPlayer({ assignment, isCompleted }: CardioPlayerProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle')
    const [seconds, setSeconds] = useState(0)
    const [logId, setLogId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [wakeLock, setWakeLock] = useState<any>(null)

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const syncRef = useRef<NodeJS.Timeout | null>(null)

    // Duration in seconds for progress bar
    const targetSeconds = assignment.duration_minutes * 60

    // Regressive timer calculation
    const remainingSeconds = Math.max(targetSeconds - seconds, 0)
    const progress = Math.min((seconds / targetSeconds) * 100, 100)

    useEffect(() => {
        if (!isCompleted) {
            checkActiveSession()
        } else {
            setLoading(false)
        }

        // Midnight check: if day changes, refresh everything
        const currentDay = new Date().toDateString()
        const interval = setInterval(() => {
            if (new Date().toDateString() !== currentDay) {
                console.log('Day changed! Resetting cardio player...')
                window.location.reload() // Simplest way to force lazy closure logic
            }
        }, 60000)

        return () => {
            clearInterval(interval)
            if (timerRef.current) clearInterval(timerRef.current)
            if (syncRef.current) clearInterval(syncRef.current)
            releaseWakeLock()
        }
    }, [isCompleted])

    // --- Helper Functions ---

    const requestWakeLock = async () => {
        if ('wakeLock' in navigator) {
            try {
                const lock = await (navigator as any).wakeLock.request('screen')
                setWakeLock(lock)
            } catch (err: any) {
                console.error(`${err.name}, ${err.message}`)
            }
        }
    }

    const releaseWakeLock = () => {
        if (wakeLock) {
            wakeLock.release()
            setWakeLock(null)
        }
    }

    const showNotification = (title: string, body: string) => {
        if ("Notification" in window && Notification.permission === "granted") {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, {
                        body,
                        icon: '/icon.jpg',
                        badge: '/icon.jpg',
                        vibrate: [200, 100, 200, 100, 200],
                        tag: 'cardio-timer',
                        renotify: true
                    } as any)
                })
            } else {
                new Notification(title, { body })
            }
        }
    }

    async function checkActiveSession() {
        setLoading(true)
        const active = await getActiveCardioSession()

        if (active && active.assigned_cardio_id === assignment.id) {
            setLogId(active.id)

            let currentElapsed = active.elapsed_seconds

            if (active.is_running) {
                // Calculation based on DB timestamp (last_resumed_at)
                // This is the most precise way to resume the timer
                const lastResumed = new Date(active.last_resumed_at || active.last_heartbeat_at).getTime()
                const now = Date.now()
                const diff = Math.floor((now - lastResumed) / 1000)

                currentElapsed += Math.max(0, diff)

                // Cap at target if reached
                if (currentElapsed > targetSeconds) currentElapsed = targetSeconds
            }

            setSeconds(currentElapsed)
            setStatus(active.is_running ? 'running' : 'paused')

            if (active.is_running) {
                const virtualStart = Date.now() - (currentElapsed * 1000)
                startTimer(virtualStart)
                startSync()
                requestWakeLock()
            }
        }
        setLoading(false)
    }

    function startTimer(virtualStart: number) {
        if (timerRef.current) clearInterval(timerRef.current)

        timerRef.current = setInterval(() => {
            const now = Date.now()
            const diff = Math.floor((now - virtualStart) / 1000)
            setSeconds(diff)
        }, 1000)
    }

    function stopTimer() {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
    }

    function startSync() {
        if (syncRef.current) clearInterval(syncRef.current)
        syncRef.current = setInterval(() => {
            // Background sync logic handles it via useEffect
        }, 15000)
    }

    // State for syncing
    const lastSyncRef = useRef<{ seconds: number, status: string }>({ seconds: 0, status: 'idle' })

    // Periodic sync effect
    useEffect(() => {
        if (!logId || status === 'idle') return

        const syncInterval = setInterval(async () => {
            // Only sync if values changed significantly or every X seconds
            const hasStatusChanged = lastSyncRef.current.status !== status
            const hasTimeProgressed = Math.abs(lastSyncRef.current.seconds - seconds) >= 10

            if (hasStatusChanged || hasTimeProgressed) {
                await updateCardioSession(logId, seconds, status === 'running')
                lastSyncRef.current = { seconds, status }
            }
        }, 10000) // Sync every 10s

        return () => clearInterval(syncInterval)
    }, [logId, status, seconds])

    async function handleStart() {
        if (!logId) {
            const res = await startCardioSession(assignment.id)
            if (res.success && res.logId) {
                setLogId(res.logId)
                setStatus('running')

                queryClient.invalidateQueries({ queryKey: ['active-cardio-session'] })

                startTimer(Date.now())
                startSync()
                requestWakeLock()
            } else {
                toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao iniciar sessão' })
            }
        } else {
            // Resuming
            setStatus('running')
            if (logId) {
                await updateCardioSession(logId, seconds, true)
            }
            const virtualStart = Date.now() - (seconds * 1000)
            queryClient.invalidateQueries({ queryKey: ['active-cardio-session'] })
            startTimer(virtualStart)
            startSync()
            requestWakeLock()
        }
    }

    async function handlePause() {
        setStatus('paused')
        stopTimer()
        releaseWakeLock()
        if (logId) {
            await updateCardioSession(logId, seconds, false)
            queryClient.invalidateQueries({ queryKey: ['active-cardio-session'] })
        }
    }

    // Auto-stop when reaching zero
    useEffect(() => {
        if (remainingSeconds === 0 && status === 'running' && logId) {
            showNotification("Cardio Concluído!", "Você atingiu sua meta de tempo. Parabéns!")
            handleStop(true)
        }
    }, [remainingSeconds, status, logId])

    async function handleStop(isAuto: boolean = false) {
        let percentage = progress
        if (percentage > 100) percentage = 100

        if (!isAuto) {
            if (remainingSeconds > 0) {
                const confirmMsg = `Você completou apenas ${percentage.toFixed(0)}% do tempo!\n\nSeu progresso será registrado como Parcial. Tem certeza que deseja parar?`
                if (!confirm(confirmMsg)) return
            } else {
                if (!confirm('Deseja finalizar este cardio?')) return
            }
        }

        if (logId) {
            const res = await finishCardioSession(logId, undefined, undefined, percentage)
            if (res.success) {
                toast({
                    title: percentage >= 100 ? 'Parabéns!' : 'Cardio Finalizado',
                    description: percentage >= 100 ? 'Cardio finalizado com sucesso!' : 'Cardio finalizado parcialmente.'
                })
                queryClient.invalidateQueries({ queryKey: ['active-cardio-session'] })
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

    if (isCompleted) {
        return (
            <Card className="bg-emerald-950/20 border-emerald-500/20 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm transition-all duration-500 cursor-default">
                <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-xl font-black text-white italic uppercase">{assignment.cardio?.name || 'Cardio'}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-700/30">{assignment.duration_minutes} min</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-700/30 italic">{assignment.suggested_intensity}</span>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Concluído</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-6 space-y-4">
                        <div className="p-6 bg-emerald-500/10 rounded-full border border-emerald-500/20 animate-in zoom-in duration-500">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Missão Cumprida!</h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Cardio de hoje pago com sucesso.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (loading) return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm animate-pulse border-t-zinc-700/10">
            <CardContent className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                                <Activity className="w-5 h-5 text-zinc-800" />
                            </div>
                            <Skeleton className="h-6 w-32 bg-zinc-800/50" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-12 bg-zinc-800/50" />
                            <Skeleton className="h-4 w-16 bg-zinc-800/50" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                    <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                    <Skeleton className="h-16 w-40 rounded-2xl bg-zinc-800/50" />
                    <Skeleton className="h-2 w-full max-w-[200px] rounded-full bg-zinc-800/50" />
                </div>

                <div className="flex items-center justify-center gap-6">
                    <Skeleton className="w-20 h-20 rounded-full bg-zinc-800/50" />
                    <Skeleton className="w-16 h-16 rounded-full bg-zinc-800/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center justify-center gap-1">
                        <Skeleton className="h-2 w-8 bg-zinc-800/50" />
                        <Skeleton className="h-4 w-12 bg-zinc-800/50" />
                    </div>
                    <div className="h-16 rounded-3xl bg-zinc-950/50 border border-zinc-900 flex flex-col items-center justify-center gap-1">
                        <Skeleton className="h-2 w-8 bg-zinc-800/50" />
                        <Skeleton className="h-4 w-12 bg-zinc-800/50" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <Card className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-t-zinc-700/10">
            <CardContent className="p-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                                <Activity className="w-5 h-5 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{assignment.cardio?.name || 'Cardio'}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 ml-1">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-700/30">{assignment.duration_minutes} min</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-800/50 px-2 py-0.5 rounded-md border border-zinc-700/30 italic">{assignment.suggested_intensity}</span>
                        </div>
                    </div>
                    {status !== 'idle' && (
                        <div className="self-start sm:self-center flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Sessão Ativa</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">
                        {remainingSeconds > 0 ? "Tempo Restante" : "Objetivo Alcançado"}
                    </div>
                    <div className={`text-7xl font-black italic tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] ${remainingSeconds === 0 && status !== 'idle' ? 'text-emerald-500' : 'text-white'}`}>
                        {remainingSeconds > 0 ? formatTime(remainingSeconds) : "00:00"}
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
                            onClick={() => handleStop(false)}
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
