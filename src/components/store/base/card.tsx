import React from 'react'
import { Box, BoxProps } from './box'
import { cn } from '@/lib/utils'

interface CardProps extends BoxProps {
    variant?: 'surface' | 'dark' | 'outline' | 'flat'
}

export function Card({ children, variant = 'surface', className, ...props }: CardProps) {
    const variants = {
        surface: {
            bg: 'zinc-900/40' as const,
            border: 'white/5' as const,
            shadow: 'amber' as const // Default amber shadow for brutalist look
        },
        dark: {
            bg: 'zinc-950' as const,
            border: 'white/10' as const,
        },
        outline: {
            bg: 'transparent' as const,
            border: 'white/10' as const,
        },
        flat: {
            bg: 'zinc-900' as const,
            border: 'transparent' as const,
        }
    }

    const config = variants[variant]

    return (
        <Box 
            {...config}
            rounded="system"
            {...props}
            className={cn(className)}
        >
            {children}
        </Box>
    )
}

export function CardHeader({ children, className, ...props }: BoxProps) {
    return (
        <Box padding={5} borderBottom="white/5" {...props} className={cn(className)}>
            {children}
        </Box>
    )
}

export function CardContent({ children, className, ...props }: BoxProps) {
    return (
        <Box padding={5} {...props} className={cn(className)}>
            {children}
        </Box>
    )
}

export function CardFooter({ children, className, ...props }: BoxProps) {
    return (
        <Box padding={5} borderTop="white/5" {...props} className={cn(className)}>
            {children}
        </Box>
    )
}
