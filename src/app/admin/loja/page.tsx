import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { AdminLojaSection } from '@/components/store/sections/admin-loja-section'
import { ShoppingBag } from 'lucide-react'

export default function AdminLojaPage() {
    return (
        <RegistryMain
            title="CATÁLOGO DA LOJA"
            subtitle="Gestão de itens da loja oficial, suplementação e equipamentos."
            icon={ShoppingBag}
            contextLabel="Painel Admin"
            showTabs={false}
        >
            <RegistrySection
                title="Inventário Disponível"
                subtitle="Gerencie os itens disponíveis na loja, preços e estoque."
                icon={ShoppingBag}
            >
                <AdminLojaSection />
            </RegistrySection>
        </RegistryMain>
    );
}
