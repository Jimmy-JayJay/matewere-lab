'use client'

import { useState } from 'react'
import { NimbyFigure, NIMBY_DURATION, NIMBY_PALETTE_DARK, NIMBY_PALETTE_LIGHT, type NimbyMood } from '@/nimby/nimby-figure'
import { NimbyLive } from '@/nimby/nimby-live'

const MOODS: { mood: NimbyMood; label: string; note: string }[] = [
  { mood: 'idle', label: 'Idle', note: 'Breathes, blinks, watches the pointer.' },
  { mood: 'wave', label: 'Wave', note: 'Hop and two tilts. Also on tap or click.' },
  { mood: 'rain', label: 'Rain', note: 'Gathers itself, then a short shower.' },
  { mood: 'lost', label: 'Lost', note: 'The 404 page: worried, drifting, drizzling.' },
  { mood: 'sent', label: 'Sent', note: 'Contact form success: takes the message away, comes back, waves.' },
]

const button =
  'rounded-md border px-3 py-1.5 font-mono text-sm transition-transform hover:-translate-y-0.5 aria-pressed:border-primary aria-pressed:text-primary'

export function Playground() {
  const [mood, setMood] = useState<NimbyMood>('idle')
  const [key, setKey] = useState(0)
  const [size, setSize] = useState(160)
  const [scrub, setScrub] = useState(0.6)
  const [scrubMood, setScrubMood] = useState<NimbyMood>('sent')

  const play = (m: NimbyMood) => {
    setMood(m)
    setKey((k) => k + 1)
  }

  return (
    <div className="space-y-12">
      <section className="grid gap-8 md:grid-cols-[1fr_16rem]">
        <div className="flex min-h-80 items-center justify-center rounded-lg border bg-card">
          <NimbyLive mood={mood} moodKey={key} size={size} />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Mood</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button key={m.mood} type="button" className={button} aria-pressed={mood === m.mood} onClick={() => play(m.mood)}>
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{MOODS.find((m) => m.mood === mood)?.note}</p>
          </div>
          <label className="block">
            <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Size {size}px</span>
            <input type="range" min={40} max={240} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-2 w-full accent-[var(--primary)]" />
          </label>
          <p className="text-sm text-muted-foreground">Hover for drizzle, click to wave. With reduced motion on, Nimby holds still and keeps the mood&apos;s face.</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Sizes and themes</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The sizes the site uses: 52 px in the footer (always dark), 96 px beside page headings, and a 56 px phone size.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Light', palette: NIMBY_PALETTE_LIGHT, bg: '#FBF6F0' },
            { label: 'Dark', palette: NIMBY_PALETTE_DARK, bg: '#16181D' },
          ].map((theme) => (
            <div key={theme.label} className="flex items-end justify-around rounded-lg border p-6" style={{ background: theme.bg }}>
              {[52, 56, 96].map((s) => (
                <div key={s} className="text-center">
                  <NimbyLive mood={mood} moodKey={key} size={s} palette={theme.palette} />
                  <span className="font-mono text-xs" style={{ color: theme.palette.line, opacity: 0.6 }}>
                    {s}px
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Frame by frame</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Nimby is a pure function of time, so any moment can be drawn exactly. This is what the Remotion reel uses.
        </p>
        <div className="mt-4 grid gap-6 rounded-lg border bg-card p-6 md:grid-cols-[1fr_16rem]">
          <div className="flex items-center justify-center">
            <NimbyFigure t={scrub} mood={scrubMood} moodStart={0} size={160} />
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {MOODS.filter((m) => NIMBY_DURATION[m.mood] > 0).map((m) => (
                <button key={m.mood} type="button" className={button} aria-pressed={scrubMood === m.mood} onClick={() => setScrubMood(m.mood)}>
                  {m.label}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">t = {scrub.toFixed(2)} s</span>
              <input
                type="range"
                min={0}
                max={NIMBY_DURATION[scrubMood] + 0.4}
                step={1 / 30}
                value={scrub}
                onChange={(e) => setScrub(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--primary)]"
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  )
}
