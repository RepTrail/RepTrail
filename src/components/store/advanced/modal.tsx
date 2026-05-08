import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { X, LucideIcon } from 'lucide-react'
import { Surface } from '../base/surface'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: LucideIcon
  children?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  variant?: 'emerald' | 'orange' | 'red' | 'blue'
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  variant = 'emerald'
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <Surface 
        variant="base" 
        className="relative w-11/12 md:w-[600px] max-h-[90vh] overflow-hidden flex flex-col"
      >
        <Stack gap={0}>
          {/* Header */}
          <div className="p-5 bg-zinc-950 border-b border-white/5">
            <Stack direction="row" align="center" justify="between">
              <Stack direction="row" align="center" gap={2.5}>
                {icon && (
                  <div className={cn(
                    "p-5 rounded-[5px] flex items-center justify-center border",
                    variant === 'emerald' && "bg-emerald-500/10 border-emerald-500/20",
                    variant === 'orange' && "bg-orange-500/10 border-orange-500/20",
                    variant === 'red' && "bg-red-500/10 border-red-500/20",
                    variant === 'blue' && "bg-blue-500/10 border-blue-500/20"
                  )}>
                    <Icon icon={icon} color={variant as any} size="sm" />
                  </div>
                )}
                <Stack gap={0}>
                  <Font variant="body" weight="black" color="white" uppercase italic tracking="widest">{title}</Font>
                  {subtitle && <Font variant="sub-tiny" color="zinc-500">{subtitle}</Font>}
                </Stack>
              </Stack>

              <Button variant="zinc" rounded="full" isIconOnly onClick={onClose}>
                <Icon icon={X} size="sm" />
              </Button>
            </Stack>
          </div>

          {/* Content */}
          <div className="p-5 bg-zinc-950 overflow-y-auto">
            {children ? children : (
              <Font variant="description" color="zinc-400">
                Configure as opções do seu perfil e preferências de sistema aqui.
                Todas as alterações são aplicadas instantaneamente ao seu ambiente de trabalho.
              </Font>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 bg-zinc-900/50 border-t border-white/5">
            <Stack direction="col" mdDirection="row" gap={2.5} justify="end">
              <Button 
                variant="outline-red" 
                rounded="full" 
                fullWidth 
                mdFullWidth={false}
                className="md:px-8"
                onClick={onClose}
              >
                {cancelLabel}
              </Button>
              <Button 
                variant="outline-emerald" 
                rounded="full" 
                fullWidth 
                mdFullWidth={false}
                className="md:px-8"
                onClick={onConfirm || onClose}
              >
                {confirmLabel}
              </Button>
            </Stack>
          </div>
        </Stack>
      </Surface>
    </div>
  )
}
