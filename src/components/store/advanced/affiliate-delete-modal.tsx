'use client'

import React from 'react'
import { Modal } from './modal'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { Icon } from '../base/icon'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface AffiliateDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    affiliate?: any
}

export function AffiliateDeleteModal({ isOpen, onClose, affiliate }: AffiliateDeleteModalProps) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Confirmar Exclusão"
            icon={AlertTriangle}
        >
            <Stack gap={5}>
                <Font variant="description">
                    Você está prestes a remover o afiliado <Font weight="bold" color="white">{affiliate?.name}</Font>. Esta ação é irreversível e o parceiro perderá acesso ao painel imediatamente.
                </Font>

                <Box bg="red/10" border="red" padding={5} rounded="system">
                    <Font variant="sub-tiny" color="red" weight="bold" uppercase>
                        Atenção: Todas as comissões pendentes serão congeladas.
                    </Font>
                </Box>

                <Box borderTop="white/5" paddingTop={5}>
                    <Stack direction="row" gap={2.5}>
                        <Button variant="outline-red" fullWidth onClick={onClose}>
                            <Icon icon={Trash2} size="xs" />
                            <span>EXCLUIR AFILIADO</span>
                        </Button>
                        <Button variant="outline" onClick={onClose}>CANCELAR</Button>
                    </Stack>
                </Box>
            </Stack>
        </Modal>
    )
}
