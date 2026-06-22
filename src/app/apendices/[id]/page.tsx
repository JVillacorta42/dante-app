'use client'

import { use } from 'react'
import Link from 'next/link'
import apendicesData from '@/data/apendices_data.json'

const CIRCLE_COLORS: Record<string, string> = {
  I:    '#c9a84c',
  II:   '#d4556a',
  III:  '#8b9650',
  IV:   '#c47c3a',
  V:    '#8b2a2a',
  VI:   '#5a3a7a',
  VII:  '#7a2a2a',
  VIII: '#4a6a5a',
  IX:   '#1a2a4a',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ApendiceEntryPage({ params }: PageProps) {
  const { id: slug } = use(params)
  const entryId = slug.replace('-', ':')
  const entry = apendicesData.entries.find((e) => e.id === entryId)

  const circle = entryId.split(':')[0]
  const color = CIRCLE_COLORS[circle] ?? '#c9a84c'

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0d0a08' }}>
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: '#8b1a1a' }}>Apéndice no encontrado</p>
          <Link href="/apendices" style={{ color: '#c9a84c', textDecoration: 'underline' }}>
            ← Volver a Apéndices
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <video
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundColor: 'rgba(13,10,8,0.82)' }} />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Back nav */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1410' }}>
          <Link href="/apendices" className="text-sm hover:underline" style={{ color: '#9e8a6a' }}>
            ← Volver a Apéndices
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Entry ID */}
          <div
            className="text-5xl font-bold text-center mb-4"
            style={{
              color,
              fontFamily: 'Georgia, serif',
              textShadow: `0 0 30px ${color}66`,
            }}
          >
            {entry.id}
          </div>

          {/* Title */}
          <h1
            className="text-2xl uppercase text-center tracking-widest mb-12"
            style={{ color: '#e8d5b0', letterSpacing: '0.25em' }}
          >
            {entry.title}
          </h1>

          {/* Divider */}
          <div
            className="mx-auto mb-12"
            style={{ width: 60, height: 1, backgroundColor: `${color}66` }}
          />

          {/* Body text */}
          <div className="flex flex-col gap-6">
            {entry.body.map((para, i) => (
              <p
                key={i}
                className="text-base leading-relaxed"
                style={{
                  color: '#c8b89a',
                  fontFamily: 'Georgia, serif',
                  textIndent: '1.5em',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="mt-16 text-center">
            <Link
              href="/apendices"
              className="text-sm hover:underline"
              style={{ color: '#6b5a3a' }}
            >
              ← Volver a Apéndices
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
