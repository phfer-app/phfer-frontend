"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Volume1, Minimize2, Radio } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAudio } from "@/components/audio-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function FloatingRadioPlayer() {
  const { t } = useLanguage()
  const { isPlaying, volume, setVolume, isMuted, setIsMuted, togglePlay } = useAudio()
  const isMobile = useIsMobile()
  const [isMinimized, setIsMinimized] = useState(true)
  const [mounted, setMounted] = useState(false)
  const hasLoadedFromStorage = useRef(false)
  const playerRef = useRef<HTMLDivElement>(null)

  // Marcar como montado após a hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Carregar e gerenciar estado de minimização do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // No mobile, sempre ocultar
    if (isMobile) {
      setIsMinimized(true)
      return
    }
    
    // Em desktop, carregar preferência salva
    if (!hasLoadedFromStorage.current) {
      const savedMinimized = localStorage.getItem("radio-minimized")
      if (savedMinimized !== null) {
        setIsMinimized(savedMinimized === "true")
      }
      hasLoadedFromStorage.current = true
    }
  }, [isMobile])

  // Salvar estado de minimização no localStorage quando mudar (apenas em desktop)
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return
    if (isMobile) return
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
    if (!mounted) return <Volume2 className="h-4 w-4" />
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  // Renderizar minimizado como um botão flutuante circular
  if (isMinimized) {
    return (
      <div className="fixed bottom-8 left-8 z-40">
        <button
          onClick={() => {
            setIsMinimized(false)
          }}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
          title="Abrir rádio"
        >
          <Radio className="h-6 w-6" />
        </button>
      </div>
    )
  }

  // Se for mobile, renderizar player em modal/overlay
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end">
        <div className="w-full bg-card border border-border/50 rounded-t-sm shadow-2xl p-4 backdrop-blur-sm max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold">{t("blog.radio_title")}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsMinimized(true)
                }}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1 hover:bg-primary/10 border border-transparent rounded-sm transition-colors cursor-pointer"
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
                className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-sm w-12 h-12 flex items-center justify-center transition-all shadow-lg cursor-pointer"
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
                className="p-1.5 hover:bg-primary/10 border border-transparent rounded-sm transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {getVolumeIcon()}
              </button>
              <div className="flex-1 relative h-2">
                {/* Background track */}
                <div className="absolute top-0 left-0 w-full h-2 rounded-sm bg-muted/80 border border-border" />
                {/* Progress indicator */}
                <div
                  className="absolute top-0 left-0 h-2 rounded-sm pointer-events-none bg-primary"
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
                  className="absolute top-0 left-0 w-full h-2 rounded-sm appearance-none cursor-pointer volume-slider z-10 opacity-0"
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

  return (
    <div
      ref={playerRef}
      className="fixed z-50 w-80 bottom-8 left-8"
    >
      <div className="bg-card border border-border/50 rounded-sm shadow-2xl p-4 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold">{t("blog.radio_title")}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsMinimized(true)
              }}
              onTouchStart={(e) => e.stopPropagation()}
              className="p-1 hover:bg-primary/10 border border-transparent rounded-sm transition-colors cursor-pointer"
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
              className="bg-primary hover:bg-primary/80 text-primary-foreground rounded-sm w-12 h-12 flex items-center justify-center transition-all shadow-lg cursor-pointer"
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
              className="p-1.5 hover:bg-primary/10 border border-transparent rounded-sm transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>
            <div className="flex-1 relative h-2">
              {/* Background track */}
              <div className="absolute top-0 left-0 w-full h-2 rounded-sm bg-muted/80 border border-border" />
              {/* Progress indicator */}
              <div
                className="absolute top-0 left-0 h-2 rounded-sm pointer-events-none bg-primary"
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
                className="absolute top-0 left-0 w-full h-2 rounded-sm appearance-none cursor-pointer volume-slider z-10 opacity-0"
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

