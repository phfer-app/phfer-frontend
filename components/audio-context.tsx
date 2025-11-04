"use client"

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react"

interface AudioContextType {
  audio: HTMLAudioElement | null
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  volume: number
  setVolume: (volume: number) => void
  isMuted: boolean
  setIsMuted: (muted: boolean) => void
  togglePlay: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const radioUrl = "https://stream.truesecurity.com.br/8014/stream/"

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(radioUrl)
      audioRef.current.volume = volume
      audioRef.current.preload = "none"
    }

    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleVolumeChange = () => {
      if (audio) {
        setVolume(audio.volume)
        setIsMuted(audio.muted)
      }
    }

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("volumechange", handleVolumeChange)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("volumechange", handleVolumeChange)
    }
  }, [radioUrl])

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err)
      })
    }
  }, [isPlaying])

  return (
    <AudioContext.Provider
      value={{
        audio: audioRef.current,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        togglePlay,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

