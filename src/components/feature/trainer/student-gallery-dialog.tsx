'use client'

import * as React from 'react'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon } from 'lucide-react'
import { UnifiedProgressGallery } from '@/components/feature/shared/unified-progress-gallery'

interface PhotoSet {
    id: string
    front_url?: string
    back_url?: string
    side_right_url?: string
    side_left_url?: string
    created_at: string
}

interface StudentGalleryDialogProps {
    photos: PhotoSet[]
    studentName: string
}

export function StudentGalleryDialog({ photos, studentName }: StudentGalleryDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="h-8 border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-purple-500/50 rounded-xl text-[10px] uppercase font-black tracking-widest px-4 gap-2 transition-all shadow-xl active:scale-95"
            >
                <ImageIcon className="w-3.5 h-3.5" />
                Ver Galeria
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-6xl max-w-[98vw] max-h-[95vh] flex flex-col p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
                    <DialogHeader className="p-8 border-b border-zinc-900 bg-zinc-900/20">
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
                                    Galeria de <span className="text-purple-500">{studentName}</span>
                                </DialogTitle>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    Acompanhe a evolução física visual através do tempo
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        <UnifiedProgressGallery photos={photos} mode="trainer" studentName={studentName} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
