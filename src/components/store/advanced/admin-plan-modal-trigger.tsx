'use client'

import React, { useState } from 'react'
import { Button } from '@/components/store/base/button'
import { Modal } from '@/components/store/advanced/modal'
import { PlanForm } from '@/components/store/advanced/plan-form'
import { Plus } from 'lucide-react'

export function AdminPlanModalTrigger() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button variant="outline-emerald" gap="element" onClick={() => setIsOpen(true)}>
                <Plus size={16} />
                Novo Plano
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                icon={Plus}
                variant="emerald"
                title="Novo Plano"
                subtitle="Preencha os dados do novo plano."
                confirmType="submit"
                formId="plan-form"
                confirmLabel="Salvar Plano"
            >
                <PlanForm onSuccess={() => setIsOpen(false)} />
            </Modal>
        </>
    )
}
