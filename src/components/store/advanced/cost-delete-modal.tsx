'use client'

import React from 'react'
import { Modal } from './modal'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { Icon } from '../base/icon'
import { AlertTriangle, Trash2 } from 'lucide-react'

interface CostDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    cost?: any
}

export function CostDeleteModal({ isOpen, onClose, cost }: CostDeleteModalProps) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Excluir Registro de Custo"
            icon={AlertTriangle}
        >
            <Stack gap={5}>
                <Font variant="description">
                    Você tem certeza que deseja excluir o registro <Font weight="bold" color="white">{cost?.desc}</Font> no valor de <Font color="red" weight="bold">R$ {cost?.amount}</Font>?
                </Font>

                <Box bg="red/10" border="red" padding={5} rounded="system">
                    <Font variant="sub-tiny" color="red" weight="bold" uppercase>
                        Esta ação afetará o cálculo do lucro líquido no dashboard.
                    </Font>
                </Box>

                <Box borderTop="white/5" paddingTop={5}>
                    <Stack direction="row" gap={2.5}>
                        <Button variant="outline-red" fullWidth onClick={onClose}>
                            <Icon icon={Trash2} size="xs" />
                            <span>EXCLUIR REGISTRO</span>
                        </Button>
                        <Button variant="outline" onClick={onClose}>CANCELAR</Button>
                    </Stack>
                </Box>
            </Stack>
        </Modal>
    )
}
