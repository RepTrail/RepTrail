'use client'

import { UnifiedDeleteButton } from '@/components/feature/shared/unified-delete-button'
import { QUERY_KEYS } from '@/lib/query-keys'

export function DeleteErgogenicButton({ ergogenicId }: { ergogenicId: string }) {
    return (
        <UnifiedDeleteButton
            id={ergogenicId}
            actionType="ergogenic"
            itemName="ergogênico"
            queryKey={['ergogenics']}
        />
    )
}
