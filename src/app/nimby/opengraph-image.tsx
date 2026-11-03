import { cloneElement, isValidElement, type ReactNode } from 'react'
import { OG_SIZE, shareCard } from '@/lib/og-card'
import { NimbyFigure, NIMBY_PALETTE_LIGHT } from '@/nimby/nimby-figure'

// Satori only draws intrinsic SVG elements, and NimbyFigure is built from small function components
// (Drop, Mouth). They are pure, so calling them here turns the tree into plain SVG.
function intrinsic(node: ReactNode): ReactNode {
  if (Array.isArray(node)) return node.map(intrinsic)
  if (!isValidElement<{ children?: ReactNode }>(node)) return node
  if (typeof node.type === 'function') return intrinsic((node.type as (p: unknown) => ReactNode)(node.props))
  return node.props.children === undefined ? node : cloneElement(node, undefined, intrinsic(node.props.children))
}

export const alt = 'Nimby, the matewere.dev cloud mascot, waving'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  return shareCard({
    eyebrow: 'EXPERIMENT',
    title: 'Nimby',
    subtitle: 'A cloud mascot drawn in code, frame by frame, for the web and for video.',
    footer: 'WORKING',
    address: 'lab.matewere.dev/nimby',
    // Mid-wave, grinning: t is 0.6 s into the wave mood. The light palette, so the cream cloud stands
    // out on the dark card.
    art: intrinsic(<NimbyFigure t={0.6} mood="wave" moodStart={0} size={300} palette={NIMBY_PALETTE_LIGHT} />),
  })
}
