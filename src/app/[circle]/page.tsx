'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { getCircle, getFirstParagraph, type Circle } from '@/lib/content'
import { getCircleProgress, resetProgress } from '@/lib/progress'

const ROMAN_NUMERALS: Record<string, { color: string; description: string }> = {
  I: {
    color: '#c9a84c',
    description: 'Los grandes de la antigüedad que vivieron sin conocer la fe cristiana',
  },
  II: {
    color: '#d4556a',
    description: 'Aquellos arrastrados eternamente por vientos tempestuosos por sus pasiones carnales',
  },
  III: {
    color: '#8b9650',
    description: 'Los glotones, hundidos en el lodo bajo lluvia eterna y granizo',
  },
  IV: {
    color: '#c47c3a',
    description: 'Avaros y pródigos condenados a hacer girar grandes pesos',
  },
  V: {
    color: '#7b3f3f',
    description: 'Los iracundos, sumergidos y golpeándose en la ciénaga del Estigia',
  },
  VI: {
    color: '#5a4a7a',
    description: 'Los herejes, encerrados en sepulcros ardientes por sus falsas creencias',
  },
  VII: {
    color: '#3a6b5a',
    description: 'Violentos contra el prójimo, contra sí mismos y contra Dios',
  },
  VIII: {
    color: '#6b5a3a',
    description: 'Los fraudulentos, castigados en las diez fosas del Malebolge',
  },
  IX: {
    color: '#4a4a6b',
    description: 'Los traidores, atrapados eternamente en el hielo del lago Cocito',
  },
}

interface PageProps {
  params: Promise<{ circle: string }>
}

