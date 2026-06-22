'use client'

import { useAudio } from '@/lib/AudioContext'

export default function MusicPlayer() {
  const { playing, volume, toggle, setVolume } = useAudio()

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{ backgroundColor: '#1a0c04', border: '1px solid #3a2010' }}
    >
      <button
        onClick={toggle}
        className="flex items-center justify-center w-6 h-6 rounded-full transition-colors hover:opacity-80"
        style={{ color: '#c9a84c' }}
        title={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="1" width="4" height="10" rx="1" />
            <rect x="7" y="1" width="4" height="10" rx="1" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="1,1 11,6 1,11" />
          </svg>
        )}
      </button>

      <span className="text-xs" style={{ color: '#6b5a3a' }}>♪</span>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-16 h-1 cursor-pointer"
        style={{ accentColor: '#c9a84c' }}
        title="Volumen"
      />
    </div>
  )
}
