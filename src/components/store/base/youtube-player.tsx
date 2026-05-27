import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface YouTubePlayerProps {
  videoId: string
  className?: string
  iframeClassName?: string
}

declare global {
  interface Window {
    YT: any;
  }
}

export function YouTubePlayer({ videoId, className, iframeClassName }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [showThumb, setShowThumb] = useState(true)

  // Extract video ID if a full URL is provided
  const extractVideoId = (urlOrId: string) => {
    if (!urlOrId) return ''
    const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)
    return match ? match[1] : urlOrId
  }
  
  const parsedId = extractVideoId(videoId)

  useEffect(() => {
    if (!parsedId || !containerRef.current) return

    const initPlayer = () => {
      if (!containerRef.current) return
      
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: parsedId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          mute: 1,
          iv_load_policy: 3
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo()
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Hide thumb after 2.5 seconds to let the YouTube UI disappear completely
              setTimeout(() => setShowThumb(false), 2500)
            }
            if (event.data === window.YT.PlayerState.ENDED) {
              // Seek to 0 instead of native looping to prevent UI flash
              event.target.seekTo(0)
              event.target.playVideo()
            }
          }
        }
      })
    }

    // Load YT API script if not loaded
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      } else {
        document.head.appendChild(tag)
      }
    }

    // Poll until YT API is ready
    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT)
        if (!playerRef.current) {
          initPlayer()
        }
      }
    }, 100)

    return () => {
      clearInterval(checkYT)
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [parsedId])

  if (!parsedId) return null

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-zinc-950", className)}>
      {/* Thumbnail Cover to hide YouTube UI on load */}
      <div 
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 transition-opacity duration-1000 bg-zinc-950", 
          iframeClassName || "w-[110%] h-[110%]"
        )}
        style={{ opacity: showThumb ? 1 : 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={`https://img.youtube.com/vi/${parsedId}/maxresdefault.jpg`} 
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actual Player */}
      <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none", iframeClassName || "w-[110%] h-[110%]")}>
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  )
}
