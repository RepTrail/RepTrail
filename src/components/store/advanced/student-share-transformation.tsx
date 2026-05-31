'use client'

import { useRef, useState } from 'react'
import { Download, Share2, Instagram, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Modal } from '@/components/store/advanced/modal'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Img } from '@/components/store/base/img'
import { Grid } from '@/components/store/base/grid'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ShareTransformationProps {
    studentName: string
    beforeUrl?: string
    afterUrl?: string
    beforeDate?: string
    afterDate?: string
    fullWidth?: boolean
}

export function ShareTransformation({ studentName, beforeUrl, afterUrl, beforeDate, afterDate, fullWidth }: ShareTransformationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [currentFormat, setCurrentFormat] = useState<'story' | 'feed' | null>(null)
    const [open, setOpen] = useState(false)

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
        ctx.translate(-40, -40)
        ctx.rotate(3 * Math.PI / 180)

        ctx.fillStyle = '#10b981'
        ctx.shadowBlur = 20
        ctx.shadowColor = 'rgba(16, 185, 129, 0.3)'

        const boxSize = 80
        const bRadius = 15
        ctx.beginPath()
        ctx.roundRect(0, 0, boxSize, boxSize, bRadius)
        ctx.fill()
        ctx.shadowBlur = 0

        // Lightning Bolt inside box
        ctx.save()
        ctx.translate(boxSize / 2, boxSize / 2)
        ctx.rotate(-3 * Math.PI / 180)
        ctx.scale(1.8, 1.8)
        ctx.fillStyle = '#09090b'
        const zapPath = new Path2D("M13 2L3 14h9l-1 8 10-12h-9l1-8z")
        ctx.translate(-12, -12)
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
        ctx.fillStyle = '#09090b'
        ctx.fillRect(0, 0, width, height)

        const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width)
        gradient.addColorStop(0, '#09090b')
        gradient.addColorStop(1, '#000000')
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

        // 2. Large Background Lightning Bolt
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(-15 * Math.PI / 180)
        ctx.scale(45, 45)
        ctx.globalAlpha = 0.05
        ctx.fillStyle = '#10b981'
        const boltPath = new Path2D("M13 2L3 14h9l-1 8 10-12h-9l1-8z")
        ctx.translate(-12, -12)
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
            const yOffset = height * 0.18

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

            // 5. Dates
            const dBefore = beforeDate ? new Date(beforeDate) : null
            const dAfter = afterDate ? new Date(afterDate) : null

            if (dBefore || dAfter) {
                const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

                const drawDateTag = (text: string, x: number, y: number) => {
                    ctx.save()
                    ctx.font = 'bold 28px Arial, sans-serif'
                    const textWidth = ctx.measureText(text).width
                    const tagW = textWidth + 40
                    const tagH = 50

                    ctx.fillStyle = 'rgba(0,0,0,0.7)'
                    ctx.beginPath()
                    ctx.roundRect(x - tagW / 2, y, tagW, tagH, 12)
                    ctx.fill()

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

            ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
            ctx.lineWidth = 2
            ctx.setLineDash([15, 15])
            ctx.beginPath()
            ctx.moveTo(width / 2, yOffset + 80)
            ctx.lineTo(width / 2, yOffset + photoHeight - 40)
            ctx.stroke()
            ctx.setLineDash([])

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

    const dataURLtoBlob = (dataUrl: string) => {
        const arr = dataUrl.split(',')
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    }

    const handleShare = async () => {
        if (!previewUrl) return

        try {
            const blob = dataURLtoBlob(previewUrl)
            const file = new File([blob], `reptrail-evolucao-${studentName.toLowerCase().replace(/\s+/g, '-')}.png`, { type: 'image/png' })
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Minha Evolução | RepTrail',
                    text: `Confira minha evolução no RepTrail! #RepTrail #Fitness`,
                })
            } else {
                const link = document.createElement('a')
                link.download = file.name
                link.href = previewUrl
                link.click()
            }
        } catch (err) {
            console.error('Share error:', err)
            const link = document.createElement('a')
            link.download = `reptrail-evolucao.png`
            link.href = previewUrl
            link.click()
        }
    }

    const handleClose = () => {
        setOpen(false)
        setPreviewUrl(null)
    }

    const handleBack = () => {
        setPreviewUrl(null)
    }

    if (!beforeUrl || !afterUrl) return null

    return (
        <>
            <Button
                variant="orange"
                onClick={() => setOpen(true)}
                transition
                paddingY={STORE_TOKENS.PADDING.ELEMENT}
                paddingX={STORE_TOKENS.PADDING.CONTAINER}
                fullWidth={fullWidth}
            >
                <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Icon icon={Share2} size="sm" />
                    <Font
                        variant="label-caps"
                        {...{
                            color: "white",
                        }}>
                        Gerar Antes e Depois
                    </Font>
                </Stack>
            </Button>
            <Modal
                isOpen={open}
                onClose={previewUrl ? handleBack : handleClose}
                title={previewUrl ? "PREVIEW DA EVOLUÇÃO" : "EVOLUÇÃO BRUTAL"}
                subtitle={previewUrl ? "SUA IMAGEM DE EVOLUÇÃO FOI GERADA" : "SELECIONE O FORMATO PARA GERAR A IMAGEM"}
                icon={Share2}
                variant={previewUrl ? "emerald" : "orange"}
                confirmVariant={previewUrl ? "outline-emerald" : "outline-orange"}
                confirmLabel="FECHAR"
                onConfirm={handleClose}
                hideCancel={!previewUrl}
                cancelLabel="VOLTAR"
            >
                {!previewUrl ? (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Grid cols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            <Box
                                as="button"
                                onClick={isGenerating ? undefined : () => generateImage('story')}
                                cursor={isGenerating ? "not-allowed" : "pointer"}
                                fullWidth
                                border
                                borderWidth={1}
                                borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                                display="flex"
                                direction="col"
                                align="center"
                                justify="center"
                                position="relative"
                                overflow="hidden"
                                transition
                                group
                                style={{ aspectRatio: '9/16', borderStyle: 'solid' }}
                                {...({ disabled: isGenerating } as any)}
                            >
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={Instagram} size="xl" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                                    <Font
                                        variant="label-caps"
                                        {...{
                                            color: "SECONDARY",
                                        }}>
                                        Stories
                                    </Font>
                                </Stack>
                                {isGenerating && currentFormat === 'story' && (
                                    <Box
                                        position="absolute"
                                        pin="inset"
                                        bg={STORE_TOKENS.COLORS.BLACK}
                                        bgOpacity={STORE_TOKENS.OPACITY.SHELF}
                                        display="flex"
                                        align="center"
                                        justify="center"
                                    >
                                        <Icon icon={Loader2} spin size="lg" color={STORE_TOKENS.COLORS.BRAND} />
                                    </Box>
                                )}
                            </Box>

                            <Box
                                as="button"
                                onClick={isGenerating ? undefined : () => generateImage('feed')}
                                cursor={isGenerating ? "not-allowed" : "pointer"}
                                fullWidth
                                aspectRatio="square"
                                border
                                borderWidth={1}
                                borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                                display="flex"
                                direction="col"
                                align="center"
                                justify="center"
                                position="relative"
                                overflow="hidden"
                                transition
                                group
                                style={{ borderStyle: 'solid' }}
                                {...({ disabled: isGenerating } as any)}
                            >
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                    <Icon icon={ImageIcon} size="xl" color={STORE_TOKENS.COLORS.TEXT.DIM} />
                                    <Font
                                        variant="label-caps"
                                        {...{
                                            color: "SECONDARY",
                                        }}>
                                        Feed
                                    </Font>
                                </Stack>
                                {isGenerating && currentFormat === 'feed' && (
                                    <Box
                                        position="absolute"
                                        pin="inset"
                                        bg={STORE_TOKENS.COLORS.BLACK}
                                        bgOpacity={STORE_TOKENS.OPACITY.SHELF}
                                        display="flex"
                                        align="center"
                                        justify="center"
                                    >
                                        <Icon icon={Loader2} spin size="lg" color={STORE_TOKENS.COLORS.BRAND} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Box
                            bg={STORE_TOKENS.COLORS.BACKGROUND}
                            bgOpacity={STORE_TOKENS.OPACITY.MODAL}
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            border
                            borderWidth={1}
                            borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                            padding={STORE_TOKENS.PADDING.CONTAINER}
                            position="relative"
                            overflow="hidden"
                            style={{ borderStyle: 'solid' }}
                        >
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Font
                                    variant="label-caps"
                                    align="center"
                                    {...{
                                        color: "SECONDARY",
                                    }}>
                                    PRONTO PARA <Font
                                    {...{
                                        color: "white",
                                    }}>IMPACTAR</Font>?
                                </Font>
                                <Font
                                    variant="tiny"
                                    align="center"
                                    {...{
                                        color: "DIM",
                                    }}>
                                    Sua evolução real com a identidade RepTrail.
                                </Font>
                            </Stack>
                        </Box>
                    </Stack>
                ) : (
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box
                            bg={STORE_TOKENS.COLORS.BLACK}
                            rounded={STORE_TOKENS.RADIUS.SYSTEM}
                            overflow="hidden"
                            border
                            borderWidth={1}
                            borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}
                            display="flex"
                            align="center"
                            justify="center"
                            style={{
                                height: '400px',
                                margin: '0 auto',
                                borderStyle: 'solid',
                                aspectRatio: currentFormat === 'story' ? '9/16' : '1/1'
                            }}
                        >
                            <Img
                                src={previewUrl}
                                alt="Preview"
                                fullHeight
                                objectFit="contain"
                            />
                        </Box>

                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                            <Button
                                onClick={handleShare}
                                variant="emerald"
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                fullWidth
                                paddingY={STORE_TOKENS.PADDING.ELEMENT}
                            >
                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Share2} size="sm" />
                                    <Font
                                        variant="label-caps"
                                        {...{
                                            color: "black",
                                        }}>
                                        Compartilhar Agora
                                    </Font>
                                </Stack>
                            </Button>

                            <Button
                                onClick={() => {
                                    const link = document.createElement('a')
                                    link.download = `reptrail-evolucao.png`
                                    link.href = previewUrl
                                    link.click()
                                }}
                                variant="outline-zinc"
                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                fullWidth
                                paddingY={STORE_TOKENS.PADDING.ELEMENT}
                            >
                                <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Icon icon={Download} size="sm" />
                                    <Font
                                        variant="label-caps"
                                        {...{
                                            color: "white",
                                        }}>
                                        Salvar Imagem
                                    </Font>
                                </Stack>
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Modal>
            <canvas
                ref={canvasRef}
                {...{
                    style: { display: 'none' },
                }} />
        </>
    );
}
