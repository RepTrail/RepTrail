'use client'

import React from 'react'
import { useQuery } from '@/lib/dal'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerProfile } from '@/lib/dal/remote'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

// Tools
import { UnifiedCreationDialog } from '@/components/store/advanced/unified-creation-dialog'
import { CopyInviteButton } from '@/components/store/intermediary/copy-invite-button'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Plus } from 'lucide-react'
import { Font } from '../base/font'

interface TrainerStudentsActionsSectionProps {
    userId: string
}

export function TrainerStudentsActionsSection({ userId }: TrainerStudentsActionsSectionProps) {
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.trainer.profile(userId),
        queryFn: () => getTrainerProfile(userId),
    })

    return (
        <Stack
            direction={{ base: 'col', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            justify="end"
            gap={STORE_TOKENS.SPACING.ELEMENT}
            fullWidth
        >
            <Box fullWidth={{ base: true, md: false }}>
                <CopyInviteButton trainerCode={profile?.trainer_code || ''} />
            </Box>
            <Box fullWidth={{ base: true, md: false }}>
                <UnifiedCreationDialog
                    title="Vincular Novo Aluno"
                    description="Insira o email que o aluno usará para criar a conta e sincronizar os dados. O email pode ser provisório e alterado depois."
                    trigger={
                        <Button variant="outline-emerald" shine fullWidth={{ base: true, sm: false }}>
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={Plus} size="xs" />
                                Vincular Aluno
                            </Stack>
                        </Button>
                    }
                    fields={[
                        { name: 'name', label: 'Nome do Aluno', placeholder: 'ex: João Silva', type: 'text', required: true },
                        { name: 'email', label: 'Email da Conta', placeholder: 'ex: aluno@email.com', type: 'text', required: true },
                        { name: 'whatsapp', label: 'WhatsApp', placeholder: '(11) 99999-9999', type: 'text', required: false },
                        { name: 'monthlyFee', label: 'Valor da Mensalidade (R$)', placeholder: '0.00', type: 'number', required: false }
                    ]}
                    actionType="create-student"
                    successMessage="Aluno vinculado com sucesso!"
                    footerLabel="Finalizar Vínculo"
                />
            </Box>
        </Stack>
    )
}
