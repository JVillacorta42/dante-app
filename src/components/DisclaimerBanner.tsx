'use client'

import { useState } from 'react'

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-lg rounded-xl flex flex-col"
        style={{
          backgroundColor: '#100808',
          border: '1px solid #3a1a0a',
          boxShadow: '0 0 80px #8b1a1a22',
          maxHeight: '90dvh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4 text-center"
          style={{ borderBottom: '1px solid #2d1008' }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#8b1a1a', letterSpacing: '0.4em' }}>
            Legal Notice
          </p>
          <h1
            className="text-lg font-bold uppercase tracking-widest"
            style={{ color: '#e8d5b0', fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}
          >
            Dante: Inferno — Fan App
          </h1>
        </div>

        {/* Notices */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Non-Commercial */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1a0a04', border: '1px solid #2d1408' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#c47c3a', letterSpacing: '0.25em' }}>
              ⊘ Non-Commercial
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#9e8a6a' }}>
              This application is completely free of charge. There are no ads, in-app purchases, or any other form of monetization or profit.
            </p>
          </div>

          {/* Fan Project */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1a0a04', border: '1px solid #2d1408' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#c47c3a', letterSpacing: '0.25em' }}>
              ✦ Fan Project
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#9e8a6a' }}>
              This is an unofficial, fan-made digital companion. It has no affiliation with or endorsement from Creative Games Studio.
            </p>
          </div>

          {/* Creators' Disclaimer */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1a0a04', border: '1px solid #2d1408' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#c47c3a', letterSpacing: '0.25em' }}>
              ⚠ Disclaimer
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#9e8a6a' }}>
              The original creators of <span style={{ color: '#e8d5b0' }}>Dante: Inferno</span> bear no responsibility for bugs, errors, or any technical issues arising from the use of this application.
            </p>
          </div>

          {/* Credits */}
          <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#0d0505', border: '1px solid #5a1010' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#c47c3a', letterSpacing: '0.25em' }}>
              ♛ Credits
            </p>
            <p className="text-sm mb-1" style={{ color: '#9e8a6a' }}>
              Original board game by the full team at
            </p>
            <p
              className="text-base font-bold uppercase tracking-widest mb-3"
              style={{ color: '#e8d5b0', fontFamily: 'Georgia, serif', letterSpacing: '0.2em' }}
            >
              Creative Games Studio
            </p>
            <a
              href="https://wearecgs.com/dante/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs uppercase tracking-widest px-4 py-2 rounded transition-all duration-200 hover:scale-105"
              style={{
                color: '#c9a87a',
                border: '1px solid #3a2a1a',
                letterSpacing: '0.2em',
              }}
            >
              wearecgs.com/dante ↗
            </a>
          </div>
        </div>

        {/* Accept button */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={() => setDismissed(true)}
            className="w-full py-3 rounded-full uppercase tracking-widest text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: '#8b1a1a',
              color: '#e8d5b0',
              border: '1px solid #c0302044',
              letterSpacing: '0.25em',
              boxShadow: '0 0 20px #8b1a1a44',
              fontFamily: 'Georgia, serif',
            }}
          >
            I Understand — Enter
          </button>
        </div>
      </div>
    </div>
  )
}
