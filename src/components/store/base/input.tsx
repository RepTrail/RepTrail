'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Font } from './font'
import { Eye, EyeOff } from 'lucide-react'
import { useRegistry } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { Stack } from './stack'


interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'width' | 'size'> {
  label?: string
  subtitle?: string
  error?: string
  icon?: React.ReactNode
  rounded?: 'system' | 'full' | 'none'
  flex1?: boolean
  mask?: 'date' | 'phone' | 'cpf' | 'number'
  color?: 'emerald' | 'orange' | 'amber' | 'red' | 'blue' | 'zinc' | 'white' | 'primary'
  weight?: 'normal' | 'bold' | 'black'
  height?: 'full' | 'auto'
  fontMono?: boolean
  textAlign?: 'left' | 'center' | 'right'
  width?: string | number | { base: string | number, md?: string | number, lg?: string | number }
  size?: 'sm' | 'md' | 'lg'
}

export function Input({
  label,
  subtitle,
  error,
  icon,
  rounded = 'system',
  flex1 = false,
  mask,
  color,
  weight,
  height,
  fontMono,
  textAlign,
  width,
  size = 'md',
  className,
  onChange,
  type,
  ...props
}: InputProps) {
  const { primaryColor } = useRegistry()

  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const resolvedColor = color === 'primary' ? primaryColor : color

  const textColors = {
    emerald: 'text-emerald-500',
    orange: 'text-orange-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    blue: 'text-blue-500',
    zinc: 'text-zinc-500',
    white: 'text-white'
  }

  const weightClasses = {
    normal: 'font-normal',
    bold: 'font-bold',
    black: 'font-black'
  }

  const colorMap = {
    blue: 'focus:border-blue-500/50 focus:bg-blue-500/5 group-focus-within:text-blue-500',
    red: 'focus:border-red-500/50 focus:bg-red-500/5 group-focus-within:text-red-500',
    amber: 'focus:border-amber-500/50 focus:bg-amber-500/5 group-focus-within:text-amber-500',
    emerald: 'focus:border-emerald-500/50 focus:bg-emerald-500/5 group-focus-within:text-emerald-500',
    orange: 'focus:border-orange-500/50 focus:bg-orange-500/5 group-focus-within:text-orange-500',
    zinc: 'focus:border-zinc-500/50 focus:bg-zinc-500/5 group-focus-within:text-zinc-500',
  }

  const activeClasses = colorMap[primaryColor as keyof typeof colorMap]

  const applyMask = (value: string) => {
    if (!mask) return value
    const clean = value.replace(/\D/g, '')
    switch (mask) {
      case 'date':
        return clean
          .replace(/(\d{2})(\d)/, '$1/$2')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .substring(0, 10);
      case 'phone':
        return clean
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .substring(0, 15);
      case 'cpf':
        return clean
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
          .substring(0, 14);
      case 'number':
        return clean
      default:
        return value
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mask) e.target.value = applyMask(e.target.value)
    onChange?.(e)
  }

  return (
    <Stack gap={STORE_TOKENS.SPACING.ELEMENT} flex1={flex1} width={width as any} fullWidth={!width}>
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
      <div className={cn("relative group", height === 'full' && 'flex-1 flex flex-col', size === 'sm' && 'h-8')}>
        {/* Left icon */}
        {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors flex items-center z-10 [&>*]:text-current",
            size === 'sm' && "left-2 text-xs scale-90",
            activeClasses.split(' ').find(c => c.startsWith('group-focus-within:'))
          )}>
            {icon}
          </div>
        )}

        <input
          type={inputType}
          className={cn(
            'w-full bg-zinc-950/40 border-2 placeholder:text-zinc-600 outline-none transition-all',
            'border-white/10',
            height === 'full' ? 'flex-1 min-h-[48px]' : (size === 'sm' ? 'h-8 text-xs' : 'h-12'),
            resolvedColor ? textColors[resolvedColor as keyof typeof textColors] : 'text-white',
            weight && weightClasses[weight],
            rounded === 'system' && (STORE_TOKENS.RADIUS.SYSTEM === 'system' ? 'rounded-[5px]' : 'rounded-full'),
            rounded === 'full' && 'rounded-full',
            rounded === 'none' && 'rounded-none',
            activeClasses.split(' ').filter(c => !c.startsWith('group-focus-within:')).join(' '),
            icon ? (size === 'sm' ? 'pl-8' : 'pl-12') : (size === 'sm' ? 'pl-2 px-2' : 'pl-4 pr-4'),
            isPassword ? (size === 'sm' ? 'pr-8' : 'pr-12') : (size === 'sm' ? 'pr-2' : 'pr-4'),
            error && 'border-red-500/50',
            fontMono && 'font-mono',
            textAlign === 'center' && 'text-center',
            textAlign === 'right' && 'text-right',
            className
          )}
          onChange={handleChange}
          {...props}
        />

        {/* Right password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors z-10",
              primaryColor === 'emerald' && "hover:text-emerald-400",
              primaryColor === 'orange' && "hover:text-orange-400",
              primaryColor === 'amber' && "hover:text-amber-400",
              primaryColor === 'blue' && "hover:text-blue-400",
              primaryColor === 'red' && "hover:text-red-400"
            )}
            tabIndex={-1}
          >
            {showPassword
              ? <EyeOff className="w-4 h-4" />
              : <Eye className="w-4 h-4" />
            }
          </button>
        )}
      </div>

      {error && (
        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.ERROR} weight="black" uppercase tracking="widest">
          {error}
        </Font>
      )}
    </Stack>
  )
}
