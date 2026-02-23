'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SplashScreenProps {
    onFinish?: () => void
    redirectHref?: string
}

export function SplashScreen({ onFinish, redirectHref }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isBackgroundVisible, setIsBackgroundVisible] = useState(true)
    const router = useRouter()
    const [progress, setProgress] = useState(0)
    const [isFinishing, setIsFinishing] = useState(false)

    useEffect(() => {
        let isFullyDrawn = false;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (isFullyDrawn) return 100;
                if (prev >= 90) {
                    return 90;
                }
                return prev + 1.2;
            });
        }, 30);

        // Part 1: Start completion
        const finishTimer = setTimeout(() => {
            isFullyDrawn = true;
            setProgress(100);

            // Part 2: Wait for path to reach 100% physically in the SVG (transition is 1.5s)
            // We give it 1.8s to be absolutely sure there's no gap
            setTimeout(() => {
                setIsFinishing(true);

                // Part 3: Fade out background quickly to reveal content underneath
                setTimeout(() => {
                    setIsBackgroundVisible(false);
                }, 600);

                // Part 4: Cleanup
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(() => {
                        if (onFinish) onFinish();
                        if (redirectHref) router.push(redirectHref);
                    }, 500);
                }, 2800);
            }, 1800);
        }, 3000);

        return () => {
            clearInterval(interval);
            clearTimeout(finishTimer);
        };
    }, [onFinish, redirectHref, router]);

    if (!isVisible) return null

    // High-vibrancy Saber Orange
    const saberColor = "#ff6a00"
    const saberCore = "#ffffff"

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            suppressHydrationWarning
        >
            {/* Separate background to fade independently */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out ${isBackgroundVisible ? 'opacity-100' : 'opacity-0'}`}
            />
            <style>{`
                @keyframes saber-flicker {
                    0%, 100% { opacity: 1; filter: brightness(1); }
                    50% { opacity: 0.95; filter: brightness(1.2); }
                }

                @keyframes saber-ignite-bloom {
                    0% { transform: scale(1); filter: brightness(1) blur(0px); }
                    40% { transform: scale(1.01); filter: brightness(1.2); }
                    /* Gentler burst to white */
                    55% { transform: scale(1.03); filter: brightness(4) drop-shadow(0 0 30px #ffffff); }
                    100% { transform: scale(1.08); filter: brightness(8) drop-shadow(0 0 60px #ffffff); }
                }

                @keyframes radial-pulse {
                    0% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 0.4; transform: scale(1.2); }
                    100% { opacity: 0; transform: scale(1.5); }
                }

                .rt-saber-path {
                    transition: 
                        stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1),
                        stroke 0.6s ease-in-out;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .rt-saber-active .rt-saber-path {
                    stroke: #ffffff !important;
                }

                .rt-saber-active {
                    animation: 
                        saber-flicker 0.2s infinite alternate,
                        saber-ignite-bloom 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .bloom-bg {
                    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                    mix-blend-mode: screen;
                    pointer-events: none;
                }
            `}</style>

            <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Subtle radial bloom back light */}
                <div
                    className={`absolute inset-0 bloom-bg transition-opacity duration-1000 ${isFinishing ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`}
                />

                <div className="relative w-full h-full flex items-center justify-center svg-container">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-full h-full transition-all duration-700 ${isFinishing ? 'rt-saber-active' : ''}`}
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            {/* Volumetric Glow Filter */}
                            <filter id="volumetric-saber" x="-200%" y="-200%" width="500%" height="500%">
                                {/* Inner Glow */}
                                <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="inner-blur" />
                                <feFlood floodColor={saberColor} result="color-inner" />
                                <feComposite in="color-inner" in2="inner-blur" operator="in" result="inner-glow" />

                                {/* Core Glow */}
                                <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="mid-blur" />
                                <feFlood floodColor={saberColor} result="color-mid" />
                                <feComposite in="color-mid" in2="mid-blur" operator="in" result="mid-glow" />

                                {/* Outer Atmosphere */}
                                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="outer-blur" />
                                <feFlood floodColor={saberColor} result="color-outer" />
                                <feComposite in="color-outer" in2="outer-blur" operator="in" result="outer-glow" />

                                <feMerge>
                                    <feMergeNode in="outer-glow" />
                                    <feMergeNode in="mid-glow" />
                                    <feMergeNode in="inner-glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <g filter="url(#volumetric-saber)">
                            {/* The Energy Beam */}
                            <path
                                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                                stroke={saberColor}
                                strokeWidth="1.2"
                                pathLength="100"
                                strokeDasharray={`${progress >= 100 ? 102 : progress} 100`}
                                className="rt-saber-path"
                            />

                            {/* The Ultra-Bright Hot Core */}
                            <path
                                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                                stroke={saberCore}
                                strokeWidth="0.4"
                                pathLength="100"
                                strokeDasharray={`${progress >= 100 ? 102 : progress} 100`}
                                className="rt-saber-path"
                                style={{ opacity: 0.95 }}
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}
