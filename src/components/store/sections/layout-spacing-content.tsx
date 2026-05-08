/* eslint-disable no-restricted-syntax */
'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Font } from '../base/font'
import { Box, BoxProps } from '../base/box'
import { Card, CardHeader, CardContent } from '../base/card'

export function LayoutSpacingContent() {
    return (
        <Grid cols={2} gap={5}>
            {/* Radii & Padding Rules */}
            <Card border="white/5" colSpan={2}>
                <Stack gap={12.5}>
                    <CardHeader>
                        <Font weight="bold">Radii & Base Padding</Font>
                    </CardHeader>
                    <CardContent>
                        <Stack direction="col" mdDirection="row" gap={5} align="stretch">
                            <Box width="full" mdWidth="1/2" display="flex" align="center" justify="center" padding={0}>
                                <Stack direction="row" gap={5} justify="center" width="full">
                                    <RadiusItem label="Standard" value="5px" rounded="system" flex1 />
                                    <RadiusItem label="Pills" value="Full" rounded="full" flex1 />
                                </Stack>
                            </Box>

                            <Box width="full" mdWidth="1/2" padding={5} bg="zinc-950/40" rounded="system" border="white/5">
                                <Stack gap={5}>
                                    <Font variant="sub-tiny" color="orange" weight="black" uppercase italic tracking="widest">Governance Rules:</Font>
                                    <Font variant="description" color="zinc-400">1. Radius must be strictly [5px] or [Full].</Font>
                                    <Font variant="description" color="zinc-400">2. Mandatory Card Padding is [20px] (Orange).</Font>
                                    <Font variant="description" color="zinc-400">3. Margins (mt/mb) are strictly prohibited.</Font>
                                </Stack>
                            </Box>
                        </Stack>
                    </CardContent>
                </Stack>
            </Card>

            {/* Vertical Rhythm */}
            <Card border="white/10" colSpan={2}>
                <Stack gap={12.5}>
                    <CardHeader>
                        <Font weight="bold">System Anatomy (Interactive Rhythm)</Font>
                    </CardHeader>
                    <CardContent>
                        <Box bg="zinc-950" padding={5} rounded="system" border="white/10" borderStyle="dashed" overflow="hidden">
                            <Stack direction="col" mdDirection="row" gap={0} height="700" align="stretch">
                                {/* Sidebar Skeleton */}
                                <Box display="md-flex" height="full">
                                    <Stack direction="row" gap={0} width="56" shrink0 height="full">
                                        <Box flex1 bg="zinc-900" display="flex" flexCol position="relative">
                                            <Box bg="blue" bgOpacity={20} height="5" width="full" shrink0 display="flex" align="center" justify="center">
                                                <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                                            </Box>
                                            <Box bg="blue" bgOpacity={30} width="full" height="px" />

                                            <Stack direction="row" gap={0} flex1 height="full">
                                                <Box bg="blue" bgOpacity={20} width="5" shrink0 display="flex" align="center" justify="center">
                                                    <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                                                </Box>
                                                <Box bg="blue" bgOpacity={30} height="full" width="px" />

                                                {/* Sidebar Content Area */}
                                                <Box flex1 display="flex" flexCol>
                                                    <Box display="flex" align="center">
                                                        <Box bg="orange" width="8" height="8" shrink0 />
                                                        <Box bg="orange" bgOpacity={30} height="8" width="px" />
                                                        <Box bg="orange" bgOpacity={20} width="2.5" height="8" display="flex" align="center" justify="center">
                                                            <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={50}>10PX</Font>
                                                        </Box>
                                                        <Box bg="orange" bgOpacity={30} height="8" width="px" />
                                                        <Box bg="white" bgOpacity={20} width="24" height="4" />
                                                    </Box>

                                                    <Stack gap={0}>
                                                        <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                        <Box bg="orange" bgOpacity={10} height="50" display="flex" align="center" justify="center">
                                                            <Font variant="sub-tiny" color="orange" weight="black" scale={75}>50PX GAP</Font>
                                                        </Box>
                                                        <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                    </Stack>

                                                    <Stack gap={0}>
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <React.Fragment key={i}>
                                                                <Box bg="white" bgOpacity={5} width="full" height="16" display="flex" flexCol overflow="hidden">
                                                                    <Box bg="blue" bgOpacity={20} height="4" width="full" shrink0 display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                                                    </Box>
                                                                    <Box bg="blue" bgOpacity={30} width="full" height="px" />

                                                                    <Stack direction="row" gap={0} flex1>
                                                                        <Box bg="blue" bgOpacity={20} width="5" height="full" shrink0 display="flex" align="center" justify="center">
                                                                            <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                                                        </Box>
                                                                        <Box bg="blue" bgOpacity={30} height="full" width="px" />

                                                                        <Box flex1 display="flex" align="center">
                                                                            <Box bg="white" bgOpacity={10} width="4" height="4" shrink0 />
                                                                            <Box bg="orange" bgOpacity={30} height="4" width="px" />
                                                                            <Box bg="orange" bgOpacity={20} width="2.5" height="4" display="flex" align="center" justify="center">
                                                                                <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={40}>10PX</Font>
                                                                            </Box>
                                                                            <Box bg="orange" bgOpacity={30} height="4" width="px" />
                                                                            <Box bg="white" bgOpacity={10} width="16" height="2.5" />
                                                                        </Box>

                                                                        <Box bg="blue" bgOpacity={30} height="full" width="px" />
                                                                        <Box bg="blue" bgOpacity={20} width="5" height="full" shrink0 display="flex" align="center" justify="center">
                                                                            <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                                                        </Box>
                                                                    </Stack>

                                                                    <Box bg="blue" bgOpacity={30} width="full" height="px" />
                                                                    <Box bg="blue" bgOpacity={20} height="4" width="full" shrink0 display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                                                    </Box>
                                                                </Box>
                                                                {i < 5 && (
                                                                    <Stack gap={0}>
                                                                        <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                        <Box bg="orange" bgOpacity={20} height="2.5" display="flex" align="center" justify="center">
                                                                            <Font variant="sub-tiny" color="orange" weight="black" scale={75}>10PX</Font>
                                                                        </Box>
                                                                        <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                    </Stack>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </Stack>

                                                    <Stack gap={0} flex1 justify="end">
                                                        <Box bg="white" bgOpacity={10} width="full" height="px" />
                                                        <Stack gap={0}>
                                                            <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                            <Box bg="orange" bgOpacity={20} height="5" display="flex" align="center" justify="center">
                                                                <Font variant="sub-tiny" color="orange" weight="black" scale={75}>20PX</Font>
                                                            </Box>
                                                            <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                        </Stack>

                                                        <Box padding={0}>
                                                            <Stack gap={0}>
                                                                <Stack direction="row" align="center" gap={0}>
                                                                    <Box bg="white" bgOpacity={10} width="10" height="10" shrink0 />
                                                                    <Box bg="orange" bgOpacity={30} height="10" width="px" />
                                                                    <Box bg="orange" bgOpacity={20} width="5" height="10" display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={50}>20PX</Font>
                                                                    </Box>
                                                                    <Box bg="orange" bgOpacity={30} height="10" width="px" />

                                                                    <Box flex1>
                                                                        <Stack gap={0}>
                                                                            <Box bg="white" bgOpacity={20} width="full" height="3" />
                                                                            <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                            <Box bg="orange" bgOpacity={20} height="2.5" display="flex" align="center" justify="center">
                                                                                <Font variant="sub-tiny" color="orange" weight="black" scale={40}>10PX</Font>
                                                                            </Box>
                                                                            <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                            <Box bg="white" bgOpacity={5} width="2/3" height="2" />
                                                                        </Stack>
                                                                    </Box>
                                                                </Stack>

                                                                <Stack gap={0}>
                                                                    <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                    <Box bg="orange" bgOpacity={20} height="5" display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="orange" weight="black" scale={75}>20PX</Font>
                                                                    </Box>
                                                                    <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                </Stack>

                                                                <Stack direction="row" gap={0}>
                                                                    <Box flex1 bg="white" bgOpacity={10} height="8" display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="white" weight="black" scale={50}>CONFIG</Font>
                                                                    </Box>
                                                                    <Box bg="orange" bgOpacity={30} height="8" width="px" />
                                                                    <Box bg="orange" bgOpacity={20} width="5" height="8" display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={50}>20PX</Font>
                                                                    </Box>
                                                                    <Box bg="orange" bgOpacity={30} height="8" width="px" />

                                                                    <Box flex1 bg="white" bgOpacity={10} height="8" display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="white" weight="black" scale={50}>SAIR</Font>
                                                                    </Box>
                                                                </Stack>
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                </Box>

                                                <Box bg="blue" bgOpacity={30} height="full" width="px" />
                                                <Box bg="blue" bgOpacity={20} width="5" shrink0 display="flex" align="center" justify="center">
                                                    <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                                                </Box>
                                            </Stack>

                                            <Box bg="blue" bgOpacity={30} width="full" height="px" />
                                            <Box bg="blue" bgOpacity={20} height="5" width="full" shrink0 display="flex" align="center" justify="center">
                                                <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                                            </Box>
                                        </Box>
                                        <Box bg="white" bgOpacity={10} height="full" width="px" />
                                    </Stack>
                                </Box>

                                {/* Main Content Skeleton */}
                                <Box flex1 bg="zinc-950" display="flex" flexCol overflow="auto" position="relative">
                                    <Box bg="blue" bgOpacity={20} height="5" width="full" shrink0 display="flex" align="center" justify="center">
                                        <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                                    </Box>
                                    <Box bg="blue" bgOpacity={30} width="full" height="px" />

                                    <Stack direction="row" gap={0} flex1>
                                        <Box bg="blue" bgOpacity={20} width="5" shrink0 display="flex" align="center" justify="center">
                                            <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                                        </Box>
                                        <Box bg="blue" bgOpacity={30} height="full" width="px" />

                                        <Box flex1 padding={0}>
                                            <Stack gap={0}>
                                                <Stack direction="row" align="center" gap={0}>
                                                    <Box bg="orange" width="16" height="16" shrink0 />
                                                    <Box bg="orange" bgOpacity={30} height="16" width="px" />
                                                    <Box bg="orange" bgOpacity={20} width="5" height="16" display="flex" align="center" justify="center">
                                                        <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                                                    </Box>
                                                    <Box bg="orange" bgOpacity={30} height="16" width="px" />
                                                    <Stack gap={0}>
                                                        <Box bg="white" bgOpacity={20} width="48" height="6" />
                                                        <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                        <Box bg="orange" bgOpacity={20} width="full" height="2.5" display="flex" align="center" justify="center">
                                                            <Font variant="sub-tiny" color="orange" weight="black" scale={75}>10PX</Font>
                                                        </Box>
                                                        <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                        <Box bg="white" bgOpacity={10} width="32" height="4" />
                                                    </Stack>
                                                </Stack>

                                                <Stack gap={0}>
                                                    <Box bg="orange" bgOpacity={10} width="full" height="px" />
                                                    <Box bg="orange" bgOpacity={5} height="100" display="flex" align="center" justify="center">
                                                        <Font variant="sub-tiny" color="orange" weight="black">100PX VERTICAL GAP</Font>
                                                    </Box>
                                                    <Box bg="orange" bgOpacity={10} width="full" height="px" />
                                                </Stack>

                                                <Stack gap={0}>
                                                    <Box bg="white" bgOpacity={20} width="64" height="8" />
                                                    <Stack gap={0}>
                                                        <Box bg="orange" bgOpacity={10} width="full" height="px" />
                                                        <Box bg="orange" bgOpacity={10} height="50" display="flex" align="center" justify="center">
                                                            <Font variant="sub-tiny" color="orange" weight="black">50PX TITLE-TO-CONTENT GAP</Font>
                                                        </Box>
                                                        <Box bg="orange" bgOpacity={10} width="full" height="px" />
                                                    </Stack>
                                                    <Stack direction="row" gap={0}>
                                                        {[1, 2, 3].map((i) => (
                                                            <React.Fragment key={i}>
                                                                <Box flex1 bg="zinc-900" border="white/5" padding={0} display="flex" flexCol overflow="hidden">
                                                                    <Box bg="blue" bgOpacity={20} height="5" width="full" display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                                                    </Box>
                                                                    <Box bg="blue" bgOpacity={10} width="full" height="px" />
                                                                    <Stack direction="row" gap={0} flex1>
                                                                        <Box bg="blue" bgOpacity={20} width="5" height="full" display="flex" align="center" justify="center">
                                                                            <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                                                        </Box>
                                                                        <Box bg="blue" bgOpacity={10} height="full" width="px" />
                                                                        <Box flex1 padding={0} display="flex" flexCol>
                                                                            <Box bg="white" bgOpacity={5} width="full" height="4" />
                                                                            <Stack gap={0}>
                                                                                <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                                <Box bg="orange" bgOpacity={10} height="5" display="flex" align="center" justify="center">
                                                                                    <Font variant="sub-tiny" color="orange" weight="black" scale={50}>20PX</Font>
                                                                                </Box>
                                                                                <Box bg="orange" bgOpacity={30} width="full" height="px" />
                                                                            </Stack>
                                                                            <Box bg="white" bgOpacity={5} width="2/3" height="4" />
                                                                        </Box>
                                                                        <Box bg="blue" bgOpacity={10} height="full" width="px" />
                                                                        <Box bg="blue" bgOpacity={20} width="5" height="full" display="flex" align="center" justify="center">
                                                                            <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                                                        </Box>
                                                                    </Stack>
                                                                    <Box bg="blue" bgOpacity={10} width="full" height="px" />
                                                                    <Box bg="blue" bgOpacity={20} height="5" width="full" display="flex" align="center" justify="center">
                                                                        <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                                                    </Box>
                                                                </Box>
                                                                {i < 3 && (
                                                                    <Stack direction="row" gap={0}>
                                                                        <Box bg="orange" bgOpacity={30} height="full" width="px" />
                                                                        <Box bg="orange" bgOpacity={20} width="5" display="flex" align="center" justify="center">
                                                                            <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                                                                        </Box>
                                                                        <Box bg="orange" bgOpacity={30} height="full" width="px" />
                                                                    </Stack>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </Stack>
                                                </Stack>

                                                <Stack gap={0}>
                                                    <Box bg="orange" bgOpacity={10} width="full" height="px" />
                                                    <Box bg="orange" bgOpacity={5} height="100" display="flex" align="center" justify="center">
                                                        <Font variant="sub-tiny" color="orange" weight="black">100PX VERTICAL GAP</Font>
                                                    </Box>
                                                    <Box bg="orange" bgOpacity={10} width="full" height="px" />
                                                </Stack>
                                            </Stack>
                                        </Box>

                                        <Box bg="blue" bgOpacity={30} height="full" width="px" />
                                        <Box bg="blue" bgOpacity={20} width="5" shrink0 display="flex" align="center" justify="center">
                                            <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                                        </Box>
                                    </Stack>

                                    <Box bg="blue" bgOpacity={30} width="full" height="px" />
                                    <Box bg="blue" bgOpacity={20} height="5" width="full" shrink0 display="flex" align="center" justify="center">
                                        <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    </CardContent>
                </Stack>
            </Card>
        </Grid>
    )
}

interface RadiusItemProps {
    label: string
    value: string
    rounded: BoxProps['rounded']
    flex1?: boolean
}

function RadiusItem({ label, value, rounded, flex1 }: RadiusItemProps) {
    return (
        <Box bg="orange" padding={5} rounded={rounded} flex1={flex1}>
            <Stack align="center" justify="center" gap={2.5}>
                <Font color="black" weight="black" variant="sub-tiny" uppercase italic>{label}</Font>
                <Font color="black" weight="bold" variant="body">{value}</Font>
            </Stack>
        </Box>
    )
}
