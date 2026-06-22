'use client'

import Image from 'next/image'
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

function getColor(id: string) {
  const circle = id.split(':')[0]
  return CIRCLE_COLORS[circle] ?? '#c9a84c'
}

export default function ApendicesPage() {
  const entries = apendicesData.entries

  return (
    <div className="min-h-screen relative">
      <video
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="https://github.com/JVillacorta42/dante-app/releases/download/1.0/bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundColor: 'rgba(13,10,8,0.80)' }} />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Back nav */}
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #1a1410' }}>
          <Link href="/" className="text-sm hover:underline" style={{ color: '#9e8a6a' }}>
            ← Volver a los círculos
          </Link>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Header image */}
          <div className="flex justify-center mb-8">
            <div className="relative" style={{ width: 280, height: 280 }}>
              <Image
                src="/images/apendices.png"
                alt="Apéndices"
                fill
                className="object-contain"
                style={{ filter: 'drop-shadow(0 0 24px #c9a84c44)' }}
              />
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center text-3xl uppercase tracking-widest mb-2"
            style={{ color: '#e8d5b0', fontFamily: 'Georgia, serif', letterSpacing: '0.3em' }}
          >
            Apéndices
          </h1>
          <p className="text-center text-sm mb-10" style={{ color: '#6b5a3a', letterSpacing: '0.2em' }}>
            Recuerdos del Infierno
          </p>

          {/* Entry buttons */}
          <div className="flex flex-col gap-3">
            {entries.map((entry) => {
              const color = getColor(entry.id)
              const slug = entry.id.replace(':', '-')
              return (
                <Link
                  key={entry.id}
                  href={`/apendices/${slug}`}
                  className="flex items-center gap-5 px-5 py-4 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: '#0d0a08',
                    border: `1px solid ${color}44`,
                    boxShadow: `inset 0 0 12px ${color}08`,
                  }}
                >
                  <span
                    className="text-2xl font-bold shrink-0"
                    style={{
                      color,
                      fontFamily: 'Georgia, serif',
                      minWidth: '4rem',
                      textShadow: `0 0 12px ${color}88`,
                    }}
                  >
                    {entry.id}
                  </span>
                  <span
                    className="text-sm uppercase tracking-wider"
                    style={{ color: '#c8b89a', letterSpacing: '0.15em' }}
                  >
                    {entry.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
