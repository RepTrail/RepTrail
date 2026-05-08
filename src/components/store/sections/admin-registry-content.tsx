'use client'

import React, { useState } from 'react'
import { RegistrySection } from '../advanced/registry-section'
import { MetricCard } from '../intermediary/metric-card'
import { UserRow } from '../intermediary/user-row'
import { LogItem } from '../intermediary/log-item'
import { ProductEditorModal } from '../advanced/product-editor-modal'
import { CostEditorModal } from '../advanced/cost-editor-modal'
import { CostDeleteModal } from '../advanced/cost-delete-modal'
import { AffiliateDeleteModal } from '../advanced/affiliate-delete-modal'
import { Grid } from '../base/grid'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Button } from '../base/button'
import { BaseAvatar } from '../base/avatar'
import { Icon } from '../base/icon'
import { Input } from '../base/input'
import { Img } from '../base/img'
import {
    BarChart3, Users2, Users, HeartHandshake, ShoppingBag,
    Activity, Search, Eye, Trash2, Zap,
    TrendingUp, CreditCard,
    AlertCircle, Clock, ArrowRightLeft,
    Pencil, PlusCircle, Plus, DollarSign
} from 'lucide-react'
import { Badge } from '../base/badge'
import { SegmentedSwitch } from '../intermediary/segmented-switch'
import { AdminIdentityContent } from './admin-identity-content'

