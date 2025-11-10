"use client"

import { useState, useRef, useEffect } from "react"
import { Linkedin, Play, Pause, Volume2, VolumeX, Volume1 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/components/language-provider"
import { useAudio } from "@/components/audio-context"
import { SectionCorners } from "@/components/section-corners"

export function BlogSection() {
  const { t } = useLanguage()

  return (
    <section className="relative py-24 overflow-hidden">
      <SectionCorners />
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-background via-background to-primary/5" />

      {/* Animated blobs - Padrão em espiral */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-primary/15 rounded-full blur-3xl opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-primary/12 rounded-full blur-3xl opacity-25" />
      <div className="absolute top-2/3 right-1/3 w-[400px] h-[400px] bg-secondary/12 rounded-full blur-3xl opacity-25" />
      
      {/* Círculos animados em espiral */}
      <div className="absolute top-1/4 right-1/5 w-28 h-28 border border-primary/20 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/5 w-24 h-24 border border-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-primary/15 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/2 right-1/3 w-16 h-16 border border-secondary/15 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-2/3 left-1/5 w-18 h-18 border border-primary/15 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-2 md:px-4 relative z-10 max-w-[95%]">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30" variant="outline">
            {t("blog.badge")}
          </Badge>
          <h2 className="text-2xl font-bold mb-2 text-balance">
            {t("blog.title")} <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{t("blog.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {t("blog.description")}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-12">
          {/* LinkedIn Container - Left (takes 2/3 width) */}
          <Card className="p-8 md:p-12 bg-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Linkedin className="h-8 w-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold mb-4">
                  {t("blog.linkedin_title")}
                </h2>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  {t("blog.linkedin_description")}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                <a
                  href="https://www.linkedin.com/in/initpedro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Linkedin className="h-5 w-5" />
                  {t("blog.view_linkedin")}
                </a>
              </Button>
            </div>
          </Card>

          {/* Info Container - Right (takes 1/3 width) */}
          <Card className="p-6 md:p-8 bg-card border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                  <span className="text-xl">💡</span>
                </div>
                <h2 className="text-base md:text-lg font-bold mb-3">
                  {t("blog.content_title")}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t("blog.content_description")}
                </p>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  <p className="text-xs text-muted-foreground">
                    {t("blog.topic1")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  <p className="text-xs text-muted-foreground">
                    {t("blog.topic2")}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                  <p className="text-xs text-muted-foreground">
                    {t("blog.topic3")}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Message - Below containers */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-sm italic">
            {t("blog.coming_soon")} {t("blog.radio_message")}
          </p>
        </div>

        {/* Radio Player Container */}
        <Card className="p-6 md:p-8 bg-card border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
          <RadioPlayer />
        </Card>
      </div>
    </section>
  )
}

function RadioPlayer() {
  const { t } = useLanguage()
  const { audio, isPlaying, setIsPlaying, volume, setVolume, isMuted, setIsMuted } = useAudio()
  const [mounted, setMounted] = useState(false)

  // Marcar como montado após a hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  const togglePlay = () => {
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((err) => {
        console.error("Error playing audio:", err)
      })
    }
  }

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
    if (!mounted) return <Volume2 className="h-5 w-5" />
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />
    return <Volume2 className="h-5 w-5" />
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Radio Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg">📻</span>
        </div>
        <div>
          <h3 className="text-lg font-bold">{t("blog.radio_title")}</h3>
          <p className="text-xs text-muted-foreground">{t("blog.radio_subtitle")}</p>
        </div>
      </div>


      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 p-0 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 cursor-pointer" />
          ) : (
            <Play className="h-5 w-5 cursor-pointer" />
          )}
        </Button>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {getVolumeIcon()}
          </button>
          <div className="flex-1 relative h-3">
            {/* Background track - always visible (gray) */}
            <div className="absolute top-0 left-0 w-full h-3 rounded-lg bg-muted/80 border border-border" />
            {/* Progress indicator - colored part (shows volume percentage) */}
            <div
              className="absolute top-0 left-0 h-3 rounded-lg pointer-events-none bg-primary"
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
              className="absolute top-0 left-0 w-full h-3 rounded-lg appearance-none cursor-pointer volume-slider z-10 opacity-0"
            />
          </div>
          <span className="text-xs text-muted-foreground w-10 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
        <span>{isPlaying ? t("blog.radio_playing") : t("blog.radio_paused")}</span>
      </div>
    </div>
  )
}

