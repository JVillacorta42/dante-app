'use client'

import Link from 'next/link'
import { getAllCircles } from '@/lib/content'

interface ParagraphContentProps {
  content: string
  circleSlug: string
}

// Build a lookup map from paragraph ID to circle slug for cross-circle links
let paragraphCircleMap: Record<string, string> | null = null

function getParagraphCircleMap(): Record<string, string> {
  if (paragraphCircleMap) return paragraphCircleMap
  const map: Record<string, string> = {}
  const circles = getAllCircles()
  for (const circle of circles) {
    for (const para of circle.paragraphs) {
      map[para.id] = circle.slug
    }
  }
  paragraphCircleMap = map
  return map
}

function resolveLink(paragraphId: string, currentCircleSlug: string): string {
  const map = getParagraphCircleMap()
  const targetSlug = map[paragraphId] ?? currentCircleSlug
  return `/${targetSlug}/${paragraphId}`
}

interface ContentPart {
  type: 'text' | 'link'
  content: string
  target?: string
}

function parseContent(content: string, circleSlug: string): ContentPart[] {
  const parts: ContentPart[] = []
  // Match paragraph references: 3 digits optionally followed by -Letter
  // e.g. 001, 001-A, 016-B
  const pattern = /\b(\d{3}(?:-[A-Z])?)\b/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(content)) !== null) {
    const [fullMatch, paragraphId] = match
    const start = match.index

    // Add text before the match
    if (start > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, start) })
    }

    // Check if this looks like a paragraph reference (not a random number)
    // We'll include it as a link if the ID exists in our map
    const map = getParagraphCircleMap()
    if (map[paragraphId]) {
      parts.push({
        type: 'link',
        content: paragraphId,
        target: resolveLink(paragraphId, circleSlug),
      })
    } else {
      parts.push({ type: 'text', content: fullMatch })
    }

    lastIndex = start + fullMatch.length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return parts
}

export default function ParagraphContent({ content, circleSlug }: ParagraphContentProps) {
  if (!content) {
    return null
  }

  // Split into paragraphs by newline
  const paragraphs = content.split('\n').filter((line) => line !== undefined)

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, pIdx) => {
        if (!paragraph.trim()) {
          return <div key={pIdx} className="h-2" />
        }

        const parts = parseContent(paragraph, circleSlug)

        const isFirst = pIdx === 0
        const firstPart = isFirst && parts.length > 0 ? parts[0] : null
        const dropCapLetter = isFirst && firstPart?.type === 'text' && firstPart.content.length > 0
          ? firstPart.content[0]
          : null
        const firstPartRest = dropCapLetter !== null && firstPart
          ? { ...firstPart, content: firstPart.content.slice(1) }
          : null

        return (
          <p
            key={pIdx}
            className="leading-relaxed"
            style={{ color: '#e8d5b0', fontSize: '1.05rem', lineHeight: '1.75' }}
          >
            {dropCapLetter && (
              <span
                style={{
                  float: 'left',
                  fontSize: '4.2rem',
                  lineHeight: '0.8',
                  marginRight: '0.1em',
                  marginTop: '0.05em',
                  fontFamily: 'Georgia, serif',
                  color: '#c9a87a',
                  fontWeight: 'bold',
                }}
              >
                {dropCapLetter}
              </span>
            )}
            {(dropCapLetter ? [firstPartRest!, ...parts.slice(1)] : parts).map((part, partIdx) => {
              if (!part) return null
              if (part.type === 'link' && part.target) {
                return (
                  <Link
                    key={partIdx}
                    href={part.target}
                    className="paragraph-link"
                    title={`Ir al párrafo ${part.content}`}
                  >
                    {part.content}
                  </Link>
                )
              }
              return <span key={partIdx}>{part.content}</span>
            })}
          </p>
        )
      })}
    </div>
  )
}
