'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, Send, Loader2 } from "lucide-react"
import { submitTrainerReview } from '@/actions/student-actions'
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

export function RatingModal({ trainerId, trainerName, initialRating = 0, initialComment = '', trigger }: RatingModalProps) {
    const { toast } = useToast()
    const [rating, setRating] = useState(initialRating)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState(initialComment)
    const [open, setOpen] = useState(false)

    const { mutate, isPending } = useOptimisticMutation({
        queryKey: QUERY_KEYS.profile.detail(trainerId), // Or trainer specific key if applicable
        actionName: 'submit-trainer-review',
        entity: ENTITIES.USER, // Or a specific REVIEW entity if registered
        mutationFn: async (variables) => variables, // 🔴 HARD BLOCK
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="h-14 px-8 rounded-system border border-zinc-800 bg-transparent hover:bg-zinc-800/80 hover:border-zinc-700 text-white hover:text-white font-black uppercase italic tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-white/5 hover:scale-[1.02] active:scale-[0.98] group/btn">
                        Avaliar Treinador
                        <Star className="w-4 h-4 ml-2 group-hover/btn:scale-110 group-hover/btn:text-amber-500 group-hover/btn:fill-amber-500/20 transition-all duration-200" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter text-center">
                        Avaliar {trainerName}
                    </DialogTitle>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center">
                        Sua opinião ajuda a manter a comunidade RepTrail no topo
                    </p>
                </DialogHeader>

                <div className="space-y-8 py-6">
                    {/* Stars */}
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                                className="group transition-transform active:scale-95"
                            >
                                <Star
                                    className={`w-10 h-10 transition-all duration-300 ${(hover || rating) >= star
                                        ? 'text-amber-500 fill-amber-500 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                                        : 'text-zinc-800'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Comment */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Comentário (opcional)</label>
                        <Textarea
                            placeholder="Conte como tem sido sua experiência..."
                            className="bg-zinc-900 border-zinc-800 rounded-system min-h-[120px] focus:border-amber-500/50 transition-all placeholder:text-zinc-700 font-medium text-white"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || rating === 0}
                        className="w-full h-16 rounded-system bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase italic tracking-wide shadow-xl shadow-amber-500/20 active:scale-95 transition-all text-lg group"
                    >
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                            <>
                                Enviar Avaliação
                                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

