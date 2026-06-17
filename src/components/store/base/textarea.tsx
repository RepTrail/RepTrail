'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { Stack } from './stack'
import { Font } from './font'
import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  subtitle?: string
  error?: string
  rounded?: 'system' | 'none'
  flex1?: boolean
}

export function Textarea({
  label,
  subtitle,
  error,
  rounded = 'system',
  flex1 = false,
  className,
  ...props
}: TextareaProps) {
  const { primaryColor } = useRegistry()

  const colorMap = {
    blue: 'focus:border-blue-500/50 focus:bg-blue-500/5',
    red: 'focus:border-red-500/50 focus:bg-red-500/5',
    amber: 'focus:border-amber-500/50 focus:bg-amber-500/5',
    emerald: 'focus:border-emerald-500/50 focus:bg-emerald-500/5',
    orange: 'focus:border-orange-500/50 focus:bg-orange-500/5',
    zinc: 'focus:border-zinc-500/50 focus:bg-zinc-500/5',
  }

  const activeClasses = colorMap[primaryColor as keyof typeof colorMap]

  return (
    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth flex1={flex1}>
      {(label || subtitle) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
              {label}
            </Font>
          )}
          {subtitle && (
            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>
              {subtitle}
            </Font>
          )}
        </div>
      )}
      <textarea
        className={cn(
          'w-full min-h-[100px] p-2.5 bg-zinc-950/40 border-2 border-white/10 text-white placeholder:text-zinc-600 outline-none transition-all resize-none',
          rounded === 'system' && (STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full'),
          rounded === 'none' && 'rounded-none',
          activeClasses,
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && (
        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.ERROR} weight="black" uppercase tracking="widest">
          {error}
        </Font>
      )}
    </Stack>
  )
}
