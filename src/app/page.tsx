'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAudio } from '@/lib/AudioContext'

export default function PortadaPage() {
  const router = useRouter()
  const { volume, setVolume } = useAudio()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in on mount
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-end overflow-hidden"
      style={{ position: 'relative', backgroundColor: '#000' }}
    >
      <style>{`body { background-color: transparent !important; }`}</style>
      {/* Background video */}
      <video
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src="https://github.com/JVillacorta42/dante-app/releases/download/v1.0/bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, backgroundColor: 'rgba(13,10,8,0.05)' }} />

      {/* Portada image contained, faded sides reveal video behind */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: 'url(/images/portada.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          maskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 35%, black 65%, transparent 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, black 35%, black 65%, transparent 85%, transparent 100%)',
          zIndex: 2,
        }}
      />

      {/* Red-black vignette on edges */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 20%, rgba(80,5,5,0.75) 55%, rgba(5,0,0,0.97) 100%),
            linear-gradient(to right, rgba(5,0,0,1) 0%, rgba(5,0,0,0.85) 25%, transparent 45%, transparent 55%, rgba(5,0,0,0.85) 75%, rgba(5,0,0,1) 100%)
          `,
          zIndex: 3,
        }}
      />

      {/* Dark gradient at the bottom so button reads clearly */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.10) 45%, transparent 70%)',
          zIndex: 4,
        }}
      />

      {/* Bottom content */}
      <div
        className="relative flex flex-col items-center pb-16 px-6 text-center"
        style={{
          zIndex: 5,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1.2s ease, transform 1.2s ease',
        }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-6"
          style={{ color: '#6b5a3a', letterSpacing: '0.5em' }}
        >
          Dante Alighieri · La Divina Comedia
        </p>

        <button
          onClick={() => {
            const sfx = new Audio('https://github.com/JVillacorta42/dante-app/releases/download/v1.0/boton_portada.mp3')
            sfx.volume = 0.1
            // Duck music while sfx plays
            const originalVolume = volume
            setVolume(originalVolume * 0.25)
            sfx.play().catch(() => {})
            sfx.addEventListener('ended', () => setVolume(originalVolume))
            router.push('/select')
          }}
          className="px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105 hover:brightness-110"
          style={{
            backgroundColor: '#8b1a1a',
            color: '#e8d5b0',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.25em',
            boxShadow: '0 0 40px #8b1a1a88, 0 4px 24px #00000099',
            border: '1px solid #c03020aa',
          }}
        >
          Soy el Camino a la Ciudad del Dolor
        </button>

        <p
          className="mt-6 text-xs italic"
          style={{ color: '#3a2a18', letterSpacing: '0.1em' }}
        >
          «Per me si va nella città dolente»
        </p>
      </div>
    </div>
  )
}
