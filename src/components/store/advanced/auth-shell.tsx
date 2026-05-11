'use client'

import React from 'react'
import { Box } from '../base/box'
import { RegistryColor, useRegistry } from './registry-context'
import { cn } from '@/lib/utils'

interface AuthShellProps {
    children: React.ReactNode
}

const lightColorMap: Record<RegistryColor, string> = {
    blue:    'from-blue-500/20',
    red:     'from-red-500/20',
    amber:   'from-amber-500/20',
    emerald: 'from-emerald-500/20',
    orange:  'from-orange-500/20',
    zinc:    'from-zinc-500/20',
}

const orbColorMap: Record<RegistryColor, string> = {
    blue:    'bg-blue-500/10',
    red:     'bg-red-500/10',
    amber:   'bg-amber-500/10',
    emerald: 'bg-emerald-500/10',
    orange:  'bg-orange-500/10',
    zinc:    'bg-zinc-500/10',
}   

export function AuthShell({ children }: AuthShellProps) {
    const { primaryColor } = useRegistry()

    return (
        <Box
            minHeight="screen"
            bg="zinc"
            bgOpacity={100}
            overflow="hidden"
            display="flex"
            align="center"
            justify="center"
            position="relative"
            padding={5}
        >
            {/* Background Grid */}
            <div
                className="fixed inset-0 bg-[url('/grid.svg')] bg-repeat bg-top [mask-image:linear-gradient(to_bottom,white_20%,transparent_95%)] opacity-[0.4] pointer-events-none z-0" 
            />

            {/* Background Orbs */}
            <div
                className={cn(
                    'fixed -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 z-0',
                    'max-md:-top-[15%] max-md:-right-[25%] max-md:w-[90%] max-md:h-[50%] max-md:blur-[120px]',
                    `bg-gradient-to-br ${lightColorMap[primaryColor]} to-transparent`
                )} 
            />
            <div
                className={cn(
                    'fixed bottom-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[180px] animate-pulse pointer-events-none transition-colors duration-1000 z-0',
                    'max-md:w-[300px] max-md:h-[300px] max-md:blur-[100px] max-md:left-[5%] max-md:bottom-[5%]',
                    orbColorMap[primaryColor]
                )} 
            />

            <Box position="relative" zIndex={10} fullWidth display="flex" align="center" justify="center">
                {children}
            </Box>
        </Box>
    )
}
