import React from 'react'
import { cn } from '@/lib/utils'

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  as?: 'div' | 'aside' | 'nav' | 'main' | 'section' | 'header' | 'footer' | 'button' | 'img' | 'input' | 'label' | 'span'
  className?: string
  id?: string
  onClick?: () => void
  style?: React.CSSProperties
}

/**
 * Box: A minimal semantic wrapper primitive.
 * Architecturally neutral. No style props allowed.
 * All styling must be done via className or by using Semantic Components (Card, Stack, etc.)
 */
export function Box({
  children,
  as: Component = 'div',
  className,
  id,
  onClick,
  style,
  ...props
}: BoxProps) {
  return (
    <Component
      id={id}
      onClick={onClick}
      style={style}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  )
}
