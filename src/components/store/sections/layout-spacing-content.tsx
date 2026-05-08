'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Inline } from '../base/layout'
import { Box } from '../base/box'
import { GlassPanel, CardHeader, CardContent } from '../base/surface'
import { RegistrySection } from '../advanced/registry-section'
import { Layout } from 'lucide-react'

export function LayoutSpacingContent({ id }: { id?: string }) {
  return (
    <RegistrySection
        id={id}
        title="Layout & Espaçamento"
        icon={Layout}
        subtitle="Regras de arquitetura de layout, raios de borda e padding obrigatório."
    >
        {/* Radii & Padding Rules */}
        <GlassPanel padding={0}>
            <Stack gap={0}>
                <CardHeader>
                    <Font weight="bold">Radii & Base Padding</Font>
                </CardHeader>
                <CardContent padding={5}>
                    <Stack direction={{ base: 'col', md: 'row' }} gap={5} align="stretch">
                        <Box flex1 display="flex" align="center" justify="center">
                            <Inline gap={5} justify="center" fullWidth>
                                <RadiusItem label="Standard" value="5px" rounded="system" />
                                <RadiusItem label="Pills" value="Full" rounded="full" />
                            </Inline>
                        </Box>

                        <GlassPanel flex1 padding={5} width={{ base: 'full', md: 'half' }}>
                            <Stack gap={5}>
                                <Font variant="sub-tiny" color="orange" weight="black" uppercase italic tracking="widest">Governance Rules:</Font>
                                <Font variant="description" color="zinc-400">1. Radius must be strictly [5px] or [Full].</Font>
                                <Font variant="description" color="zinc-400">2. Mandatory Card Padding is [20px] (Orange).</Font>
                                <Font variant="description" color="zinc-400">3. Margins (mt/mb) are strictly prohibited.</Font>
                            </Stack>
                        </GlassPanel>
                    </Stack>
                </CardContent>
            </Stack>
        </GlassPanel>
    </RegistrySection>
  )
}

interface RadiusItemProps {
  label: string
  value: string
  rounded: 'system' | 'full' | 'none'
}

function RadiusItem({ label, value, rounded }: RadiusItemProps) {
  return (
    <Box bg="orange" padding={5} flex1 rounded={rounded}>
      <Stack align="center" justify="center" gap={2.5}>
        <Font color="black" weight="black" variant="sub-tiny" uppercase italic>{label}</Font>
        <Font color="black" weight="bold" variant="body">{value}</Font>
      </Stack>
    </Box>
  )
}
