'use client'

import { useState, useEffect } from 'react'

interface UseWorkoutRestProps {
    initialIsResting: boolean
    initialRestEndTime?: number
    onRestChange?: (isResting: boolean) => void
    onRestEnd: () => void
}

export function useWorkoutRest({ initialIsResting, initialRestEndTime, onRestChange, onRestEnd }: UseWorkoutRestProps) {
    const [isResting, setIsResting] = useState(initialIsResting)
    const [restTimeLeft, setRestTimeLeft] = useState(0)
    const [restEndTime, setRestEndTime] = useState<number | null>(initialRestEndTime || null)

    useEffect(() => {
        onRestChange?.(isResting)
    }, [isResting])

    useEffect(() => {
        if (!isResting || !restEndTime) return
        
        const interval = setInterval(() => {
            const now = Date.now()
            const secondsLeft = Math.ceil((restEndTime - now) / 1000)
            
            if (secondsLeft <= 0) {
                setRestTimeLeft(0)
                handleRestEnd()
            } else {
                setRestTimeLeft(secondsLeft)
            }
        }, 200)

        return () => clearInterval(interval)
    }, [isResting, restEndTime])

    const startRest = (durationSeconds: number) => {
        const endTime = Date.now() + durationSeconds * 1000
        setRestEndTime(endTime)
        setIsResting(true)
    }

    const handleRestEnd = () => {
        setIsResting(false)
        setRestEndTime(null)
        
        if ("Notification" in window && Notification.permission === "granted") {
            const msg = "Descanso Finalizado! Hora de voltar para a série."
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(reg => reg.showNotification(msg))
            } else {
                new Notification(msg)
            }
        }
        
        onRestEnd()
    }

    return {
        isResting,
        setIsResting,
        restTimeLeft,
        restEndTime,
        setRestEndTime,
        startRest,
        handleRestEnd
    }
}
