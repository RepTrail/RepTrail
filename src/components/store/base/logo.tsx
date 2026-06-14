import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: 'white' | 'orange' | 'emerald' | 'amber' | 'red' | 'blue' | 'brand-accent'
    className?: never
    id?: string
}

export function Logo({
    size = 'md',
    color = 'orange',
    className,
    id
}: LogoProps) {
    const sizeMap = {
        sm: {
            container: 'p-2 rounded-[5px]',
            icon: 'w-4 h-4',
            text: 'text-2xl'
        },
        md: {
            container: 'p-2.5 rounded-[5px]',
            icon: 'w-5 h-5',
            text: 'text-3xl'
        },
        lg: {
            container: 'p-4 rounded-[5px]',
            icon: 'w-8 h-8',
            text: 'text-5xl md:text-6xl'
        },
        xl: {
            container: 'p-6 rounded-[5px]',
            icon: 'w-14 h-14',
            text: 'text-8xl md:text-[10rem]'
        }
    }

    const colorMap = {
        orange: {
            bg: 'bg-orange-500',
            text: 'text-orange-500'
        },
        emerald: {
            bg: 'bg-emerald-500',
            text: 'text-emerald-500'
        },
        amber: {
            bg: 'bg-amber-500',
            text: 'text-amber-500'
        },
        red: {
            bg: 'bg-red-500',
            text: 'text-red-500'
        },
        'brand-accent': {
            bg: 'bg-orange-500',
            text: 'text-orange-500'
        },
        white: {
            bg: 'bg-white',
            text: 'text-white'
        },
        blue: {
            bg: 'bg-blue-500',
            text: 'text-blue-500'
        }
    }

    const currentSize = sizeMap[size]
    const currentColor = colorMap[color]

    return (
        <div id={id} className={cn("flex items-center gap-3", className)} suppressHydrationWarning data-color={color}>
            <div className={cn(
                "rotate-3 transition-transform group-hover:rotate-0 flex-shrink-0 aspect-square flex items-center justify-center",
                currentColor?.bg,
                currentSize.container
            )}>
                <Zap className={cn(
                    "transition-transform group-hover:rotate-0",
                    "text-zinc-950",
                    "-rotate-3",
                    currentSize.icon
                )} />
            </div>
            <h1 className={cn(
                "font-black text-white italic uppercase tracking-tighter leading-none",
                currentSize.text
            )}>
                REP<span className={currentColor?.text}>{color === 'white' ? 'TRAIL' : 'TRAIL'}</span>
            </h1>
        </div>
    )
}
