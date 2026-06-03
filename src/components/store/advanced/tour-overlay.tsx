'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassPanel } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { X } from 'lucide-react'

interface TourOverlayProps {
    targetId: string
    title: string
    content: string
    subtext?: string
    buttonText?: string
    onNext?: () => void
    onClose?: () => void
    isCentered?: boolean
    advanceOnTargetClick?: boolean
}

export function TourOverlay({
    targetId,
    title,
    content,
    subtext,
    buttonText,
    onNext,
    onClose,
    isCentered = false,
    advanceOnTargetClick = true
}: TourOverlayProps) {
    const [rect, setRect] = useState<DOMRect | null>(null)
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 })

    useEffect(() => {
        setWindowSize({ w: window.innerWidth, h: window.innerHeight })

        const updateRect = () => {
            if (isCentered) {
                setRect(null)
                return
            }

            const element = document.getElementById(targetId)
            if (element) {
                const newRect = element.getBoundingClientRect()
                // Evita updates desnecessários
                setRect(prev => {
                    if (!prev || 
                        Math.abs(prev.top - newRect.top) > 2 || 
                        Math.abs(prev.left - newRect.left) > 2 ||
                        Math.abs(prev.width - newRect.width) > 2 ||
                        Math.abs(prev.height - newRect.height) > 2) {
                        return newRect
                    }
                    return prev
                })
            } else {
                setRect(null)
            }
        }

        updateRect()
        const interval = setInterval(updateRect, 100) // Poll frequently for smooth tracking
        window.addEventListener('resize', updateRect)
        window.addEventListener('scroll', updateRect, true)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', updateRect)
            window.removeEventListener('scroll', updateRect, true)
        }
    }, [targetId, isCentered])

    // Adicionar hook de click no alvo apenas se não houver um botão "Próximo" no overlay
    useEffect(() => {
        if (isCentered) return

        const element = document.getElementById(targetId)
        // Se buttonText existe ou advanceOnTargetClick for false, não anexamos os listeners
        if (!element || !onNext || buttonText || !advanceOnTargetClick) return

        const handleClick = () => {
            onNext()
        }

        element.addEventListener('click', handleClick)
        element.addEventListener('drop', handleClick)
        element.addEventListener('change', handleClick)
        return () => {
            element.removeEventListener('click', handleClick)
            element.removeEventListener('drop', handleClick)
            element.removeEventListener('change', handleClick)
        }
    }, [targetId, onNext, isCentered, rect, buttonText])

    // Se não é centrado e não achou o rect ainda, não mostra pra não piscar no meio da tela
    if (!isCentered && !rect) return null

    const padding = 12 // Padding ao redor do elemento alvo
    
    const spotlightStyles = isCentered ? {
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        x: '-50%',
        y: '-50%'
    } : rect ? {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        x: 0,
        y: 0
    } : { top: 0, left: 0, width: 0, height: 0 }

    // Calcular posição do tooltip
    let tooltipPos: any = { top: '50%', left: '50%', x: '-50%', y: '-50%' }
    if (!isCentered && rect) {
        // Tentar posicionar abaixo, se não couber, posiciona acima
        const spaceBelow = windowSize.h - (rect.bottom + padding)
        const spaceAbove = rect.top - padding

        if (spaceBelow > 200 || spaceBelow >= spaceAbove) {
            // Embaixo
            tooltipPos = {
                top: rect.bottom + padding + 16,
                left: Math.max(16, Math.min(rect.left + rect.width / 2, windowSize.w - 300 - 16)), // Centralizado ou limite da tela
                x: rect.left + rect.width / 2 > 316 ? '-50%' : 0,
                y: 0
            }
        } else {
            // Em cima
            tooltipPos = {
                top: rect.top - padding - 16,
                left: Math.max(16, Math.min(rect.left + rect.width / 2, windowSize.w - 300 - 16)),
                x: rect.left + rect.width / 2 > 316 ? '-50%' : 0,
                y: '-100%'
            }
        }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
            <AnimatePresence>
                <motion.div
                    key="spotlight"
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: 1,
                        ...spotlightStyles,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                        position: 'absolute',
                        borderRadius: STORE_TOKENS.RADIUS.SYSTEM,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
                        pointerEvents: isCentered ? 'auto' : 'none' 
                        // pointerEvents none no buraco permite clicar no elemento alvo!
                    }}
                >

                </motion.div>

                <motion.div
                    key="tooltip"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                        opacity: 1, 
                        scale: 1,
                        ...tooltipPos
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
                    style={{
                        position: 'absolute',
                        width: '320px',
                        pointerEvents: 'auto'
                    }}
                >
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} variant="glass" border="emerald">
                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Stack direction="row" align="start" justify="between">
                                <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                    {title}
                                </Font>
                                {onClose && (
                                    <div onClick={onClose} style={{ cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.2s' }}>
                                        <X size={16} />
                                    </div>
                                )}
                            </Stack>
                            
                            <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.MUTED} leading="relaxed">
                                {content}
                            </Font>

                            {subtext && (
                                <Font variant="label" color={STORE_TOKENS.COLORS.BRAND} italic>
                                    {subtext}
                                </Font>
                            )}

                            {buttonText && onNext && (
                                <div style={{ marginTop: '8px' }}>
                                    <Button variant="outline-emerald" fullWidth onClick={onNext}>
                                        {buttonText}
                                    </Button>
                                </div>
                            )}
                        </Stack>
                    </GlassPanel>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
