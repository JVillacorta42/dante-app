import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0d0a08' }}
    >
      <div className="text-center px-8 max-w-md">
        <div
          className="text-8xl font-bold mb-4"
          style={{
            color: '#8b1a1a',
            fontFamily: 'Georgia, serif',
            textShadow: '0 0 30px rgba(139, 26, 26, 0.5)',
          }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold uppercase tracking-widest mb-4"
          style={{ color: '#c9a84c', letterSpacing: '0.2em' }}
        >
          PERDIDO EN EL INFIERNO
        </h1>
        <p className="text-base italic mb-8" style={{ color: '#9e8a6a' }}>
          &ldquo;Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura...&rdquo;
        </p>
        <Link
          href="/"
          className="inline-block py-3 px-6 rounded-lg font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: '#8b1a1a',
            color: '#e8d5b0',
            boxShadow: '0 0 20px rgba(139, 26, 26, 0.4)',
          }}
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
