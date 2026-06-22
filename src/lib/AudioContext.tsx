'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

interface AudioContextType {
  playing: boolean
  volume: number
  toggle: () => void
  setVolume: (v: number) => void
  startIfPaused: () => void
  audioElement: React.MutableRefObject<HTMLAudioElement | null>
  ambientVolumeRef: React.MutableRefObject<number>
  duckRef: React.MutableRefObject<((vol: number, ms?: number) => void) | null>
}

const AudioCtx = createContext<AudioContextType>({
  playing: false,
  volume: 0.35,
  toggle: () => {},
  setVolume: () => {},
  startIfPaused: () => {},
  audioElement: { current: null },
  ambientVolumeRef: { current: 0.35 },
  duckRef: { current: null },
})

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ambientVolumeRef = useRef(0.35)
  const duckRef = useRef<((vol: number, ms?: number) => void) | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.35)

  useEffect(() => {
    const audio = new Audio('https://github.com/JVillacorta42/dante-app/releases/download/v1.0/Ambiente.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    const startRandom = () => {
      if (audio.duration > 0) {
        audio.currentTime = Math.random() * audio.duration * 0.8
      }
      audio.play().catch(() => {})
    }

    if (audio.readyState >= 1) {
      startRandom()
    } else {
      audio.addEventListener('loadedmetadata', startRandom, { once: true })
    }

    const onInteract = () => { if (audio.paused) startRandom() }
    document.addEventListener('click', onInteract, { once: true })
    document.addEventListener('keydown', onInteract, { once: true })

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      document.removeEventListener('click', onInteract)
      document.removeEventListener('keydown', onInteract)
      audio.pause()
    }
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      if (audio.currentTime === 0 && audio.duration > 0) {
        audio.currentTime = Math.random() * audio.duration * 0.8
      }
      audio.play()
    } else {
      audio.pause()
    }
  }

  function setVolume(v: number) {
    setVolumeState(v)
    ambientVolumeRef.current = v
    if (audioRef.current) audioRef.current.volume = v
  }

  function startIfPaused() {
    const audio = audioRef.current
    if (!audio || !audio.paused) return
    if (audio.duration > 0) {
      audio.currentTime = Math.random() * audio.duration * 0.8
    }
    audio.play().catch(() => {})
  }

  return (
    <AudioCtx.Provider value={{ playing, volume, toggle, setVolume, startIfPaused, audioElement: audioRef, ambientVolumeRef, duckRef }}>
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudio() {
  return useContext(AudioCtx)
}
