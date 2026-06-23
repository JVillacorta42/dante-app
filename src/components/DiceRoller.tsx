'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

// SVG burst icon (HeroQuest-style 8-pointed star burst)
function BurstSVG() {
  return (
    <svg viewBox="0 0 100 100" width="54" height="54" fill="white">
      <path d="M50,8 L57,38 L82,20 L67,46 L95,50 L67,54 L82,80 L57,62 L50,92 L43,62 L18,80 L33,54 L5,50 L33,46 L18,20 L43,38 Z" />
    </svg>
  )
}

function DoubleBurstSVG() {
  return (
    <svg viewBox="0 0 100 100" width="54" height="54" fill="white">
      <g transform="translate(-18,0) scale(0.65)">
        <path d="M50,8 L57,38 L82,20 L67,46 L95,50 L67,54 L82,80 L57,62 L50,92 L43,62 L18,80 L33,54 L5,50 L33,46 L18,20 L43,38 Z" />
      </g>
      <g transform="translate(18,0) scale(0.65)">
        <path d="M50,8 L57,38 L82,20 L67,46 L95,50 L67,54 L82,80 L57,62 L50,92 L43,62 L18,80 L33,54 L5,50 L33,46 L18,20 L43,38 Z" />
      </g>
    </svg>
  )
}

// HeroQuest-style skull SVG
function SkullSVG() {
  return (
    <svg viewBox="0 0 100 110" width="52" height="52" fill="white">
      {/* Cranium */}
      <ellipse cx="50" cy="44" rx="36" ry="34" fill="white" />
      {/* Eye sockets */}
      <ellipse cx="36" cy="44" rx="12" ry="14" fill="#b91c1c" />
      <ellipse cx="64" cy="44" rx="12" ry="14" fill="#b91c1c" />
      {/* Nose */}
      <polygon points="47,61 53,61 50,68" fill="#b91c1c" />
      {/* Jaw */}
      <rect x="24" y="70" width="52" height="22" rx="7" fill="white" />
      {/* Teeth gaps */}
      <rect x="24" y="70" width="2" height="22" rx="1" fill="#b91c1c" />
      <line x1="38" y1="70" x2="38" y2="92" stroke="#b91c1c" strokeWidth="3.5" />
      <line x1="50" y1="70" x2="50" y2="92" stroke="#b91c1c" strokeWidth="3.5" />
      <line x1="62" y1="70" x2="62" y2="92" stroke="#b91c1c" strokeWidth="3.5" />
      <rect x="74" y="70" width="2" height="22" rx="1" fill="#b91c1c" />
    </svg>
  )
}

// Face content
const FACES = [
  { type: 'burst1', icon: <BurstSVG /> },
  { type: 'burst2', icon: <DoubleBurstSVG /> },
  { type: 'burst1', icon: <BurstSVG /> },
  { type: 'burst2', icon: <DoubleBurstSVG /> },
  { type: 'skull', icon: <SkullSVG /> },
  { type: 'skull', icon: <SkullSVG /> },
]

// Final rotation to show each face facing the viewer
const FACE_ROTATIONS = [
  { x: 0, y: 0 },      // front → 1 burst
  { x: 0, y: 180 },    // back → 2 bursts
  { x: 0, y: -90 },   // right → 1 burst
  { x: 0, y: 90 },    // left → 2 bursts
  { x: 90, y: 0 },    // top → skull
  { x: -90, y: 0 },   // bottom → skull
]

const FACE_SIZE = 70

interface DieState {
  id: number
  faceIndex: number
  rotX: number
  rotY: number
  transition: boolean
}

