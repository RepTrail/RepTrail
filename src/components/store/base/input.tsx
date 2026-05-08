import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'
import { Font } from './font'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: React.ReactNode
  rounded?: 'system' | 'full' | 'none'
  flex1?: boolean
}

export function Input({
  error,
  icon,
  rounded = 'system',
  flex1 = false,
  className,
  ...props
}: InputProps) {
  return (
    <Box width="full" flex1={flex1} className="space-y-2">
      <Box position="relative" className="group">
        {icon && (
          <Box
            position="absolute"
            inset="left-4-top-1/2"
            className="-translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-500"
            zIndex={10}
          >
            {icon}
          </Box>
        )}
        <input
          className={cn(
            'w-full h-12 bg-zinc-950/40 border border-white/10 text-white placeholder:text-zinc-600 outline-none transition-all',
            rounded === 'system' && 'rounded-[5px]',
            rounded === 'full' && 'rounded-full',
            rounded === 'none' && 'rounded-none',
            'focus:border-emerald-500/50 focus:bg-emerald-500/5',
            icon ? 'pl-12 pr-4' : 'px-4',
            error && 'border-red-500/50',
            className
          )}
          {...props}
        />
      </Box>
      {error && (
        <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest" className="pl-1">
          {error}
        </Font>
      )}
    </Box>
  )
}
