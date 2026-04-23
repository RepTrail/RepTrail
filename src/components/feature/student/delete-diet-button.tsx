'use client'

import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'
import { QUERY_KEYS } from '@/lib/query-keys'

interface DeleteDietButtonProps {
    dietId: string
}

export function DeleteDietButton({ dietId }: DeleteDietButtonProps) {
    return (
        <UnifiedDeleteButton
            id={dietId}
            actionType="diet"
            itemName="dieta"
            queryKey={['diets']}
        />
    )
}
