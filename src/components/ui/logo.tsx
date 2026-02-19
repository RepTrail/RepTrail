import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    textClassName?: string
    iconContainerClassName?: string
    iconClassName?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: 'orange' | 'emerald' | 'amber'
}

export function Logo({
    className,
    textClassName,
    iconContainerClassName,
    iconClassName,
    size = 'md',
    color = 'orange'
}: LogoProps) {
    const sizeMap = {
        sm: {
            container: 'p-1.5 rounded-lg shadow-md',
            icon: 'w-3 h-3',
            text: 'text-xl'
        },
        md: {
            container: 'p-2 rounded-xl shadow-lg',
            icon: 'w-4 h-4',
            text: 'text-2xl'
        },
        lg: {
            container: 'p-3 rounded-2xl shadow-lg',
            icon: 'w-6 h-6',
            text: 'text-4xl md:text-5xl'
        },
        xl: {
            container: 'p-4 rounded-[2rem] shadow-2xl',
            icon: 'w-10 h-10',
            text: 'text-6xl md:text-8xl'
        }
    }

    const colorMap = {
        orange: {
            bg: 'bg-orange-500 shadow-orange-500/20',
            text: 'text-orange-500'
        },
        emerald: {
            bg: 'bg-emerald-500 shadow-emerald-500/20',
            text: 'text-emerald-500'
        },
        amber: {
            bg: 'bg-amber-500 shadow-amber-500/20',
            text: 'text-amber-500'
        }
    }

    const currentSize = sizeMap[size]
    const currentColor = colorMap[color]

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className={cn(
                "rotate-3 transition-transform group-hover:rotate-0",
                currentColor.bg,
                currentSize.container,
                iconContainerClassName
            )}>
                <Zap className={cn("text-zinc-950 -rotate-3 transition-transform group-hover:rotate-0", currentSize.icon, iconClassName)} />
            </div>
            <h1 className={cn(
                "font-black text-white italic uppercase tracking-tighter leading-none",
                currentSize.text,
                textClassName
            )}>
                REP<span className={currentColor.text}>TRAIL</span>
            </h1>
        </div>
    )
}
