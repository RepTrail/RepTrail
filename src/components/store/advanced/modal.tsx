'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon, IconBox } from '../base/icon'
import { Button } from '../base/button'
import { X, LucideIcon } from 'lucide-react'
import { Surface, CardHeader, CardContent } from '../base/surface'
import { ModalOverlay, ModalContainer, Divider } from '../base/layout'
import { Box } from '../base/box'

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
  isLoading?: boolean
  disabled?: boolean
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
  variant = 'emerald',
  isLoading = false,
  disabled = false
}: ModalProps) {
  if (!isOpen) return null

  return (
    <ModalOverlay onClose={onClose}>
      <ModalContainer>
        <Surface variant="base" padding={0} rounded="system" direction="col" flex1 className="min-h-0 overflow-hidden">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Header */}
            <CardHeader bg="zinc" bgOpacity={100} className="shrink-0 gap-5">
              <Stack direction="row" align="center" gap={2.5} flex1>
                {icon && <IconBox icon={icon} variant={variant as any} />}
                <Stack gap={0}>
                  <Font variant="body" weight="black" color="white" uppercase italic tracking="normal">{title}</Font>
                  {subtitle && <Font variant="sub-tiny" color="zinc-500">{subtitle}</Font>}
                </Stack>
              </Stack>

              <div className="ml-auto">
                <Button variant="close" rounded="full" isIconOnly onClick={onClose} disabled={isLoading}>
                  <Icon icon={X} size="sm" />
                </Button>
              </div>
            </CardHeader>

            <Divider color="white/5" />

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-zinc-950 p-5 min-h-0">
              {children ? children : (
                <Font variant="description" color="zinc-400">
                  Configure as opções do seu perfil e preferências de sistema aqui.
                  Todas as alterações são aplicadas instantaneamente ao seu ambiente de trabalho.
                </Font>
              )}
            </div>

            <Divider color="white/5" />

            {/* Footer Actions */}
            <div className="shrink-0 bg-zinc-900 p-5">
              <Stack direction={{ base: 'col', md: 'row' }} gap={2.5} flex1>
                <Button 
                  variant="outline-red" 
                  rounded="full" 
                  fullWidth 
                  flex1
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelLabel}
                </Button>
                <Button 
                  variant={variant === 'emerald' ? 'outline-emerald' : 'outline-blue'} 
                  rounded="full" 
                  fullWidth 
                  flex1
                  onClick={onConfirm || onClose}
                  disabled={disabled || isLoading}
                >
                  {isLoading ? 'Carregando...' : confirmLabel}
                </Button>
              </Stack>
            </div>
          </div>
        </Surface>
      </ModalContainer>
    </ModalOverlay>
  )
}
