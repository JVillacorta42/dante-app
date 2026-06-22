'use client'

import Link from 'next/link'

interface CircleCardProps {
  id: string
  name: string
  slug: string
  paragraphCount: number
  index: number
}

const CIRCLE_DESCRIPTIONS: Record<string, string> = {
  limbo: 'Los grandes de la antigüedad, sin bautismo ni fe',
  lujuria: 'Azotados por vientos eternos por sus pasiones carnales',
  gula: 'Revolcados en el lodo bajo lluvia perpetua',
  avaricia: 'Condenados a hacer girar pesos sin fin',
  ira: 'Hundidos en la ciénaga del río Estigia',
  herejia: 'Encerrados en tumbas ardientes por sus falsas creencias',
  violencia: 'Sumergidos en ríos de sangre hirviente',
  fraude: 'Castigados en las diez fosas del Malebolge',
  traicion: 'Atrapados en el hielo eterno del Cocito',
}

const ROMAN_COLORS = [
  '#c9a84c', // I
  '#d4556a', // II
  '#8b9650', // III
  '#c47c3a', // IV
  '#7b3f3f', // V
  '#5a4a7a', // VI
  '#3a6b5a', // VII
  '#6b5a3a', // VIII
  '#4a4a6b', // IX
]

export default function CircleCard({ id, name, slug, paragraphCount, index }: CircleCardProps) {
  const color = ROMAN_COLORS[index] ?? '#c9a84c'
  const description = CIRCLE_DESCRIPTIONS[slug] ?? ''

  return (
    <Link href={`/${slug}`}>
      <div
        className="group relative cursor-pointer rounded-lg border p-6 transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: '#1a1410',
          borderColor: '#2d1f0f',
          minHeight: '180px',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = color
          el.style.boxShadow = `0 0 20px ${color}44, 0 0 40px ${color}22`
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = '#2d1f0f'
          el.style.boxShadow = 'none'
        }}
      >
        {/* Roman numeral */}
        <div
          className="text-4xl font-bold mb-2 leading-none"
          style={{ color, fontFamily: 'Georgia, serif', textShadow: `0 0 12px ${color}88` }}
        >
          {id}
        </div>

        {/* Circle name */}
        <div
          className="text-xl font-bold uppercase tracking-widest mb-3"
          style={{ color: '#e8d5b0', letterSpacing: '0.15em' }}
        >
          {name}
        </div>

        {/* Description */}
        <div className="text-sm mb-4" style={{ color: '#9e8a6a', fontStyle: 'italic', lineHeight: '1.5' }}>
          {description}
        </div>

        {/* Paragraph count */}
        <div
          className="text-xs uppercase tracking-wider absolute bottom-4 right-4"
          style={{ color: '#6b5a3a' }}
        >
          {paragraphCount} párrafos
        </div>

        {/* Arrow indicator */}
        <div
          className="absolute bottom-4 left-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color }}
        >
          → Explorar
        </div>
      </div>
    </Link>
  )
}
