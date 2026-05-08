import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Box } from './box'
import { Font } from './font'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rounded?: 'system' | 'full' | 'none'
  flex1?: boolean
  mask?: 'date' | 'phone' | 'cpf' | 'number'
}

export function Input({
  label,
  error,
  icon,
  rounded = 'system',
  flex1 = false,
  mask,
  className,
  onChange,
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const applyMask = (value: string) => {
    if (!mask) return value
    const clean = value.replace(/\D/g, '')
    switch (mask) {
      case 'date':
        return clean
          .replace(/(\d{2})(\d)/, '$1/$2')
          .replace(/(\d{2})(\d)/, '$1/$2')
          .substring(0, 10)
      case 'phone':
        return clean
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .substring(0, 15)
      case 'cpf':
        return clean
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
          .substring(0, 14)
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
    <Box className={cn('w-full flex flex-col gap-[10px]', flex1 && 'flex-1')}>
      {label && (
        <Font variant="auxiliary" color="zinc-500" weight="black" uppercase tracking="widest">
          {label}
        </Font>
      )}
      <div className="relative group">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-emerald-500 flex items-center z-10">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          className={cn(
            'w-full h-12 bg-zinc-950/40 border-2 border-white/5 text-white placeholder:text-zinc-600 outline-none transition-all',
            rounded === 'system' && 'rounded-[5px]',
            rounded === 'full' && 'rounded-full',
            rounded === 'none' && 'rounded-none',
            'focus:border-emerald-500/50 focus:bg-emerald-500/5',
            icon ? 'pl-12' : 'pl-4',
            isPassword ? 'pr-12' : 'pr-4',
            error && 'border-red-500/50',
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-emerald-400 transition-colors z-10"
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
        <Font variant="sub-tiny" color="red" weight="black" uppercase tracking="widest" className="pl-1">
          {error}
        </Font>
      )}
    </Box>
  )
}
