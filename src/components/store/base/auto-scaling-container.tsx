'use client'

import React, { useRef, useEffect, useState } from 'react'

export function AutoScalingContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const observer = new ResizeObserver(() => {
      if (!containerRef.current || !contentRef.current) return
      
      // Remove a transformação temporariamente para medir o tamanho intrínseco real
      contentRef.current.style.transform = 'none'
      
      const containerWidth = containerRef.current.offsetWidth
      const contentWidth = contentRef.current.scrollWidth

      if (contentWidth > containerWidth && containerWidth > 0) {
        setScale(containerWidth / contentWidth)
      } else {
        setScale(1)
      }
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div 
        ref={containerRef} 
        className="flex-1 min-w-0 w-full flex items-center overflow-hidden"
    >
      <div 
        ref={contentRef} 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'left center',
          width: 'max-content',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {children}
      </div>
    </div>
  )
}
