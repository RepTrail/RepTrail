import React from 'react'
import { cn } from '@/lib/utils'
import { ImageFallback } from './image-fallback'
import { LucideIcon } from 'lucide-react'
import { SpacingToken } from './box'

interface ImgProps {
    src: string
    alt: string
    width?: number | string
    height?: number | string
    className?: never
    rounded?: 'system' | 'full' | 'none' | boolean
    id?: string
    fallbackIcon?: LucideIcon
    style?: never
    padding?: SpacingToken
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    hoverScale?: 105 | 110
    transition?: boolean
    fullWidth?: boolean
    fullHeight?: boolean
    grayscale?: boolean | 'group-hover'
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
    fullHeight,
    grayscale
}: ImgProps) {
    const [error, setError] = React.useState(false)

    if (error || !src) {
        return <ImageFallback icon={fallbackIcon} className={className} />
    }

    const paddingMapping: Record<SpacingToken, string> = {
        none:         'p-0',
        tiny:         'p-1',
        element:      'p-2.5',
        container:    'p-5',
        empty_state:  'p-[30px]',
        section:      'p-10',
        dashboard_pc: 'p-20',
        safe_area:    'p-[100px]',
        'title-content': 'p-[30px]',
        'header-gap': 'p-8',
    }

    const objectFitMapping = {
        cover:       'object-cover',
        contain:     'object-contain',
        fill:        'object-fill',
        none:        'object-none',
        'scale-down':'object-scale-down'
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
                rounded === 'full'   && "rounded-full",
                rounded === true     && "rounded-[5px]",
                fullWidth            && "w-full",
                fullHeight           && "h-full",
                padding !== undefined && paddingMapping[padding],
                objectFit            && objectFitMapping[objectFit],
                transition           && "transition-all duration-500",
                hoverScale === 105   && "group-hover:scale-105",
                hoverScale === 110   && "group-hover:scale-110",
                grayscale === true           && "grayscale",
                grayscale === 'group-hover'  && "grayscale group-hover:grayscale-0",
                className
            )} 
        />
    )
}
