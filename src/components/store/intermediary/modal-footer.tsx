'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Icon } from '@/components/store/base/icon'
import { Button, ButtonVariant } from '@/components/store/base/button'
import { Box } from '@/components/store/base/box'
import { LucideIcon } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface ModalFooterProps {
    confirmLabel?: string
    confirmIcon?: LucideIcon
    confirmVariant?: ButtonVariant
    cancelLabel?: string
    hideCancel?: boolean
    isLoading?: boolean
    disabled?: boolean
    onConfirm?: () => void
    onClose: () => void
}

/**
 * ModalFooter: Intermediary molecule for modal action groups.
 * Standardizes the action bar for all advanced modals.
 */
export function ModalFooter({
    confirmLabel = 'Confirmar',
    confirmIcon,
    confirmVariant = 'outline-emerald',
    cancelLabel = 'Cancelar',
    hideCancel = false,
    isLoading = false,
    disabled = false,
    onConfirm,
    onClose
}: ModalFooterProps) {
    return (
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
                        text={cancelLabel} />
                )}
                <Button
                    variant={confirmVariant}
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    fullWidth
                    flex1
                    onClick={onConfirm || onClose}
                    disabled={disabled || isLoading}
                    text={isLoading ? 'Carregando...' : (
                        <Stack direction="row" align="center" justify="center">
                            {confirmIcon && <Icon icon={confirmIcon} size="xs" />}
                            {confirmLabel}
                        </Stack>
                    )} />
            </Stack>
        </Box>
    );
}
