'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.TooltipProvider
export const Tooltip = TooltipPrimitive.Tooltip
export const TooltipTrigger = TooltipPrimitive.TooltipTrigger

interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.TooltipContent> {
  variant?: 'default' | 'transparent'
}

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.TooltipContent>,
  TooltipContentProps
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <TooltipPrimitive.TooltipContent
      ref={ref}
      className={cn(
        variant === 'transparent' && 'p-0 border-0 bg-transparent shadow-none',
        className
      )}
      {...props}
    />
  )
})

TooltipContent.displayName = 'TooltipContent'
