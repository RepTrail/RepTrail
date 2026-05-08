'use client'

import { useEffect } from 'react'

export function ShineManager() {
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      
      // Ensure the target has relative positioning and hidden overflow for the effect
      const originalPosition = window.getComputedStyle(target).position
      if (originalPosition === 'static') {
        target.style.position = 'relative'
      }
      target.style.overflow = 'hidden'

      // Create shine container
      const container = document.createElement('div')
      container.className = 'shine-container'
      
      // Create shine line
      const line = document.createElement('div')
      line.className = 'shine-line'
      
      container.appendChild(line)
      target.appendChild(container)
      
      // Store the container reference to remove it later
      target.dataset.shineActive = 'true'
    }

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
      const container = target.querySelector('.shine-container')
      if (container) {
        container.remove()
      }
      delete target.dataset.shineActive
    }

    // Function to attach listeners to all buttons
    const attachListeners = () => {
      const buttons = document.querySelectorAll('button, [role="button"]')
      buttons.forEach(button => {
        // Avoid duplicate listeners
        if ((button as any)._shineAttached) return
        
        button.addEventListener('mouseenter', handleMouseEnter as any)
        button.addEventListener('mouseleave', handleMouseLeave as any)
        ;(button as any)._shineAttached = true
      })
    }

    // Initial attachment
    attachListeners()

    // Observe DOM changes to attach to new buttons
    const observer = new MutationObserver(() => {
      attachListeners()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
      const buttons = document.querySelectorAll('button, [role="button"]')
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', handleMouseEnter as any)
        button.removeEventListener('mouseleave', handleMouseLeave as any)
        delete (button as any)._shineAttached
      })
    }
  }, [])

  return null
}
