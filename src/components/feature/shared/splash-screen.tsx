'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/store/base/logo'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'

interface SplashScreenProps {
    onFinish?: () => void
    redirectHref?: string
    color?: 'emerald' | 'amber' | 'red' | 'orange' | 'blue'
}

export function SplashScreen({ onFinish, redirectHref, color = 'emerald' }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isFinishing, setIsFinishing] = useState(false)
    const router = useRouter()

    const colorMap = {
        emerald: '#10b981',
        amber: '#f59e0b',
        red: '#ef4444',
        orange: '#f97316',
        blue: '#3b82f6'
    }

    const strokeColor = colorMap[color] || colorMap.emerald

    useEffect(() => {
        const drawDuration = 1500; 
        const holdDuration = 500;   

        const finishTimer = setTimeout(() => {
            setIsFinishing(true);

            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onFinish) onFinish();
                    if (redirectHref) router.push(redirectHref);
                }, 400); 
            }, holdDuration);
        }, drawDuration);

        return () => clearTimeout(finishTimer);
    }, [onFinish, redirectHref, router]);

    if (!isVisible) return null

    return (
        <Box
            position="fixed"
            inset={0}
            zIndex={100}
            display="flex"
            align="center"
            justify="center"
            bg="zinc"
            bgOpacity={100}
            className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            suppressHydrationWarning
        >
            <style>{`
                @keyframes saber-draw {
                    from { stroke-dashoffset: 100; }
                    to { stroke-dashoffset: 0; }
                }

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }

                .rt-minimal-bolt {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: saber-draw 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    will-change: stroke-dashoffset;
                }

                .rt-loading-container {
                    animation: pulse-glow 2s ease-in-out infinite;
                }

                .rt-finish-fade {
                    animation: bolt-fade-out 0.5s ease-in forwards;
                }

                @keyframes bolt-fade-out {
                    to { opacity: 0; transform: scale(0.95); }
                }
            `}</style>

            <Stack 
                align="center" 
                justify="center" 
                gap={7.5}
                className={`transition-all duration-500 ${isFinishing ? 'rt-finish-fade' : ''}`}
            >
                <Box position="relative">
                    <div className="rt-loading-container">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-24 h-24"
                        >
                            <path
                                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                                stroke={strokeColor}
                                strokeWidth="1"
                                pathLength="100"
                                className="rt-minimal-bolt"
                                style={{ strokeDashoffset: 100, strokeDasharray: 100 }}
                            />
                        </svg>
                    </div>
                </Box>
            </Stack>
        </Box>
    )
}
