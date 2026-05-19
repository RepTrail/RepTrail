'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Textarea } from '@/components/store/base/textarea'
import { Star, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { QUERY_KEYS } from '@/lib/query-keys'
import { ENTITIES } from '@/lib/outbox-db'

interface RatingModalProps {
    trainerId: string
    trainerName: string
    initialRating?: number
    initialComment?: string
    trigger?: React.ReactNode
}

export function RatingModal({
    trainerId,
    trainerName,
    initialRating = 0,
    initialComment = '',
    trigger
}: RatingModalProps) {
    const { toast } = useToast()
    const [rating, setRating] = useState(initialRating)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState(initialComment)
    const [open, setOpen] = useState(false)

    // Synchronize initial rating/comment when the modal is opened
    useEffect(() => {
        if (open) {
            setRating(initialRating)
            setComment(initialComment)
        }
    }, [open, initialRating, initialComment])

    const { mutate, isPending } = useOptimisticMutation({
        queryKey: QUERY_KEYS.profile.detail(trainerId),
        actionName: 'submit-trainer-review',
        entity: ENTITIES.USER,
        mutationFn: async (variables) => variables,
        onSuccess: () => {
            toast({
                title: 'Avaliação enviada!',
                description: 'Obrigado pelo seu feedback.',
            })
            setOpen(false)
        },
        onError: (error) => {
            toast({
                title: 'Erro ao enviar',
                description: error.message,
                variant: 'destructive'
            })
        }
    })

    function handleSubmit() {
        if (rating === 0) {
            toast({
                title: 'Nota obrigatória',
                description: 'Por favor, selecione uma nota de 1 a 5.',
                variant: 'destructive'
            })
            return
        }

        mutate({
            trainer_id: trainerId,
            rating,
            comment
        })
    }

    return (
        <>
            {trigger ? (
                <Box onClick={() => setOpen(true)} display="inline-block" cursor="pointer" fullWidth>
                    {trigger}
                </Box>
            ) : (
                <Button variant="outline-zinc" size="sm" onClick={() => setOpen(true)} fullWidth>
                    <Stack direction="row" align="center" justify="center" gap={2.5}>
                        Avaliar Treinador
                        <Icon icon={Star} size="xs" color="amber" />
                    </Stack>
                </Button>
            )}

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title={`AVALIAR ${trainerName.toUpperCase()}`}
                subtitle="SUA OPINIÃO AJUDA A MANTER A COMUNIDADE REPTRAIL NO TOPO"
                icon={Star}
                variant="orange"
                confirmVariant="outline-orange"
                confirmLabel={isPending ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
                confirmIcon={Send}
                onConfirm={handleSubmit}
                disabled={rating === 0 || isPending}
                isLoading={isPending}
                cancelLabel="CANCELAR"
            >
                <Stack gap={5}>
                    {/* Stars Select */}
                    <Box display="flex" align="center" justify="center" gap={2.5}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Box
                                as="button"
                                key={star}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                                cursor="pointer"
                                transition
                                style={{ background: 'none', border: 'none', padding: 0 }}
                            >
                                <Icon
                                    icon={Star}
                                    size="xl"
                                    color={(hover || rating) >= star ? 'amber' : 'zinc-700'}
                                    style={{
                                        fill: (hover || rating) >= star ? 'currentColor' : 'transparent',
                                        filter: (hover || rating) >= star ? 'drop-shadow(0px 0px 8px rgba(245,158,11,0.5))' : 'none'
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    {/* Comment Textarea */}
                    <Textarea
                        label="COMENTÁRIO (OPCIONAL)"
                        placeholder="Conte como tem sido sua experiência..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Stack>
            </Modal>
        </>
    )
}
