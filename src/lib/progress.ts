'use client'

const STORAGE_KEY = 'dante-inferno-progress'

export interface CircleProgress {
  currentParagraph: string
  visited: string[]
  lastUpdated: string
}

export interface Progress {
  [circleId: string]: CircleProgress
}

export function getProgress(): Progress {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Progress
  } catch {
    return {}
  }
}

export function saveProgress(circleId: string, paragraphId: string): void {
  if (typeof window === 'undefined') return
  try {
    const progress = getProgress()
    const existing = progress[circleId]
    const visited = existing ? [...new Set([...existing.visited, paragraphId])] : [paragraphId]
    progress[circleId] = {
      currentParagraph: paragraphId,
      visited,
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // silently fail if localStorage is unavailable
  }
}

export function getCircleProgress(circleId: string): CircleProgress | null {
  const progress = getProgress()
  return progress[circleId] ?? null
}

export function resetProgress(circleId: string): void {
  if (typeof window === 'undefined') return
  try {
    const progress = getProgress()
    delete progress[circleId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // silently fail
  }
}