function Die({ state }: { state: DieState }) {
  const transform = `rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`
  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: FACE_SIZE,
    height: FACE_SIZE,
    backgroundColor: '#b91c1c',
    border: '2px solid #7f1d1d',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    boxShadow: 'inset 0 0 12px rgba(0,0,0,0.4)',
  }
  const half = FACE_SIZE / 2

  return (
    <div
      style={{
        width: FACE_SIZE,
        height: FACE_SIZE,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform,
        transition: state.transition ? 'transform 1.4s cubic-bezier(0.15, 0.85, 0.3, 1)' : 'none',
      }}
    >
      {/* Front */}
      <div style={{ ...faceStyle, transform: `translateZ(${half}px)` }}>{FACES[0].icon}</div>
      {/* Back */}
      <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${half}px)` }}>{FACES[1].icon}</div>
      {/* Right */}
      <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${half}px)` }}>{FACES[2].icon}</div>
      {/* Left */}
      <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${half}px)` }}>{FACES[3].icon}</div>
      {/* Top */}
      <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${half}px)` }}>{FACES[4].icon}</div>
      {/* Bottom */}
      <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${half}px)` }}>{FACES[5].icon}</div>
    </div>
  )
}

function resultSummary(dice: DieState[]) {
  let bursts1 = 0, bursts2 = 0, skulls = 0
  for (const d of dice) {
    const t = FACES[d.faceIndex].type
    if (t === 'burst1') bursts1++
    else if (t === 'burst2') bursts2++
    else skulls++
  }
  const parts = []
  if (bursts1 > 0) parts.push(`${bursts1}× ✸`)
  if (bursts2 > 0) parts.push(`${bursts2}× ✸✸`)
  if (skulls > 0) parts.push(`${skulls}× ☠`)
  return parts.join('  ')
}

export default function DiceRoller() {
  const [open, setOpen] = useState(false)
  const [diceCount, setDiceCount] = useState(2)
  const [dice, setDice] = useState<DieState[]>([])
  const [rolling, setRolling] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const rollRef = useRef(0)

  // Initialize dice when count changes
  useEffect(() => {
    setDice(
      Array.from({ length: diceCount }, (_, i) => ({
        id: i,
        faceIndex: 0,
        rotX: -20,
        rotY: 30,
        transition: false,
      }))
    )
    setShowResult(false)
  }, [diceCount])

  const roll = useCallback(() => {
    if (rolling) return
    setRolling(true)
    setShowResult(false)
    const rollId = ++rollRef.current

    // Pick results
    const results = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6))

    // Phase 1: jump to random spin position (no transition)
    setDice(
      Array.from({ length: diceCount }, (_, i) => ({
        id: i,
        faceIndex: results[i],
        rotX: Math.floor(Math.random() * 3 + 2) * 360 + (Math.random() * 180 - 90),
        rotY: Math.floor(Math.random() * 3 + 2) * 360 + (Math.random() * 180 - 90),
        transition: false,
      }))
    )

    // Phase 2: transition to final position
    setTimeout(() => {
      if (rollRef.current !== rollId) return
      setDice(
        Array.from({ length: diceCount }, (_, i) => {
          const fi = results[i]
          const { x, y } = FACE_ROTATIONS[fi]
          const spinX = Math.floor(Math.random() * 2 + 1) * 360
          const spinY = Math.floor(Math.random() * 2 + 1) * 360
          return {
            id: i,
            faceIndex: fi,
            rotX: x + spinX,
            rotY: y + spinY,
            transition: true,
          }
        })
      )

      // Show result after transition
      setTimeout(() => {
        if (rollRef.current !== rollId) return
        setShowResult(true)
        setRolling(false)
      }, 1500)
    }, 50)
  }, [diceCount, rolling])

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          width: 44,
          height: 44,
          backgroundColor: '#b91c1c',
          border: '2px solid #7f1d1d',
          boxShadow: '0 0 16px #b91c1c55, 0 2px 8px #00000088',
          color: 'white',
          fontSize: '1.3rem',
        }}
        title="Tirar dados"
      >
        ⚄
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            className="rounded-xl p-6 flex flex-col items-center gap-5"
            style={{
              backgroundColor: '#1a0a0a',
              border: '1px solid #7f1d1d',
              boxShadow: '0 0 60px #b91c1c33',
              minWidth: 320,
              maxWidth: '90vw',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <h2
                className="uppercase tracking-widest text-sm font-bold"
                style={{ color: '#e8d5b0', letterSpacing: '0.3em' }}
              >
                Tirada de Dados
              </h2>
              <button
                onClick={() => setOpen(false)}
                style={{ color: '#6b5a3a', fontSize: '1.2rem' }}
                className="hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Dice count selector */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                disabled={rolling}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors hover:bg-white/10"
                style={{ color: '#e8d5b0', border: '1px solid #3a2010' }}
              >
                −
              </button>
              <span style={{ color: '#c9a87a', fontSize: '1.1rem', minWidth: '6rem', textAlign: 'center' }}>
                {diceCount} {diceCount === 1 ? 'dado' : 'dados'}
              </span>
              <button
                onClick={() => setDiceCount(Math.min(10, diceCount + 1))}
                disabled={rolling}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-colors hover:bg-white/10"
                style={{ color: '#e8d5b0', border: '1px solid #3a2010' }}
              >
                +
              </button>
            </div>

            {/* Dice display */}
            {dice.length > 0 && (
              <div
                className="flex flex-wrap justify-center gap-4 p-4 rounded-lg"
                style={{
                  perspective: 600,
                  backgroundColor: '#0d0505',
                  border: '1px solid #3a0808',
                  maxWidth: 360,
                }}
              >
                {dice.map((d) => (
                  <Die key={d.id} state={d} />
                ))}
              </div>
            )}

            {/* Result */}
            <div
              className="text-center transition-all duration-500"
              style={{
                minHeight: '2rem',
                opacity: showResult ? 1 : 0,
                color: '#e8d5b0',
                fontSize: '1.1rem',
                letterSpacing: '0.15em',
              }}
            >
              {showResult && resultSummary(dice)}
            </div>

            {/* Roll button */}
            <button
              onClick={roll}
              disabled={rolling}
              className="px-8 py-3 rounded-full uppercase tracking-widest text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: rolling ? '#7f1d1d' : '#b91c1c',
                color: 'white',
                border: '1px solid #991b1b',
                letterSpacing: '0.25em',
                boxShadow: rolling ? 'none' : '0 0 20px #b91c1c66',
                opacity: rolling ? 0.7 : 1,
              }}
            >
              {rolling ? 'Tirando…' : 'Tirar'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
