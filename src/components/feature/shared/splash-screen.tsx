'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SplashScreenProps {
    onFinish?: () => void
    redirectHref?: string
}

export function SplashScreen({ onFinish, redirectHref }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true)
    const [isFinishing, setIsFinishing] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Snappier minimalist timings
        const drawDuration = 1500; // 1.5s to draw
        const holdDuration = 500;   // 0.5s pause

        const finishTimer = setTimeout(() => {
            setIsFinishing(true);

            setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onFinish) onFinish();
                    if (redirectHref) router.push(redirectHref);
                }, 400); // Fade out duration
            }, holdDuration);
        }, drawDuration);

        return () => clearTimeout(finishTimer);
    }, [onFinish, redirectHref, router]);

    if (!isVisible) return null

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            suppressHydrationWarning
        >
            <style>{`
                @keyframes saber-draw {
                    from { stroke-dashoffset: 100; }
                    to { stroke-dashoffset: 0; }
                }

                .rt-minimal-bolt {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: saber-draw 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    will-change: stroke-dashoffset;
                }

                .rt-finish-fade {
                    animation: bolt-fade-out 0.5s ease-in forwards;
                }

                @keyframes bolt-fade-out {
                    to { opacity: 0; transform: scale(0.95); }
                }
            `}</style>

            <div className={`relative w-24 h-24 flex items-center justify-center transition-all duration-500 ${isFinishing ? 'rt-finish-fade' : ''}`}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <path
                        d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                        pathLength="100"
                        className="rt-minimal-bolt"
                        style={{ strokeDashoffset: 100, strokeDasharray: 100 }}
                    />
                </svg>
            </div>
        </div>
    )
}
