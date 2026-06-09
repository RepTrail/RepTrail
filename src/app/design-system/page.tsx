'use client'

import React from 'react'
import { RegistryShell } from '@/components/store/advanced/registry-shell'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { BrandingSectionContent } from '@/components/store/sections/branding-section-content'
import { TypographyContent } from '@/components/store/sections/typography-content'
import { LayoutSpacingContent } from '@/components/store/sections/layout-spacing-content'
import { ComponentsRegistryContent } from '@/components/store/sections/components-registry-content'
import { ColorsSectionContent } from '@/components/store/sections/colors-section-content'
import { AuthSectionsContent } from '@/components/store/sections/auth-sections-content'
import { Zap, Palette, ShieldCheck, Type, Layout } from 'lucide-react'

export default function DesignSystemPage() {
    return (
        <RegistryShell>
                <RegistryMain
                    title="Design System"
                    subtitle="A comprehensive guide to RepTrail's visual identity, components, and design principles."
                    icon="Zap"
                    contextLabel="Brand Guidelines"
                    showTabs={true}
                >
                    <RegistrySection id="branding" title="Logos & Identidade" icon={Zap} subtitle="Diretrizes de marca para as diferentes instâncias do ecossistema RepTrail.">
                        <BrandingSectionContent />
                    </RegistrySection>
                    
                    <RegistrySection id="colors" title="Paleta de Cores" icon={Palette} subtitle="Cores institucionais e funcionais aplicadas no ecossistema RepTrail.">
                        <ColorsSectionContent />
                    </RegistrySection>

                    <RegistrySection id="auth" title="Autenticação" subtitle="Formulários de acesso e cadastro padronizados." icon={ShieldCheck}>
                        <AuthSectionsContent />
                    </RegistrySection>

                    <RegistrySection id="typography" title="Tipografia & Escala" icon={Type} subtitle="Definições de hierarquia visual e legibilidade para interfaces RepTrail.">
                        <TypographyContent />
                    </RegistrySection>

                    <RegistrySection id="components" title="Componentes Base" icon={Layout} subtitle="Variedade de componentes reutilizáveis para o Design System.">
                        <ComponentsRegistryContent />
                    </RegistrySection>

                    <RegistrySection id="layout" title="Layout & Espaçamento" icon={Layout} subtitle="Regras de arquitetura de layout, raios de borda e padding obrigatório.">
                        <LayoutSpacingContent />
                    </RegistrySection>
                </RegistryMain>
        </RegistryShell>
    )
}
