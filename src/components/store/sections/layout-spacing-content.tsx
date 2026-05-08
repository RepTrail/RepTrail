/* eslint-disable no-restricted-syntax */
'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Grid } from '../base/grid'
import { Font } from '../base/font'
import { Inline } from '../base/layout'
import { GlassPanel, CardHeader, CardContent } from '../base/surface'
import { cn } from '@/lib/utils'

export function LayoutSpacingContent() {
  return (
    <Stack gap={5}>
      {/* Radii & Padding Rules */}
      <GlassPanel padding={0}>
        <Stack gap={0}>
          <CardHeader>
            <Font weight="bold">Radii & Base Padding</Font>
          </CardHeader>
          <CardContent padding={5}>
            <div className="flex flex-col md:flex-row gap-5 items-stretch">
              <div className="w-full md:w-1/2 flex items-center justify-center">
                <Inline gap={5} justify="center" className="w-full">
                  <RadiusItem label="Standard" value="5px" rounded="system" />
                  <RadiusItem label="Pills" value="Full" rounded="full" />
                </Inline>
              </div>

              <GlassPanel className="w-full md:w-1/2" padding={5}>
                <Stack gap={5}>
                  <Font variant="sub-tiny" color="orange" weight="black" uppercase italic tracking="widest">Governance Rules:</Font>
                  <Font variant="description" color="zinc-400">1. Radius must be strictly [5px] or [Full].</Font>
                  <Font variant="description" color="zinc-400">2. Mandatory Card Padding is [20px] (Orange).</Font>
                  <Font variant="description" color="zinc-400">3. Margins (mt/mb) are strictly prohibited.</Font>
                </Stack>
              </GlassPanel>
            </div>
          </CardContent>
        </Stack>
      </GlassPanel>

      {/* Vertical Rhythm */}
      <GlassPanel padding={0}>
        <Stack gap={0}>
          <CardHeader>
            <Font weight="bold">System Anatomy (Interactive Rhythm)</Font>
          </CardHeader>
          <CardContent padding={0}>
            <div className="bg-zinc-950 rounded-[5px] border border-white/10 border-dashed overflow-hidden">
              <div className="flex flex-col md:flex-row gap-0 h-[700px] items-stretch">
                {/* Sidebar Skeleton */}
                <div className="hidden md:flex h-full">
                  <div className="flex flex-row gap-0 w-56 shrink-0 h-full">
                    <div className="flex-1 bg-zinc-900 flex flex-col relative">
                      <div className="bg-blue-500/20 h-5 w-full shrink-0 flex items-center justify-center">
                        <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                      </div>
                      <div className="bg-blue-500/30 w-full h-px" />

                      <div className="flex flex-row gap-0 flex-1 h-full">
                        <div className="bg-blue-500/20 w-5 shrink-0 flex items-center justify-center">
                          <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                        </div>
                        <div className="bg-blue-500/30 h-full w-px" />

                        {/* Sidebar Content Area */}
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center">
                            <div className="bg-orange-500 w-8 h-8 shrink-0" />
                            <div className="bg-orange-500/30 h-8 w-px" />
                            <div className="bg-orange-500/20 w-2.5 h-8 flex items-center justify-center">
                              <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={50}>10PX</Font>
                            </div>
                            <div className="bg-orange-500/30 h-8 w-px" />
                            <div className="bg-white/20 w-24 h-4" />
                          </div>

                          <div className="flex flex-col gap-0">
                            <div className="bg-orange-500/30 w-full h-px" />
                            <div className="bg-orange-500/10 h-[50px] flex items-center justify-center">
                              <Font variant="sub-tiny" color="orange" weight="black" scale={75}>50PX GAP</Font>
                            </div>
                            <div className="bg-orange-500/30 w-full h-px" />
                          </div>
                          
                          <div className="flex flex-col gap-0">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <React.Fragment key={i}>
                                <div className="bg-white/5 w-full h-16 flex flex-col overflow-hidden">
                                  <div className="bg-blue-500/20 h-4 w-full shrink-0 flex items-center justify-center">
                                    <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                  </div>
                                  <div className="bg-blue-500/30 w-full h-px" />
                                  
                                  <div className="flex flex-row gap-0 flex-1">
                                    <div className="bg-blue-500/20 w-5 h-full shrink-0 flex items-center justify-center">
                                      <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                    </div>
                                    <div className="bg-blue-500/30 h-full w-px" />

                                    <div className="flex-1 flex items-center">
                                      <div className="bg-white/10 w-4 h-4 shrink-0" />
                                      <div className="bg-orange-500/30 h-4 w-px" />
                                      <div className="bg-orange-500/20 w-2.5 h-4 flex items-center justify-center">
                                        <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={40}>10PX</Font>
                                      </div>
                                      <div className="bg-orange-500/30 h-4 w-px" />
                                      <div className="bg-white/10 w-16 h-2.5" />
                                    </div>
                                    
                                    <div className="bg-blue-500/30 h-full w-px" />
                                    <div className="bg-blue-500/20 w-5 h-full shrink-0 flex items-center justify-center">
                                      <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                    </div>
                                  </div>

                                  <div className="bg-blue-500/30 w-full h-px" />
                                  <div className="bg-blue-500/20 h-4 w-full shrink-0 flex items-center justify-center">
                                    <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                  </div>
                                </div>
                                {i < 5 && (
                                  <div className="flex flex-col gap-0">
                                    <div className="bg-orange-500/30 w-full h-px" />
                                    <div className="bg-orange-500/20 h-2.5 flex items-center justify-center">
                                      <Font variant="sub-tiny" color="orange" weight="black" scale={75}>10PX</Font>
                                    </div>
                                    <div className="bg-orange-500/30 w-full h-px" />
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>

                          <div className="flex flex-col gap-0 flex-1 justify-end">
                            <div className="bg-white/10 w-full h-px" />
                            <div className="flex flex-col gap-0">
                              <div className="bg-orange-500/30 w-full h-px" />
                              <div className="bg-orange-500/20 h-5 flex items-center justify-center">
                                <Font variant="sub-tiny" color="orange" weight="black" scale={75}>20PX</Font>
                              </div>
                              <div className="bg-orange-500/30 w-full h-px" />
                            </div>

                            <div className="p-0">
                              <div className="flex flex-col gap-0">
                                <div className="flex flex-row items-center gap-0">
                                  <div className="bg-white/10 w-10 h-10 shrink-0" />
                                  <div className="bg-orange-500/30 h-10 w-px" />
                                  <div className="bg-orange-500/20 w-5 h-10 flex items-center justify-center">
                                    <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={50}>20PX</Font>
                                  </div>
                                  <div className="bg-orange-500/30 h-10 w-px" />

                                  <div className="flex-1">
                                    <div className="flex flex-col gap-0">
                                      <div className="bg-white/20 w-full h-3" />
                                      <div className="bg-orange-500/30 w-full h-px" />
                                      <div className="bg-orange-500/20 h-2.5 flex items-center justify-center">
                                        <Font variant="sub-tiny" color="orange" weight="black" scale={40}>10PX</Font>
                                      </div>
                                      <div className="bg-orange-500/30 w-full h-px" />
                                      <div className="bg-white/5 w-2/3 h-2" />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-0">
                                  <div className="bg-orange-500/30 w-full h-px" />
                                  <div className="bg-orange-500/20 h-5 flex items-center justify-center">
                                    <Font variant="sub-tiny" color="orange" weight="black" scale={75}>20PX</Font>
                                  </div>
                                  <div className="bg-orange-500/30 w-full h-px" />
                                </div>

                                <div className="flex flex-row gap-0">
                                  <div className="flex-1 bg-white/10 h-8 flex items-center justify-center">
                                    <Font variant="sub-tiny" color="white" weight="black" scale={50}>CONFIG</Font>
                                  </div>
                                  <div className="bg-orange-500/30 h-8 w-px" />
                                  <div className="bg-orange-500/20 w-5 h-8 flex items-center justify-center">
                                    <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={50}>20PX</Font>
                                  </div>
                                  <div className="bg-orange-500/30 h-8 w-px" />

                                  <div className="flex-1 bg-white/10 h-8 flex items-center justify-center">
                                    <Font variant="sub-tiny" color="white" weight="black" scale={50}>SAIR</Font>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-500/30 h-full w-px" />
                        <div className="bg-blue-500/20 w-5 shrink-0 flex items-center justify-center">
                          <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                        </div>
                      </div>

                      <div className="bg-blue-500/30 w-full h-px" />
                      <div className="bg-blue-500/20 h-5 w-full shrink-0 flex items-center justify-center">
                        <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                      </div>
                    </div>
                    <div className="bg-white/10 h-full w-px" />
                  </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="flex-1 bg-zinc-950 flex flex-col overflow-auto relative">
                  <div className="bg-blue-500/20 h-5 w-full shrink-0 flex items-center justify-center">
                    <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                  </div>
                  <div className="bg-blue-500/30 w-full h-px" />

                  <div className="flex flex-row gap-0 flex-1">
                    <div className="bg-blue-500/20 w-5 shrink-0 flex items-center justify-center">
                      <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                    </div>
                    <div className="bg-blue-500/30 h-full w-px" />

                    <div className="flex-1 p-0">
                      <div className="flex flex-col gap-0">
                        <div className="flex flex-row items-center gap-0">
                          <div className="bg-orange-500 w-16 h-16 shrink-0" />
                          <div className="bg-orange-500/30 h-16 w-px" />
                          <div className="bg-orange-500/20 w-5 h-16 flex items-center justify-center">
                            <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                          </div>
                          <div className="bg-orange-500/30 h-16 w-px" />
                          <div className="flex flex-col gap-0">
                            <div className="bg-white/20 w-48 h-6" />
                            <div className="bg-orange-500/30 w-full h-px" />
                            <div className="bg-orange-500/20 w-full h-2.5 flex items-center justify-center">
                              <Font variant="sub-tiny" color="orange" weight="black" scale={75}>10PX</Font>
                            </div>
                            <div className="bg-orange-500/30 w-full h-px" />
                            <div className="bg-white/10 w-32 h-4" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-0">
                          <div className="bg-orange-500/10 w-full h-px" />
                          <div className="bg-orange-500/5 h-[100px] flex items-center justify-center">
                            <Font variant="sub-tiny" color="orange" weight="black">100PX VERTICAL GAP</Font>
                          </div>
                          <div className="bg-orange-500/10 w-full h-px" />
                        </div>

                        <div className="flex flex-col gap-0">
                          <div className="bg-white/20 w-64 h-8" />
                          <div className="flex flex-col gap-0">
                            <div className="bg-orange-500/10 w-full h-px" />
                            <div className="bg-orange-500/10 h-[50px] flex items-center justify-center">
                              <Font variant="sub-tiny" color="orange" weight="black">50PX TITLE-TO-CONTENT GAP</Font>
                            </div>
                            <div className="bg-orange-500/10 w-full h-px" />
                          </div>
                          
                          <div className="flex flex-row gap-0 items-stretch">
                            {[1, 2, 3].map((i) => (
                              <React.Fragment key={i}>
                                <div className="flex-1 bg-zinc-900 border border-white/10 flex flex-col overflow-hidden">
                                  <div className="bg-blue-500/20 h-5 w-full flex items-center justify-center">
                                    <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                  </div>
                                  <div className="bg-blue-500/10 w-full h-px" />
                                  <div className="flex flex-row gap-0 flex-1">
                                    <div className="bg-blue-500/20 w-5 h-full flex items-center justify-center">
                                      <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                    </div>
                                    <div className="bg-blue-500/10 h-full w-px" />
                                    
                                    <div className="flex-1 p-0 flex flex-col">
                                      <div className="bg-white/5 w-full h-4" />
                                      <div className="flex flex-col gap-0">
                                        <div className="bg-orange-500/30 w-full h-px" />
                                        <div className="bg-orange-500/10 h-5 flex items-center justify-center">
                                          <Font variant="sub-tiny" color="orange" weight="black" scale={50}>20PX</Font>
                                        </div>
                                        <div className="bg-orange-500/30 w-full h-px" />
                                      </div>
                                      <div className="bg-white/5 w-2/3 h-4" />
                                    </div>

                                    <div className="bg-blue-500/10 h-full w-px" />
                                    <div className="bg-blue-500/20 w-5 h-full flex items-center justify-center">
                                      <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={50}>20PX</Font>
                                    </div>
                                  </div>
                                  <div className="bg-blue-500/10 w-full h-px" />
                                  <div className="bg-blue-500/20 h-5 w-full flex items-center justify-center">
                                    <Font variant="sub-tiny" color="blue" weight="black" scale={50}>20PX</Font>
                                  </div>
                                </div>
                                {i < 3 && (
                                  <div className="flex flex-row gap-0 shrink-0">
                                    <div className="bg-orange-500/30 h-full w-px" />
                                    <div className="bg-orange-500/20 w-5 flex items-center justify-center">
                                      <Font variant="sub-tiny" color="orange" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                                    </div>
                                    <div className="bg-orange-500/30 h-full w-px" />
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col gap-0">
                          <div className="bg-orange-500/10 w-full h-px" />
                          <div className="bg-orange-500/5 h-[100px] flex items-center justify-center">
                            <Font variant="sub-tiny" color="orange" weight="black">100PX VERTICAL GAP</Font>
                          </div>
                          <div className="bg-orange-500/10 w-full h-px" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/30 h-full w-px" />
                    <div className="bg-blue-500/20 w-5 shrink-0 flex items-center justify-center">
                      <Font variant="sub-tiny" color="blue" weight="black" rotate={90} scale={75} inlineBlock>20PX</Font>
                    </div>
                  </div>

                  <div className="bg-blue-500/30 w-full h-px" />
                  <div className="bg-blue-500/20 h-5 w-full shrink-0 flex items-center justify-center">
                    <Font variant="sub-tiny" color="blue" weight="black" scale={75}>20PX</Font>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Stack>
      </GlassPanel>
    </Stack>
  )
}

interface RadiusItemProps {
  label: string
  value: string
  rounded: 'system' | 'full' | 'none'
}

function RadiusItem({ label, value, rounded }: RadiusItemProps) {
  return (
    <div className={cn(
      "bg-orange-500 p-5 flex-1",
      rounded === 'system' && 'rounded-[5px]',
      rounded === 'full' && 'rounded-full',
      rounded === 'none' && 'rounded-none'
    )}>
      <Stack align="center" justify="center" gap={2.5}>
        <Font color="black" weight="black" variant="sub-tiny" uppercase italic>{label}</Font>
        <Font color="black" weight="bold" variant="body">{value}</Font>
      </Stack>
    </div>
  )
}
