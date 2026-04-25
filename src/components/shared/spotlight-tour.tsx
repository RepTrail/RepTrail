'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TourStep {
    selector: string
    title: string
    content: string
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-right'
    actionType?: 'click' | 'none'
    showNextButton?: boolean
    noPulse?: boolean
    showArrow?: boolean
    isFixed?: boolean
}

interface SpotlightTourProps {
    steps: TourStep[]
    currentPhase: number
    totalPhases: number
    stepIndex: number
    onStepChange: (index: number) => void
    onComplete: () => void
    onDismiss: () => void
    active: boolean
}

export function SpotlightTour({ steps, currentPhase, totalPhases, stepIndex, onStepChange, onComplete, onDismiss, active }: SpotlightTourProps) {
    const [mounted, setMounted] = useState(false)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    
    const lastRectRef = useRef<{ top: number, left: number, width: number, height: number } | null>(null)

    useEffect(() => {
        setMounted(true)
        if (typeof window !== 'undefined') {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
            const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
            window.addEventListener('resize', handleResize)
            return () => window.removeEventListener('resize', handleResize)
        }
    }, [])

    const currentStep = steps[stepIndex]

    const updateRect = useCallback(() => {
        if (!currentStep || !currentStep.selector) return
        const el = document.querySelector(currentStep.selector)
        if (el) {
            const rect = el.getBoundingClientRect()
            const hasChanged = !lastRectRef.current || 
                Math.abs(lastRectRef.current.top - rect.top) > 0.5 ||
                Math.abs(lastRectRef.current.left - rect.left) > 0.5 ||
                Math.abs(lastRectRef.current.width - rect.width) > 0.5 ||
                Math.abs(lastRectRef.current.height - rect.height) > 0.5

            if (hasChanged) {
                lastRectRef.current = {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                }
                setTargetRect(rect)
            }
        } else {
            if (lastRectRef.current !== null) {
                lastRectRef.current = null
                setTargetRect(null)
            }
        }
    }, [currentStep])

    useEffect(() => {
        if (!active) return
        updateRect()
        let frameId: number
        const loop = () => {
            updateRect()
            frameId = requestAnimationFrame(loop)
        }
        frameId = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frameId)
    }, [active, updateRect])

    const handleNext = () => {
        if (stepIndex < steps.length - 1) {
            onStepChange(stepIndex + 1)
        } else {
            onComplete()
        }
    }

    const cardPosition = () => {
        if (!currentStep) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        if (currentStep.position === 'top-right') return { top: 40, right: 40, transform: 'none' }
        if (!targetRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        
        const padding = 24
        const pos = currentStep.position || 'bottom'
        const cardWidth = 380 
        let style: any = {}

        switch (pos) {
            case 'top':
                style = { bottom: windowSize.height - targetRect.top + padding, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' }
                break
            case 'bottom':
                style = { top: targetRect.bottom + padding, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' }
                break
            case 'left':
                style = { top: targetRect.top + targetRect.height / 2, right: windowSize.width - targetRect.left + padding, transform: 'translateY(-50%)' }
                break
            case 'right':
                style = { top: targetRect.top + targetRect.height / 2, left: targetRect.right + padding, transform: 'translateY(-50%)' }
                break
            case 'center':
                style = { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
                break
            default:
                style = { top: targetRect.bottom + padding, left: targetRect.left + targetRect.width / 2, transform: 'translateX(-50%)' }
        }

        if (style.left !== undefined) {
            const leftVal = typeof style.left === 'number' ? style.left : (targetRect.left + targetRect.width / 2)
            const minLeft = cardWidth / 2 + padding
            const maxLeft = windowSize.width - cardWidth / 2 - padding
            style.left = Math.max(minLeft, Math.min(maxLeft, leftVal))
            style.transform = 'translateX(-50%)'
        }

        return style
    }

    if (!active || !mounted || !currentStep) return null

    const pad = 12

    // Create a path with a hole using even-odd rule
    const getPath = () => {
        const { width, height } = windowSize;
        if (!targetRect) return `M 0 0 h ${width} v ${height} h -${width} Z`;
        
        const { left, top, width: w, height: h } = targetRect;
        const x = left - pad;
        const y = top - pad;
        const rw = w + pad * 2;
        const rh = h + pad * 2;
        const r = 24; // border radius

        // Outer rect (clockwise)
        const outer = `M 0 0 h ${width} v ${height} h -${width} Z`;
        
        // Inner rounded rect (counter-clockwise to create hole with even-odd)
        const inner = `
            M ${x + r} ${y}
            h ${rw - 2 * r}
            a ${r} ${r} 0 0 1 ${r} ${r}
            v ${rh - 2 * r}
            a ${r} ${r} 0 0 1 -${r} ${r}
            h -${rw - 2 * r}
            a ${r} ${r} 0 0 1 -${r} -${r}
            v -${rh - 2 * r}
            a ${r} ${r} 0 0 1 ${r} -${r}
            Z
        `;
        
        return `${outer} ${inner}`;
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
            {/* 
                THE "SVG EVEN-ODD" STRATEGY (The Absolute Final Solution):
                Instead of a mask (which is visual only), we use a single PATH 
                with fill-rule="even-odd". 
                Because the hole is NOT part of the path geometry, 
                clicks on the hole will pass through to the element below NATIVELY.
                This is how modern tour libraries (like Shepherd/Intro.js) do it.
            */}
            <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 10 }}
            >
                <path 
                    d={getPath()}
                    fill="rgba(0, 0, 0, 0.85)"
                    fillRule="evenodd"
                    className="pointer-events-auto"
                />
            </svg>

            {targetRect && (
                <div 
                    style={{
                        position: 'fixed',
                        top: targetRect.top - pad,
                        left: targetRect.left - pad,
                        width: targetRect.width + (pad * 2),
                        height: targetRect.height + (pad * 2),
                        borderRadius: '1.5rem',
                        border: '2px solid rgba(249, 115, 22, 0.6)',
                        zIndex: 11,
                        pointerEvents: 'none'
                    }}
                />
            )}

            <AnimatePresence>
                {targetRect && !currentStep.noPulse && (
                    <motion.div 
                        key={`pulse-${stepIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            top: targetRect.top - pad,
                            left: targetRect.left - pad,
                            width: targetRect.width + (pad * 2),
                            height: targetRect.height + (pad * 2),
                            borderRadius: '1.5rem',
                            pointerEvents: 'none',
                            zIndex: 15
                        }}
                        className="ring-4 ring-orange-500/30 ring-offset-4 ring-offset-transparent animate-pulse"
                    />
                )}

                {targetRect && currentStep.showArrow && (
                    <motion.div
                        key={`arrow-${stepIndex}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: [0, 15, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                            position: 'absolute',
                            top: Math.min(windowSize.height - 60, targetRect.bottom + 20),
                            left: targetRect.left + targetRect.width / 2 - 20,
                            zIndex: 50
                        }}
                        className="text-orange-500 pointer-events-none"
                    >
                        <ChevronDown className="w-10 h-10 drop-shadow-lg" />
                    </motion.div>
                )}

                <motion.div 
                    key={`card-${stepIndex}`}
                    data-tour-card="true"
                    className="absolute z-[60] pointer-events-auto w-full max-w-[320px] sm:max-w-[380px]"
                    style={cardPosition() as any}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                >
                    <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden p-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                                    {currentPhase} de {totalPhases}
                                </span>
                                <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-orange-500 transition-all duration-500" 
                                        style={{ width: `${(currentPhase / totalPhases) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-orange-500" />
                                    {currentStep.title}
                                </h4>
                                <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                                    {currentStep.content}
                                </p>
                            </div>
                            
                            <div className="pt-4 flex items-center justify-between">
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em] italic">
                                    {currentStep.showNextButton ? "Leia e confirme abaixo" : "⚡ Clique no item para avançar"}
                                </p>

                                {currentStep.showNextButton && (
                                    <button 
                                        onClick={handleNext}
                                        className="bg-orange-500 hover:bg-orange-400 text-zinc-950 font-black uppercase italic tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        Entendido
                                        <div className="w-4 h-4 rounded-full bg-zinc-950/20 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>,
        document.body
    )
}
