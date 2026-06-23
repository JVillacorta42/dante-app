'use client'

import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getCircle, getExtraBattle } from '@/lib/content'
import BattleMusicPlayer from '@/components/BattleMusicPlayer'
import { useAudio } from '@/lib/AudioContext'

interface PageProps {
  params: Promise<{ circle: string; bossSlug: string }>
}

export default function ExtraBattlePage({ params }: PageProps) {
  const { circle: circleSlug, bossSlug } = use(params)
  const circle = getCircle(circleSlug)
  const battle = getExtraBattle(circleSlug, bossSlug)
  const [narrating, setNarrating] = useState(false)
  const narratorRef = useRef<HTMLAudioElement | null>(null)
  const bgVideoRef = useRef<HTMLVideoElement>(null)
  const { duckRef } = useAudio()

  useEffect(() => {
    const v = bgVideoRef.current
    if (!v) return
    const id = setInterval(() => {
      if (v.paused || v.ended) { v.currentTime = 0; v.play().catch(() => {}) }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  function toggleNarration() {
    const audio = narratorRef.current
    if (!audio) return
    if (narrating) {
      audio.pause(); audio.currentTime = 0; setNarrating(false)
      duckRef.current?.(0.35, 1200)
    } else {
      audio.play().then(() => { setNarrating(true); duckRef.current?.(0.07, 1200) }).catch(() => {})
    }
  }
  function handleNarrationEnd() { setNarrating(false); duckRef.current?.(0.35, 1200) }

  useEffect(() => {
    document.body.classList.add('battle-mode')
    return () => document.body.classList.remove('battle-mode')
  }, [])

  if (!circle || !battle) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0a08' }}>
        <div className="text-center">
          <p className="text-2xl mb-4" style={{ color: '#8b1a1a' }}>Enfrentamiento no encontrado</p>
          <Link href="/" style={{ color: '#c9a84c', textDecoration: 'underline' }}>← Volver al inicio</Link>
        </div>
      </div>
    )
  }

  const maskStyle = {
    maskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
      linear-gradient(to bottom, transparent 0%, black 3%, black 70%, transparent 100%)`,
    WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
      linear-gradient(to bottom, transparent 0%, black 3%, black 70%, transparent 100%)`,
    maskComposite: 'intersect' as const,
    WebkitMaskComposite: 'source-in' as const,
  }

  return (
    <div className="min-h-screen relative">
      <style>{`body { background-color: transparent !important; }`}</style>
      <video
        ref={bgVideoRef}
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="https://github.com/JVillacorta42/dante-app/releases/download/1.0/bg_battle.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundColor: 'rgba(13,10,8,0.25)' }} />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Top bar */}
        <div
          className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
          style={{ backgroundColor: '#0d0508e8', borderBottom: '1px solid #3a0808', backdropFilter: 'blur(8px)' }}
        >
          <Link href={`/${circleSlug}`} className="text-sm hover:underline transition-colors" style={{ color: '#9e8a6a' }}>
            ← Volver a {circle.name}
          </Link>
          <BattleMusicPlayer />
        </div>

        {/* Hero: Boss image + name */}
        <div className="relative text-center" style={{ borderBottom: '1px solid #3a0808' }}>
          {battle.boss_image && (
            <div className="w-full max-w-2xl mx-auto">
              <img src={`/images/${battle.boss_image}`} className="w-full" style={maskStyle} />
            </div>
          )}
          <div
            className="py-10 px-4"
            style={battle.boss_image ? { marginTop: '-6rem', position: 'relative', zIndex: 1 } : { paddingTop: '4rem' }}
          >
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8b1a1a', letterSpacing: '0.4em' }}>
              Confrontación Especial
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold uppercase tracking-widest"
              style={{ color: '#e8c0a0', fontFamily: 'Georgia, serif', textShadow: '0 0 40px #8b1a1a88, 0 2px 4px #000', letterSpacing: '0.15em' }}
            >
              {battle.boss_name}
            </h1>
          </div>
        </div>

        {/* Intro narrative */}
        {battle.intro && (
          <div className="max-w-2xl mx-auto px-4 py-10">
            <audio
              ref={narratorRef}
              src={`https://github.com/JVillacorta42/dante-app/releases/download/1.0/batalla_${bossSlug}.mp3`}
              onEnded={handleNarrationEnd}
            />
            <div className="flex justify-center mb-8">
              <button
                onClick={toggleNarration}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: narrating ? '#3a0808' : 'transparent',
                  border: `1px solid ${narrating ? '#8b1a1a' : '#3a1a0a'}`,
                  color: narrating ? '#c97070' : '#9e8a6a',
                  letterSpacing: '0.2em',
                  boxShadow: narrating ? '0 0 16px #8b1a1a44' : 'none',
                }}
              >
                {narrating ? '■ Detener narración' : '▶ Escuchar narración'}
              </button>
            </div>
            <div className="prose max-w-none">
              {battle.intro.split('\n\n').map((para, i) => (
                <p key={i} className="leading-relaxed mb-4 text-base" style={{ color: '#c8b08a', fontFamily: 'Georgia, serif' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Setup scenes */}
        {battle.scenes && battle.scenes.length > 0 && (
          <div className="max-w-2xl mx-auto px-4 pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ backgroundColor: '#3a0808' }} />
              <h2 className="text-xs uppercase tracking-widest font-bold" style={{ color: '#8b1a1a', letterSpacing: '0.4em' }}>
                Preparación del Escenario
              </h2>
              <div className="h-px flex-1" style={{ backgroundColor: '#3a0808' }} />
            </div>
            {battle.scenes.map((scene, idx) => (
              <div key={idx} className="rounded-lg p-5 mb-4" style={{ backgroundColor: '#130a04', border: '1px solid #3a2010' }}>
                {scene.rules_image && (
                  <div className="mb-4">
                    <img src={`/images/${scene.rules_image}`} className="w-full rounded" style={{ border: '1px solid #3a1010', opacity: 0.9 }} />
                  </div>
                )}
                <ul className="space-y-3">
                  {scene.paragraphs.map((line, i) => (
                    <li key={i} className="flex gap-3">
                      <span style={{ color: '#c47c3a', marginTop: '2px', flexShrink: 0 }}>▸</span>
                      <span className="text-sm leading-relaxed" style={{ color: '#9e8a6a' }}>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Outro / Result scene */}
        {battle.outro && (
          <div className="max-w-2xl mx-auto px-4 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ backgroundColor: '#3a0808' }} />
              <h2 className="text-xs uppercase tracking-widest font-bold" style={{ color: '#8b1a1a', letterSpacing: '0.4em' }}>
                Escena — Embarque Forzoso
              </h2>
              <div className="h-px flex-1" style={{ backgroundColor: '#3a0808' }} />
            </div>
            <div className="rounded-lg p-5 mb-6" style={{ backgroundColor: '#0d0505', border: '1px solid #5a1010' }}>
              {battle.outro.split('\n\n').map((para, i) => (
                <p key={i} className="leading-relaxed mb-4 text-sm" style={{ color: '#c8b08a', fontFamily: 'Georgia, serif' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Outro instructions */}
        {battle.outro_instructions && (
          <div className="max-w-2xl mx-auto px-4 pb-16">
            <div className="rounded-lg p-5" style={{ backgroundColor: '#130a04', border: '1px solid #3a2010' }}>
              <h3 className="text-xs uppercase tracking-widest mb-4 font-bold" style={{ color: '#c47c3a', letterSpacing: '0.3em' }}>
                Desmontaje y Continuación
              </h3>
              <ul className="space-y-3">
                {battle.outro_instructions.split('\n\n').map((line, i) => (
                  <li key={i} className="flex gap-3">
                    <span style={{ color: '#c47c3a', marginTop: '2px', flexShrink: 0 }}>▸</span>
                    <span className="text-sm leading-relaxed" style={{ color: '#9e8a6a' }}>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
