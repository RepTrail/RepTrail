'use client'

import React, { useState } from 'react'
import { Grid } from '../base/grid'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { StatsCard } from '../intermediary/stats-card'
import { UserListItem } from '../intermediary/user-list-item'
import { LogItem } from '../intermediary/log-item'
import { ProductCard } from '../intermediary/product-card'
import { EmptyState } from '../intermediary/empty-state'
import { RegistrySection } from '../advanced/registry-section'
import { Modal } from '../advanced/modal'
import { 
    TrendingUp, 
    Users, 
    Wallet, 
    CreditCard, 
    UserCheck, 
    GraduationCap, 
    BarChart3, 
    AlertCircle, 
    HeartHandshake,
    ShoppingBag,
    Search,
    History,
    Package,
    Trash2,
    Edit3
} from 'lucide-react'

export function AdminSectionContent({ id }: { id?: string }) {
    const [modalState, setModalState] = useState<{
        type: 'edit' | 'delete' | null,
        target: string | null,
        category: 'user' | 'product' | null
    }>({ type: null, target: null, category: null })

    const openModal = (type: 'edit' | 'delete', target: string, category: 'user' | 'product') => {
        setModalState({ type, target, category })
    }

    const closeModal = () => {
        setModalState({ type: null, target: null, category: null })
    }

    return (
        <Stack gap={12.5}>
            {/* Dashboard Overview */}
            <RegistrySection 
                id={id}
                title="Dashboard Admin" 
                icon={TrendingUp} 
                subtitle="Componentes analíticos e de gestão financeira para a interface administrativa."
            >
                <Grid cols={1} mdCols={2} lgCols={4} gap={5}>
                    <StatsCard 
                        label="Lucro Líquido (Plataforma)"
                        value="R$ 21,80"
                        description="BRUTO: R$ 21,80 | CUSTOS: R$ 0,00"
                        icon={TrendingUp}
                        color="emerald"
                    />
                    <StatsCard 
                        label="Faturamento Personais"
                        value="R$ 370,00"
                        description="MÉDIO: R$ 13,214 / PERSONAL"
                        icon={Wallet}
                        color="blue"
                    />
                    <StatsCard 
                        label="Ticket Médio (RepTrail)"
                        value="R$ 0,779"
                        description="POR PERSONAL CADASTRADO"
                        icon={BarChart3}
                        color="amber"
                    />
                    <StatsCard 
                        label="Comissões Pendentes"
                        value="R$ 0,00"
                        description="ESTE MÊS: R$ 0,00"
                        icon={AlertCircle}
                        color="red"
                    />
                    <StatsCard 
                        label="Afiliados"
                        value="5"
                        description="LUCRO TOTAL: R$ 0,00"
                        icon={HeartHandshake}
                        color="orange"
                    />
                    <StatsCard 
                        label="Personais"
                        value="28"
                        description="0 EM PERÍODO DE TESTE"
                        icon={UserCheck}
                        color="blue"
                    />
                    <StatsCard 
                        label="Alunos"
                        value="20"
                        description="9 COM PERSONAL | 2 AUTO-TREINO | 9 AVULSOS"
                        icon={GraduationCap}
                        color="emerald"
                    />
                    <StatsCard 
                        label="Produtos Loja"
                        value="17"
                        description="18 CLIQUES TOTAIS"
                        icon={ShoppingBag}
                        color="orange"
                    />
                </Grid>
            </RegistrySection>

            {/* Gestão de Personals */}
            <RegistrySection
                title="Gestão de Personals"
                icon={UserCheck}
                subtitle="Administração de profissionais parceiros e status de serviço On-Demand."
            >
                <Stack gap={2.5}>
                    <UserListItem 
                        name="Marcos Vinicius"
                        email="marcos@reptrail.com.br"
                        registrationDate="08/05/2024"
                        role="personal"
                        roleLabel="PERSONAL TRAINER"
                        initials="MV"
                        avatarVariant="orange"
                        onDelete={() => openModal('delete', 'Marcos Vinicius', 'user')}
                        onInspect={() => openModal('edit', 'Marcos Vinicius', 'user')}
                        onAction={() => openModal('edit', 'Marcos Vinicius', 'user')}
                    />
                    <UserListItem 
                        name="Juliana Silva"
                        email="juliana.silva@gmail.com"
                        registrationDate="12/11/2023"
                        role="personal"
                        roleLabel="PERSONAL TRAINER"
                        initials="JS"
                        avatarVariant="amber"
                        onDelete={() => openModal('delete', 'Juliana Silva', 'user')}
                        onInspect={() => openModal('edit', 'Juliana Silva', 'user')}
                        onAction={() => openModal('edit', 'Juliana Silva', 'user')}
                    />
                    
                    <Box className="pt-5">
                        <EmptyState 
                            icon={Search}
                            title="Nenhum personal encontrado"
                            description="Tente ajustar os filtros de busca para encontrar o profissional desejado."
                        />
                    </Box>
                </Stack>
            </RegistrySection>

            {/* Gestão de Alunos */}
            <RegistrySection
                title="Gestão de Alunos"
                icon={GraduationCap}
                subtitle="Monitoramento de base de alunos e ativação de planos automatizados."
            >
                <Stack gap={2.5}>
                    <UserListItem 
                        name="Carlos Eduardo"
                        email="cadu.fit@outlook.com"
                        registrationDate="15/02/2024"
                        role="aluno"
                        roleLabel="ALUNO PREMIUM"
                        initials="CE"
                        avatarVariant="emerald"
                        onDelete={() => openModal('delete', 'Carlos Eduardo', 'user')}
                        onInspect={() => openModal('edit', 'Carlos Eduardo', 'user')}
                        onAction={() => openModal('edit', 'Carlos Eduardo', 'user')}
                    />
                    <UserListItem 
                        name="Beatriz Santos"
                        email="bia.santos22@uol.com.br"
                        registrationDate="02/05/2024"
                        role="aluno"
                        roleLabel="ALUNO FREE"
                        initials="BS"
                        avatarVariant="zinc"
                        onDelete={() => openModal('delete', 'Beatriz Santos', 'user')}
                        onInspect={() => openModal('edit', 'Beatriz Santos', 'user')}
                        onAction={() => openModal('edit', 'Beatriz Santos', 'user')}
                    />

                    <Box className="pt-5">
                        <EmptyState 
                            icon={Search}
                            title="Nenhum aluno encontrado"
                            description="Não localizamos registros com os critérios informados. Verifique a digitação ou remova os filtros."
                        />
                    </Box>
                </Stack>
            </RegistrySection>

            {/* Catálogo de Produtos */}
            <RegistrySection
                title="Catálogo de Produtos"
                icon={Package}
                subtitle="Gestão de itens da loja oficial, suplementação e equipamentos."
            >
                <Stack gap={5}>
                    <Grid cols={1} mdCols={2} lgCols={4} gap={5}>
                        <ProductCard 
                            name="Whey Protein Isolado"
                            price="R$ 189,90"
                            category="SUPLEMENTOS"
                            onDelete={() => openModal('delete', 'Whey Protein Isolado', 'product')}
                            onEdit={() => openModal('edit', 'Whey Protein Isolado', 'product')}
                        />
                        <ProductCard 
                            name="Creatina Monohidratada"
                            price="R$ 95,00"
                            category="SUPLEMENTOS"
                            onDelete={() => openModal('delete', 'Creatina Monohidratada', 'product')}
                            onEdit={() => openModal('edit', 'Creatina Monohidratada', 'product')}
                        />
                        <ProductCard 
                            name="Cinto de Agachamento"
                            price="R$ 120,00"
                            category="EQUIPAMENTOS"
                            onDelete={() => openModal('delete', 'Cinto de Agachamento', 'product')}
                            onEdit={() => openModal('edit', 'Cinto de Agachamento', 'product')}
                        />
                        <ProductCard 
                            name="Camiseta RepTrail Oversized"
                            price="R$ 89,00"
                            category="VESTUÁRIO"
                            onDelete={() => openModal('delete', 'Camiseta RepTrail Oversized', 'product')}
                            onEdit={() => openModal('edit', 'Camiseta RepTrail Oversized', 'product')}
                        />
                    </Grid>

                    <EmptyState 
                        icon={Package}
                        title="Fim do Catálogo"
                        description="Você visualizou todos os produtos ativos na loja no momento."
                    />
                </Stack>
            </RegistrySection>

            {/* Logs de Atividade */}
            <RegistrySection
                title="Logs de Atividade"
                icon={History}
                subtitle="Rastro de auditoria de todas as ações realizadas no painel administrativo."
            >
                <Stack gap={2.5}>
                    <LogItem 
                        action="UPDATE_USER_ROLE"
                        admin="Marcos Vinicius"
                        target="ALUNO_CARLOS"
                        details={{ from: 'FREE', to: 'PREMIUM', method: 'MANUAL_ADMIN' }}
                        date="há 5 minutos"
                        variant="blue"
                    />
                    <LogItem 
                        action="ACTIVATE_ONDEMAND"
                        admin="Juliana Silva"
                        target="PERSONAL_JULIANA"
                        details={{ service: 'ON_DEMAND_V2', status: 'ACTIVE' }}
                        date="há 12 minutos"
                        variant="orange"
                    />
                    <LogItem 
                        action="DELETE_PRODUCT"
                        admin="Sistema"
                        target="PROD_TEST_01"
                        details="Remoção automática de produto sem estoque há 30 dias."
                        date="há 1 hora"
                        variant="red"
                    />

                    <Box className="pt-5">
                        <EmptyState 
                            icon={History}
                            title="Sem mais atividades"
                            description="Não há registros adicionais de auditoria para o período selecionado."
                        />
                    </Box>
                </Stack>
            </RegistrySection>

            {/* MODALS REUSE */}
            <Modal
                isOpen={modalState.type === 'delete'}
                onClose={closeModal}
                title={`Excluir ${modalState.category === 'user' ? 'Usuário' : 'Produto'}`}
                subtitle={`Você está prestes a remover permanentemente: ${modalState.target}`}
                icon={Trash2}
                variant="red"
                confirmLabel="Confirmar Exclusão"
                cancelLabel="Manter Registro"
            >
                <Stack gap={2.5}>
                    <Font variant="description" color="zinc-400">
                        Esta ação é irreversível e removerá todos os vínculos históricos associados a este registro no banco de dados do RepTrail.
                    </Font>
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
                        <Font variant="sub-tiny" color="red" weight="black" uppercase italic>
                            Aviso: Os dados de auditoria (Logs) permanecerão salvos para fins legais.
                        </Font>
                    </div>
                </Stack>
            </Modal>

            <Modal
                isOpen={modalState.type === 'edit'}
                onClose={closeModal}
                title={`Editar ${modalState.category === 'user' ? 'Perfil' : 'Produto'}`}
                subtitle={`Modificando informações de: ${modalState.target}`}
                icon={Edit3}
                variant="blue"
                confirmLabel="Salvar Alterações"
                cancelLabel="Descartar"
            >
                <Stack gap={5}>
                    <Font variant="description" color="zinc-400">
                        Interface de edição rápida. Os campos abaixo permitem atualizar as propriedades fundamentais do registro sem sair do dashboard.
                    </Font>
                    
                    {/* Placeholder for actual form components */}
                    <div className="space-y-4">
                        <div className="h-10 w-full bg-white/5 border border-white/10 rounded flex items-center px-4">
                            <Font variant="sub-tiny" color="zinc-500">Campo de Exemplo 01...</Font>
                        </div>
                        <div className="h-10 w-full bg-white/5 border border-white/10 rounded flex items-center px-4">
                            <Font variant="sub-tiny" color="zinc-500">Campo de Exemplo 02...</Font>
                        </div>
                    </div>
                </Stack>
            </Modal>
        </Stack>
    )
}
