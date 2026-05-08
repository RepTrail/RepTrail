/* eslint-disable no-restricted-syntax */
import React from 'react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Font } from '../base/font'
import { Icon } from '../base/icon'
import { Box } from '../base/box'
import { Button } from '../base/button'
import { Input } from '../base/input'
import { Card, CardHeader, CardContent } from '../base/card'
import { Badge } from '../base/badge'
import { Eye, Trash2, Check, Zap, X, LucideIcon, Hash, Fingerprint, Phone, Lock, Calendar, Image as ImageIcon, Upload, Search } from 'lucide-react'

export function ComponentShowcaseContent() {
    const [isAiEnabled, setIsAiEnabled] = React.useState(true)
    const [cpf, setCpf] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [date, setDate] = React.useState('')

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '')
        if (val.length > 11) val = val.slice(0, 11)
        val = val.replace(/(\d{3})(\d)/, '$1.$2')
        val = val.replace(/(\d{3})(\d)/, '$1.$2')
        val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        setCpf(val)
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '')
        if (val.length > 11) val = val.slice(0, 11)
        val = val.replace(/^(\d{2})(\d)/g, '($1) $2')
        val = val.replace(/(\d)(\d{4})$/, '$1-$2')
        setPhone(val)
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '')
        if (val.length > 8) val = val.slice(0, 8)
        val = val.replace(/(\d{2})(\d)/, '$1/$2')
        val = val.replace(/(\d{2})(\d)/, '$1/$2')
        setDate(val)
    }

    return (
        <Grid cols={2} gap={5}>
            {/* Action Buttons */}
            <Card border="white/5">
                <Stack gap={5}>
                    <CardHeader>
                        <Font weight="bold">Action Buttons</Font>
                    </CardHeader>
                    <CardContent>
                        <Stack gap={5}>
                            <Button variant="white" fullWidth>Premium Action (White)</Button>
                            <Button variant="orange" fullWidth>Main Action (Orange)</Button>
                            <Button variant="emerald" fullWidth>Success Action (Emerald)</Button>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>

            {/* Pill Variants */}
            <Card border="white/5">
                <Stack gap={5} fullHeight>
                    <CardHeader>
                        <Font weight="bold">Pill Variants</Font>
                    </CardHeader>
                    <CardContent>
                        <Stack gap={5} align="center" justify="center" fullHeight>
                            <Button variant="outline-orange" rounded="full" fullWidth>Premium Orange</Button>
                            <Button variant="outline-emerald" rounded="full" fullWidth>Success Emerald</Button>
                            <Button variant="outline-blue" rounded="full" fullWidth>Info Blue</Button>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>

            {/* Row Actions */}
            <Card border="white/10">
                <Stack gap={5} fullHeight>
                    <CardHeader>
                        <Font weight="bold">Grid & Row Actions</Font>
                    </CardHeader>
                    <CardContent>
                        <Stack direction="row" gap={12.5} justify="around" wrap>
                            <RowActionItem icon={Eye} label="INSPECIONAR" variant="outline-blue" />
                            <RowActionItem icon={Trash2} label="DELETAR" variant="outline-red" />
                            <RowActionItem icon={Check} label="FINALIZAR" variant="outline-emerald" />

                            <Stack align="center" gap={2.5}>
                                <Stack direction="row" gap={2.5}>
                                    <Button variant="outline-blue" isIconOnly rounded="full" size="sm">
                                        <Icon icon={Eye} size="xs" />
                                    </Button>
                                    <Button variant="outline-red" isIconOnly rounded="full" size="sm">
                                        <Icon icon={Trash2} size="xs" />
                                    </Button>
                                    <Button variant="outline-emerald" isIconOnly rounded="full" size="sm">
                                        <Icon icon={Check} size="xs" />
                                    </Button>
                                </Stack>
                                <Font variant="sub-tiny" color="zinc-600">Icon Actions</Font>
                            </Stack>

                            <Stack align="center" gap={2.5}>
                                <Button variant="zinc" isIconOnly rounded="full" size="sm">
                                    <Icon icon={X} size="xs" />
                                </Button>
                                <Font variant="sub-tiny" color="zinc-600">Close Action</Font>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>

            {/* Badges & Status */}
            <Card border="white/10">
                <Stack gap={5} fullHeight>
                    <CardHeader>
                        <Font weight="bold">Status & Info Badges</Font>
                    </CardHeader>
                    <CardContent>
                        <Stack gap={5} justify="center" fullHeight>
                            <Stack direction="row" gap={5} justify="around" wrap>
                                <Badge variant="dot" color="emerald" label="Ativo" />
                                <Badge variant="dot" color="orange" label="Pendente" />
                                <Badge variant="dot" color="red" label="Alerta" />
                                <Badge variant="dot" color="blue" label="Info" />
                            </Stack>

                            <Box height="px" bg="white/5" />

                            <Stack direction="row" gap={2.5} justify="center">
                                <Badge variant="outline" color="emerald" label="REGISTRO: 08/05/2026" />
                                <Badge variant="outline" color="blue" label="42 ALUNOS" />
                            </Stack>

                            <Stack direction="row" gap={2.5} justify="center">
                                <Badge variant="outline" color="zinc" label="System Tag" />
                                <Badge variant="outline" color="amber" label="Elite" />
                                <Badge variant="outline" color="red" label="Excluir" />
                            </Stack>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>

            {/* Advanced Input Controls */}
            <Card border="white/10" colSpan={2}>
                <Stack gap={5}>
                    <CardHeader>
                        <Font weight="bold">Advanced Interface Controls</Font>
                    </CardHeader>
                    <CardContent>
                        <Stack gap={5}>
                            <Grid cols={3} gap={5}>
                                <Stack gap={2.5}>
                                    <Font variant="sub-tiny" color="zinc-600" uppercase>Number Input</Font>
                                    <Input type="number" placeholder="0" icon={<Icon icon={Hash} size="xs" />} />
                                </Stack>

                                <Stack gap={2.5}>
                                    <Font variant="sub-tiny" color="zinc-600" uppercase>CPF Mask</Font>
                                    <Input
                                        value={cpf}
                                        onChange={handleCpfChange}
                                        placeholder="000.000.000-00"
                                        icon={<Icon icon={Fingerprint} size="xs" />}
                                    />
                                </Stack>

                                <Stack gap={2.5}>
                                    <Font variant="sub-tiny" color="zinc-600" uppercase>Telefone Mask</Font>
                                    <Input
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="(00) 00000-0000"
                                        icon={<Icon icon={Phone} size="xs" />}
                                    />
                                </Stack>

                                <Stack gap={2.5}>
                                    <Font variant="sub-tiny" color="zinc-600" uppercase>Password Field</Font>
                                    <Input type="password" placeholder="••••••••" icon={<Icon icon={Lock} size="xs" />} />
                                </Stack>

                                <Stack gap={2.5}>
                                    <Font variant="sub-tiny" color="zinc-600" uppercase>Date (Masked Text)</Font>
                                    <Input
                                        value={date}
                                        onChange={handleDateChange}
                                        placeholder="DD/MM/AAAA"
                                        icon={<Icon icon={Calendar} size="xs" />}
                                    />
                                </Stack>

                                <Stack gap={2.5}>
                                    <Font variant="sub-tiny" color="zinc-600" uppercase>Media Upload</Font>
                                    <Box
                                        bg="zinc-900"
                                        border="white/5"
                                        rounded="system"
                                        padding={2.5}
                                        display="flex"
                                        align="center"
                                        gap={2.5}
                                        height="12"
                                        cursor="pointer"
                                        hoverBg="zinc-800"
                                        transition="all"
                                    >
                                        <Box bg="emerald" bgOpacity={10} rounded="sm" width="8" height="8" display="flex" align="center" justify="center">
                                            <Icon icon={ImageIcon} color="emerald" size="xs" />
                                        </Box>
                                        <Font variant="auxiliary" color="white" weight="bold">UPLOAD IMAGE</Font>
                                        <Box flex1 />
                                        <Icon icon={Upload} color="zinc-500" size="xs" />
                                    </Box>
                                </Stack>
                            </Grid>

                            <Box height="px" bg="white/5" />

                            <Stack gap={2.5}>
                                <Font variant="sub-tiny" color="zinc-600" uppercase>Standard Full Width Input</Font>
                                <Input placeholder="Escreva algo..." icon={<Icon icon={Zap} size="xs" />} />
                            </Stack>

                            <Stack gap={2.5}>
                                <Font variant="sub-tiny" color="zinc-600" uppercase>Global Search Input (Full Width)</Font>
                                <Input placeholder="Pesquisar em toda a plataforma..." rounded="full" icon={<Icon icon={Search} size="xs" />} />
                            </Stack>

                            <Grid cols={2} gap={12.5}>
                                <Stack gap={5} justify="center">
                                    <Box
                                        bg="zinc-900"
                                        rounded="full"
                                        padding={5}
                                        border="white/5"
                                        display="flex"
                                        align="center"
                                        justify="between"
                                        onClick={() => setIsAiEnabled(!isAiEnabled)}
                                        cursor="pointer"
                                        hoverBg="zinc-800"
                                        transition="all"
                                    >
                                        <Font variant="auxiliary" color="white" weight="bold">ENABLE AI ANALYSIS</Font>
                                        <Box
                                            bg={isAiEnabled ? 'emerald' : 'zinc-800'}
                                            bgOpacity={isAiEnabled ? 20 : 100}
                                            rounded="full"
                                            width="10"
                                            height="5"
                                            position="relative"
                                            border={isAiEnabled ? 'emerald' : 'white/10'}
                                            transition="all"
                                        >
                                            <Box
                                                bg={isAiEnabled ? 'emerald' : 'zinc-400'}
                                                rounded="full"
                                                className="w-[14px] h-[14px]"
                                                position="absolute"
                                                right={isAiEnabled ? 0.75 : undefined}
                                                left={!isAiEnabled ? 0.75 : undefined}
                                                top={0.5}
                                                shadow={isAiEnabled ? 'emerald' : undefined}
                                                transition="all"
                                            />
                                        </Box>
                                    </Box>
                                </Stack>

                                <Stack direction="row" align="center" gap={2.5} justify="center">
                                    <Box border="emerald" rounded="sm" className="w-5 h-5" display="flex" align="center" justify="center" bg="emerald" bgOpacity={10}>
                                        <Icon icon={Check} size="xs" color="emerald" />
                                    </Box>
                                    <Font variant="auxiliary" color="zinc-400">Accept terms and conditions</Font>
                                </Stack>
                            </Grid>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>
        </Grid>
    )
}



function RowActionItem({ icon, label, variant }: { icon: LucideIcon, label: string, variant: 'outline-blue' | 'outline-red' | 'outline-emerald' }) {
    const color = variant.split('-')[1] as 'blue' | 'red' | 'emerald'

    return (
        <Stack align="center" gap={2.5}>
            <Button variant={variant} rounded="full">
                <Icon icon={icon} size="xs" />
                <Font variant="auxiliary" weight="black" color={color}>{label}</Font>
            </Button>
            <Font variant="sub-tiny" color="zinc-600">Row Action ({color})</Font>
        </Stack>
    )
}
