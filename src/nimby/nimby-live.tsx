'use client'

// Live Nimby for websites: feeds NimbyFigure the clock with requestAnimationFrame, only while it is on
// screen, and holds still under prefers-reduced-motion. Eyes follow the pointer; hover drizzles; a tap
// (phones) or click waves. Changing `mood` or `moodKey` restarts that mood from its first frame.

import { useEffect, useRef, useState } from 'react'
import { NimbyFigure, type NimbyMood, type NimbyPalette } from './nimby-figure'

type Props = {
  mood?: NimbyMood
  // Bump to replay the same mood (e.g. a second message sent).
  moodKey?: number
  size?: number
  palette?: NimbyPalette
  followPointer?: boolean
  tapToWave?: boolean
  className?: string
}

type Target = { mood: NimbyMood; key: string }

export function NimbyLive({ mood = 'idle', moodKey = 0, size = 96, palette, followPointer = true, tapToWave = true, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  // What should be playing (props or a tap) and what is playing; the frame loop reconciles the two,
  // so a new mood starts on the very next frame.
  const target = useRef<Target>({ mood, key: `${mood}:${moodKey}` })
  const active = useRef<Target & { at: number }>({ mood, key: `${mood}:${moodKey}`, at: 0 })
  const [frame, setFrame] = useState({ t: 0, mood, moodStart: 0 })
  const [visible, setVisible] = useState(false)
  const [still, setStill] = useState(false)
  const [hover, setHover] = useState(false)
  const [look, setLook] = useState({ x: 0, y: 0 })

  useEffect(() => {
    target.current = { mood, key: `${mood}:${moodKey}` }
  }, [mood, moodKey])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setStill(mq.matches)
    const io = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)))
    if (ref.current) io.observe(ref.current)
    mq.addEventListener('change', update)
    queueMicrotask(update)
    return () => {
      io.disconnect()
      mq.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    if (!visible || still) return
    const origin = performance.now() - frame.t * 1000 // resume where it left off
    let raf = 0
    const tick = () => {
      const t = (performance.now() - origin) / 1000
      if (active.current.key !== target.current.key) active.current = { ...target.current, at: t }
      setFrame({ t, mood: active.current.mood, moodStart: active.current.at })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // frame.t is read once to resume; re-running on every frame would restart the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, still])

  useEffect(() => {
    if (!followPointer || still) return
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const d = Math.hypot(dx, dy) || 1
      const reach = Math.min(1, d / 200) // eyes move less when the pointer is close
      setLook({ x: (dx / d) * reach, y: (dy / d) * reach })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [followPointer, still])

  const wave = () => {
    if (!tapToWave || active.current.mood === 'sent') return // never cut the message animation short
    target.current = { mood: 'wave', key: `tap:${performance.now()}` }
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{ width: size, height: size * 0.85, touchAction: 'manipulation' }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={wave}
    >
      <NimbyFigure
        t={frame.t}
        mood={still ? mood : frame.mood}
        moodStart={frame.moodStart}
        look={look}
        hover={hover}
        still={still}
        size={size}
        palette={palette}
      />
    </div>
  )
}
