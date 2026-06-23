import type { Metadata } from 'next'
import './globals.css'
import MusicPlayer from '@/components/MusicPlayer'
import FullscreenButton from '@/components/FullscreenButton'
import DiceRoller from '@/components/DiceRoller'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import { AudioProvider } from '@/lib/AudioContext'

export const metadata: Metadata = {
  title: 'Dante: Infierno',
  description: 'Un libro-juego digital ambientado en el Infierno de Dante Alighieri',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dante: Infierno',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#0d0a08',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512.png" />
        <meta name="theme-color" content="#0d0a08" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          backgroundColor: '#0d0a08',
          color: '#e8d5b0',
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <AudioProvider>
          <DisclaimerBanner />
          {/* Persistent music player — fixed bottom-right */}
          <div className="ambient-player fixed bottom-4 right-4 z-50 flex items-center gap-2">
            <FullscreenButton />
            <MusicPlayer />
          </div>
          <DiceRoller />
          {children}
        </AudioProvider>
      </body>
    </html>
  )
}
