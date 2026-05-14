'use client'

import React from 'react'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { ErgogenicsList } from '@/components/store/intermediary/ergogenics-list'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { FlaskConical } from 'lucide-react'

export function StudentBioactivesManagement() {
    return (
        <RegistrySection
            title="ERGOGÊNICOS"
            subtitle="Gestão diária."
            icon={FlaskConical}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <ErgogenicsList
                    items={[
                        { name: 'DURATESTON', dosage: 'PADRÃO' },
                        { name: 'IOIMBINA', dosage: 'PADRÃO' },
                        { name: 'NAC', dosage: 'PADRÃO' },
                        { name: 'CAFEINA', dosage: 'PADRÃO' }
                    ]}
                    status="active"
                />
                <ErgogenicsList
                    items={[]}
                    status="empty"
                />
            </Stack>
        </RegistrySection>
    )
}
