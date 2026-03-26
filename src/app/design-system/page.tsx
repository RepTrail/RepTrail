'use client'

import React from 'react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { PillButton } from '@/components/ui/pill-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Zap, Activity, Dumbbell, Trophy, Users, LayoutDashboard, Settings, Shield, Trash2, Eye, Check, Download, FileJson, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Export Logic ─────────────────────────────────────────────────────────────

function exportToPng(elementId: string, filename: string, size: number) {
    const element = document.getElementById(elementId)
    if (!element) return

    // Create a temporary SVG for the export
    // Since we want high quality, we'll construct a clean SVG version of our logo
    const isIconOnly = elementId.includes('favicon')
    const color = element.getAttribute('data-color') || 'orange'
    
    const colors = {
        orange: '#f97316',
        emerald: '#10b981',
        red: '#ef4444'
    }
    const brandColor = colors[color as keyof typeof colors]

    // Construct SVG string
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
        // High-precision full logo reconstruction
        // Using 7.0 multiplier to ensure the italic 'L' at the end is never cut off
        const width = size * 7.0
        const height = size
        svgString = `
            <svg width="${width}" height="${height}" viewBox="0 0 700 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Icon: Perfectly balanced with 80% of viewbox height -->
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
                
                <!-- Text: Same height as the icon (80 units) to match the bold UI look -->
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

export default function DesignSystemPage() {
    const [exportSize, setExportSize] = React.useState(512)
    const [exportColor, setExportColor] = React.useState<'orange' | 'emerald' | 'red'>('orange')

    return (
        <div className="min-h-screen bg-background text-foreground p-8 md:p-16 space-y-24 max-w-7xl mx-auto page-entry">
            {/* Header */}
            <header className="space-y-4">
                <div className="flex items-center gap-4 text-orange-500">
                    <LayoutDashboard className="w-8 h-8" />
                    <span className="text-sm font-bold uppercase tracking-widest">Brand Guidelines</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter">
                    Design <span className="text-orange-500">System</span>
                </h1>
                <p className="text-zinc-400 text-xl max-w-2xl">
                    A comprehensive guide to RepTrail's visual identity, components, and design principles.
                </p>
            </header>

            <Separator className="opacity-20" />

            {/* Logo Assets & Exporter */}
            <section className="space-y-12">
                <SectionHeader 
                    title="Logo Assets" 
                    subtitle="Export branding assets for external use." 
                    icon={<ImageIcon className="w-6 h-6" />}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 bg-zinc-950/50 border-white/5">
                        <CardHeader>
                            <CardTitle>Export Configuration</CardTitle>
                            <CardDescription>Select variants and dimensions for your PNG export.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Brand Variant</Label>
                                    <div className="flex gap-2">
                                        {(['orange', 'emerald', 'red'] as const).map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => setExportColor(c)}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl border-2 transition-all uppercase text-[10px] font-black",
                                                    exportColor === c 
                                                        ? `bg-${c}-500/10 border-${c}-500 text-${c}-500` 
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                                                )}
                                            >
                                                {c === 'orange' ? 'Aluno' : c === 'emerald' ? 'Personal' : 'Admin'}
                                            </button>
                                        ) )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Output Size (Height px)</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {[32, 64, 128, 512, 1024].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setExportSize(s)}
                                                className={cn(
                                                    "px-3 py-2 rounded-lg border transition-all text-[10px] font-bold",
                                                    exportSize === s 
                                                        ? "bg-white text-zinc-950 border-white" 
                                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                                )}
                                            >
                                                {s}px
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-wrap gap-4">
                                <Button 
                                    onClick={() => exportToPng('preview-full-logo', `reptrail-logo-${exportColor}-${exportSize}`, exportSize)}
                                    className="flex-1 h-12 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export Full Logo
                                </Button>
                                <Button 
                                    onClick={() => exportToPng('preview-favicon', `reptrail-favicon-${exportColor}-${exportSize}`, exportSize)}
                                    variant="outline"
                                    className="flex-1 h-12 border-zinc-800 text-white font-black uppercase italic tracking-widest rounded-xl text-xs gap-2"
                                >
                                    <Zap className="w-4 h-4" />
                                    Export Favicon
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/30 border-white/5 flex flex-col items-center justify-center p-8 gap-8 overflow-hidden">
                        <div id="preview-full-logo" data-color={exportColor} className="hidden">
                            <Logo color={exportColor} size="lg" />
                        </div>
                        <div id="preview-favicon" data-color={exportColor} className="hidden">
                             <div className={cn("p-4 rounded-2xl", exportColor === 'orange' ? 'bg-orange-500' : exportColor === 'emerald' ? 'bg-emerald-500' : 'bg-red-500')}>
                                <Zap className="w-8 h-8 text-zinc-950" />
                             </div>
                        </div>

                        <div className="text-center space-y-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Live Preview</span>
                             <div className="p-8 bg-zinc-950 rounded-3xl border border-white/5 flex flex-col items-center gap-6">
                                <Logo color={exportColor} size="md" />
                                <div className="h-px w-full bg-white/5" />
                                <div className={cn("p-3 rounded-xl", exportColor === 'orange' ? 'bg-orange-500' : exportColor === 'emerald' ? 'bg-emerald-500' : 'bg-red-500')}>
                                    <Zap className="w-5 h-5 text-zinc-950" />
                                </div>
                             </div>
                        </div>
                    </Card>
                </div>
            </section>
            <section className="space-y-12">
                <SectionHeader 
                    title="Branding" 
                    subtitle="Logo variations and core identity elements." 
                    icon={<Zap className="w-6 h-6" />}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-zinc-950/50 border-white/5 overflow-hidden group">
                        <CardHeader className="bg-zinc-900/50">
                            <CardTitle>Logo Sizes</CardTitle>
                            <CardDescription>Different scales for various contexts.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex flex-col items-start gap-12">
                            <Logo size="sm" />
                            <Logo size="md" />
                            <Logo size="lg" />
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950/50 border-white/5 overflow-hidden group">
                        <CardHeader className="bg-zinc-900/50">
                            <CardTitle>Hero Scale</CardTitle>
                            <CardDescription>Maximum impact for landing pages.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex items-center justify-center min-h-[300px]">
                            <Logo size="xl" />
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950/50 border-white/5 overflow-hidden group md:col-span-2">
                        <CardHeader className="bg-zinc-900/50">
                            <CardTitle>Core Variants</CardTitle>
                            <CardDescription>Module-specific brand identities.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex flex-wrap gap-12 justify-around">
                            <div className="space-y-4 text-center">
                                <Logo color="orange" size="md" />
                                <span className="text-xs text-orange-500 font-mono uppercase font-bold">ALUNO (STUDENT)</span>
                            </div>
                            <div className="space-y-4 text-center">
                                <Logo color="emerald" size="md" />
                                <span className="text-xs text-emerald-500 font-mono uppercase font-bold">PERSONAL (TRAINER)</span>
                            </div>
                            <div className="space-y-4 text-center">
                                <Logo color="red" size="md" />
                                <span className="text-xs text-red-500 font-mono uppercase font-bold">ADMIN (PLATFORM)</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Colors Section */}
            <section className="space-y-12">
                <SectionHeader 
                    title="Colors & Identity" 
                    subtitle="Our module-based color strategy." 
                    icon={<Activity className="w-6 h-6" />}
                />

                <div className="space-y-16">
                    {/* Brand Colors */}
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-zinc-500">
                             Brand Core
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <ColorSwatch name="Primary Orange" value="#f97316 (orange-500)" className="bg-orange-500 text-black" />
                            <ColorSwatch name="Secondary Green" value="#10b981 (emerald-500)" className="bg-emerald-500 text-black" />
                            <ColorSwatch name="Admin Red" value="#ef4444 (red-500)" className="bg-red-500 text-white" />
                            <ColorSwatch name="Brand Accent" value="#ea580c (orange-600)" className="bg-orange-600 text-white" />
                        </div>
                    </div>

                    {/* Module Specific */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Affiliate Hub</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ColorRow name="Gold" value="#D4AF37" className="bg-[#D4AF37]" />
                                <ColorRow name="Gold Hover" value="#B8962E" className="bg-[#B8962E]" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Admin Dashboard</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ColorRow name="Admin Base" value="red-500" className="bg-red-500" />
                                <ColorRow name="Admin Surface" value="red-500/10" className="bg-red-500/10 border border-red-500/20" />
                            </div>
                        </div>
                    </div>

                    {/* Surface Tokens */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Surface</h4>
                            <div className="space-y-3">
                                <ColorRow name="Background" value="oklch(0.145 0 0)" className="bg-background border border-white/10" />
                                <ColorRow name="Secondary" value="oklch(0.269 0 0)" className="bg-secondary" />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">Interactive</h4>
                            <div className="space-y-3">
                                <ColorRow name="Input" value="oklch(1 0 0 / 15%)" className="bg-input" />
                                <ColorRow name="Ring" value="orange-500" className="bg-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Admin Identity Section */}
            <section className="space-y-12">
                <SectionHeader 
                    title="Admin Identity" 
                    subtitle="Visual cues for the Super Admin environment." 
                    icon={<Shield className="w-6 h-6 text-red-500" />}
                />

                <Card className="bg-zinc-950/50 border-red-500/10 overflow-hidden">
                    <CardContent className="p-8 flex flex-wrap gap-8 items-center justify-around">
                        <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                            <Shield className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">Super Admin</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                 <Trash2 className="w-5 h-5 text-red-500" />
                             </div>
                             <span className="text-[10px] font-black text-zinc-500 uppercase">Destructive Action</span>
                        </div>

                        <div className="space-y-1 text-center">
                            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Admin Dashboard</h4>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Painel de Controle RepTrail</p>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Typography Section */}
            <section className="space-y-12">
                <SectionHeader 
                    title="Typography" 
                    subtitle="Geist Sans and Mono for a premium feel." 
                    icon={<Users className="w-6 h-6" />}
                />

                <Card className="bg-zinc-950/50 border-white/5 overflow-hidden">
                    <CardContent className="p-8 space-y-12">
                        <div className="space-y-4">
                            <span className="text-xs font-mono text-zinc-500">H1 - Extra Bold Italic</span>
                            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">
                                RepTrail Performance
                            </h1>
                        </div>
                        <div className="space-y-4">
                            <span className="text-xs font-mono text-zinc-500">H2 - Bold</span>
                            <h2 className="text-4xl font-black italic uppercase tracking-tight">
                                Transform your training with AI
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <span className="text-xs font-mono text-zinc-500">Body - Regular</span>
                                <p className="text-zinc-400 leading-relaxed text-lg font-medium">
                                    Nossa plataforma foi construída para treinadores que buscam excelência técnica e agilidade no acompanhamento de seus alunos. Unimos inteligência artificial com uma interface premium.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <span className="text-xs font-mono text-zinc-500">Interface Label (Black Italic)</span>
                                <span className="text-xs font-black uppercase tracking-[0.2em] italic text-orange-500 block">
                                    Acessar Dashboard
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Components Section */}
            <section className="space-y-12">
                <SectionHeader 
                    title="Real Components" 
                    subtitle="Actual patterns used across the application." 
                    icon={<Dumbbell className="w-6 h-6" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Action Buttons */}
                    <Card className="bg-zinc-950/50 border-white/5">
                        <CardHeader>
                            <CardTitle>Action Buttons</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4 p-8">
                            <div className="space-y-4 w-full">
                                <Button className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs h-12 transition-all hover:scale-[1.02] active:scale-95">
                                    Premium Action (White)
                                </Button>
                                <Button className="w-full bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs h-12 transition-all hover:scale-[1.02] active:scale-95">
                                    Main Action (Orange)
                                </Button>
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase italic tracking-widest rounded-xl text-xs h-12 transition-all hover:scale-[1.02] active:scale-95">
                                    Success Action (Emerald)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pill Buttons */}
                    <Card className="bg-zinc-950/50 border-white/5">
                        <CardHeader>
                            <CardTitle>Pill Variants</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 p-8 items-center justify-center">
                            <PillButton variant="orange">Premium Orange</PillButton>
                            <PillButton variant="emerald">Success Emerald</PillButton>
                        </CardContent>
                    </Card>

                    {/* Row Actions */}
                    <Card className="bg-zinc-950/50 border-white/5 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Grid & Row Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-6 p-8 justify-around">
                            <div className="flex flex-col items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-[9px] font-black uppercase tracking-widest transition-all">
                                    <Eye className="w-3 h-3" />
                                    Inspecionar
                                </button>
                                <span className="text-[8px] font-mono text-zinc-600">Row Action (Blue)</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[9px] font-black uppercase tracking-widest transition-all">
                                    <Trash2 className="w-3 h-3" />
                                    Deletar
                                </button>
                                <span className="text-[8px] font-mono text-zinc-600">Row Action (Red)</span>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[9px] font-black uppercase tracking-widest transition-all">
                                    <Check className="w-3 h-3" />
                                    Finalizar
                                </button>
                                <span className="text-[8px] font-mono text-zinc-600">Row Action (Emerald)</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Controls */}
                    <Card className="bg-zinc-950/50 border-white/5 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Interface Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Standard Input</Label>
                                    <Input className="h-12 bg-zinc-900 border-zinc-800 rounded-xl" placeholder="Escreva algo..." />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <Label htmlFor="ds-switch" className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Enable AI Analysis</Label>
                                    <Switch id="ds-switch" />
                                </div>
                                <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <Checkbox id="ds-check" />
                                    <Label htmlFor="ds-check" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Accept terms and conditions</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* LayoutSection */}
            <section className="space-y-12">
                <SectionHeader 
                    title="Layout & Spacing" 
                    subtitle="Consistency through rigid spacing tokens." 
                    icon={<Trophy className="w-6 h-6" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-zinc-950/50 border-white/5">
                        <CardHeader>
                            <CardTitle>Radii</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-6 p-8">
                            <div className="w-20 h-20 bg-orange-500 rounded-sm flex items-center justify-center text-[10px] text-black font-bold uppercase">SM - 4px</div>
                            <div className="w-20 h-20 bg-orange-500 rounded-md flex items-center justify-center text-[10px] text-black font-bold uppercase">MD - 6px</div>
                            <div className="w-20 h-20 bg-orange-500 rounded-lg flex items-center justify-center text-[10px] text-black font-bold uppercase">LG - 12pt</div>
                            <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-[10px] text-black font-bold uppercase">2XL - 20px</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-950/50 border-white/5">
                        <CardHeader>
                            <CardTitle>Section Spacing</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="h-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-xs text-zinc-500 uppercase tracking-widest">
                                Content Block A
                            </div>
                            <div className="h-[50px] bg-orange-500/10 border-x border-dashed border-orange-500/50 flex items-center justify-center text-[10px] font-mono text-orange-500">
                                section-gap (50px)
                            </div>
                            <div className="h-10 bg-zinc-900 border border-white/5 flex items-center justify-center text-xs text-zinc-500 uppercase tracking-widest">
                                Content Block B
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <footer className="pt-24 pb-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
                <Logo size="sm" />
                <p className="text-sm font-mono tracking-widest uppercase">
                    RepTrail Design System v2.0 - 2026
                </p>
                <div className="flex gap-4">
                    <Settings className="w-4 h-4 cursor-pointer hover:text-orange-500" />
                    <Trophy className="w-4 h-4 cursor-pointer hover:text-orange-500" />
                </div>
            </footer>
        </div>
    )
}

function SectionHeader({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-3 text-orange-500">
                {icon}
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">{title}</h2>
            </div>
            <p className="text-zinc-500 text-lg">{subtitle}</p>
        </div>
    )
}

function ColorSwatch({ name, value, className }: { name: string, value: string, className: string }) {
    return (
        <div className="group cursor-pointer">
            <div className={cn("aspect-square rounded-2xl p-4 flex flex-col justify-end transition-transform group-hover:scale-95", className)}>
                <span className="text-sm font-black uppercase tracking-tighter leading-tight">{name}</span>
                <span className="text-[10px] font-mono opacity-80 uppercase">{value}</span>
            </div>
        </div>
    )
}

function ColorRow({ name, value, className }: { name: string, value: string, className: string }) {
    return (
        <div className="flex items-center gap-4 bg-zinc-900/30 p-2 rounded-xl border border-white/5">
            <div className={cn("w-10 h-10 rounded-lg", className)} />
            <div className="flex flex-col">
                <span className="text-sm font-bold">{name}</span>
                <span className="text-[10px] font-mono text-zinc-600 uppercase">{value}</span>
            </div>
        </div>
    )
}
