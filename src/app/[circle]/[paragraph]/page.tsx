'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import {
  getCircle,
  getParagraph,
  getNextParagraph,
  getPrevParagraph,
  findParagraph,
} from '@/lib/content'
import { saveProgress } from '@/lib/progress'
import ParagraphContent from '@/components/ParagraphContent'

const CIRCLE_COLORS: Record<string, string> = {
  I: '#c9a84c',
  II: '#d4556a',
  III: '#8b9650',
  IV: '#c47c3a',
  V: '#7b3f3f',
  VI: '#5a4a7a',
  VII: '#3a6b5a',
  VIII: '#6b5a3a',
  IX: '#4a4a6b',
}

interface PageProps {
  params: Promise<{ circle: string; paragraph: string }>
}

export default function ParagraphPage({ params }: PageProps) {
  const { circle: circleSlug, paragraph: paragraphId } = use(params)

  const circle = getCircle(circleSlug)
  const paragraph = getParagraph(circleSlug, paragraphId)
  const nextPara = getNextParagraph(circleSlug, paragraphId)
  const prevPara = getPrevParagraph(circleSlug, paragraphId)

  // Save progress when page loads
  useEffect(() => {
    if (circle && paragraph) {
      saveProgress(circle.id, paragraph.id)
    }
  }, [circle, paragraph])

  if (!circle || !paragraph) {
    // Try to find the paragraph in other circles
    const found = findParagraph(paragraphId)
    if (found) {
      return (
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: '#0d0a08' }}
        >
          <div className="text-center p-8">
            <p style={{ color: '#9e8a6a' }} className="mb-4">
              Este párrafo pertenece a{' '}
              <span style={{ color: '#c9a84c' }}>{found.circle.name}</span>
            </p>
            <Link
              href={`/${found.circle.slug}/${paragraphId}`}
              className="py-2 px-4 rounded inline-block"
              style={{ backgroundColor: '#8b1a1a', color: '#e8d5b0' }}
            >
              Ir al párrafo {paragraphId}
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0d0a08' }}
      >
        <div className="text-center p-8">
          <p className="text-2xl mb-4" style={{ color: '#8b1a1a' }}>
            Párrafo no encontrado
          </p>
          <p className="text-sm mb-6" style={{ color: '#6b5a3a' }}>
            Párrafo {paragraphId} no existe en {circleSlug}
          </p>
          <Link href={`/${circleSlug}`} style={{ color: '#c9a84c', textDecoration: 'underline' }}>
            ← Volver al círculo
          </Link>
        </div>
      </div>
    )
  }

  const accentColor = CIRCLE_COLORS[circle.id] ?? '#c9a84c'

  return (
    <div className="min-h-screen relative">
      {/* Force body background transparent so video shows through */}
      <style>{`body { background-color: transparent !important; }`}</style>

      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="https://github.com/JVillacorta42/dante-app/releases/download/1.0/bg.mp4" type="video/mp4" />
      </video>
      {/* Semi-transparent dark overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1, backgroundColor: 'rgba(13, 10, 8, 0.20)' }}
      />
      {/* Top navigation bar */}
      <nav
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: '#0d0a08e8',
          borderBottom: '1px solid #1a1410',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Link
          href={`/${circleSlug}`}
          className="text-sm hover:underline transition-colors"
          style={{ color: '#9e8a6a' }}
        >
          ← {circle.name}
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono px-2 py-1 rounded"
            style={{
              color: accentColor,
              backgroundColor: `${accentColor}1a`,
              border: `1px solid ${accentColor}44`,
            }}
          >
            {circle.id} · {paragraph.id}
          </span>
        </div>

        {/* Prev/Next navigation */}
        <div className="flex items-center gap-2">
          {prevPara ? (
            <Link
              href={`/${circleSlug}/${prevPara.id}`}
              className="text-sm px-2 py-1 rounded hover:opacity-80 transition-opacity"
              style={{ color: '#9e8a6a' }}
              title={`Anterior: ${prevPara.id}`}
            >
              ‹ {prevPara.id}
            </Link>
          ) : (
            <span className="text-sm px-2 py-1 opacity-30" style={{ color: '#6b5a3a' }}>
              ‹
            </span>
          )}
          {nextPara ? (
            <Link
              href={`/${circleSlug}/${nextPara.id}`}
              className="text-sm px-2 py-1 rounded hover:opacity-80 transition-opacity"
              style={{ color: '#9e8a6a' }}
              title={`Siguiente: ${nextPara.id}`}
            >
              {nextPara.id} ›
            </Link>
          ) : (
            <span className="text-sm px-2 py-1 opacity-30" style={{ color: '#6b5a3a' }}>
              ›
            </span>
          )}
        </div>
      </nav>

      {/* Paragraph content */}
      <article className="max-w-2xl mx-auto px-4 py-12 relative" style={{ zIndex: 2 }}>
        {/* Paragraph ID badge */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="text-sm font-mono px-3 py-1 rounded"
            style={{
              color: accentColor,
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}33`,
            }}
          >
            § {paragraph.id}
          </div>
          <div className="h-px flex-1" style={{ backgroundColor: '#2d1f0f' }} />
        </div>

        {/* Paragraph image */}
        {paragraph.image && (
          <div className="w-full max-w-sm mx-auto mb-8" style={{ position: 'relative' }}>
            <img
              src={`/images/${paragraph.image}`}
              className="w-full"
              style={{
                maskImage: `
                  linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%),
                  linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)
                `,
                WebkitMaskImage: `
                  linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%),
                  linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)
                `,
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
                borderRadius: '1.5rem',
              }}
            />
          </div>
        )}

        {/* Title */}
        {paragraph.title && (
          <h1
            className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-8 text-center"
            style={{
              color: accentColor,
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.1em',
              textShadow: `0 0 20px ${accentColor}44`,
            }}
          >
            {paragraph.title}
          </h1>
        )}

        {/* Content */}
        <div className="prose max-w-none" style={{ color: '#e8d5b0' }}>
          <ParagraphContent content={paragraph.content} circleSlug={circleSlug} />
        </div>

        {/* Divider before choices */}
        {paragraph.choices.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-10" style={{ color: '#4a2010' }}>
              <div className="h-px flex-1" style={{ backgroundColor: '#2d1f0f' }} />
              <span
                className="text-sm uppercase tracking-widest"
                style={{ color: '#6b5a3a' }}
              >
                ELIGE TU CAMINO
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: '#2d1f0f' }} />
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {paragraph.choices.map((choice) => {
                const targetFound = findParagraph(choice.target)
                const targetCircleSlug = targetFound ? targetFound.circle.slug : circleSlug

                return (
                  <Link
                    key={choice.label}
                    href={`/${targetCircleSlug}/${choice.target}`}
                    className="flex items-start gap-4 p-4 rounded-lg group transition-all duration-300"
                    style={{
                      backgroundColor: '#1a1410',
                      border: `1px solid #2d1f0f`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = accentColor
                      e.currentTarget.style.backgroundColor = `${accentColor}15`
                      e.currentTarget.style.boxShadow = `0 0 15px ${accentColor}22`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2d1f0f'
                      e.currentTarget.style.backgroundColor = '#1a1410'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <span
                      className="font-mono text-sm font-bold shrink-0 pt-0.5"
                      style={{ color: accentColor, minWidth: '3.5rem' }}
                    >
                      {choice.label}
                    </span>
                    <span className="text-sm leading-relaxed" style={{ color: '#c8b08a' }}>
                      {choice.text}
                    </span>
                    <span
                      className="ml-auto shrink-0 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: accentColor }}
                    >
                      →
                    </span>
                  </Link>
                )
              })}
            </div>
          </>
        )}

        {/* Bottom navigation */}
        <div
          className="flex justify-between mt-16 pt-8"
          style={{ borderTop: '1px solid #1a1410' }}
        >
          <div>
            {prevPara && (
              <Link
                href={`/${circleSlug}/${prevPara.id}`}
                className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: '#9e8a6a' }}
              >
                ← {prevPara.id}
                {prevPara.title && (
                  <span className="hidden sm:inline text-xs" style={{ color: '#6b5a3a' }}>
                    {prevPara.title.slice(0, 30)}
                  </span>
                )}
              </Link>
            )}
          </div>
          <div className="text-right">
            {nextPara && (
              <Link
                href={`/${circleSlug}/${nextPara.id}`}
                className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
                style={{ color: '#9e8a6a' }}
              >
                {nextPara.title && (
                  <span className="hidden sm:inline text-xs" style={{ color: '#6b5a3a' }}>
                    {nextPara.title.slice(0, 30)}
                  </span>
                )}
                {nextPara.id} →
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
