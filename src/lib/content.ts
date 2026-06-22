import contentData from '@/data/content.json'

export interface Choice {
  label: string
  text: string
  target: string
}

export interface Paragraph {
  id: string
  title: string
  image?: string
  content: string
  choices: Choice[]
}

export interface BattleScene {
  id: string
  title: string
  type: 'scene' | 'final' | 'additional'
  image?: string | null
  image_position?: 'before_content' | 'after_content'
  content: string
}

export interface Battle {
  boss_name: string
  boss_image?: string | null
  intro: string
  setup: string[]
  rules_note?: string
  rules_note_image?: string | null
  scenes: BattleScene[]
}

export interface Circle {
  id: string
  name: string
  slug: string
  paragraphs: Paragraph[]
  battle?: Battle
}

export interface Content {
  circles: Circle[]
}

const data = contentData as unknown as Content

export function getAllCircles(): Circle[] {
  return data.circles
}

export function getCircle(slug: string): Circle | undefined {
  return data.circles.find((c) => c.slug === slug)
}

export function getParagraph(circleSlug: string, paragraphId: string): Paragraph | undefined {
  const circle = getCircle(circleSlug)
  if (!circle) return undefined
  return circle.paragraphs.find((p) => p.id === paragraphId)
}

export function findParagraph(paragraphId: string): { circle: Circle; paragraph: Paragraph } | null {
  for (const circle of data.circles) {
    const paragraph = circle.paragraphs.find((p) => p.id === paragraphId)
    if (paragraph) {
      return { circle, paragraph }
    }
  }
  return null
}

export function getFirstParagraph(circleSlug: string): Paragraph | undefined {
  const circle = getCircle(circleSlug)
  if (!circle || circle.paragraphs.length === 0) return undefined
  return circle.paragraphs[0]
}

export function getNextParagraph(circleSlug: string, currentId: string): Paragraph | undefined {
  const circle = getCircle(circleSlug)
  if (!circle) return undefined
  const idx = circle.paragraphs.findIndex((p) => p.id === currentId)
  if (idx < 0 || idx >= circle.paragraphs.length - 1) return undefined
  return circle.paragraphs[idx + 1]
}

export function getPrevParagraph(circleSlug: string, currentId: string): Paragraph | undefined {
  const circle = getCircle(circleSlug)
  if (!circle) return undefined
  const idx = circle.paragraphs.findIndex((p) => p.id === currentId)
  if (idx <= 0) return undefined
  return circle.paragraphs[idx - 1]
}
