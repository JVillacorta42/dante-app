'use client'

import { use, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { getCircle } from '@/lib/content'
import BattleMusicPlayer from '@/components/BattleMusicPlayer'
import { useAudio } from '@/lib/AudioContext'

interface PageProps {
  params: Promise<{ circle: string }>
}

export default function BattlePage({ params }: PageProps) {
  const { circle: circleSlug } = use(params)
  const circle = getCircle(circleSlug)

  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set())
  const [narrating, setNarrating] = useState(false)
  const narratorRef = useRef<HTMLAudioElement | null>(null)
  const { duckRef } = useAudio()

  function toggleNarration() {
    const audio = narratorRef.current
    if (!audio) return
    if (narrating) {
      audio.pause()
      audio.currentTime = 0
      setNarrating(false)
      duckRef.current?.(0.35, 1200)   // restore battle music
    } else {
      audio.play().then(() => {
        setNarrating(true)
        duckRef.current?.(0.07, 1200) // duck battle music
      }).catch(() => {})
    }
  }

  function handleNarrationEnd() {
    setNarrating(false)
    duckRef.current?.(0.35, 1200)     // restore battle music
  }

  useEffect(() => {
    document.body.classList.add('battle-mode')
    return () => document.body.classList.remove('battle-mode')
  }, [])

  if (!circle) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0d0a08' }}
      >
        <div className="text-center">
          <p className="text-2xl mb-4" style={{ color: '#8b1a1a' }}>
            Círculo no encontrado
          </p>
          <Link href="/" style={{ color: '#c9a84c', textDecoration: 'underline' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!circle.battle) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0d0a08' }}
      >
        <div className="text-center">
          <p className="text-2xl mb-4" style={{ color: '#8b1a1a' }}>
            No hay enfrentamiento en este círculo
          </p>
          <Link
            href={`/${circleSlug}`}
            style={{ color: '#c9a84c', textDecoration: 'underline' }}
          >
            ← Volver al círculo
          </Link>
        </div>
      </div>
    )
  }

  const battle = circle.battle

  function toggleScene(id: string) {
    setExpandedScenes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen relative">
      <style>{`body { background-color: transparent !important; }`}</style>
      {/* Background video */}
      <video
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="https://github.com/JVillacorta42/dante-app/releases/download/v1.0/bg_battle.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundColor: 'rgba(13,10,8,0.25)' }} />

      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
      {/* Top bar: back + battle music player */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: '#0d0508e8',
          borderBottom: '1px solid #3a0808',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Link
          href={`/${circleSlug}`}
          className="text-sm hover:underline transition-colors"
          style={{ color: '#9e8a6a' }}
        >
          ← Volver a {circle.name}
        </Link>
        <BattleMusicPlayer />
      </div>

      {/* Hero: Boss image + name */}
      <div
        className="relative text-center"
        style={{
          borderBottom: '1px solid #3a0808',
        }}
      >
        {battle.boss_image && (
          <div className="w-full max-w-2xl mx-auto">
            <img
              src={`/images/${battle.boss_image}`}
              className="w-full"
              style={{
                maskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                  linear-gradient(to bottom, transparent 0%, black 3%, black 70%, transparent 100%)`,
                WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                  linear-gradient(to bottom, transparent 0%, black 3%, black 70%, transparent 100%)`,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }}
            />
          </div>
        )}

        <div
          className="py-10 px-4"
          style={
            battle.boss_image
              ? { marginTop: battle.boss_image ? '-6rem' : '0', position: 'relative', zIndex: 1 }
              : { paddingTop: '4rem' }
          }
        >
          <h1
            className="text-4xl md:text-5xl font-bold uppercase tracking-widest"
            style={{
              color: '#e8c0a0',
              fontFamily: 'Georgia, serif',
              textShadow: '0 0 40px #8b1a1a88, 0 2px 4px #000',
              letterSpacing: '0.15em',
            }}
          >
            Enfrentamiento
          </h1>
        </div>
      </div>

      {/* Intro narrative */}
      {battle.intro && (
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Narration audio + button */}
          <audio
            ref={narratorRef}
            src={`https://github.com/JVillacorta42/dante-app/releases/download/v1.0/batalla_${circleSlug}.mp3`}
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
            {battle.intro.split('\n').map((line, i) => (
              <p
                key={i}
                className="leading-relaxed mb-4 text-base"
                style={{ color: '#c8b08a', fontFamily: 'Georgia, serif' }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Setup instructions */}
      {battle.setup && battle.setup.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 pb-6">
          <div
            className="rounded-lg p-6"
            style={{
              backgroundColor: '#130a04',
              border: '1px solid #3a2010',
            }}
          >
            <h2
              className="text-xs uppercase tracking-widest mb-4 font-bold"
              style={{ color: '#c47c3a', letterSpacing: '0.3em' }}
            >
              Preparación
            </h2>
            <ul className="space-y-3">
              {battle.setup.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: '#c47c3a', marginTop: '2px', flexShrink: 0 }}>▸</span>
                  <span className="text-sm leading-relaxed" style={{ color: '#9e8a6a' }}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Rules note image (image17 — board image after NOTA del Trono) */}
      {battle.rules_note_image && (
        <div className="max-w-2xl mx-auto px-4 pb-10">
          <img
            src={`/images/${battle.rules_note_image}`}
            className="w-full rounded-lg"
            style={{
              border: '1px solid #3a1010',
              boxShadow: '0 0 20px #8b1a1a22',
              maskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)`,
              WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)`,
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
              opacity: 0.9,
            }}
          />
        </div>
      )}

      {/* Scenes / Conclusions */}
      {battle.scenes && battle.scenes.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ backgroundColor: '#3a0808' }} />
            <h2
              className="text-xs uppercase tracking-widest font-bold"
              style={{ color: '#8b1a1a', letterSpacing: '0.4em' }}
            >
              Escenas / Conclusiones
            </h2>
            <div className="h-px flex-1" style={{ backgroundColor: '#3a0808' }} />
          </div>

          <p className="text-xs text-center mb-8" style={{ color: '#6b5a3a' }}>
            Estas escenas se revelan durante o después del combate. Pulsa para expandir.
          </p>

          <div className="space-y-3">
            {battle.scenes.map((scene, idx) => {
              const isExpanded = expandedScenes.has(scene.id)
              const isFinal = scene.type === 'final'
              const isAdditional = scene.type === 'additional'

              // Derive label and accent color based on scene type
              const sceneLabel = isFinal
                ? 'ESCENA FINAL'
                : isAdditional
                ? 'ESCENA ADICIONAL'
                : `ESCENA ${idx + 1}`

              const accentColor = isFinal
                ? '#8b1a1a'
                : isAdditional
                ? '#a07820'
                : '#6b4a2a'

              const bgColor = isFinal
                ? '#1a0505'
                : isAdditional
                ? '#130e02'
                : '#110805'

              const borderColor = isFinal
                ? '#8b1a1a'
                : isAdditional
                ? '#7a5c10'
                : '#2d1008'

              const textColor = isFinal
                ? '#e8c0a0'
                : isAdditional
                ? '#e8d090'
                : '#c8a070'

              const contentColor = isFinal
                ? '#c8b08a'
                : isAdditional
                ? '#c8be80'
                : '#9e8a6a'

              return (
                <div
                  key={scene.id}
                  className="rounded-lg overflow-hidden transition-all duration-300"
                  style={{
                    border: `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    boxShadow: (isFinal || isAdditional) && isExpanded ? `0 0 30px ${accentColor}33` : 'none',
                  }}
                >
                  {/* Scene header - always visible, click to expand */}
                  <button
                    onClick={() => toggleScene(scene.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-mono"
                        style={{ color: accentColor }}
                      >
                        {sceneLabel}
                      </span>
                      <span
                        className="font-bold uppercase tracking-wide text-sm"
                        style={{
                          color: textColor,
                          fontFamily: 'Georgia, serif',
                        }}
                      >
                        {scene.title}
                      </span>
                    </div>
                    <span
                      className="text-lg transition-transform duration-300"
                      style={{
                        color: accentColor,
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        display: 'inline-block',
                      }}
                    >
                      ▾
                    </span>
                  </button>

                  {/* Scene content - collapsible */}
                  {isExpanded && (
                    <div
                      className="px-5 pb-6"
                      style={{ borderTop: `1px solid ${borderColor}` }}
                    >
                      {/* Image BEFORE content (default) */}
                      {scene.image && scene.image_position !== 'after_content' && (
                        <div className="mt-4 mb-4 rounded overflow-hidden">
                          <img
                            src={`/images/${scene.image}`}
                            className="w-full rounded"
                            style={{
                              border: `1px solid ${borderColor}`,
                              maskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                                linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)`,
                              WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                                linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)`,
                              maskComposite: 'intersect',
                              WebkitMaskComposite: 'source-in',
                            }}
                          />
                        </div>
                      )}

                      {/* Scene content */}
                      {scene.content && (
                        <div className="mt-4 space-y-3">
                          {scene.content.split('\n').map((line, i) => (
                            <p
                              key={i}
                              className="text-sm leading-relaxed"
                              style={{
                                color: contentColor,
                                fontFamily: 'Georgia, serif',
                              }}
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Image AFTER content */}
                      {scene.image && scene.image_position === 'after_content' && (
                        <div className="mt-6 rounded overflow-hidden">
                          <img
                            src={`/images/${scene.image}`}
                            className="w-full rounded"
                            style={{
                              border: `1px solid ${borderColor}`,
                              maskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                                linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)`,
                              WebkitMaskImage: `linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%),
                                linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)`,
                              maskComposite: 'intersect',
                              WebkitMaskComposite: 'source-in',
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
