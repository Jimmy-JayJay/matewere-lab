// Nimby, the matewere.dev cloud mascot, as a pure function of time.
//
// Given a time `t` (seconds) and the moment the current mood started, this draws one exact frame.
// No CSS animation, no timers, no state: the same props always give the same picture. That is what
// lets one component serve the website (a live wrapper feeds it requestAnimationFrame time) and the
// Remotion reel (which feeds it frame / fps and renders frame by frame).
//
// Canonical copy: matewere-lab/src/nimby/. The site (jimmy-matewere-v2) and portfolio-reel carry
// copies of this file; change it here first.

export type NimbyMood = 'idle' | 'wave' | 'rain' | 'lost' | 'sent'

export type NimbyPalette = { body: string; line: string; cheek: string; rain: string }

// Defaults read the host site's tokens, so it themes itself on the website. Remotion passes hex.
export const NIMBY_PALETTE_CSS: NimbyPalette = {
  body: 'var(--nimby-body, var(--card, #FBF6F0))',
  line: 'var(--nimby-line, var(--foreground, #16181D))',
  cheek: 'var(--nimby-cheek, var(--accent, #C9683B))',
  rain: 'var(--nimby-rain, var(--primary, #1D4E6E))',
}

export const NIMBY_PALETTE_LIGHT: NimbyPalette = { body: '#FBF6F0', line: '#16181D', cheek: '#C9683B', rain: '#1D4E6E' }
export const NIMBY_PALETTE_DARK: NimbyPalette = { body: '#1F2228', line: '#F0EEE9', cheek: '#E3A47A', rain: '#6FA8D6' }

// How long each one-shot mood plays before Nimby settles back to idle (seconds).
export const NIMBY_DURATION: Record<NimbyMood, number> = { idle: 0, wave: 1.8, rain: 1.6, lost: 0, sent: 3.2 }

export type NimbyFigureProps = {
  t: number // seconds since start (any monotonic clock)
  mood?: NimbyMood
  moodStart?: number // t at which `mood` began
  look?: { x: number; y: number } // where the eyes point, each -1 to 1
  hover?: boolean // pointer over Nimby: drizzle, eyes widen
  still?: boolean // reduced motion: hold a calm pose, keep the mood's face
  size?: number // rendered width in px
  palette?: NimbyPalette
  className?: string
}

const TAU = Math.PI * 2
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))
const ease = (v: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(v)) // smooth 0 -> 1
const between = (u: number, a: number, b: number) => clamp((u - a) / (b - a))

// Damped spring settling from 1 to 0: the bounce after a landing.
const settle = (u: number, k = 3.2, w = 14) => (u < 0 ? 1 : Math.exp(-k * u) * Math.cos(w * u))

// Deterministic blink schedule: a blink roughly every 4 to 6 s, sometimes a double blink.
function blinkAmount(t: number): number {
  const period = 5.1
  const n = Math.floor(t / period)
  const jitter = ((Math.sin(n * 12.9898) * 43758.5453) % 1 + 1) % 1 // 0..1, fixed per cycle
  const at = n * period + 1 + jitter * 3
  const d = t - at
  const one = (x: number) => (x >= 0 && x < 0.14 ? Math.sin((x / 0.14) * Math.PI) : 0)
  return Math.max(one(d), jitter > 0.7 ? one(d - 0.24) : 0) // 0 open, 1 shut
}

type Pose = {
  x: number
  y: number
  rotate: number
  sx: number
  sy: number
  opacity: number
  mouth: 'smile' | 'grin' | 'worried' | 'o'
  rain: 0 | 1 | 2 // none, drizzle, shower
  envelope: number // 0..1 visibility of the carried message
  eyeLift: number // extra eye height, for surprise and hover
}

