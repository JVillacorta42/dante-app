'use client'

import { useEffect, useRef, useState } from 'react'
import { useAudio } from '@/lib/AudioContext'

const TRACKS = [
  { id: 1, name: 'Battle I',   src: '/battle/Battle1.mp3' },
  { id: 2, name: 'Battle II',  src: '/battle/Battle2.mp3' },
  { id: 3, name: 'Battle III', src: '/battle/Battle3.mp3' },
  { id: 4, name: 'Battle IV',  src: '/battle/Battle4.mp3' },
  { id: 5, name: 'Battle V',   src: '/battle/Battle5.mp3' },
]

const FADE_MS = 3000
const STEPS = 60

function fade(
  audio: HTMLAudioElement,
  fromVol: number,
  toVol: number,
  durationMs: number,
  onDone?: () => void
): () => void {
  let step = 0
  const stepTime = durationMs / STEPS
  const interval = setInterval(() => {
    step++
    const t = step / STEPS
    audio.volume = Math.min(1, Math.max(0, fromVol + (toVol - fromVol) * t))
    if (step >= STEPS) {
      clearInterval(interval)
      audio.volume = toVol
      onDone?.()
    }
  }, stepTime)
  return () => clearInterval(interval)
}

export default function BattleMusicPlayer() {
  const { audioElement, ambientVolumeRef, duckRef } = useAudio()
  const battleRef = useRef<HTMLAudioElement | null>(null)
  const cancelFadesRef = useRef<(() => void)[]>([])
  const [currentTrack, setCurrentTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.35)
  const mountedRef = useRef(true)

  function cancelAll() {
    cancelFadesRef.current.forEach((c) => c())
    cancelFadesRef.current = []
  }

  function loadTrack(idx: number, autoplay = true) {
    const battle = battleRef.current
    if (!battle) return
    battle.src = TRACKS[idx].src
    battle.currentTime = 0
    if (autoplay) battle.play().catch(() => {})
    setCurrentTrack(idx)
  }

  useEffect(() => {
    mountedRef.current = true
    const ambient = audioElement.current
    const battle = new Audio(TRACKS[0].src)
    battle.loop = false
    battle.volume = 0
    battle.currentTime = 0
    battleRef.current = battle

    battle.addEventListener('play', () => { if (mountedRef.current) setPlaying(true) })
    battle.addEventListener('pause', () => { if (mountedRef.current) setPlaying(false) })
    battle.addEventListener('ended', () => { if (mountedRef.current) goNext() })

    // Register duck function so narration can lower battle volume
    duckRef.current = (toVol: number, ms = 800) => {
      const b = battleRef.current
      if (!b) return
      fade(b, b.volume, toVol, ms)
    }

    // Start battle immediately at 0 volume
    battle.play().catch(() => {})

    // Fade ambient out, battle in — simultaneously
    if (ambient && !ambient.paused) {
      const ambientStart = ambient.volume
      const c1 = fade(ambient, ambientStart, 0, FADE_MS, () => { ambient.pause() })
      cancelFadesRef.current.push(c1)
    }
    const c2 = fade(battle, 0, volume, FADE_MS)
    cancelFadesRef.current.push(c2)

    return () => {
      mountedRef.current = false
      cancelAll()
      const b = battleRef.current
      if (b) {
        const battleVol = b.volume
        fade(b, battleVol, 0, 1500, () => b.pause())
      }
      // Fade ambient back in
      if (ambient) {
        const target = ambientVolumeRef.current
        ambient.volume = 0
        if (ambient.paused) ambient.play().catch(() => {})
        fade(ambient, 0, target, FADE_MS)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function goNext() {
    const next = (currentTrack + 1) % TRACKS.length
    cancelAll()
    loadTrack(next)
    setCurrentTrack(next)
  }

  function goPrev() {
    const prev = (currentTrack - 1 + TRACKS.length) % TRACKS.length
    cancelAll()
    loadTrack(prev)
    setCurrentTrack(prev)
  }

  function toggle() {
    const battle = battleRef.current
    if (!battle) return
    if (battle.paused) battle.play().catch(() => {})
    else battle.pause()
  }

  function handleVolume(v: number) {
    setVolumeState(v)
    if (battleRef.current) battleRef.current.volume = v
  }

  const track = TRACKS[currentTrack]

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-full"
      style={{
        backgroundColor: '#1a0505',
        border: '1px solid #5a1010',
        boxShadow: '0 0 20px #8b1a1a33',
      }}
    >
      {/* Prev */}
      <button
        onClick={goPrev}
        className="flex items-center justify-center w-6 h-6 transition-opacity hover:opacity-80"
        style={{ color: '#c9503a' }}
        title="Anterior"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <polygon points="11,1 4,6 11,11" />
          <rect x="1" y="1" width="2" height="10" rx="1" />
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        onClick={toggle}
        className="flex items-center justify-center w-7 h-7 rounded-full transition-opacity hover:opacity-80"
        style={{ color: '#c9503a' }}
        title={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? (
          <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="1" width="4" height="10" rx="1" />
            <rect x="7" y="1" width="4" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="1,1 11,6 1,11" />
          </svg>
        )}
      </button>

      {/* Next */}
      <button
        onClick={goNext}
        className="flex items-center justify-center w-6 h-6 transition-opacity hover:opacity-80"
        style={{ color: '#c9503a' }}
        title="Siguiente"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <polygon points="1,1 8,6 1,11" />
          <rect x="9" y="1" width="2" height="10" rx="1" />
        </svg>
      </button>

      {/* Track selector */}
      <select
        value={currentTrack}
        onChange={(e) => {
          const idx = parseInt(e.target.value)
          cancelAll()
          loadTrack(idx)
          setCurrentTrack(idx)
        }}
        className="text-xs font-mono cursor-pointer outline-none"
        style={{
          backgroundColor: '#1a0505',
          color: '#c9503a',
          border: 'none',
          minWidth: '5.5rem',
        }}
      >
        {TRACKS.map((t, i) => (
          <option key={t.id} value={i} style={{ backgroundColor: '#1a0505', color: '#c9503a' }}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Volume */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => handleVolume(parseFloat(e.target.value))}
        className="w-16 h-1 cursor-pointer"
        style={{ accentColor: '#c9503a' }}
        title="Volumen"
      />
    </div>
  )
}
