'use client'

import * as React from 'react'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
    children?: React.ReactNode
}

export function StudentGalleryDialog({ photos, studentName, children }: StudentGalleryDialogProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                {children ? (
                    <DialogTrigger asChild>
                        {children}
                    </DialogTrigger>
                ) : (
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg text-[10px] uppercase font-bold tracking-widest gap-2">
                            Ver Galeria
                        </Button>
                    </DialogTrigger>
                )}
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
