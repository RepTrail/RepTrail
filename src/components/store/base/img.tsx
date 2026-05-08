'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ImgProps {
    src: string
    alt: string
    width?: string | number
    height?: string | number
    className?: string
    rounded?: boolean
    id?: string
}

export function Img({ src, alt, width, height, className, rounded, id }: ImgProps) {
    return (
        <img 
            id={id}
            src={src} 
            alt={alt} 
            width={width} 
            height={height} 
            className={cn(
                rounded && "rounded-[5px]",
                className
            )} 
        />
    )
}