function pose(p: Required<Pick<NimbyFigureProps, 't' | 'mood' | 'moodStart' | 'hover' | 'still'>>): Pose {
  const { t, hover, still } = p
  const u = t - p.moodStart
  const mood = p.mood !== 'idle' && NIMBY_DURATION[p.mood] > 0 && u > NIMBY_DURATION[p.mood] ? 'idle' : p.mood

  // Idle breathing: a 3.2 s bob, stretched on the way up and squashed at the bottom.
  const phase = still ? 0 : (TAU * t) / 3.2
  const base: Pose = {
    x: 0,
    y: -2.5 * Math.sin(phase),
    rotate: 0,
    sx: 1 - 0.018 * Math.sin(phase),
    sy: 1 + 0.025 * Math.sin(phase),
    opacity: 1,
    mouth: 'smile',
    rain: hover ? 1 : 0,
    envelope: 0,
    eyeLift: hover ? 0.6 : 0,
  }

  if (still) {
    if (mood === 'lost') return { ...base, mouth: 'worried', rain: 1 }
    if (mood === 'wave' || mood === 'sent') return { ...base, mouth: 'grin' }
    if (mood === 'rain') return { ...base, rain: 2 }
    return base
  }

  switch (mood) {
    case 'wave': {
      // A small hop, then two tilts each way that fade out.
      const hop = u < 0.35 ? Math.sin((u / 0.35) * Math.PI) : 0
      const fade = 1 - ease(between(u, 1.1, 1.8))
      return {
        ...base,
        y: base.y - 7 * hop,
        sy: base.sy + 0.08 * hop - 0.06 * Math.max(0, settle(u - 0.35) * (u > 0.35 ? 1 : 0)),
        sx: base.sx - 0.05 * hop,
        rotate: 8 * Math.sin(TAU * between(u, 0.2, 1.8) * 2) * fade,
        mouth: 'grin',
      }
    }
    case 'rain': {
      // Gathers itself (slight squash), then a shower.
      const gather = u < 0.25 ? Math.sin((u / 0.25) * Math.PI) : 0
      return { ...base, sy: base.sy - 0.06 * gather, sx: base.sx + 0.05 * gather, rain: u > 0.15 ? 2 : 0, mouth: 'o' }
    }
    case 'lost':
      return {
        ...base,
        x: 3 * Math.sin((TAU * t) / 6),
        rotate: 3 * Math.sin((TAU * t) / 6 + 1),
        mouth: 'worried',
        rain: 1,
      }
    case 'sent': {
      // Takes the message (squash), rises away with it, is gone a moment, drops back in, waves.
      const grab = between(u, 0, 0.35)
      const rise = ease(between(u, 0.35, 1.15))
      const fall = between(u, 1.5, 1.9)
      const landed = u - 1.9
      if (u < 0.35) {
        return { ...base, sy: 1 - 0.14 * Math.sin(grab * Math.PI), sx: 1 + 0.1 * Math.sin(grab * Math.PI), envelope: grab, mouth: 'grin' }
      }
      if (u < 1.5) {
        return {
          ...base,
          y: -70 * rise,
          sy: 1 + 0.12 * Math.sin(rise * Math.PI),
          sx: 1 - 0.08 * Math.sin(rise * Math.PI),
          rotate: -4 * Math.sin(rise * Math.PI),
          opacity: 1 - between(u, 0.85, 1.15),
          envelope: 1 - between(u, 0.85, 1.15),
          mouth: 'grin',
        }
      }
      if (u < 1.9) {
        return { ...base, y: -40 * (1 - ease(fall)), opacity: ease(between(u, 1.5, 1.65)), mouth: 'o', eyeLift: 0.6 }
      }
      // Landing bounce, then a short wave.
      const bounce = settle(landed / 0.6)
      const wave = between(landed, 0.35, 1.3)
      return {
        ...base,
        sy: base.sy - 0.1 * bounce,
        sx: base.sx + 0.07 * bounce,
        rotate: 7 * Math.sin(TAU * wave * 2) * (1 - ease(between(landed, 1.0, 1.3))),
        mouth: 'grin',
      }
    }
    default:
      return base
  }
}

