import React from 'react'
import { cn } from '@/lib/utils'

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    rounded?: 'none' | 'sm' | 'system' | 'full'
}

export function Img({ className, rounded = 'none', ...props }: ImgProps) {
    return (
        <img 
            {...props}
            className={cn(
                "w-full h-full object-cover",
                rounded === 'sm' && 'rounded-sm',
                rounded === 'system' && 'rounded-[5px]',
                rounded === 'full' && 'rounded-full',
                className
            )}
        />
    )
}
