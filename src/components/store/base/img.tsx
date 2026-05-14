'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ImageFallback } from './image-fallback'
import { LucideIcon } from 'lucide-react'

interface ImgProps {
    src: string
    alt: string
    width?: number | string
    height?: number | string
    className?: string
    rounded?: 'system' | 'full' | 'none' | boolean
    id?: string
    fallbackIcon?: LucideIcon
    style?: React.CSSProperties
    padding?: 0 | 1 | 2.5 | 5 | 7.5 | 10
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    hoverScale?: 105 | 110
    transition?: boolean
    fullWidth?: boolean
    fullHeight?: boolean
}

export function Img({ 
    src, 
    alt, 
    width, 
    height, 
    className, 
    rounded, 
    id, 
    fallbackIcon, 
    style,
    padding,
    objectFit,
    hoverScale,
    transition,
    fullWidth,
    fullHeight
}: ImgProps) {
    const [error, setError] = React.useState(false)

    if (error || !src) {
        return <ImageFallback icon={fallbackIcon} className={className} />
    }

    const paddingMapping = {
        0: 'p-0',
        1: 'p-1',
        2.5: 'p-2.5',
        5: 'p-5',
        7.5: 'p-[30px]',
        10: 'p-10'
    }

    const objectFitMapping = {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down'
    }

    return (
        <img 
            id={id}
            src={src} 
            alt={alt} 
            width={width} 
            height={height} 
            onError={() => setError(true)}
            style={style}
            className={cn(
                rounded === 'system' && "rounded-[5px]",
                rounded === 'full' && "rounded-full",
                rounded === true && "rounded-[5px]",
                fullWidth && "w-full",
                fullHeight && "h-full",
                padding !== undefined && paddingMapping[padding],
                objectFit && objectFitMapping[objectFit],
                transition && "transition-all duration-500",
                hoverScale === 105 && "group-hover:scale-105",
                hoverScale === 110 && "group-hover:scale-110",
                className
            )} 
        />
    )
}