// One falling drop: a short cobalt line looping every `period` seconds.
function Drop({ t, x, delay, period, color }: { t: number; x: number; delay: number; period: number; color: string }) {
  const k = (((t - delay) / period) % 1 + 1) % 1
  const opacity = k < 0.3 ? k / 0.3 : 1 - (k - 0.3) / 0.7
  const y = 82 + 12 * k
  return (
    <line x1={x} y1={y} x2={x - 2} y2={y + 8} stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={opacity} />
  )
}

export function NimbyFigure({
  t,
  mood = 'idle',
  moodStart = 0,
  look = { x: 0, y: 0 },
  hover = false,
  still = false,
  size = 96,
  palette = NIMBY_PALETTE_CSS,
  className,
}: NimbyFigureProps) {
  const p = pose({ t, mood, moodStart, hover, still })
  const lookX = mood === 'lost' && !still ? 2 * Math.sin((TAU * t) / 4.5) : 2.2 * clamp(look.x, -1, 1)
  const lookY = mood === 'lost' && !still ? Math.sin((TAU * t) / 3.1) : 1.6 * clamp(look.y, -1, 1)
  const blink = still ? 0 : blinkAmount(t)
  const eyeRy = (4 + p.eyeLift) * (1 - 0.9 * blink)
  const lean = still ? 0 : 1.5 * clamp(look.x, -1, 1)

  // Body transforms pivot on the cloud's base, so squash and tilt read as weight.
  const body = `translate(${p.x} ${p.y}) translate(62 78) rotate(${p.rotate + lean}) scale(${p.sx} ${p.sy}) translate(-62 -78)`
  const showRain = p.rain > 0
  const period = p.rain === 2 ? 0.55 : 0.95
  const drops = p.rain === 2 ? [40, 50, 60, 70, 80] : [46, 62, 78]

  return (
    <svg aria-hidden viewBox="0 0 120 102" width={size} height={size * 0.85} overflow="visible" className={className}>
      {showRain && (
        <g>
          {drops.map((x, i) => (
            <Drop key={x} t={t} x={x} delay={(i * period) / drops.length} period={period} color={palette.rain} />
          ))}
        </g>
      )}
      <g transform={body} opacity={p.opacity}>
        {p.envelope > 0 && (
          // The message Nimby carries away: a small envelope tucked under its base.
          <g opacity={p.envelope} transform="translate(52 72)">
            <rect width="20" height="14" rx="2" fill={palette.body} stroke={palette.rain} strokeWidth={2} />
            <path d="M1 2 L10 8 L19 2" fill="none" stroke={palette.rain} strokeWidth={2} strokeLinejoin="round" />
          </g>
        )}
        <path
          d="M30 76 a20 20 0 0 1 2-39 a26 26 0 0 1 48-8 a20 20 0 0 1 20 21 a14 14 0 0 1-2 26 Z"
          fill={palette.body}
          stroke={palette.line}
          strokeOpacity={0.8}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <g transform={`translate(${lookX} ${lookY})`}>
          <ellipse cx="52" cy="54" rx="3.2" ry={eyeRy} fill={palette.line} />
          <ellipse cx="72" cy="54" rx="3.2" ry={eyeRy} fill={palette.line} />
        </g>
        <circle cx="45" cy="63" r="3.4" fill={palette.cheek} opacity={0.45} />
        <circle cx="79" cy="63" r="3.4" fill={palette.cheek} opacity={0.45} />
        <Mouth kind={p.mouth} color={palette.line} />
      </g>
    </svg>
  )
}

function Mouth({ kind, color }: { kind: Pose['mouth']; color: string }) {
  const stroke = { fill: 'none', stroke: color, strokeOpacity: 0.8, strokeWidth: 2, strokeLinecap: 'round' as const }
  switch (kind) {
    case 'grin':
      return <path d="M55 63 q7 7 14 0 z" fill={color} fillOpacity={0.8} stroke={color} strokeOpacity={0.8} strokeWidth={1.5} strokeLinejoin="round" />
    case 'worried':
      return <path d="M57 66 q5 -3 10 0" {...stroke} />
    case 'o':
      return <ellipse cx="62" cy="65" rx="2.4" ry="2.8" {...stroke} />
    default:
      return <path d="M56 64 q6 5 12 0" {...stroke} />
  }
}
