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
    const [isFinishing, setIsFinishing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Part 1: Start completion transition after drawing completes (3s)
        const finishTimer = setTimeout(() => {
            setIsFinishing(true);

            // Part 2: Wait for ignition bloom to peak before fading background
            setTimeout(() => {
                setIsBackgroundVisible(false);
            }, 800);

            // Part 3: Total duration cleanup
            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onFinish) onFinish();
                    if (redirectHref) router.push(redirectHref);
                }, 200);
            }, 3000);
        }, 3200); // Path animation duration is 3s

        return () => clearTimeout(finishTimer);
    }, [onFinish, redirectHref, router]);

    if (!isVisible) return null

    const saberColor = "#ff6a00"
    const saberCore = "#ffffff"

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            suppressHydrationWarning
        >
            <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ease-in-out ${isBackgroundVisible ? 'opacity-100' : 'opacity-0'}`} />

            <style>{`
                @keyframes saber-draw {
                    from { stroke-dashoffset: 100; }
                    to { stroke-dashoffset: -2; } /* slight overlap */
                }

                @keyframes saber-flicker {
                    0%, 100% { opacity: 1; filter: brightness(1); }
                    50% { opacity: 0.92; filter: brightness(1.15); }
                }

                @keyframes saber-ignite-bloom {
                    0% { transform: scale(1); filter: brightness(1) blur(0px); }
                    30% { transform: scale(1.02); filter: brightness(1.4); }
                    /* Flash to white */
                    50% { transform: scale(1.04); filter: brightness(4) drop-shadow(0 0 20px #ffffff); }
                    100% { transform: scale(1.1); filter: brightness(8) drop-shadow(0 0 50px #ffffff); }
                }

                .rt-saber-path {
                    stroke-dasharray: 100 100;
                    stroke-dashoffset: 100;
                    animation: saber-draw 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .rt-saber-active .rt-saber-path {
                    stroke: #ffffff !important;
                    stroke-dashoffset: -2 !important;
                }

                .rt-saber-active {
                    animation: 
                        saber-flicker 0.15s infinite alternate,
                        saber-ignite-bloom 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .bloom-bg {
                    background: radial-gradient(circle, rgba(255,106,0,0.2) 0%, transparent 70%);
                    mix-blend-mode: screen;
                    pointer-events: none;
                }
            `}</style>

            <div className="relative w-80 h-80 flex items-center justify-center">
                <div className={`absolute inset-0 bloom-bg transition-opacity duration-1000 ${isFinishing ? 'opacity-100 scale-150' : 'opacity-0 scale-100'}`} />

                <div className="relative w-full h-full flex items-center justify-center">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-full h-full ${isFinishing ? 'rt-saber-active' : ''}`}
                        style={{ overflow: 'visible' }}
                    >
                        <defs>
                            <filter id="volumetric-saber" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="glow" />
                                <feFlood floodColor={saberColor} result="color" />
                                <feComposite in="color" in2="glow" operator="in" />
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        <g filter="url(#volumetric-saber)">
                            <path
                                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                                stroke={saberColor}
                                strokeWidth="1.2"
                                pathLength="100"
                                className="rt-saber-path"
                            />
                            <path
                                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                                stroke={saberCore}
                                strokeWidth="0.4"
                                pathLength="100"
                                className="rt-saber-path"
                                style={{ opacity: 0.8, animationDelay: '0.1s' }}
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    )
}
