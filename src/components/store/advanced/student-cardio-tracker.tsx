'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { CardioTimerCard } from '@/components/store/intermediary/cardio-timer-card'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { actions } from '@/lib/dal'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'

import { useQueryClient } from '@/lib/dal'
import { useToast } from '@/components/store/hooks/use-toast'
import { Modal } from '@/components/store/advanced/modal'

interface StudentCardioTrackerProps {
    userId: string
}

/**
 * StudentCardioTracker (Smart): Manages cardio protocols and status.
 * Uses duration_minutes and suggested_intensity from database.
 */
export function StudentCardioTracker({ userId }: StudentCardioTrackerProps) {
    const { toast } = useToast()
    const queryClient = useQueryClient()
    const [currentIndex, setCurrentIndex] = useState(0)

    // Player State
    const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle')
    const [seconds, setSeconds] = useState(0)
    const [logId, setLogId] = useState<string | null>(null)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const timerRef = React.useRef<NodeJS.Timeout | null>(null)
    const lastSyncRef = React.useRef<{ seconds: number, status: string }>({ seconds: 0, status: 'idle' })

    const { data: cardios, isLoading } = useQuery<any[]>({
        queryKey: QUERY_KEYS.cardio.today(userId),
        queryFn: () => actions.getTodayCardio(userId),
        staleTime: 1000 * 60 * 5,
    })

    const { data: cardioLogs } = useQuery<any[]>({
        queryKey: QUERY_KEYS.cardio.logs(userId),
        queryFn: () => actions.getCardioStatus(userId),
        staleTime: 1000 * 60 * 5,
    })

    const { data: activeSession } = useQuery({
        queryKey: QUERY_KEYS.cardio.session,
        queryFn: () => actions.getActiveCardioSession(),
        staleTime: 1000 * 30
    })

    // Sync local state with activeSession
    React.useEffect(() => {
        if (activeSession && status === 'idle') {
            const assignment = cardios?.find(c => c.id === activeSession.assigned_cardio_id)
            if (assignment) {
                const idx = cardios?.findIndex(c => c.id === assignment.id) ?? 0
                setCurrentIndex(idx)

                setLogId(activeSession.id)
                let currentElapsed = activeSession.elapsed_seconds || 0

                if (activeSession.is_running) {
                    const lastResumed = new Date(activeSession.last_resumed_at || activeSession.last_heartbeat_at).getTime()
                    const diff = Math.floor((Date.now() - lastResumed) / 1000)
                    currentElapsed += Math.max(0, diff)
                }

                setSeconds(currentElapsed)
                setStatus(activeSession.is_running ? 'running' : 'paused')

                if (activeSession.is_running) {
                    startTimer(Date.now() - (currentElapsed * 1000))
                }
            }
        }
    }, [activeSession, cardios])

    // Periodic Sync Effect
    React.useEffect(() => {
        if (!logId || status === 'idle') return

        const syncInterval = setInterval(() => {
            const hasStatusChanged = lastSyncRef.current.status !== status
            const hasTimeProgressed = Math.abs(lastSyncRef.current.seconds - seconds) >= 10

            if (hasStatusChanged || hasTimeProgressed) {
                actions.updateCardioSession(logId, seconds, status === 'running')
                lastSyncRef.current = { seconds, status }
            }
        }, 10000)

        return () => clearInterval(syncInterval)
    }, [logId, status, seconds])

    // Auto stop when timer finishes
    React.useEffect(() => {
        if (status === 'running' && logId) {
            const currentCardio = cardios?.[currentIndex]
            if (currentCardio) {
                const targetSeconds = (currentCardio.duration_minutes || 30) * 60
                if (seconds >= targetSeconds) {
                    stopTimer()
                    setStatus('idle')
                    setSeconds(0)
                    setLogId(null)

                    actions.finishCardioSession(logId, 'ConcluÃ­do automaticamente', undefined, 100).then((res) => {
                        if (res.success) {
                            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cardio.logs(userId) })
                            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cardio.session })
                            toast({
                                title: "Sucesso",
                                description: "Cardio concluÃ­do automaticamente por atingir o tempo!"
                            })
                        }
                    })
                }
            }
        }
    }, [seconds, status, logId, cardios, currentIndex, userId, queryClient, toast])

    function startTimer(virtualStart: number) {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            const diff = Math.floor((Date.now() - virtualStart) / 1000)
            setSeconds(diff)
        }, 1000)
    }

    function stopTimer() {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
    }

    async function handleStart() {
        const currentCardio = cardios?.[currentIndex]
        if (!currentCardio) return

        if (!logId) {
            const res = await actions.startCardioSession(currentCardio.id)
            if (res.success && res.logId) {
                setLogId(res.logId)
                setStatus('running')
                startTimer(Date.now())
            } else {
                toast({
                    title: "Erro",
                    description: "Erro ao iniciar sessÃ£o",
                    variant: "destructive"
                })
            }
        } else {
            setStatus('running')
            actions.updateCardioSession(logId, seconds, true)
            startTimer(Date.now() - (seconds * 1000))
        }
    }

    function handlePause() {
        setStatus('paused')
        stopTimer()
        if (logId) {
            actions.updateCardioSession(logId, seconds, false)
        }
    }

    async function handleStop() {
        if (!logId) return
        setIsConfirmOpen(true)
    }

    async function handleStopConfirm() {
        if (!logId) return
        const currentCardio = cardios?.[currentIndex]
        const targetSeconds = (currentCardio?.duration_minutes || 30) * 60
        const progress = Math.min(Math.round((seconds / targetSeconds) * 100), 100)

        const res = await actions.finishCardioSession(logId, undefined, undefined, progress)
        if (res.success) {
            setStatus('idle')
            setSeconds(0)
            setLogId(null)
            stopTimer()
            setIsConfirmOpen(false)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cardio.logs(userId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cardio.session })
            toast({
                title: "Sucesso",
                description: "Cardio finalizado!"
            })
        } else {
            toast({
                title: "Erro",
                description: "Erro ao finalizar sessÃ£o",
                variant: "destructive"
            })
        }
    }

    function formatTime(s: number, targetMins: number) {
        const targetSecs = targetMins * 60
        const remaining = Math.max(targetSecs - s, 0)
        const mins = Math.floor(remaining / 60)
        const secs = remaining % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (isLoading) return (
        <Surface height="192px" bg="zinc" bgOpacity={50} rounded={STORE_TOKENS.RADIUS.SYSTEM} animation="pulse"><span /></Surface>
    )

    if (!cardios || cardios.length === 0) {
        return (
            <CardioTimerCard
                title="SEM CARDIO"
                duration="0 MIN"
                intensity="N/A"
                remainingTime="00:00"
                estimatedBurn="0"
                status="empty"
                isRunning={false}
                progress={0}
                onPlay={() => { }}
                onPause={() => { }}
                onStop={() => { }}
            />
        )
    }

    const currentCardio = cardios[currentIndex] || cardios[0]
    const completedLog = cardioLogs?.find(l => l.assigned_cardio_id === currentCardio.id && l.status === 'completed')
    const isCompleted = !!completedLog

    const next = () => {
        if (status !== 'idle') return
        setCurrentIndex(prev => (prev + 1) % cardios.length)
    }
    const prev = () => {
        if (status !== 'idle') return
        setCurrentIndex(prev => (prev - 1 + cardios.length) % cardios.length)
    }

    const targetMinutes = currentCardio.duration_minutes || 0
    const displayMinutes = isCompleted ? Math.round((completedLog.elapsed_seconds || 0) / 60) : targetMinutes
    const progress = Math.min((seconds / (targetMinutes * 60)) * 100, 100)

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            {cardios.length > 1 && status === 'idle' && (
                <Stack direction="row" justify="end" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Button variant="outline-zinc" isIconOnly size="sm" onClick={prev}>
                        <Icon icon={ChevronLeft} size="xs" />
                    </Button>
                    <Button variant="outline-zinc" isIconOnly size="sm" onClick={next}>
                        <Icon icon={ChevronRight} size="xs" />
                    </Button>
                </Stack>
            )}
            <CardioTimerCard
                title={currentCardio.cardio?.name?.toUpperCase() || currentCardio.name?.toUpperCase() || 'ATIVIDADE AERÃ“BICA'}
                duration={`${displayMinutes} MIN`}
                intensity={currentCardio.suggested_intensity?.toUpperCase() || 'MODERADA'}
                remainingTime={isCompleted ? "00:00" : formatTime(seconds, targetMinutes)}
                estimatedBurn={currentCardio.estimated_calories?.toString() || '0'}
                status={isCompleted ? 'completed' : 'not_started'}
                isRunning={status === 'running'}
                progress={progress}
                onPlay={handleStart}
                onPause={handlePause}
                onStop={handleStop}
            />
            <Modal
                isOpen={isConfirmOpen}
                icon={Activity}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleStopConfirm}
                title="Encerrar Atividade?"
                subtitle="Deseja realmente finalizar a atividade de cardio atual?"
                confirmLabel="Finalizar"
                cancelLabel="Continuar"
                variant="red"
                confirmVariant="outline-red"
            >
                <Font
                    variant="description"
                    {...{
                        color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                    }}>
                    VocÃª realizou {Math.floor(seconds / 60)} minuto(s) de atividade. Ao encerrar agora, o progresso serÃ¡ salvo proporcionalmente.
                </Font>
            </Modal>
        </Stack>
    );
}
