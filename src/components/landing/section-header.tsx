import { LandingBadge } from "./landing-badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    badgeIcon?: LucideIcon;
    badgeText?: string;
    badgeVariant?: "emerald" | "orange";
    title: React.ReactNode;
    subtitle?: string;
    align?: "left" | "center";
    maxW?: string;
    className?: string;
}

export function SectionHeader({
    badgeIcon,
    badgeText,
    badgeVariant = "emerald",
    title,
    subtitle,
    align = "center",
    maxW = "max-w-3xl",
    className
}: SectionHeaderProps) {
    const alignmentClasses = {
        left: "items-start text-left",
        center: "items-center text-center mx-auto"
    };

    return (
        <div className={cn(
            "flex flex-col gap-[20px] w-full",
            alignmentClasses[align],
            maxW,
            className
        )}>
            {badgeText && (
                <LandingBadge icon={badgeIcon} variant={badgeVariant}>
                    {badgeText}
                </LandingBadge>
            )}
            
            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                {title}
            </h2>
            
            {subtitle && (
                <p className="text-zinc-500 text-lg leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
