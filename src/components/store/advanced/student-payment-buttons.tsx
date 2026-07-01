'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { Button } from '@/components/store/base/button'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { CreditCard } from 'lucide-react'
import { useToast } from "@/components/store/hooks/use-toast"
import { useOptimisticMutation } from '@/lib/dal'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'

export function StudentPaymentButtons() {
    const { toast } = useToast()

    const { mutate, isPending } = useOptimisticMutation({
        actionName: 'create-asaas-subscription',
        entity: ENTITIES.SUBSCRIPTION,
        entityId: 'new',
        queryKey: QUERY_KEYS.student.all('me'),
        mutationFn: async (variables: { tier: string, type: string }) => {
            const { createAsaasSubscription } = await import('@/lib/dal/remote')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return await createAsaasSubscription(variables.tier as any, variables.type as 'CREDIT_CARD' | 'PIX' | 'BOLETO')
        },
        onMutate: () => {
            toast({
                title: "Gerando pagamento...",
                description: `Aguarde um instante enquanto preparamos seu checkout...`
            })
        },
        onSuccess: (res) => {
            if (res.success && res.invoiceUrl) {
                window.location.href = res.invoiceUrl
            } else if (res.error) {
                toast({ variant: 'destructive', title: 'Erro no Asaas', description: res.error })
            }
        }
    })

    const handleAsaas = (type: 'PIX' | 'BOLETO' | 'CREDIT_CARD') => {
        mutate({ tier: 'auto_training', type })
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Button
                onClick={() => handleAsaas('CREDIT_CARD')}
                disabled={isPending}
                loading={isPending}
                variant="emerald"
                fullWidth
                text="Assinar com Cartão"
                iconLeft={CreditCard} />
            <Font
                variant="tiny"
                weight="bold"
                uppercase
                tracking="widest"
                align="center"
                {...{
                    color: "DIM",
                }}>
                Pagamento processado com segurança pelo Asaas
            </Font>
        </Stack>
    );
}


