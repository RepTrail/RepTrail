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
    <ModalOverlay onClose={onClose}>
      <ModalContainer>
        <Surface variant="base" padding={0} rounded="system" direction="col" fullHeight>
          <Stack gap={0} flex1>
            {/* Header */}
            <CardHeader bg="zinc" bgOpacity={100} display="flex" direction="row" align="center" justify="between">
              <Stack direction="row" align="center" gap={2.5}>
                {icon && <IconBox icon={icon} variant={variant as any} />}
                <Stack gap={0}>
                  <Font variant="body" weight="black" color="white" uppercase italic tracking="widest">{title}</Font>
                  {subtitle && <Font variant="sub-tiny" color="zinc-500">{subtitle}</Font>}
                </Stack>
              </Stack>

              <Button variant="close" rounded="full" isIconOnly onClick={onClose}>
                <Icon icon={X} size="sm" />
              </Button>
            </CardHeader>

            <Divider color="white/5" />

            {/* Content */}
            <CardContent 
              padding={5} 
              bg="zinc" 
              bgOpacity={100} 
              overflow="auto" 
              height="auto" 
              style={{ minHeight: '100px' }} 
              flex1
            >
              {children ? children : (
                <Font variant="description" color="zinc-400">
                  Configure as opções do seu perfil e preferências de sistema aqui.
                  Todas as alterações são aplicadas instantaneamente ao seu ambiente de trabalho.
                </Font>
              )}
            </CardContent>

            <Divider color="white/5" />

            {/* Footer Actions */}
            <CardContent padding={5} bg="zinc" bgOpacity={50}>
              <Stack direction="row" gap={2.5} flex1>
                <Button 
                  variant="outline-red" 
                  rounded="full" 
                  fullWidth 
                  flex1
                  onClick={onClose}
                >
                  {cancelLabel}
                </Button>
                <Button 
                  variant="outline-emerald" 
                  rounded="full" 
                  fullWidth 
                  flex1
                  onClick={onConfirm || onClose}
                >
                  {confirmLabel}
                </Button>
              </Stack>
            </CardContent>
          </Stack>
        </Surface>
      </ModalContainer>
    </ModalOverlay>
  )
}
