'use client'

import React from 'react'
import { Box } from './box'
import { Img } from './img'
import { Image as ImageIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface BannerProps {
    children: React.ReactNode
    src: string
    overlay?: 'gradient' | 'none'
    minHeight?: string | number
}

/**
 * Banner: A base primitive for hero sections and banners with background images and glass gradients.
 * Follows Rule 4 of the Design System for unique customizations like background images.
 */
export function Banner({ 
    children, 
    src, 
    overlay = 'gradient', 
    minHeight = '350px' 
}: BannerProps) {
    return (
        <Box 
            position="relative" 
            overflow="hidden" 
            rounded={STORE_TOKENS.RADIUS.SYSTEM} 
            bg={STORE_TOKENS.COLORS.BACKGROUND} 
            style={{ 
                minHeight, 
                border: '1px solid rgba(255, 255, 255, 0.05)' 
            }}
        >
            {/* Background Image */}
            <Box position="absolute" pin="inset" style={{ zIndex: 0 }}>
                <Img 
                    src={src} 
                    alt="Banner" 
                    fallbackIcon={ImageIcon}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
                />
            </Box>
            
            {/* Standard Liquid Glass Gradients */}
            {overlay === 'gradient' && (
                <>
                    <Box 
                        position="absolute" 
                        pin="inset" 
                        style={{ 
                            zIndex: 10,
                            background: 'linear-gradient(to right, #09090b, rgba(9, 9, 11, 0.6), transparent)',
                        }} 
                    />
                    <Box 
                        position="absolute" 
                        pin="inset" 
                        style={{ 
                            zIndex: 10,
                            background: 'radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.1), transparent 50%)'
                        }} 
                    />
                </>
            )}

            {/* Content Area */}
            <Box 
                position="relative" 
                padding={{ base: 'container', md: 'empty_state' }} 
                display="flex" 
                direction="col" 
                justify="center" 
                style={{ 
                    zIndex: 20, 
                    height: '100%', 
                    minHeight 
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