export function AdminRegistryContent() {
    const [subTab, setSubTab] = useState<string>('overview')
    const [affiliateTab, setAffiliateTab] = useState('list')
    const [isAffDeleteModalOpen, setIsAffDeleteModalOpen] = useState(false)
    const [selectedAff, setSelectedAff] = useState<any>(null)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [isCostModalOpen, setIsCostModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCost, setSelectedCost] = useState<any>(null)

    const tabs = [
        { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
        { id: 'trainers', label: 'Personais', icon: Users2 },
        { id: 'students', label: 'Alunos', icon: Users },
        { id: 'affiliates', label: 'Afiliados', icon: HeartHandshake },
        { id: 'store', label: 'Loja', icon: ShoppingBag },
        { id: 'logs', label: 'Logs', icon: Activity },
    ]

    return (
        <Stack gap="section">
            <SegmentedSwitch
                options={tabs}
                activeId={subTab}
                onSelect={setSubTab}
                defaultActiveVariant="outline-red"
            />

            {subTab === 'overview' && (
                <Stack gap="section">
                    <AdminIdentityContent />
                    <RegistrySection title="Métricas em Tempo Real" icon={BarChart3} subtitle="Visão consolidada da saúde financeira e crescimento da plataforma.">
                        <Grid cols={4} gap={5}>
                            <MetricCard label="Lucro Líquido" value="R$ 45.230,00" sub="Bruto: R$ 125k | Custos: R$ 80k" icon={DollarSign} variant="emerald" />
                            <MetricCard label="Faturamento Personais" value="R$ 850.430,00" sub="Médio: R$ 12k / trainer" icon={CreditCard} variant="emerald" />
                            <MetricCard label="Ticket Médio (RepTrail)" value="R$ 145,00" sub="Por personal cadastrado" icon={TrendingUp} variant="emerald" />
                            <MetricCard label="Comissões Pendentes" value="R$ 8.400,00" sub="Mês atual: R$ 5.200" icon={AlertCircle} variant="emerald" />

                            <MetricCard label="Afiliados" value="128" sub="Lucro Total: R$ 15.400" icon={HeartHandshake} variant="emerald" />
                            <MetricCard label="Personais" value="42" sub="5 em período de teste" icon={Users2} variant="emerald" />
                            <MetricCard label="Alunos" value="1.240" sub="980 com personal | 260 avulsos" icon={Users} variant="emerald" />
                            <MetricCard label="Produtos Loja" value="15" sub="4.200 cliques totais" icon={ShoppingBag} variant="emerald" />
                        </Grid>
                    </RegistrySection>

                    <RegistrySection title="Custos Operacionais" icon={Activity} subtitle="Gestão de infraestrutura, impostos e custos fixos.">
                        <Box bg="zinc-950/40" border="white/10" rounded="system" overflow="hidden">
                            <Box bg="zinc-900/40" border="white/5" padding={5}>
                                <Stack direction="col" mdDirection="row" align="start" mdAlign="center" justify="between" gap={5}>
                                    <Stack gap={0} width="full" mdWidth="1/2">
                                        <Font variant="body" weight="black">Fluxo de Caixa Operacional</Font>
                                        <Font variant="sub-tiny" color="zinc-600">Últimos 30 dias</Font>
                                    </Stack>
                                    <Stack direction="col" mdDirection="row" align="stretch" mdAlign="center" gap={2.5} width="full" mdWidth="1/2" justify="center" mdJustify="end">
                                        <Button variant="outline-emerald" size="sm" rounded="full" fullWidth mdFullWidth={false} onClick={() => { setSelectedCost(null); setIsCostModalOpen(true) }}>
                                            <Stack direction="row" align="center" gap={2.5} justify="center">
                                                <Icon icon={PlusCircle} size="xs" />
                                                <Font variant="auxiliary" color="emerald" weight="black" italic uppercase nowrap>REGISTRAR CUSTO</Font>
                                            </Stack>
                                        </Button>
                                        <Box bg="red" bgOpacity={10} border="red" paddingX={5} paddingY={2.5} rounded="full" display="flex" align="center" justify="center" width="full" mdWidth="auto">
                                            <Font variant="body-sm" color="red" weight="black" italic nowrap>- R$ 12.450,00</Font>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Box>
                            <Stack gap={0}>
                                {[
                                    { desc: 'AWS Infrastructure', type: 'Fixo', amount: '4.500', date: '05/05/2024' },
                                    { desc: 'Gemini AI API', type: 'Variável', amount: '1.250', date: '04/05/2024' },
                                    { desc: 'Marketing (Meta/Google)', type: 'Variável', amount: '6.700', date: '02/05/2024' }
                                ].map((cost, idx) => (
                                    <Box key={idx} padding={5} border={idx !== 0 ? 'white/5' : undefined} display="flex" align="center" justify="between" hoverBg="white/5" transition="all" overflow="hidden" gap={5} group>
                                        <Stack direction="row" align="center" gap={5} width="2/3" mdWidth="auto" overflow="hidden">
                                            <BaseAvatar initials="AWS" size="sm" variant="zinc" />
                                            <Stack gap={0} flex1 overflow="hidden">
                                                <Font variant="body-sm" weight="black" italic uppercase truncate>{cost.desc}</Font>
                                                <Font variant="sub-tiny" color="zinc-600">{cost.date} • {cost.type}</Font>
                                            </Stack>
                                        </Stack>

                                        <Box position="relative" display="flex" align="center" justify="end" width="1/3" mdWidth="auto">
                                            <Box transition="all" groupHoverTranslateX={-32}>
                                                <Font variant="auxiliary" weight="black" color="red" italic>- R$ {cost.amount}</Font>
                                            </Box>
                                            <Box position="absolute" right={0} opacity={0} visibility="invisible" groupHoverOpacity={100} groupHoverVisible groupHoverTranslateX={0} translateX="full" transition="all" pointerEvents="none" groupHoverPointerEvents="auto" display="flex" align="center" gap={5}>
                                                <Stack direction="row" gap={2.5}>
                                                    <Button variant="zinc" size="sm" isIconOnly rounded="full" onClick={() => { setSelectedCost(cost); setIsCostModalOpen(true) }}>
                                                        <Icon icon={Pencil} size="xs" />
                                                    </Button>
                                                    <Button variant="outline-red" size="sm" isIconOnly rounded="full" onClick={() => { setSelectedCost(cost); setIsDeleteModalOpen(true) }}>
                                                        <Icon icon={Trash2} size="xs" />
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </RegistrySection>

                    <Grid cols={2} gap={5}>
                        <RegistrySection title="Produtos Mais Clicados" icon={TrendingUp} subtitle="Análise de engajamento e produtos mais populares na loja.">
                            <Box bg="zinc-950/40" border="white/5" rounded="system" padding={5}>
                                <Stack gap={2.5}>
                                    {[
                                        { name: 'Whey Protein Pro', category: 'Suplementos', clicks: 1250 },
                                        { name: 'Creatina Monohidratada', category: 'Suplementos', clicks: 980 },
                                        { name: 'Faixa de Resistência', category: 'Equipamentos', clicks: 420 }
                                    ].map((p, i) => (
                                        <Box key={i} padding={5} bg="zinc-900/40" border="white/5" rounded="system" display="flex" align="center" justify="between">
                                            <Stack direction="row" align="center" gap={5}>
                                                <Font variant="sub-tiny" color="zinc-500" weight="black">{i + 1}</Font>
                                                <Stack gap={0}>
                                                    <Font variant="body-sm" weight="black" italic uppercase>{p.name}</Font>
                                                    <Font variant="sub-tiny" color="zinc-600" uppercase>{p.category}</Font>
                                                </Stack>
                                            </Stack>
                                            <Stack gap={0} align="end">
                                                <Font variant="body-sm" color="emerald" weight="black" italic>{p.clicks}</Font>
                                                <Font variant="sub-tiny" color="emerald" weight="black" italic uppercase>cliques</Font>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </RegistrySection>

                        <RegistrySection title="Atividade Recente" icon={Activity} subtitle="Monitoramento em tempo real das ações dos alunos na plataforma.">
                            <Box bg="zinc-950/40" border="white/5" rounded="system" padding={5}>
                                <Stack gap={2.5}>
                                    {[
                                        { user: 'João Silva', workout: 'Treino A - Peito', status: 'completed', time: '10min atrás' },
                                        { user: 'Maria Oliveira', workout: 'Treino B - Costas', status: 'in_progress', time: '1h atrás' },
                                        { user: 'Pedro Costa', workout: 'Cardio Livre', status: 'completed', time: '2h atrás' }
                                    ].map((entry, i) => (
                                        <Box key={i} padding={5} bg="zinc-900/40" border="white/5" rounded="system" display="flex" align="center" justify="between">
                                            <Stack direction="row" align="center" gap={5}>
                                                <BaseAvatar initials={entry.user.substring(0, 2)} size="sm" />
                                                <Stack gap={0}>
                                                    <Font variant="body-sm" weight="black" italic uppercase>{entry.user}</Font>
                                                    <Font variant="sub-tiny" color="zinc-600">{entry.workout}</Font>
                                                </Stack>
                                            </Stack>
                                            <Stack gap={0} align="end">
                                                <Font variant="sub-tiny" color={entry.status === 'completed' ? 'emerald' : 'blue'} weight="black" uppercase>{entry.status}</Font>
                                                <Font variant="sub-tiny" color="zinc-700">{entry.time}</Font>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </RegistrySection>
                    </Grid>
                </Stack>
            )}

            {subTab === 'trainers' && (
                <RegistrySection title="Gestão de Personais" icon={Users2} subtitle="Gerencie acesso, cobranças e isenções de treinadores.">
                    <Stack gap={5}>
                        <Box display="flex" align="center" gap={5}>
                            <Input placeholder="Buscar personal por nome ou email..." icon={<Icon icon={Search} size="sm" />} rounded="full" />
                        </Box>
                        <Stack gap={2.5}>
                            <UserRow
                                initials="RF"
                                name="Rodrigo Faro"
                                sub="rodrigo@faro.com • Elite"
                                tags={
                                    <>
                                        <Badge label="45 Alunos" variant="dot" color="blue" />
                                        <Badge label="R$ 2.450,00" variant="dot" color="emerald" />
                                    </>
                                }
                                actions={
                                    <>
                                        <Button variant="zinc" size="sm" isIconOnly rounded="full"><Icon icon={Eye} size="xs" /></Button>
                                        <Button variant="outline-red" size="sm" isIconOnly rounded="full"><Icon icon={Trash2} size="xs" /></Button>
                                    </>
                                }
                            />
                            <UserRow
                                initials="EA"
                                name="Eliana Ap."
                                sub="eliana@sbt.com • Pro"
                                tags={
                                    <>
                                        <Badge label="12 Alunos" variant="dot" color="blue" />
                                        <Badge label="R$ 850,00" variant="dot" color="emerald" />
                                    </>
                                }
                                actions={
                                    <>
                                        <Button variant="zinc" size="sm" isIconOnly rounded="full"><Icon icon={Eye} size="xs" /></Button>
                                        <Button variant="outline-red" size="sm" isIconOnly rounded="full"><Icon icon={Trash2} size="xs" /></Button>
                                    </>
                                }
                            />
                        </Stack>
                    </Stack>
                </RegistrySection>
            )}

            {subTab === 'students' && (
                <RegistrySection title="Gestão de Alunos" icon={Users} subtitle="Controle total sobre registros de alunos e auto-treino.">
                    <Stack gap={5}>
                        <Box display="flex" align="center" gap={5}>
                            <Input placeholder="Buscar aluno..." icon={<Icon icon={Search} size="sm" />} rounded="full" />
                        </Box>
                        <Stack gap={2.5}>
                            <UserRow
                                initials="MV"
                                name="Marcos Vinicius"
                                sub="marcos@teste.com • Aluno"
                                tags={<Badge label="Ativo" variant="dot" color="emerald" />}
                                actions={<Button variant="outline-red" size="sm" isIconOnly rounded="full"><Icon icon={Trash2} size="xs" /></Button>}
                            />
                            <UserRow
                                initials="AJ"
                                name="Ana Julia"
                                sub="ana@julia.com • Aluno"
                                tags={<Badge label="Inativo" variant="dot" color="zinc" />}
                                actions={<Button variant="outline-red" size="sm" isIconOnly rounded="full"><Icon icon={Trash2} size="xs" /></Button>}
                            />
                        </Stack>
                    </Stack>
                </RegistrySection>
            )}

            {subTab === 'affiliates' && (
                <RegistrySection title="Gestão de Afiliados" icon={HeartHandshake} subtitle="Controle de parceiros, comissões e pagamentos.">
                    <Stack gap={5}>
                        <Box display="flex" align="center" justify="between" gap={5}>
                            <Box display="flex" align="center" gap={5} width="full" mdWidth="1/2">
                                <Input placeholder="Buscar parceiro..." icon={<Icon icon={Search} size="sm" />} rounded="full" />
                            </Box>
                            <Box padding={2.5} bg="zinc-950/40" rounded="full" border="white/5" display="flex" gap={2.5}>
                                <Button variant={affiliateTab === 'list' ? 'outline-red' : 'ghost'} rounded="full" size="sm" onClick={() => setAffiliateTab('list')}>
                                    <Font variant="auxiliary" weight="black" italic uppercase>AFILIADOS</Font>
                                </Button>
                                <Button variant={affiliateTab === 'payouts' ? 'outline-emerald' : 'ghost'} rounded="full" size="sm" onClick={() => setAffiliateTab('payouts')}>
                                    <Stack direction="row" align="center" gap={2.5}>
                                        <Font variant="auxiliary" weight="black" italic uppercase>SAQUES PIX</Font>
                                        <Box width="px" height="1" bg="amber" rounded="full" />
                                    </Stack>
                                </Button>
                            </Box>
                        </Box>

                        {affiliateTab === 'list' ? (
                            <Stack gap={2.5}>
                                {[
                                    { name: 'Lucas Silva', email: 'lucas@parceiro.com', earnings: '1.240,00', referrals: 15, status: 'active' },
                                    { name: 'Beatriz Lima', email: 'bia@fitness.com', earnings: '840,00', referrals: 8, status: 'active' }
                                ].map((aff, i) => (
                                    <UserRow
                                        key={i}
                                        initials={aff.name.substring(0, 2)}
                                        name={aff.name}
                                        sub={`${aff.email} • ${aff.referrals} indicados`}
                                        tags={<Badge label={`R$ ${aff.earnings}`} variant="dot" color="emerald" />}
                                        actions={<Button variant="outline-red" size="sm" isIconOnly rounded="full" onClick={() => { setSelectedAff(aff); setIsAffDeleteModalOpen(true) }}><Icon icon={Trash2} size="xs" /></Button>}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Stack gap={2.5}>
                                {[
                                    { name: 'Lucas Silva', amount: '250,00', pix: 'lucas@pix.com', date: '05/05/2024', status: 'pending' },
                                    { name: 'Beatriz Lima', amount: '120,00', pix: 'bia@pix.com', date: '04/05/2024', status: 'requested' }
                                ].map((payout, i) => (
                                    <Box key={i} padding={5} bg="zinc-950/40" border="white/5" rounded="system" display="flex" align="center" justify="between">
                                        <Stack direction="row" align="center" gap={5}>
                                            <Box bg="emerald" bgOpacity={10} rounded="full" padding={2.5}>
                                                <Icon icon={ArrowRightLeft} color="emerald" size="xs" />
                                            </Box>
                                            <Stack gap={0}>
                                                <Font variant="body-sm" weight="black" italic uppercase>{payout.name}</Font>
                                                <Font variant="sub-tiny" color="zinc-600">PIX: {payout.pix} • {payout.date}</Font>
                                            </Stack>
                                        </Stack>
                                        <Stack direction="row" align="center" gap={5}>
                                            <Font variant="body" weight="black" color="emerald">R$ {payout.amount}</Font>
                                            <Button variant="emerald" size="sm" rounded="full">
                                                <Font variant="auxiliary" weight="black" italic uppercase>PAGAR AGORA</Font>
                                            </Button>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </RegistrySection>
            )}

            {subTab === 'store' && (
                <RegistrySection title="RepTrail Store" icon={ShoppingBag} subtitle="Catálogo de suplementos e equipamentos com redirecionamento de afiliados.">
                    <Stack gap={5}>
                        <Box display="flex" align="center" justify="between" gap={5}>
                            <Box display="flex" align="center" gap={5} width="full" mdWidth="1/2">
                                <Input placeholder="Filtrar por nome ou categoria..." icon={<Icon icon={Search} size="sm" />} rounded="full" />
                            </Box>
                            <Button variant="orange" rounded="full" onClick={() => { setEditingProduct(null); setIsProductModalOpen(true) }}>
                                <Stack direction="row" align="center" gap={2.5}>
                                    <Icon icon={Plus} size="sm" />
                                    <Font variant="auxiliary" weight="black" italic uppercase>NOVO PRODUTO</Font>
                                </Stack>
                            </Button>
                        </Box>
                        <Grid cols={3} gap={5}>
                            {[
                                { name: 'Whey Protein Pro', category: 'Suplementos', price: '189,90', clicks: 1250, status: 'active', img: 'https://images.unsplash.com/photo-1593095191850-2a7330053bb4?w=400' },
                                { name: 'Creatina Pure', category: 'Suplementos', price: '89,90', clicks: 980, status: 'active', img: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=400' },
                                { name: 'Faixa Elástica', category: 'Equipamentos', price: '45,00', clicks: 420, status: 'inactive', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400' }
                            ].map((product, i) => (
                                <Box key={i} bg="zinc-950/40" border="white/5" rounded="system" overflow="hidden" group>
                                    <Box position="relative" aspectRatio="video" overflow="hidden" bg="black">
                                        <Img src={product.img} alt={product.name} />
                                        <Box position="absolute" top={0} left={0} padding={2.5}>
                                            <Badge label={product.status === 'active' ? 'EM LINHA' : 'DESATIVADO'} variant="solid" color={product.status === 'active' ? 'emerald' : 'zinc'} />
                                        </Box>
                                    </Box>
                                    <Box padding={5}>
                                        <Stack gap={5}>
                                            <Stack gap={0}>
                                                <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>{product.category}</Font>
                                                <Font variant="body" weight="black" italic uppercase>{product.name}</Font>
                                            </Stack>
                                            <Stack direction="row" align="center" justify="between">
                                                <Stack gap={0}>
                                                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>Clicks</Font>
                                                    <Font variant="body-sm" color="blue" weight="black">{product.clicks}</Font>
                                                </Stack>
                                                <Stack gap={0} align="end">
                                                    <Font variant="sub-tiny" color="zinc-600" weight="black" uppercase>Valor Est.</Font>
                                                    <Font variant="body-sm" color="emerald" weight="black">R$ {product.price}</Font>
                                                </Stack>
                                            </Stack>
                                            <Box border="white/5" />
                                            <Stack direction="row" gap={2.5}>
                                                <Button variant="zinc" fullWidth rounded="sm" onClick={() => { setEditingProduct(product); setIsProductModalOpen(true) }}>
                                                    <Font variant="auxiliary" weight="black" italic uppercase>EDITAR</Font>
                                                </Button>
                                                <Button variant="outline-red" isIconOnly rounded="sm">
                                                    <Icon icon={Trash2} size="xs" />
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box>
                            ))}
                        </Grid>
                    </Stack>
                </RegistrySection>
            )}

            {subTab === 'logs' && (
                <RegistrySection title="Auditoria de Sistema" icon={Activity} subtitle="Histórico completo de ações administrativas e eventos críticos.">
                    <Stack gap={2.5}>
                        <LogItem
                            admin="Rodrigo Faro"
                            action="DELETE_USER"
                            target="Aluno Teste"
                            date="Há 5 minutos"
                            details={{ id: '123', reason: 'Abuse' }}
                        />
                        <LogItem
                            admin="Eliana Ap."
                            action="UPDATE_PLAN"
                            target="Personal Top"
                            date="Há 12 minutos"
                            details={{ from: 'Pro', to: 'Elite' }}
                        />
                        <LogItem
                            admin="Rodrigo Faro"
                            action="WITHDRAW_APPROVAL"
                            target="Afiliado 01"
                            date="Há 45 minutos"
                            details={{ amount: 250 }}
                        />
                    </Stack>
                </RegistrySection>
            )}

            {/* Modals */}
            <ProductEditorModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} product={editingProduct} />
            <CostEditorModal isOpen={isCostModalOpen} onClose={() => setIsCostModalOpen(false)} cost={selectedCost} />
            <CostDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} cost={selectedCost} />
            <AffiliateDeleteModal isOpen={isAffDeleteModalOpen} onClose={() => setIsAffDeleteModalOpen(false)} affiliate={selectedAff} />
        </Stack>
    )
}
