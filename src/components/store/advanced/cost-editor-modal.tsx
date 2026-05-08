'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Input } from '../base/input'
import { Button } from '../base/button'
import { Box } from '../base/box'
import { Icon } from '../base/icon'
import { Activity, Save, DollarSign } from 'lucide-react'

interface CostEditorModalProps {
    isOpen: boolean
    onClose: () => void
    cost?: any
}

export function CostEditorModal({ isOpen, onClose, cost }: CostEditorModalProps) {
    const [desc, setDesc] = useState('')
    const [amount, setAmount] = useState('')

    useEffect(() => {
        if (cost) {
            setDesc(cost.desc)
            setAmount(cost.amount)
        } else {
            setDesc('')
            setAmount('')
        }
    }, [cost, isOpen])

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={cost ? 'Editar Custo' : 'Registrar Novo Custo'}
            icon={Activity}
        >
            <Stack gap={5}>
                <Stack gap={2.5}>
                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>Descrição do Gasto</Font>
                    <Input 
                        value={desc} 
                        onChange={(e) => setDesc(e.target.value)} 
                        placeholder="Ex: Servidores AWS" 
                    />
                </Stack>

                <Stack gap={2.5}>
                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>Valor (R$)</Font>
                    <Input 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)} 
                        placeholder="0.00" 
                        icon={<Icon icon={DollarSign} size="xs" color="zinc-600" />}
                    />
                </Stack>

                <Box borderTop="white/5" paddingTop={5}>
                    <Stack direction="row" gap={2.5}>
                        <Button variant="white" fullWidth onClick={onClose}>
                            <Icon icon={Save} size="xs" />
                            <span>CONFIRMAR REGISTRO</span>
                        </Button>
                        <Button variant="outline" onClick={onClose}>CANCELAR</Button>
                    </Stack>
                </Box>
            </Stack>
        </Modal>
    )
}
