'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'

interface CircularProgressProps {
    value: number
    size?: 'sm' | 'md' | 'lg'
    color?: 'emerald' | 'amber' | 'red' | 'blue' | 'primary'
    thickness?: number
    className?: never
}

/**
 * CircularProgress: High-fidelity SVG gauge for the design system.
 * Used for metrics that require a 360-degree visualization.
 */
export function CircularProgress({
    value,
    size = 'md',
    color = 'emerald',
    thickness = 8,
    className
}: CircularProgressProps) {
    const sizeMap = {
        sm: 40,
        md: 64,
        lg: 96
    }

    const radius = (sizeMap[size] - thickness) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference

    const colorMap = {
        emerald: 'text-emerald-500',
        amber: 'text-amber-500',
        red: 'text-red-500',
        blue: 'text-blue-500',
        primary: 'text-primary'
    }

    return (
        <Box 
            width="auto" 
            height="auto" 
            display="flex" 
            align="center" 
            justify="center" 
            position="relative"
            className={className}
        >
            <svg
                width={sizeMap[size]}
                height={sizeMap[size]}
                viewBox={`0 0 ${sizeMap[size]} ${sizeMap[size]}`}
                className="-rotate-90"
            >
                {/* Background Circle */}
                <circle
                    cx={sizeMap[size] / 2}
                    cy={sizeMap[size] / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={thickness}
                    fill="transparent"
                    className="text-white/5"
                />
                {/* Progress Circle */}
                <circle
                    cx={sizeMap[size] / 2}
                    cy={sizeMap[size] / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={thickness}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn(colorMap[color], "transition-all duration-700 ease-in-out")}
                />
            </svg>
            
            {/* Value Label (Optional / Overlay) */}
            <Box position="absolute" display="flex" align="center" justify="center">
                {/* Children could go here if we wanted text inside */}
            </Box>
        </Box>
    )
}
