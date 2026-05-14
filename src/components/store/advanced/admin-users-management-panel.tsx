'use client'

import React, { useState } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Box } from '@/components/store/base/box'
import { UserListItem } from '@/components/store/intermediary/user-list-item'
import { AffiliateListItem } from '@/components/store/intermediary/affiliate-list-item'
import { EmptyState } from '@/components/store/intermediary/empty-state'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Modal } from '@/components/store/advanced/modal'
import { Callout } from '@/components/store/intermediary/callout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { 
    UserCheck, 
    HeartHandshake, 
    GraduationCap, 
    Search, 
    Trash2, 
    Edit3,
    History
} from 'lucide-react'

export function AdminUsersManagementPanel() {
    const [modalState, setModalState] = useState<{
        type: 'edit' | 'delete' | 'inspect' | null,
        target: string | null,
        category: 'user' | 'product' | null
    }>({ type: null, target: null, category: null })

    const [userServices, setUserServices] = useState<Record<string, boolean>>({
        'Marcos Vinicius': true,
        'Juliana Silva': false,
        'Carlos Eduardo': true,
        'Beatriz Santos': false
    })

    const toggleService = (name: string) => {
        setUserServices(prev => ({ ...prev, [name]: !prev[name] }))
    }

    const openModal = (type: 'edit' | 'delete' | 'inspect', target: string, category: 'user' | 'product') => {
        setModalState({ type, target, category })
    }

    const closeModal = () => {
        setModalState({ type: null, target: null, category: null })
    }

    return (
        <Stack gap={{ base: STORE_TOKENS.SPACING.EMPTY_STATE, md: STORE_TOKENS.SPACING.SECTION }}>
            {/* Gestão de Personals */}
            <RegistrySection
                title="Gestão de Personals"
                icon={UserCheck}
                subtitle="Administração de profissionais parceiros e status de serviço On-Demand."
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <UserListItem 
                        name="Marcos Vinicius"
                        email="marcos@reptrail.com.br"
                        registrationDate="08/05/2024"
                        role="personal"
                        roleLabel="12 ALUNOS"
                        initials="MV"
                        avatarVariant="orange"
                        onDelete={() => openModal('delete', 'Marcos Vinicius', 'user')}
                        onInspect={() => openModal('inspect', 'Marcos Vinicius', 'user')}
                        onAction={() => toggleService('Marcos Vinicius')}
                        isActionActive={userServices['Marcos Vinicius']}
                    />
                    <UserListItem 
                        name="Juliana Silva"
                        email="juliana.silva@gmail.com"
                        registrationDate="12/11/2023"
                        role="personal"
                        roleLabel="5 ALUNOS"
                        initials="JS"
                        avatarVariant="amber"
                        onDelete={() => openModal('delete', 'Juliana Silva', 'user')}
                        onInspect={() => openModal('inspect', 'Juliana Silva', 'user')}
                        onAction={() => toggleService('Juliana Silva')}
                        isActionActive={userServices['Juliana Silva']}
                    />
                    
                    <EmptyState 
                        icon={Search}
                        title="Nenhum personal encontrado"
                        description="Tente ajustar os filtros de busca para encontrar o profissional desejado."
                    />
                </Stack>
            </RegistrySection>

            {/* Gestão de Afiliados */}
            <RegistrySection
                title="Gestão de Afiliados"
                icon={HeartHandshake}
                subtitle="Administração de parceiros comerciais, comissões e indicações."
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <AffiliateListItem 
                        name="Thiago Nigro"
                        email="thiago.nigro@primocast.com.br"
                        affiliateId="PRIMO20"
                        registrationDate="10/01/2024"
                        referrals={{ total: 1500, active: 850 }}
                        revenue="R$ 45.000,00"
                        commission="R$ 4.500,00"
                        rate={10}
                        onDelete={() => openModal('delete', 'Thiago Nigro', 'user')}
                    />
                    <AffiliateListItem 
                        name="Joel Jota"
                        email="joel@jota.com.br"
                        affiliateId="JJ2024"
                        registrationDate="15/02/2024"
                        referrals={{ total: 800, active: 420 }}
                        revenue="R$ 28.000,00"
                        commission="R$ 2.800,00"
                        rate={10}
                        onDelete={() => openModal('delete', 'Joel Jota', 'user')}
                    />

                    <EmptyState 
                        icon={HeartHandshake}
                        title="Nenhum afiliado encontrado"
                        description="Não há registros de parceiros comerciais para os filtros selecionados (Demonstração)."
                    />
                </Stack>
            </RegistrySection>

            {/* Gestão de Alunos */}
            <RegistrySection
                title="Gestão de Alunos"
                icon={GraduationCap}
                subtitle="Monitoramento de base de alunos e ativação de planos automatizados."
            >
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <UserListItem 
                        name="Carlos Eduardo"
                        email="cadu.fit@outlook.com"
                        registrationDate="15/02/2024"
                        role="aluno"
                        roleLabel="ALUNO PREMIUM"
                        initials="CE"
                        avatarVariant="emerald"
                        onDelete={() => openModal('delete', 'Carlos Eduardo', 'user')}
                        onInspect={() => openModal('inspect', 'Carlos Eduardo', 'user')}
                        onAction={() => toggleService('Carlos Eduardo')}
                        isActionActive={userServices['Carlos Eduardo']}
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
                        onInspect={() => openModal('inspect', 'Beatriz Santos', 'user')}
                        onAction={() => toggleService('Beatriz Santos')}
                        isActionActive={userServices['Beatriz Santos']}
                    />

                    <EmptyState 
                        icon={Search}
                        title="Nenhum aluno encontrado"
                        description="Não localizamos registros com os critérios informados. Verifique a digitação ou remova os filtros."
                    />
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
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Callout variant="danger" title="Aviso">
                        Esta ação é irreversível e removerá todos os vínculos históricos associados a este registro no banco de dados do RepTrail. Os dados de auditoria (Logs) permanecerão salvos para fins legais.
                    </Callout>
                </Stack>
            </Modal>

            <Modal
                isOpen={modalState.type === 'inspect'}
                onClose={closeModal}
                title={`Inspecionar ${modalState.category === 'user' ? 'Painel' : 'Produto'}`}
                subtitle={`Acessando interface do usuário: ${modalState.target}`}
                icon={Search}
                variant="blue"
                confirmLabel="Acessar Painel"
                cancelLabel="Cancelar"
            >
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        A ação de inspeção permite que você acesse temporariamente o painel deste usuário. Você poderá visualizar a interface exatamente como ele a vê para fins de suporte, auditoria ou configuração.
                    </Font>
                    
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase italic>Status do Registro</Font>
                            <Font color={STORE_TOKENS.COLORS.SUCCESS} weight="bold">VERIFICADO & ATIVO</Font>
                        </Box>
                    </Stack>
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
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.SECONDARY}>
                        Interface de edição rápida. Os campos abaixo permitem atualizar as propriedades fundamentais do registro sem sair do dashboard.
                    </Font>
                    
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Box fullWidth bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Campo de Exemplo 01...</Font>
                        </Box>
                        <Box fullWidth bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} border borderColor={STORE_TOKENS.COLORS.DIVIDER.STANDARD} rounded={STORE_TOKENS.RADIUS.SYSTEM} display="flex" align="center" padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>Campo de Exemplo 02...</Font>
                        </Box>
                    </Stack>
                </Stack>
            </Modal>
        </Stack>
    )
}
