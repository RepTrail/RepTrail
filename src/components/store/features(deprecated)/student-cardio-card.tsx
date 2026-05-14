'use client'

import { getTodayCardio, getCardioStatus } from '@/actions/cardio-actions'
import { Flame, Activity, ChevronLeft, ChevronRight, CheckCircle, Sparkles } from 'lucide-react'
import { CardioPlayer } from './cardio-player'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useRealtimeSync } from '@/hooks/use-realtime-sync'
import { useQuery } from '@tanstack/react-query'
import { outboxDB } from '@/lib/outbox-db'
import { useState } from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface CardioCardProps {
    userId: string
}

export function CardioCard({ userId }: CardioCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useRealtimeSync({
        table: 'assigned_cardios',
        queryKey: QUERY_KEYS.cardio.all(userId),
        filter: `student_id=eq.${userId}`
    })

    const { data: cardios, isLoading } = useQuery({
        queryKey: QUERY_KEYS.cardio.today(userId),
        queryFn: () => getTodayCardio(userId),
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    const { data: cardioLogs, isLoading: isLoadingLogs } = useQuery({
        queryKey: QUERY_KEYS.cardio.logs(userId),
        queryFn: async () => {
            const logs = await getCardioStatus(userId)
            const pending = await outboxDB.getPending()
            
            const pendingCompletions = pending
                .filter(p => p.action === 'finish-cardio-session' && p.payload.status === 'completed')
                .map(p => ({
                    assigned_cardio_id: p.payload.assignmentId,
                    status: 'completed',
                    _optimistic: true
                }))

            return [...(logs || []), ...pendingCompletions]
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
    })

    if ((isLoading || isLoadingLogs) && (!cardios || !Array.isArray(cardios) || cardios.length === 0)) {
        return null
    }

    if (!cardios || !Array.isArray(cardios) || cardios.length === 0) {
        return (
            <Box 
                border 
                borderColor='zinc' 
                rounded='system' 
                bg='zinc' 
                bgOpacity={20}
                className='border-dashed flex flex-col items-center justify-center text-center'
            >
                <Activity className='w-8 h-8 text-zinc-700 mb-4' />
                <Font variant='tiny' weight='black' color='zinc-400' italic uppercase tracking='tight'>
                    Nenhum cardio pendente
                </Font>
            </Box>
        )
    }

    const currentAssignment = (Array.isArray(cardios) && cardios.length > 0) ? (cardios[currentIndex] || cardios[0]) : null
    const isCompleted = cardioLogs?.some(
        (l: any) => l.assigned_cardio_id === currentAssignment?.id && l.status === 'completed'
    )

    const nextCardio = () => {
        if (!Array.isArray(cardios) || cardios.length === 0) return
        setCurrentIndex((prev) => (prev + 1) % cardios.length)
    }

    const prevCardio = () => {
        if (!Array.isArray(cardios) || cardios.length === 0) return
        setCurrentIndex((prev) => (prev - 1 + cardios.length) % cardios.length)
    }

    return (
        <Box position='relative' group transition className='group/carousel'>
            <Box 
                padding={{ base: 5, md: 10 }} 
                rounded='system' 
                backdropBlur='sm' 
                overflow='hidden' 
                transition 
                border
                bg={isCompleted ? 'emerald' : 'zinc'}
                bgOpacity={isCompleted ? 20 : 40}
                borderColor={isCompleted ? 'emerald' : 'zinc'}
                className={cn(
                    'relative',
                    !isCompleted && 'hover:border-blue-500/30'
                )}
            >
                <Box 
                    position='absolute' 
                    pin='right' 
                    top={0} 
                    padding={STORE_TOKENS.PADDING.CONTAINER} 
                    bgOpacity={10} 
                    transition
                >
                    <Flame className='w-32 h-32' />
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} position='relative'>
                    <Stack gap={2.5}>
                        <div className='flex items-center justify-between mb-2'>
                            <div className='flex items-center gap-2'>
                                {isCompleted ? (
                                    <Font variant='sub-tiny' weight='black' color='emerald' uppercase tracking='widest' className='flex items-center gap-2'>
                                        <CheckCircle className='w-3 h-3' />
                                        Cardio Finalizado
                                    </Font>
                                ) : (
                                    <Font variant='sub-tiny' weight='black' color='blue' uppercase tracking='widest' className='flex items-center gap-2'>
                                        <Activity className='w-3 h-3' />
                                        Foco: {currentAssignment?.category || 'Resistência'}
                                    </Font>
                                )}
                            </div>
                            {cardios.length > 1 && (
                                <Font variant='sub-tiny' weight='black' color='zinc-600' uppercase tracking='widest'>
                                    {currentIndex + 1} de {cardios.length}
                                </Font>
                            )}
                        </div>

                        <Font variant='heading' weight='black' italic uppercase tracking='tight' className='leading-none text-3xl sm:text-4xl lg:text-5xl'>
                            {currentAssignment?.name || 'Sessão de Cardio'}
                        </Font>
                        
                        <Font variant='tiny' weight='bold' color='zinc-500' uppercase tracking='widest'>
                            {currentAssignment?.duration_minutes || 30} min • {currentAssignment?.intensity || 'Moderada'}
                        </Font>
                    </Stack>

                    <CardioPlayer 
                        assignment={currentAssignment}
                        isCompleted={isCompleted}
                    />
                </Stack>
            </Box>
            {cardios.length > 1 && (
                <>
                    <Box position='absolute' pin='inset' display='flex' align='center' justify='between' padding={STORE_TOKENS.PADDING.ELEMENT} className='pointer-events-none z-20'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={prevCardio}
                            className='pointer-events-auto h-12 w-12 rounded-full bg-zinc-950/50 border border-zinc-800 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity'
                        >
                            <ChevronLeft className='w-6 h-6' />
                        </Button>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={nextCardio}
                            className='pointer-events-auto h-12 w-12 rounded-full bg-zinc-950/50 border border-zinc-800 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity'
                        >
                            <ChevronRight className='w-6 h-6' />
                        </Button>
                    </Box>
                    <Box position='absolute' bottom={5} left={0} right={0} display='flex' justify='center' gap={2.5} className='z-20 pointer-events-none'>
                        {cardios.map((_, idx) => (
                            <Box 
                                key={idx}
                                height={1} 
                                width={idx === currentIndex ? 5 : 1}
                                rounded='full' 
                                bg={idx === currentIndex ? 'primary' : 'white'}
                                opacity={idx === currentIndex ? 100 : 20}
                                transition
                                className='shadow-sm'
                            />
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
}
