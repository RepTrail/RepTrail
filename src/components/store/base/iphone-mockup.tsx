import React from 'react'
import { cn } from '@/lib/utils'

interface IphoneMockupProps {
  children?: React.ReactNode
  className?: string
  id?: string
}

export function IphoneMockup({ children, className, id }: IphoneMockupProps) {
  return (
    <div
      id={id}
      className={cn(
        "relative mx-auto w-full max-w-[300px] aspect-[9/19.5] border-[10px] border-zinc-900 bg-zinc-950 rounded-[42px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] ring-1 ring-zinc-800/80",
        className
      )}
    >
      {/* Volume / Silent Buttons (Left Side) */}
      <div className="absolute -left-[12px] top-[75px] w-[2px] h-[22px] bg-zinc-700 rounded-l-sm" />
      <div className="absolute -left-[12px] top-[120px] w-[2px] h-[40px] bg-zinc-700 rounded-l-sm" />
      <div className="absolute -left-[12px] top-[175px] w-[2px] h-[40px] bg-zinc-700 rounded-l-sm" />

      {/* Power Button (Right Side) */}
      <div className="absolute -right-[12px] top-[135px] w-[2px] h-[60px] bg-zinc-700 rounded-r-sm" />

      {/* Internal Screen Container */}
      <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-zinc-950 flex flex-col">
        {/* Notch - iPhone 13 Style (Slightly narrower and taller earpiece placement) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[24px] bg-zinc-900 rounded-b-[18px] z-30 flex items-center justify-between px-3">
          {/* Earpiece Speaker (Move up close to the bezel) */}
          <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-12 h-[3px] bg-zinc-800 rounded-full" />
          
          {/* Sensors and Camera Lens */}
          <div className="w-1.5 h-1.5 bg-zinc-950 rounded-full ring-1 ring-zinc-850" />
          <div className="w-2.5 h-2.5 bg-zinc-950 rounded-full border border-indigo-950/80 ring-1 ring-zinc-850 relative flex items-center justify-center">
            <div className="w-1 h-1 bg-indigo-900/60 rounded-full absolute top-[1px] right-[1px]" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="w-full h-full select-none pointer-events-auto">
          {children}
        </div>

        {/* Gloss / Reflection Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/[0.08] z-20 rounded-[32px]" />
      </div>
    </div>
  )
}
