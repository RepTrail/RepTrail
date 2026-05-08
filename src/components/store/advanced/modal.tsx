import React from 'react'
import { Box } from '../base/box'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Button } from '../base/button'
import { X, LucideIcon } from 'lucide-react'

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
    <Box
      position="fixed"
      inset="0"
      zIndex={1000}
      display="flex"
      align="center"
      justify="center"
      padding={5}
    >
      {/* Backdrop */}
      <Box
        position="absolute"
        inset="0"
        bg="black"
        bgOpacity={60}
        blur="sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <Box
        position="relative"
        bg="zinc-950"
        bgOpacity={100}
        border="white/10"
        rounded="system"
        width="11/12"
        mdWidth="1/2"
        overflow="hidden"
      >
        <Stack gap={0}>
          {/* Header */}
          <Box padding={5} bg="zinc-950">
            <Stack direction="row" align="center" justify="between">
              <Stack direction="row" align="center" gap={2.5}>
                {icon && (
                  <Box bg={variant} bgOpacity={10} padding={5} rounded="system" display="flex" align="center" justify="center">
                    <Icon icon={icon} color={variant} size="sm" />
                  </Box>
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
          </Box>

          {/* Separator */}
          <Box width="full" height="px" bg="white/5" />

          {/* Content */}
          <Box padding={5} bg="zinc-950">
            {children ? children : (
              <Font variant="description" color="zinc-400">
                Configure as opções do seu perfil e preferências de sistema aqui.
                Todas as alterações são aplicadas instantaneamente ao seu ambiente de trabalho.
              </Font>
            )}
          </Box>

          {/* Separator */}
          <Box width="full" height="px" bg="white/5" />

          {/* Footer Actions */}
          <Box padding={5} bg="zinc-900">
            <Stack direction="col" mdDirection="row" gap={2.5} justify="end">
              <Button variant="outline-red" rounded="full" fullWidth onClick={onClose}>
                {cancelLabel}
              </Button>
              <Button variant="outline-emerald" rounded="full" fullWidth onClick={onConfirm || onClose}>
                {confirmLabel}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
