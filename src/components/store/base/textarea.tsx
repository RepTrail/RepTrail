import React from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'
import { Font } from './font'
import { useRegistry } from '../advanced/registry-context'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  rounded?: 'system' | 'none'
  flex1?: boolean
}

export function Textarea({
  label,
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
    <Box className={cn('w-full flex flex-col gap-[10px]', flex1 && 'flex-1')}>
      {label && (
        <Font variant="auxiliary" color="zinc-500" weight="black" uppercase tracking="widest">
          {label}
        </Font>
      )}
      <textarea
        className={cn(
          'w-full min-h-[100px] p-4 bg-zinc-950/40 border-2 border-white/5 text-white placeholder:text-zinc-600 outline-none transition-all resize-none',
          rounded === 'system' && 'rounded-[5px]',
          rounded === 'none' && 'rounded-none',
          activeClasses,
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && (
        <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest" className="pl-1">
          {error}
        </Font>
      )}
    </Box>
  )
}
