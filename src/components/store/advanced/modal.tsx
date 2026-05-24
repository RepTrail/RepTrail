'use client'

import React, { useState, useEffect } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon, IconBox } from '@/components/store/base/icon'
import { Button, ButtonVariant } from '@/components/store/base/button'
import { X, LucideIcon } from 'lucide-react'
import { Surface, CardHeader } from '@/components/store/base/surface'
import { ModalOverlay, ModalContainer, Divider, Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: LucideIcon
  children?: React.ReactNode
  confirmLabel?: string
  confirmIcon?: LucideIcon
  cancelLabel?: string
  onConfirm?: () => void
  variant?: 'emerald' | 'orange' | 'red' | 'blue' | 'primary'
  confirmVariant?: ButtonVariant
  isLoading?: boolean
  disabled?: boolean
  noPadding?: boolean
  hideCancel?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  confirmLabel = 'Confirmar',
  confirmIcon,
  cancelLabel = 'Cancelar',
  onConfirm,
  variant = 'emerald',
  confirmVariant,
  isLoading = false,
  disabled = false,
  noPadding = false,
  hideCancel = false
}: ModalProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [animateState, setAnimateState] = useState<'closed' | 'open'>('closed')

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const timer = setTimeout(() => {
        setAnimateState('open')
      }, 10)
      return () => clearTimeout(timer)
    } else {
      if (shouldRender) {
        setAnimateState('closed')
        const timer = setTimeout(() => {
          setShouldRender(false)
        }, 200)
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen, shouldRender])

  // Lock page scrolling when modal is active/rendered to avoid backscroll
  useEffect(() => {
    if (shouldRender) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <ModalOverlay onClose={onClose} animateState={animateState}>
      <ModalContainer animateState={animateState}>
        <Surface variant="base" padding="none" rounded={STORE_TOKENS.RADIUS.SYSTEM} direction="col" flex1 minHeight={0} overflow="hidden">
          <Box flex1 direction="col" minHeight={0} overflow="hidden">
            {/* Header */}
            <CardHeader 
              bg={STORE_TOKENS.COLORS.BACKGROUND} 
              bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND} 
              shrink={0} 
            >
              <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" justify="between" fullWidth>
                <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center" flex1>
                  {icon && <IconBox icon={icon} variant={variant as any} />}
                  <Stack gap="none" flex1 justify="center">
                    <Font variant="body" weight="black" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic tracking="normal">{title}</Font>
                    {subtitle && <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{subtitle}</Font>}
                  </Stack>
                </Inline>

                <Box display={{ base: 'none', md: 'block' }}>
                  <Button variant="close" rounded={STORE_TOKENS.RADIUS.SYSTEM} isIconOnly onClick={onClose} disabled={isLoading}>
                    <Icon icon={X} size="sm" />
                  </Button>
                </Box>
              </Inline>
            </CardHeader>

            <Divider color={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} />

            {/* Content Area */}
            <Box 
              flex1 
              overflowY="auto" 
              bg={STORE_TOKENS.COLORS.BACKGROUND} 
              bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND} 
              padding={noPadding ? 'none' : STORE_TOKENS.PADDING.CONTAINER} 
              minHeight={0}
            >
              {children ? children : (
                <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                  Configure as opções do seu perfil e preferências de sistema aqui.
                  Todas as alterações são aplicadas instantaneamente ao seu ambiente de trabalho.
                </Font>
              )}
            </Box>

            <Divider color={STORE_TOKENS.COLORS.DIVIDER.SUBTLE} />

            {/* Footer Actions */}
            <Box shrink={0} bg={STORE_TOKENS.COLORS.SURFACE} bgOpacity={STORE_TOKENS.OPACITY.SURFACE} padding={STORE_TOKENS.PADDING.CONTAINER}>
              <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
                {!hideCancel && (
                  <Button 
                    variant="outline-red" 
                    rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                    fullWidth 
                    flex1
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </Button>
                )}
                <Button 
                  variant={confirmVariant || 'outline-emerald'} 
                  rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                  fullWidth 
                  flex1
                  onClick={onConfirm || onClose}
                  disabled={disabled || isLoading}
                  gap={STORE_TOKENS.SPACING.ELEMENT}
                >
                  {isLoading ? 'Carregando...' : (
                    <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                      {confirmIcon && <Icon icon={confirmIcon} size="xs" />}
                      {confirmLabel}
                    </Stack>
                  )}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Surface>
      </ModalContainer>
    </ModalOverlay>
  );
}
