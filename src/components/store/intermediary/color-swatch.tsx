import React from 'react'
import { Box } from '../base/box'
import { Font } from '../base/font'
import { Stack } from '../base/stack'

interface ColorSwatchProps {
  name: string
  value: string
  bg: 'orange' | 'emerald' | 'red' | 'blue' | 'brand-accent'
}

export function ColorSwatch({ name, value, bg }: ColorSwatchProps) {
  return (
    <Box bg={bg} padding={5} rounded="system" overflow="hidden">
      <Stack gap={2.5}>
        <Font variant="label-caps" color="black">{name}</Font>
        <Font variant="sub-tiny" color="black">{value}</Font>
      </Stack>
    </Box>
  )
}