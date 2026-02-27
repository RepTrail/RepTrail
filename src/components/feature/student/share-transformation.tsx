'use client'

import { useRef, useState } from 'react'
import { Download, Share2, Instagram, Image as ImageIcon, X } from 'lucide-react'
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

        // Tilted Emerald Box (Platform Style)
        ctx.save()
        ctx.translate(-40, -40) // Position relative to origin
        ctx.rotate(3 * Math.PI / 180) // 3 degrees rotation

        ctx.fillStyle = '#10b981' // Emerald-500
        ctx.shadowBlur = 20
        ctx.shadowColor = 'rgba(16, 185, 129, 0.3)'

        // Rounded Rect for Logo Box
        const boxSize = 80
        const bRadius = 15
        ctx.beginPath()
        ctx.roundRect(0, 0, boxSize, boxSize, bRadius)
        ctx.fill()
        ctx.shadowBlur = 0

        // Lightning Bolt inside box
        ctx.save()
        ctx.translate(boxSize / 2, boxSize / 2)
        ctx.rotate(-3 * Math.PI / 180) // Counter-rotate to keep bolt straight
        ctx.scale(1.8, 1.8)
        ctx.fillStyle = '#09090b' // Zinc-950
        const zapPath = new Path2D("M13 2L3 14h9l-1 8 10-12h-9l1-8z") // Standard Lucide Zap
        ctx.translate(-12, -12) // Center bolt (Zap is 24x24)
        ctx.fill(zapPath)
        ctx.restore()

        ctx.restore()

        // Text "REPTRAIL" (Platform Style)
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'
        ctx.font = 'italic 900 68px Arial Black, sans-serif'

        const spacing = 60
        ctx.fillStyle = 'white'
        ctx.fillText('REP', spacing, 0)

        const repWidth = ctx.measureText('REP').width
        ctx.fillStyle = '#10b981'
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
        const height = format === 'story' ? 1920 : 1350
        canvas.width = width
        canvas.height = height

        // 1. Background
        ctx.fillStyle = '#09090b' // Deep Zinc
        ctx.fillRect(0, 0, width, height)

        // Radial depth for "infinite dark" effect
        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
        gradient.addColorStop(0, '#09090b') // Zinc-950
        gradient.addColorStop(1, '#000000') // True Black
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Brand Glows
        const emeraldGlow = ctx.createRadialGradient(width, 0, 0, width, 0, width * 0.9)
        emeraldGlow.addColorStop(0, 'rgba(16, 185, 129, 0.15)')
        emeraldGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = emeraldGlow
        ctx.fillRect(0, 0, width, height)

        const zincGlow = ctx.createRadialGradient(0, height, 0, 0, height, width * 1.1)
        zincGlow.addColorStop(0, 'rgba(39, 39, 42, 0.2)')
        zincGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = zincGlow
        ctx.fillRect(0, 0, width, height)

        // 2. Large Background Lightning Bolt (Brand Element)
        // Draw centered and subtle
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(-15 * Math.PI / 180)
        ctx.scale(45, 45) // Massive scale
        ctx.globalAlpha = 0.05
        ctx.fillStyle = '#10b981'
        const boltPath = new Path2D("M13 2L3 14h9l-1 8 10-12h-9l1-8z")
        ctx.translate(-12, -12) // Center of 24x24
        ctx.fill(boltPath)
        ctx.restore()
        ctx.globalAlpha = 1.0

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
            const photoHeight = format === 'story' ? height * 0.65 : height * 0.62
            const yOffset = height * 0.18 // Fixed top offset for better control

            // Background Bloom - REMOVED ctx.filter as it bugs on mobile
            // Instead, use a stylized gradient overlay
            // Background Bloom & Light leaks
            const bloomGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
            bloomGradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)')
            bloomGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.02)')
            bloomGradient.addColorStop(1, 'transparent')
            ctx.fillStyle = bloomGradient
            ctx.fillRect(0, 0, width, height)

            // Top Light Beam
            const beam = ctx.createLinearGradient(0, 0, width, 200)
            beam.addColorStop(0, 'rgba(255,255,255,0.05)')
            beam.addColorStop(1, 'transparent')
            ctx.fillStyle = beam
            ctx.fillRect(0, 0, width, 400)

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
                ctx.fillStyle = isActive ? '#10b981' : '#27272a'
                ctx.fill()

                // Slanted Border
                ctx.strokeStyle = isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'
                ctx.lineWidth = 3
                ctx.stroke()

                ctx.fillStyle = isActive ? 'black' : 'white'
                ctx.font = 'italic 900 44px Arial Black, sans-serif'
                ctx.textAlign = 'center'
                ctx.fillText(text, 25, 58)
                ctx.restore()
            }

            drawSlantedLabel('INÍCIO', padding + photoWidth / 2, false)
            drawSlantedLabel('ATUAL', padding * 2 + photoWidth + photoWidth / 2, true)

            // 4. Branding Header
            drawLogo(ctx, width / 2 - 230, yOffset - 170, 0.95)

            // Glow effect behind header title
            ctx.shadowBlur = 30
            ctx.shadowColor = 'rgba(16,185,129,0.5)'
            ctx.fillStyle = '#10b981'
            ctx.font = 'black 26px Arial Black, sans-serif'
            ctx.textAlign = 'center'
            ctx.letterSpacing = '18px'
            ctx.fillText('EVOLUÇÃO BRUTAL', width / 2, yOffset - 50)
            ctx.letterSpacing = '0px'
            ctx.shadowBlur = 0

            // 5. Dates (Positioned Inside Photo Area)
            const dBefore = beforeDate ? new Date(beforeDate) : null
            const dAfter = afterDate ? new Date(afterDate) : null

            const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

            if (dBefore || dAfter) {
                const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

                const drawDateTag = (text: string, x: number, y: number) => {
                    ctx.save()
                    ctx.font = 'bold 28px Arial, sans-serif'
                    const textWidth = ctx.measureText(text).width
                    const tagW = textWidth + 40
                    const tagH = 50

                    // Semi-transparent background pill
                    ctx.fillStyle = 'rgba(0,0,0,0.7)'
                    ctx.beginPath()
                    ctx.roundRect(x - tagW / 2, y, tagW, tagH, 12)
                    ctx.fill()

                    // Text
                    ctx.fillStyle = 'white'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText(text, x, y + tagH / 2)
                    ctx.restore()
                }

                if (dBefore) drawDateTag(formatDate(dBefore), padding + photoWidth / 2, yOffset + 30)
                if (dAfter) drawDateTag(formatDate(dAfter), padding * 2 + photoWidth + photoWidth / 2, yOffset + 30)

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

                    ctx.fillStyle = 'rgba(16, 185, 129, 0.95)'
                    ctx.font = 'italic 900 28px Arial Black, sans-serif'
                    const bWidth = ctx.measureText(intervalText).width + 100

                    ctx.beginPath()
                    ctx.moveTo(-bWidth / 2, -35)
                    ctx.lineTo(bWidth / 2, -35)
                    ctx.lineTo(bWidth / 2 + 30, 35)
                    ctx.lineTo(-bWidth / 2 + 30, 35)
                    ctx.closePath()
                    ctx.fill()

                    // Glowing border for interval badge
                    ctx.strokeStyle = 'rgba(255,255,255,0.3)'
                    ctx.lineWidth = 3
                    ctx.stroke()

                    ctx.fillStyle = 'black'
                    ctx.textAlign = 'center'
                    ctx.fillText(intervalText, 15, 12)
                    ctx.restore()
                }
            }

            // 7. Footer
            ctx.fillStyle = 'white'
            ctx.font = 'italic 900 52px Arial Black, sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(studentName.toUpperCase(), width / 2, height - (format === 'story' ? 140 : 120))

            ctx.fillStyle = '#10b981'
            ctx.font = 'bold 22px Arial, sans-serif'
            ctx.letterSpacing = '6px'
            ctx.fillText('REP-TRAIL.VERCEL.APP', width / 2, height - (format === 'story' ? 80 : 60))

            // Signature Line
            ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
            ctx.lineWidth = 2
            ctx.setLineDash([15, 15])
            ctx.beginPath()
            ctx.moveTo(width / 2, yOffset + 80) // Start below date tag
            ctx.lineTo(width / 2, yOffset + photoHeight - 40) // End just before the badge area
            ctx.stroke()
            ctx.setLineDash([]) // Reset

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
                <div className="p-4 md:p-8 space-y-4">
                    {!previewUrl ? (
                        <>
                            <DialogHeader className="mb-4">
                                <div className="flex justify-center mb-2">
                                    <div className="h-1 w-12 bg-gradient-to-r from-transparent via-[#10b981] to-transparent rounded-full opacity-50" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-left leading-none">
                                        EVOLUÇÃO <br />
                                        <span className="text-[#10b981]">BRUTAL 🔥</span>
                                    </DialogTitle>
                                    <DialogClose asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all shadow-xl">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </DialogClose>
                                </div>
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

                            <div className="mt-6 bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-[#f97316]/20 transition-all pointer-events-none" />
                                <p className="text-[10px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-widest text-center leading-relaxed relative z-10">
                                    PRONTO PARA <span className="text-white">IMPACTAR</span>? <br />
                                    <span className="text-zinc-600 text-[8px] md:text-[9px] mt-2 block">Sua evolução real com a identidade RepTrail.</span>
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="flex items-center justify-between mb-4 bg-zinc-900/40 p-2.5 rounded-2xl border border-zinc-800/50">
                                <Button
                                    variant="ghost"
                                    onClick={() => setPreviewUrl(null)}
                                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white h-auto py-2 px-4 flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    Voltar
                                </Button>

                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">Premium Render</span>
                                    </div>

                                    <DialogClose asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all shadow-xl">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </DialogClose>
                                </div>
                            </div>

                            <div className={`relative mx-auto bg-black rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-zinc-800/50 mb-6 ${currentFormat === 'story' ? 'h-[420px] aspect-[9/16]' : 'h-[420px] aspect-[4/5]'}`}>
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={handleShare}
                                    className="w-full h-14 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 rounded-2xl font-black uppercase italic tracking-widest text-xs flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition-all active:scale-95"
                                >
                                    <Share2 className="w-4 h-4" />
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
