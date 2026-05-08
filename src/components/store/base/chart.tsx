'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ChartBarProps {
    value: number
    active?: boolean
    label?: string
}

export function ChartBar({ value, active = false, label }: ChartBarProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-end gap-2.5 h-full group relative">
            <div 
                className={cn(
                    "w-full rounded-[5px] transition-all duration-300 relative",
                    active ? "bg-orange-500" : "bg-white/10 hover:bg-white/20"
                )}
                style={{ height: `${value}%` }}
            >
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 p-2 rounded-[5px] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <span className="text-[10px] font-black text-white">{value}%</span>
                </div>
            </div>
            {label && (
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
            )}
        </div>
    )
}

export function ChartContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-40 w-full flex flex-row items-end justify-between gap-2.5">
            {children}
        </div>
    )
}
