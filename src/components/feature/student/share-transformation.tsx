'use client'

import { useRef, useState } from 'react'
import { Download, Share2, Instagram, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogClose } from '@/components/ui/dialog'

interface ShareTransformationProps {
    studentName: string
    beforeUrl?: string
    afterUrl?: string
    beforeDate?: string
    afterDate?: string
}

export function ShareTransformation({ studentName, beforeUrl, afterUrl, beforeDate, afterDate }: ShareTransformationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [currentFormat, setCurrentFormat] = useState<'story' | 'feed' | null>(null)

    const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
        const imgRatio = img.width / img.height
        const targetRatio = w / h
        let sWidth, sHeight, sx, sy

        if (imgRatio > targetRatio) {
            sHeight = img.height
            sWidth = img.height * targetRatio
            sx = (img.width - sWidth) / 2
            sy = 0
        } else {
            sWidth = img.width
            sHeight = img.width / targetRatio
            sx = 0
            sy = (img.height - sHeight) / 2
        }
        ctx.save()
        // Round corners for photos
        const radius = 40
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + w - radius, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
        ctx.lineTo(x + w, y + h - radius)
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
        ctx.lineTo(x + radius, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h)
        ctx.restore()
    }

    const drawLogo = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number = 1) => {
        ctx.save()
        ctx.translate(x, y)
        ctx.scale(scale, scale)

        // Orange Circle (Perfectly Round)
        ctx.fillStyle = '#f97316'
        ctx.beginPath()
        ctx.arc(0, 0, 42, 0, Math.PI * 2)
        ctx.fill()

        // Lightning Bolt (Lucide Zap Path)
        // Path: M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z
        // Need to center and scale this path manually for Canvas
        ctx.save()
        ctx.translate(-24, -24) // Lucide is 24x24, center it (roughly)
        ctx.scale(2, 2) // Make it 48x48

        ctx.fillStyle = 'white'
        const p = new Path2D("M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z")
        ctx.fill(p)
        ctx.restore()

        // Text "REPTRAIL"
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.font = 'italic 900 68px Arial Black, sans-serif'

        const spacing = 80
        ctx.fillStyle = 'white'
        ctx.fillText('REP', spacing, 0)

        const repWidth = ctx.measureText('REP').width
        ctx.fillStyle = '#f97316'
        ctx.fillText('TRAIL', spacing + repWidth - 4, 0)

        ctx.restore()
    }

    const generateImage = async (format: 'story' | 'feed') => {
        if (!canvasRef.current || !beforeUrl || !afterUrl) return
        setIsGenerating(true)

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const width = 1080
        const height = format === 'story' ? 1920 : 1080
        canvas.width = width
        canvas.height = height

        // 1. Background Gradient
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.9)
        gradient.addColorStop(0, '#18181b')
        gradient.addColorStop(1, '#020617')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        const loadImg = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new window.Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = url
        })

        try {
            const [imgBefore, imgAfter] = await Promise.all([
                loadImg(beforeUrl),
                loadImg(afterUrl)
            ])

            // 2. Photo Layout
            const padding = 50
            const photoWidth = (width - (padding * 3)) / 2
            const photoHeight = format === 'story' ? height * 0.65 : height * 0.65
            const yOffset = (height - photoHeight) / 2 + (format === 'story' ? 60 : 60)

            // Background Bloom - REMOVED ctx.filter as it bugs on mobile
            // Instead, use a stylized gradient overlay
            const bloomGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
            bloomGradient.addColorStop(0, 'rgba(249, 115, 22, 0.08)')
            bloomGradient.addColorStop(1, 'transparent')
            ctx.fillStyle = bloomGradient
            ctx.fillRect(0, 0, width, height)

            // Photos
            ctx.shadowBlur = 80
            ctx.shadowColor = 'rgba(0,0,0,0.7)'
            drawImageCover(ctx, imgBefore, padding, yOffset, photoWidth, photoHeight)
            drawImageCover(ctx, imgAfter, padding * 2 + photoWidth, yOffset, photoWidth, photoHeight)
            ctx.shadowBlur = 0

            // 3. Status Labels
            const labelY = yOffset + photoHeight - 50
            const drawSlantedLabel = (text: string, x: number, isActive: boolean) => {
                ctx.save()
                ctx.translate(x, labelY)
                ctx.beginPath()
                ctx.moveTo(-140, 0)
                ctx.lineTo(140, 0)
                ctx.lineTo(165, 90)
                ctx.lineTo(-115, 90)
                ctx.closePath()
                ctx.fillStyle = isActive ? '#f97316' : '#27272a'
                ctx.fill()

                ctx.fillStyle = isActive ? 'black' : 'white'
                ctx.font = 'italic 900 44px Arial Black, sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText(text, 25, 58)
                ctx.restore()
            }

            drawSlantedLabel('INÍCIO', padding + photoWidth / 2, false)
            drawSlantedLabel('ATUAL', padding * 2 + photoWidth + photoWidth / 2, true)

            // 4. Branding Header
            drawLogo(ctx, width / 2 - 200, yOffset - 170, 0.95)

            ctx.fillStyle = 'rgba(255,255,255,0.4)'
            ctx.font = 'bold 24px Arial, sans-serif'
            ctx.textAlign = 'center'
            ctx.letterSpacing = '14px'
            ctx.fillText('EVOLUÇÃO BRUTAL', width / 2, yOffset - 50)
            ctx.letterSpacing = '0px'

            // 5. Dates (Positioned Inside Photo Area)
            const dBefore = beforeDate ? new Date(beforeDate) : null
            const dAfter = afterDate ? new Date(afterDate) : null

            const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

            if (dBefore || dAfter) {
                ctx.font = 'black 30px Arial Black, sans-serif'
                ctx.textAlign = 'center'

                if (dBefore) {
                    // Shadow for readability
                    ctx.fillStyle = 'rgba(0,0,0,0.6)'
                    ctx.fillText(formatDate(dBefore), padding + photoWidth / 2, yOffset + 50)
                    ctx.fillStyle = 'white'
                    ctx.fillText(formatDate(dBefore), padding + photoWidth / 2, yOffset + 48)
                }

                if (dAfter) {
                    ctx.fillStyle = 'rgba(0,0,0,0.6)'
                    ctx.fillText(formatDate(dAfter), padding * 2 + photoWidth + photoWidth / 2, yOffset + 50)
                    ctx.fillStyle = 'white'
                    ctx.fillText(formatDate(dAfter), padding * 2 + photoWidth + photoWidth / 2, yOffset + 48)
                }

                // 6. Interval (Center Badge)
                if (dBefore && dAfter) {
                    const diffMs = Math.abs(dAfter.getTime() - dBefore.getTime())
                    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
                    const diffWeeks = Math.floor(diffDays / 7)

                    const intervalText = diffWeeks > 0
                        ? `${diffWeeks} SEMANAS DE FOCO`
                        : `${diffDays} DIAS DE FOCO`

                    const bannerY = yOffset + photoHeight / 2
                    ctx.save()
                    ctx.translate(width / 2, bannerY)
                    ctx.rotate(-Math.PI / 2)

                    ctx.fillStyle = 'rgba(0,0,0,0.95)'
                    ctx.font = 'italic 900 28px Arial Black, sans-serif'
                    const bWidth = ctx.measureText(intervalText).width + 100

                    ctx.beginPath()
                    ctx.moveTo(-bWidth / 2, -35)
                    ctx.lineTo(bWidth / 2, -35)
                    ctx.lineTo(bWidth / 2 + 30, 35)
                    ctx.lineTo(-bWidth / 2 + 30, 35)
                    ctx.closePath()
                    ctx.fill()

                    ctx.fillStyle = '#f97316'
                    ctx.textAlign = 'center'
                    ctx.fillText(intervalText, 15, 12)
                    ctx.restore()
                }
            }

            // 7. Footer
            ctx.fillStyle = 'white'
            ctx.font = 'italic 900 52px Arial Black, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(studentName.toUpperCase(), width / 2, height - (format === 'story' ? 140 : 80))

            ctx.fillStyle = '#f97316'
            ctx.font = 'bold 22px Arial, sans-serif'
            ctx.letterSpacing = '6px'
            ctx.fillText('REP-TRAIL.VERCEL.APP', width / 2, height - (format === 'story' ? 80 : 30))

            // Signature Line
            ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)'
            ctx.lineWidth = 2
            ctx.setLineDash([15, 15])
            ctx.beginPath()
            ctx.moveTo(width / 2, yOffset + 20)
            ctx.lineTo(width / 2, yOffset + photoHeight - 40) // End just before the badge area
            ctx.stroke()

            const dataUrl = canvas.toDataURL('image/png')
            setPreviewUrl(dataUrl)
            setCurrentFormat(format)
        } catch (err) {
            console.error(err)
            alert('Erro ao gerar imagem premium. Tente novamente.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleShare = async () => {
        if (!previewUrl) return

        try {
            const response = await fetch(previewUrl)
            const blob = await response.blob()
            const file = new File([blob], `reptrail-evolucao-${studentName.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' })

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Minha Evolução | RepTrail',
                    text: `Confira minha evolução no RepTrail! #RepTrail #Fitness`,
                })
            } else {
                // Fallback to download if sharing is not supported
                const link = document.createElement('a')
                link.download = file.name
                link.href = previewUrl
                link.click()
            }
        } catch (err) {
            console.error('Share error:', err)
            // Fallback to download
            const link = document.createElement('a')
            link.download = `reptrail-evolucao.png`
            link.href = previewUrl
            link.click()
        }
    }

    if (!beforeUrl || !afterUrl) return null

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#f97316] text-black hover:bg-[#ea580c] rounded-3xl h-14 px-8 font-black uppercase italic tracking-widest text-[11px] gap-3 shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:scale-105 active:scale-95 group">
                    <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Gerar Antes e Depois
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950/95 border-zinc-900 text-white max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] backdrop-blur-3xl p-0 overflow-y-auto max-h-[90vh] shadow-[0_0_100px_rgba(0,0,0,1)] gap-0 [&>button]:hidden">
                <div className="sticky top-6 right-6 flex justify-end px-6 z-50">
                    <DialogClose asChild>
                        <Button variant="ghost" className="h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all backdrop-blur-md">
                            <span className="sr-only">Fechar</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </Button>
                    </DialogClose>
                </div>

                <div className="p-6 md:p-8 pt-4 md:pt-8">
                    {!previewUrl ? (
                        <>
                            <DialogHeader className="mb-6 md:mb-8">
                                <div className="flex justify-center mb-4 md:mb-8">
                                    <div className="h-1.5 w-16 bg-gradient-to-r from-transparent via-[#f97316] to-transparent rounded-full opacity-50" />
                                </div>
                                <DialogTitle className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-center leading-none">
                                    EVOLUÇÃO <br />
                                    <span className="text-[#f97316]">BRUTAL 🔥</span>
                                </DialogTitle>
                                <p className="text-center text-emerald-500/60 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mt-4 md:mt-6">RepTrail Premium Graphics</p>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 py-2 md:py-4">
                                <button onClick={() => generateImage('story')} disabled={isGenerating} className="group flex flex-col items-center">
                                    <div className="aspect-[9/16] w-full bg-zinc-900 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#f97316]/30 transition-all shadow-2xl group-hover:shadow-[#f97316]/10">
                                        <Instagram className="w-8 h-8 md:w-10 md:h-10 text-zinc-700 group-hover:text-white transition-all group-hover:scale-110" />
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white mt-4 md:mt-6 transition-colors">Stories</span>
                                        {isGenerating && (
                                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                                <div className="w-10 h-10 border-3 border-[#f97316] border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </button>

                                <button onClick={() => generateImage('feed')} disabled={isGenerating} className="group flex flex-col items-center">
                                    <div className="aspect-square w-full bg-zinc-900 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-[#f97316]/30 transition-all shadow-2xl group-hover:shadow-[#f97316]/10">
                                        <ImageIcon className="w-10 h-10 text-zinc-700 group-hover:text-white transition-all group-hover:scale-110" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white mt-6 transition-colors">Feed</span>
                                        {isGenerating && (
                                            <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                                                <div className="w-10 h-10 border-3 border-[#f97316] border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>

                            <div className="mt-8 md:mt-12 bg-zinc-900/50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-[#f97316]/20 transition-all pointer-events-none" />
                                <p className="text-[10px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-widest text-center leading-relaxed relative z-10">
                                    PRONTO PARA <span className="text-white">IMPACTAR</span>? <br />
                                    <span className="text-zinc-600 text-[8px] md:text-[9px] mt-2 block">Sua evolução real com a identidade RepTrail.</span>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setPreviewUrl(null)}
                                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white h-auto p-0"
                                >
                                    ← Voltar
                                </Button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#f97316]">Pronto para Compartilhar</span>
                            </div>

                            <div className={`relative mx-auto bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 ${currentFormat === 'story' ? 'aspect-[9/16] w-[260px]' : 'aspect-square w-full max-w-[340px]'}`}>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={handleShare}
                                    className="w-full h-16 bg-[#f97316] text-black hover:bg-[#ea580c] rounded-2xl font-black uppercase italic tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Compartilhar Agora
                                </Button>

                                <Button
                                    onClick={() => {
                                        const link = document.createElement('a')
                                        link.download = `reptrail-evolucao.png`
                                        link.href = previewUrl
                                        link.click()
                                    }}
                                    variant="outline"
                                    className="w-full h-14 border-zinc-800 bg-transparent text-white hover:bg-zinc-900 rounded-2xl font-black uppercase italic tracking-widest text-[10px]"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Salvar Imagem
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </DialogContent>
        </Dialog>
    )
}
