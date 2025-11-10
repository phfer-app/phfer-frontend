"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Volume1, Minimize2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAudio } from "@/components/audio-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function FloatingRadioPlayer() {
  const { t } = useLanguage()
  const { isPlaying, volume, setVolume, isMuted, setIsMuted, togglePlay } = useAudio()
  const isMobile = useIsMobile()
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 80 })
  const [mounted, setMounted] = useState(false)
  const hasLoadedFromStorage = useRef(false)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const playerRef = useRef<HTMLDivElement>(null)

  // Marcar como montado após a hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Carregar e gerenciar estado de minimização do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // No mobile, sempre minimizar (não salva preferência)
    if (isMobile) {
      setIsMinimized(true)
      return
    }
    
    // Em desktop, carregar preferência salva
    if (!hasLoadedFromStorage.current) {
      // Primeira carga: carregar do localStorage
      const savedMinimized = localStorage.getItem("radio-minimized")
      if (savedMinimized !== null) {
        setIsMinimized(savedMinimized === "true")
      }
      hasLoadedFromStorage.current = true
    } else {
      // Após primeira carga: quando volta para desktop, restaurar preferência
      const savedMinimized = localStorage.getItem("radio-minimized")
      if (savedMinimized !== null) {
        setIsMinimized(savedMinimized === "true")
      }
    }
  }, [isMobile])

  // Salvar estado de minimização no localStorage quando mudar (apenas em desktop)
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return
    if (isMobile) return // No mobile não salva, pois sempre é minimizado
    if (typeof window === "undefined") return
    
    localStorage.setItem("radio-minimized", isMinimized.toString())
  }, [isMinimized, isMobile])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const getVolumeIcon = () => {
    // Durante a hidratação, sempre retornar Volume2 para consistência
    // Após a montagem, usar o valor real do volume
    if (!mounted) return <Volume2 className="h-4 w-4" />
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  // Drag functionality for mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }

  // Drag functionality for touch (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('button, input')) return
    const touch = e.touches[0]
    setIsDragging(true)
    dragStartPos.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    }
    e.preventDefault() // Prevent scrolling while dragging
  }

  const updatePosition = (clientX: number, clientY: number) => {
    if (!playerRef.current) return

    const rect = playerRef.current.getBoundingClientRect()
    const playerWidth = rect.width
    const playerHeight = rect.height
    
    let newX = clientX - dragStartPos.current.x
    let newY = clientY - dragStartPos.current.y

    // Constrain to viewport bounds
    const maxX = window.innerWidth - playerWidth
    const maxY = window.innerHeight - playerHeight

    newX = Math.max(0, Math.min(newX, maxX))
    newY = Math.max(0, Math.min(newY, maxY))

    setPosition({
      x: newX,
      y: newY,
    })
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        updatePosition(touch.clientX, touch.clientY)
        e.preventDefault() // Prevent scrolling while dragging
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseup", handleMouseUp, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  if (isMinimized) {
    return (
      <div
        ref={playerRef}
        className="fixed z-50 cursor-move touch-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
          <button
            onClick={() => setIsMinimized(false)}
            onTouchStart={(e) => e.stopPropagation()}
            className="text-sm font-medium hover:opacity-80 transition-opacity"
          >
            {t("blog.radio_title")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={playerRef}
      className="fixed z-50 w-80 cursor-move touch-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="bg-card border-2 border-primary/30 rounded-lg shadow-2xl p-4 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📻</span>
            <h3 className="text-sm font-bold">{t("blog.radio_title")}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              onTouchStart={(e) => e.stopPropagation()}
              className="p-1 hover:bg-primary/10 rounded transition-colors cursor-pointer"
              aria-label="Minimize"
            >
              <Minimize2 className="h-4 w-4 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {/* Play/Pause Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={togglePlay}
              onTouchStart={(e) => e.stopPropagation()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 cursor-pointer" />
              ) : (
                <Play className="h-5 w-5 ml-0.5 cursor-pointer" />
              )}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              onTouchStart={(e) => e.stopPropagation()}
              className="p-1.5 hover:bg-primary/10 rounded transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>
            <div className="flex-1 relative h-2">
              {/* Background track */}
              <div className="absolute top-0 left-0 w-full h-2 rounded-lg bg-muted/80 border border-border" />
              {/* Progress indicator */}
              <div
                className="absolute top-0 left-0 h-2 rounded-lg pointer-events-none bg-primary"
                style={{
                  width: `${(isMuted ? 0 : volume) * 100}%`,
                  transition: 'width 0.1s ease',
                }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute top-0 left-0 w-full h-2 rounded-lg appearance-none cursor-pointer volume-slider z-10 opacity-0"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
            <span>{isPlaying ? t("blog.radio_playing") : t("blog.radio_paused")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

