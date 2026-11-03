// The share card behind every page's og:image, in the same design as matewere.dev's own card
// (jimmy-matewere-v2 src/app/opengraph-image.tsx): charcoal ground, cobalt stripes ending in one
// terracotta stripe, IBM Plex and Plus Jakarta Sans. Built at build time with next/og.

import { ImageResponse } from 'next/og'

export const OG_SIZE = { width: 1200, height: 630 }

const C = {
  charcoal: '#16181D',
  cream: '#F0EEE9',
  cobaltDeep: '#1D4E6E',
  cobaltTint: '#6FA8D6',
  terracotta: '#C9683B',
  muted: '#9C968C',
}

// Google's CSS endpoint returns truetype (which Satori can read) when called without a browser UA;
// `text` subsets the font to the glyphs drawn.
async function font(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
  if (!src?.[1]) throw new Error(`Could not resolve a truetype face for ${family} ${weight}`)
  return (await fetch(src[1])).arrayBuffer()
}

function mix(from: string, to: string, t: number) {
  const a = [1, 3, 5].map((i) => parseInt(from.slice(i, i + 2), 16))
  const b = [1, 3, 5].map((i) => parseInt(to.slice(i, i + 2), 16))
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')}`
}

const STRIPES = Array.from({ length: 26 }, (_, i) => (i === 25 ? C.terracotta : mix(C.cobaltDeep, C.cobaltTint, i / 24)))

type Card = {
  eyebrow: string
  title: string
  subtitle: string
  footer: string // bottom-left label
  address: string // bottom-right, the page's address
  art?: React.ReactNode // optional picture on the right (the lab uses Nimby)
}

export async function shareCard({ eyebrow, title, subtitle, footer, address, art }: Card) {
  const titleSize = title.length > 48 ? 58 : title.length > 28 ? 72 : 96
  const [heading, sans, mono] = await Promise.all([
    font('Plus Jakarta Sans', 700, title),
    font('IBM Plex Sans', 400, subtitle),
    font('IBM Plex Mono', 500, eyebrow + footer + address),
  ])

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: C.charcoal,
        padding: '76px 80px 72px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: art ? 760 : 1040 }}>
          <div style={{ display: 'flex', marginBottom: 24, fontFamily: 'IBM Plex Mono', fontSize: 20, letterSpacing: 4, color: C.cobaltTint }}>
            {eyebrow}
          </div>
          <div style={{ display: 'flex', fontFamily: 'Plus Jakarta Sans', fontSize: titleSize, lineHeight: 1.08, letterSpacing: -1.5, color: C.cream }}>
            {title}
          </div>
          <div style={{ display: 'flex', marginTop: 22, fontFamily: 'IBM Plex Sans', fontSize: 30, lineHeight: 1.35, color: C.muted }}>
            {subtitle}
          </div>
        </div>
        {art ? <div style={{ display: 'flex', alignItems: 'center' }}>{art}</div> : null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
            fontFamily: 'IBM Plex Mono',
            fontSize: 15,
            letterSpacing: 3,
            color: C.muted,
          }}
        >
          <div style={{ display: 'flex' }}>{footer}</div>
          <div style={{ display: 'flex', letterSpacing: 1, color: C.cream }}>{address}</div>
        </div>
        <div style={{ display: 'flex', width: '100%', height: 56 }}>
          {STRIPES.map((color, i) => (
            <div key={i} style={{ flexGrow: 1, height: '100%', backgroundColor: color, marginRight: i === 25 ? 0 : 5 }} />
          ))}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Plus Jakarta Sans', data: heading, style: 'normal', weight: 700 },
        { name: 'IBM Plex Sans', data: sans, style: 'normal', weight: 400 },
        { name: 'IBM Plex Mono', data: mono, style: 'normal', weight: 500 },
      ],
    },
  )
}
