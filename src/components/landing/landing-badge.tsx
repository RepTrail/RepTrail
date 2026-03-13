import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandingBadgeProps {
    icon?: LucideIcon;
    children: React.ReactNode;
    variant?: "emerald" | "orange";
    className?: string;
}

export function LandingBadge({ 
    icon: Icon, 
    children, 
    variant = "emerald",
    className 
}: LandingBadgeProps) {
    const variants = {
        emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500",
        orange: "border-orange-500/20 bg-orange-500/5 text-orange-500",
    };

    return (
        <div className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest leading-none",
            variants[variant],
            className
        )}>
            {Icon && <Icon className="w-3 h-3 mr-2 fill-current" />}
            {children}
        </div>
    );
}
