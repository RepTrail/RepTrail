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
            container: 'p-2 rounded-lg shadow-md',
            icon: 'w-4 h-4',
            text: 'text-2xl'
        },
        md: {
            container: 'p-2.5 rounded-xl shadow-lg',
            icon: 'w-5 h-5',
            text: 'text-3xl'
        },
        lg: {
            container: 'p-4 rounded-2xl shadow-lg',
            icon: 'w-8 h-8',
            text: 'text-5xl md:text-6xl'
        },
        xl: {
            container: 'p-6 rounded-[2.5rem] shadow-2xl',
            icon: 'w-14 h-14',
            text: 'text-8xl md:text-[10rem]'
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
        <div className={cn("flex items-center gap-3", className)} suppressHydrationWarning>
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
