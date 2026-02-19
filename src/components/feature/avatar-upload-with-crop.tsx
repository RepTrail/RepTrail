'use client'

import React, { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/lib/image-utils'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, Upload } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'

interface AvatarUploadWithCropProps {
    currentImageUrl?: string
    onUploadSuccess: (url: string) => void
    uploadAction: (formData: FormData) => Promise<{ success: boolean; url?: string; error?: string }>
    userName?: string
    accentColor?: string // 'emerald' or 'orange'
    align?: 'start' | 'center' | 'end'
}

export function AvatarUploadWithCrop({
    currentImageUrl,
    onUploadSuccess,
    uploadAction,
    userName,
    accentColor = 'orange',
    align = 'center'
}: AvatarUploadWithCropProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            if (!file.type.startsWith('image/')) {
                toast({
                    title: 'Formato inválido',
                    description: 'Por favor, selecione uma imagem.',
                    variant: 'destructive'
                })
                return
            }

            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string)
                setIsDialogOpen(true)
            })
            reader.readAsDataURL(file)
        }
    }

    const handleConfirmCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        setUploading(true)
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (!croppedImageBlob) throw new Error('Falha ao processar imagem')

            const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' })
            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadAction(formData)

            if (result.success && result.url) {
                onUploadSuccess(result.url)
                setIsDialogOpen(false)
                toast({
                    title: 'Foto Atualizada',
                    description: 'Sua foto de perfil foi alterada com sucesso.',
                })
            } else {
                throw new Error(result.error || 'Erro no upload')
            }
        } catch (error: any) {
            toast({
                title: 'Erro no processamento',
                description: error.message,
                variant: 'destructive'
            })
        } finally {
            setUploading(false)
            setImageSrc(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const colorClasses = accentColor === 'emerald'
        ? 'hover:border-emerald-500/50 text-emerald-500'
        : 'hover:border-orange-500/50 text-orange-500'

    const btnClasses = accentColor === 'emerald'
        ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
        : 'bg-orange-500 hover:bg-orange-400 text-zinc-950'

    const alignmentClasses = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end'
    }

    return (
        <div className={`flex flex-col ${alignmentClasses[align]} gap-4 w-full`}>
            <div className="relative group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-36 h-36 rounded-[2.5rem] bg-zinc-800 border-4 border-zinc-700/50 flex items-center justify-center overflow-hidden shadow-2xl group cursor-pointer transition-all duration-500 relative ${colorClasses}`}
                >
                    {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-[2px]">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    )}

                    {currentImageUrl ? (
                        <img src={currentImageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <Avatar className="w-full h-full rounded-none">
                            <AvatarFallback className="bg-zinc-900 text-zinc-600 text-2xl font-black uppercase">
                                {userName?.substring(0, 2) || 'RT'}
                            </AvatarFallback>
                        </Avatar>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-zinc-900 border-zinc-800 shadow-xl hover:bg-zinc-800 transition-all z-20"
                >
                    <Upload className="w-4 h-4 text-zinc-400" />
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                if (!open && !uploading) {
                    setIsDialogOpen(false)
                    setImageSrc(null)
                }
            }}>
                <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 p-0 overflow-hidden rounded-[2.5rem]">
                    <DialogHeader className="p-6 border-b border-zinc-900">
                        <DialogTitle className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-3">
                            <Camera className={`w-5 h-5 ${accentColor === 'emerald' ? 'text-emerald-500' : 'text-orange-500'}`} />
                            Ajustar Foto
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            Arraste para posicionar e use o zoom para ajustar o enquadramento.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="relative h-[400px] w-full bg-zinc-900">
                        <Cropper
                            image={imageSrc || ''}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropShape="rect"
                            showGrid={false}
                        />
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                <span>Zoom</span>
                                <span>{Math.round(zoom * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className={`w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500 ${accentColor === 'emerald' ? 'accent-emerald-500' : 'accent-orange-500'}`}
                            />
                        </div>

                        <DialogFooter className="flex gap-3 sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={uploading}
                                className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white rounded-xl h-12 uppercase font-bold text-xs"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleConfirmCrop}
                                disabled={uploading}
                                className={`rounded-xl h-12 px-8 uppercase font-black italic tracking-wide active:scale-95 transition-all flex items-center gap-2 ${btnClasses}`}
                            >
                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar & Salvar'}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
