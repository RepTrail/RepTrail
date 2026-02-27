'use client'

import { Logo } from '@/components/ui/logo'

export function AuthLoadingScreen() {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black animate-in fade-in duration-500">
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
            `}</style>

            <div className="relative mb-8">
                <div className="rt-loading-container">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-24 h-24"
                    >
                        <path
                            d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                            stroke="#10b981"
                            strokeWidth="1"
                            pathLength="100"
                            className="rt-minimal-bolt"
                        />
                    </svg>
                </div>
            </div>

            <Logo size="md" color="emerald" className="animate-pulse" />

            <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                    Autenticando Acesso
                </p>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" />
                </div>
            </div>
        </div>
    )
}
