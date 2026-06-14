'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import React from 'react'
import { Font } from './font'
import { cn } from '@/lib/utils'
import { useRegistry } from '@/components/store/base/registry-context'

interface BaseAvatarProps {
    initials: string
    variant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc' | 'primary'
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
    src?: string
    className?: never
    style?: never
}

export function BaseAvatar({
    initials,
    variant = 'zinc',
    size = 'md',
    src,
    className
}: BaseAvatarProps) {
    const { primaryColor } = useRegistry()
    const resolvedVariant = variant === 'primary' ? primaryColor : variant

    const sizeClasses = {
        sm: 'h-8 w-8 text-[8px]',
        md: 'h-12 w-12 text-[12px]',
        lg: 'h-16 w-16 text-[14px]',
        xl: 'h-20 w-20 text-[16px]',
        xxl: 'h-40 w-40 text-[24px]'
    }

    const variantClasses = {
        zinc: 'bg-zinc-900 border-zinc-800 text-zinc-500',
        orange: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
        emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
        red: 'bg-red-500/10 border-red-500/30 text-red-500',
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-500',
        amber: 'bg-amber-500/10 border-amber-500/30 text-amber-500'
    }

    return (
        <div
            className={cn(
                "rounded-full border flex items-center justify-center shrink-0 overflow-hidden relative",
                sizeClasses[size],
                variantClasses[resolvedVariant as keyof typeof variantClasses],
                className
            )}
        >
            {src ? (
                <img 
                    src={src} 
                    alt={initials} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                    }}
                />
            ) : null}
            <Font 
                weight="black" 
                color={resolvedVariant === STORE_TOKENS.COLORS.BACKGROUND ? STORE_TOKENS.COLORS.TEXT.MUTED : resolvedVariant as any} 
                variant={size === 'sm' ? 'sub-tiny' : 'body'} 
                align="center"
            >
                {initials}
            </Font>
        </div>
    );
}
