/* eslint-disable no-restricted-syntax */
'use client'

import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { Card, CardHeader, CardContent } from '../base/card'
import { Logo } from '../base/logo'
import { Download, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

function exportToPng(elementId: string, filename: string, size: number) {
    const element = document.getElementById(elementId)
    if (!element) return

    const isIconOnly = elementId.includes('favicon')
    const color = element.getAttribute('data-color') || 'orange'

    const colors = {
        orange: '#f97316',
        emerald: '#10b981',
        red: '#ef4444',
        amber: '#f59e0b',
        white: '#ffffff'
    }
    const brandColor = colors[color as keyof typeof colors]

    let svgString = ''
    if (isIconOnly) {
        svgString = `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="20" fill="${brandColor}" />
                <polygon 
                    points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" 
                    fill="none" 
                    stroke="#09090b" 
                    stroke-width="2.5" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    transform="translate(18, 18) scale(2.7)"
                />
            </svg>
        `
    } else {
        const width = size * 7.0
        const height = size
        svgString = `
            <svg width="${width}" height="${height}" viewBox="0 0 700 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="80" rx="20" fill="${brandColor}" transform="rotate(3 50 50)" />
                <polygon 
                    points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" 
                    fill="none" 
                    stroke="#09090b" 
                    stroke-width="2.2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    transform="translate(20, 18) scale(2.6)" 
                />
                <text x="115" y="80" font-family="'Inter', -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="75" fill="white" style="text-transform: uppercase;">
                    REP<tspan fill="${brandColor}">TRAIL</tspan>
                </text>
            </svg>
        `
    }

    const canvas = document.createElement('canvas')
    canvas.width = isIconOnly ? size : size * 7.0
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
        ctx.drawImage(img, 0, 0)
        const pngUrl = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = `${filename}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(url)
    }
    img.src = url
}

export function LogoAssetsContent() {
    const [exportSize, setExportSize] = React.useState(512)
    const [exportColor, setExportColor] = React.useState<'orange' | 'emerald' | 'red'>('orange')

    return (
        <Grid cols={3} gap={5}>
            <Card border="white/10" padding={5} colSpan={2}>
                <Stack gap={5}>
                    <CardHeader>
                        <Font variant="h2">Export Configuration</Font>
                        <Font color="zinc-500" variant="body">Select variants and dimensions for your PNG export.</Font>
                    </CardHeader>

                    <Grid cols={2} gap={12.5}>
                        <Stack gap={5}>
                            <Font variant="auxiliary" color="zinc-500">Brand Variant</Font>
                            <Stack direction="row" gap={2.5}>
                                {(['orange', 'emerald', 'red'] as const).map((c) => (
                                    <Box
                                        key={c}
                                        as="button"
                                        flex1
                                        height="10"
                                        rounded="sm"
                                        border={exportColor === c ? true : 'zinc-800'}
                                        bg={exportColor === c ? 'white' : 'zinc-900'}
                                        display="flex"
                                        align="center"
                                        justify="center"
                                        onClick={() => setExportColor(c)}
                                    >
                                        <Font
                                            variant="sub-tiny"
                                            weight="black"
                                            uppercase
                                            color={exportColor === c ? 'black' : 'zinc-500'}
                                        >
                                            {c === 'orange' ? 'Aluno' : c === 'emerald' ? 'Personal' : 'Admin'}
                                        </Font>
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                        <Stack gap={5}>
                            <Font variant="auxiliary" color="zinc-500">Output Size (Height px)</Font>
                            <Stack direction="row" gap={2.5} wrap>
                                {[32, 64, 128, 512, 1024].map((s) => (
                                    <Box
                                        key={s}
                                        as="button"
                                        padding={2.5}
                                        rounded="sm"
                                        border={exportSize === s ? true : 'zinc-800'}
                                        bg={exportSize === s ? 'white' : 'zinc-900'}
                                        display="flex"
                                        align="center"
                                        justify="center"
                                        onClick={() => setExportSize(s)}
                                    >
                                        <Font
                                            variant="sub-tiny"
                                            weight="bold"
                                            color={exportSize === s ? 'black' : 'zinc-400'}
                                        >
                                            {s}px
                                        </Font>
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    <Stack direction="row" gap={5} wrap>
                        <Button
                            onClick={() => exportToPng('preview-full-logo', `reptrail-logo-${exportColor}-${exportSize}`, exportSize)}
                            variant="white"
                            fullWidth
                        >
                            <Icon icon={Download} size="sm" />
                            <span>Export Full Logo</span>
                        </Button>
                        <Button
                            onClick={() => exportToPng('preview-favicon', `reptrail-favicon-${exportColor}-${exportSize}`, exportSize)}
                            variant="outline"
                            fullWidth
                        >
                            <Icon icon={Zap} size="sm" />
                            <span>Export Favicon</span>
                        </Button>
                    </Stack>
                </Stack>
            </Card>

            <Card variant="dark" padding={5} fullHeight>
                <Stack align="center" justify="center" gap={5} fullWidth>
                    {/* Hidden elements for export capture */}
                    <Box display="hidden">
                        <Logo id="preview-full-logo" color={exportColor} size="lg" />
                        <div id="preview-favicon" data-color={exportColor}>
                            <Box bg={exportColor} padding={5} rounded="system">
                                <Icon icon={Zap} color="black" size="lg" />
                            </Box>
                        </div>
                    </Box>

                    <Stack align="center" gap={2.5}>
                        <Font variant="auxiliary" color="zinc-600">Live Preview</Font>
                        <Box bg="zinc-950" padding={5} rounded="system" border="white/5">
                            <Stack align="center" gap={5}>
                                <Logo color={exportColor} size="md" />

                                {/* Physical Separator Substitute */}
                                <Box bg="white" bgOpacity={5} width="full" height="px" />

                                <Box bg={exportColor} padding={5} rounded="system">
                                    <Icon icon={Zap} color="black" size="md" />
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </Stack>
            </Card>
        </Grid>
    )
}
