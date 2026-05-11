'use client'

import React, { useEffect } from 'react'
import { useRegistry } from '../store/advanced/registry-context'

export function DynamicThemeManager() {
  const { primaryColor } = useRegistry()

  useEffect(() => {
    const root = document.documentElement
    
    const colors: Record<string, string> = {
      blue: '#3b82f6',
      red: '#ef4444',
      amber: '#f59e0b',
      emerald: '#10b981',
      orange: '#f97316',
      zinc: '#71717a'
    }

    const hex = colors[primaryColor] || colors.blue
    
    // Set global CSS variables
    root.style.setProperty('--primary-dynamic', hex)
    root.style.setProperty('--primary-dynamic-rgb', hexToRgb(hex))
    
    // Specifically for NProgress/TopLoader if it uses a class
    const styleId = 'dynamic-theme-overrides'
    let styleTag = document.getElementById(styleId) as HTMLStyleElement
    
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleId
      document.head.appendChild(styleTag)
    }
    
    styleTag.innerHTML = `
      #nprogress .bar {
        background: ${hex} !important;
        box-shadow: 0 0 10px ${hex}, 0 0 5px ${hex} !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px ${hex}, 0 0 5px ${hex} !important;
      }
      #nprogress .spinner-icon {
        border-top-color: ${hex} !important;
        border-left-color: ${hex} !important;
      }
    `
  }, [primaryColor])

  return null
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}