export default function CirclePage({ params }: PageProps) {
  const { circle: circleSlug } = use(params)
  const circle = getCircle(circleSlug)
  const firstPara = getFirstParagraph(circleSlug)
  const [savedParagraph, setSavedParagraph] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (circle) {
      const progress = getCircleProgress(circle.id)
      if (progress) {
        setSavedParagraph(progress.currentParagraph)
      }
    }
  }, [circle])

  const searchResults = circle
    ? query.trim().length > 0
      ? circle.paragraphs.filter(
          (p) =>
            p.id.includes(query.trim()) ||
            p.title?.toLowerCase().includes(query.trim().toLowerCase()) ||
            p.content?.toLowerCase().includes(query.trim().toLowerCase())
        ).slice(0, 8)
      : []
    : []

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

  const info = ROMAN_NUMERALS[circle.id] ?? { color: '#c9a84c', description: '' }

  function handleReset() {
    if (confirm(`¿Reiniciar progreso en ${circle!.name}?`)) {
      resetProgress(circle!.id)
      setSavedParagraph(null)
    }
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
        <source src="https://github.com/JVillacorta42/dante-app/releases/download/v1.0/bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundColor: 'rgba(13,10,8,0.72)' }} />
      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
      {/* Back navigation */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1410' }}>
        <Link
          href="/"
          className="text-sm hover:underline transition-colors"
          style={{ color: '#9e8a6a' }}
        >
          ← Volver a los círculos
        </Link>
      </div>

      {/* Circle Header */}
      <div
        className="text-center py-14 px-4"
        style={{
          borderBottom: '1px solid #2d1f0f',
          background: `radial-gradient(ellipse at top, ${info.color}0a 0%, transparent 70%)`,
        }}
      >
        <div
          className="text-7xl font-bold mb-4"
          style={{
            color: info.color,
            fontFamily: 'Georgia, serif',
            textShadow: `0 0 30px ${info.color}66`,
          }}
        >
          {circle.id}
        </div>
        <h1
          className="text-4xl font-bold uppercase tracking-widest mb-4"
          style={{ color: '#e8d5b0', letterSpacing: '0.25em' }}
        >
          {circle.name}
        </h1>
        <p className="text-base italic max-w-lg mx-auto" style={{ color: '#9e8a6a' }}>
          {info.description}
        </p>
        <p className="text-sm mt-3" style={{ color: '#6b5a3a' }}>
          {circle.paragraphs.length} párrafos
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 py-8 max-w-xl mx-auto">
        {firstPara && (
          <Link
            href={`/${circleSlug}/${firstPara.id}`}
            className="flex-1 text-center py-3 px-6 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: info.color,
              color: '#0d0a08',
              boxShadow: `0 0 20px ${info.color}44`,
            }}
          >
            ▶ Comenzar desde el principio
          </Link>
        )}

        {savedParagraph && (
          <Link
            href={`/${circleSlug}/${savedParagraph}`}
            className="flex-1 text-center py-3 px-6 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#1a1410',
              color: info.color,
              border: `1px solid ${info.color}`,
            }}
          >
            ↺ Continuar: párrafo {savedParagraph}
          </Link>
        )}
      </div>

      {/* Apéndices button */}
      <div className="text-center mb-2">
        <Link
          href="/apendices"
          className="inline-block text-xs uppercase tracking-widest px-4 py-2 rounded transition-all duration-200 hover:scale-105"
          style={{
            color: '#9e8a6a',
            border: '1px solid #3a2a1a',
            letterSpacing: '0.2em',
          }}
        >
          📜 Apéndices
        </Link>
      </div>

      {/* Reset progress button */}
      {savedParagraph && (
        <div className="text-center mb-8">
          <button
            onClick={handleReset}
            className="text-xs hover:underline transition-colors"
            style={{ color: '#6b5a3a' }}
          >
            Reiniciar progreso
          </button>
        </div>
      )}

      {/* Paragraph Search */}
      <div className="max-w-xl mx-auto px-4 pb-8">
        <h2
          className="text-xs uppercase tracking-widest mb-4 text-center"
          style={{ color: '#6b5a3a', letterSpacing: '0.3em' }}
        >
          Buscar párrafo
        </h2>

        {/* Search input */}
        <div className="relative">
          <span
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
            style={{ color: '#6b5a3a' }}
          >
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Número (001) o título..."
            className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
            style={{
              backgroundColor: '#130a04',
              border: `1px solid ${query ? info.color + '66' : '#3a2010'}`,
              color: '#e8d5b0',
              fontFamily: 'Georgia, serif',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm hover:opacity-80"
              style={{ color: '#6b5a3a' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim().length > 0 && (
          <div className="mt-2 rounded-lg overflow-hidden" style={{ border: '1px solid #2d1a08' }}>
            {searchResults.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: '#6b5a3a' }}>
                Sin resultados
              </p>
            ) : (
              <div>
                {searchResults.map((para) => (
                  <Link
                    key={para.id}
                    href={`/${circleSlug}/${para.id}`}
                    className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                    style={{ borderBottom: '1px solid #1a0c04' }}
                  >
                    <span
                      className="text-sm font-mono w-14 shrink-0"
                      style={{ color: info.color }}
                    >
                      {para.id}
                    </span>
                    <span className="text-sm truncate" style={{ color: '#9e8a6a' }}>
                      {para.title || para.content.slice(0, 60) + '…'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Battle / Confrontation Section */}
      {circle.battle && (
        <div
          className="max-w-3xl mx-auto px-4 pb-16"
          style={{ borderTop: '1px solid #2d1010' }}
        >
          <div
            className="mt-10 rounded-xl p-8"
            style={{
              background: 'linear-gradient(135deg, #1a0505 0%, #0d0a08 100%)',
              border: '1px solid #5a1010',
              boxShadow: '0 0 40px #8b1a1a22',
            }}
          >
            {/* Battle header */}
            <h2
              className="text-2xl font-bold mb-6 uppercase tracking-widest text-center"
              style={{
                color: '#e8c0a0',
                fontFamily: 'Georgia, serif',
                textShadow: '0 0 20px #8b1a1a66',
                letterSpacing: '0.2em',
              }}
            >
              Enfrentamiento — {circle.name}
            </h2>

            <div className="flex justify-center">
              <Link
                href={`/${circleSlug}/battle`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: '#8b1a1a',
                  color: '#e8d5b0',
                  boxShadow: '0 0 20px #8b1a1a44',
                  border: '1px solid #c0302044',
                }}
              >
                Entrar al Enfrentamiento
              </Link>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
