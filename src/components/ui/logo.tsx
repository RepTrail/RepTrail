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

type SizeConfig = {
    container: string
    icon: string
    text: string
}

const SIZE_MAP: Record<string, SizeConfig> = {
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

const COLOR_MAP = {
    orange: {
        bg: 'bg-brand-secondary shadow-brand-secondary/20',
        text: 'text-brand-secondary'
    },
    emerald: {
        bg: 'bg-brand-primary shadow-brand-primary/20',
        text: 'text-brand-primary'
    },
    amber: {
        bg: 'bg-amber-500 shadow-amber-500/20',
        text: 'text-amber-500'
    }
}

export function Logo({
    className,
    textClassName,
    iconContainerClassName,
    iconClassName,
    size = 'md',
    color = 'orange'
}: LogoProps) {
    const config = SIZE_MAP[size]
    const colors = COLOR_MAP[color]

    return (
        <div className={cn("flex items-center gap-3 select-none", className)} suppressHydrationWarning>
            <div className={cn(
                "rotate-3 transition-transform group-hover:rotate-0 flex items-center justify-center shrink-0",
                colors.bg,
                config.container,
                iconContainerClassName
            )}>
                <Zap className={cn("text-zinc-950 -rotate-3 transition-transform group-hover:rotate-0", config.icon, iconClassName)} />
            </div>
            <h1 className={cn(
                "font-black text-white italic uppercase tracking-tighter leading-none whitespace-nowrap",
                config.text,
                textClassName
            )}>
                REP<span className={colors.text}>TRAIL</span>
            </h1>
        </div>
    )
}
