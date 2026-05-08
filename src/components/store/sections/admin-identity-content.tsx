import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { Box } from '../base/box'
import { Card } from '../base/card'
import { Icon } from '../base/icon'
import { Shield, Trash2 } from 'lucide-react'

export function AdminIdentityContent() {
    return (
        <Card border="red" variant="surface" padding={5}>
            <Stack direction="row" align="center" justify="between" wrap>
                {/* Super Admin Badge */}
                <Box bg="transparent" padding={0} rounded="full" border="red">
                    <Stack direction="row" align="center" gap={2.5}>
                        <Icon icon={Shield} color="red" size="sm" />
                        <Font variant="label-caps" color="red" weight="black" italic uppercase tracking="widest">Super Admin</Font>
                    </Stack>
                </Box>

                {/* Destructive Action Example */}
                <Stack align="center" gap={2.5}>
                    <Box bg="transparent" padding={0} rounded="full" border="red">
                        <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={Trash2} color="red" size="xs" />
                            <Font color="red" variant="auxiliary" weight="bold">DELETAR REGISTRO</Font>
                        </Stack>
                    </Box>
                    <Font variant="sub-tiny" color="zinc-600" uppercase tracking="widest">Action (Red Pill)</Font>
                </Stack>

                {/* Text Identity */}
                <Stack gap={2.5} align="end">
                    <Font weight="black" italic uppercase tracking="tighter" variant="h2">Admin Dashboard</Font>
                    <Font variant="auxiliary" color="zinc-600" tracking="widest" uppercase>Painel de Controle RepTrail</Font>
                </Stack>
            </Stack>
        </Card>
    )
}
