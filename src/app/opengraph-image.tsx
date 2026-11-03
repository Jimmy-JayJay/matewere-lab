import { OG_SIZE, shareCard } from '@/lib/og-card'
import { EXPERIMENTS } from '@/lib/experiments'

export const alt = 'The lab at matewere.dev: experiments and prototypes by Jimmy Matewere'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  const n = EXPERIMENTS.length
  return shareCard({
    eyebrow: 'LAB',
    title: 'Experiments, published early',
    subtitle: 'Prototypes and sketches by Jimmy Matewere.',
    footer: `${n} EXPERIMENT${n === 1 ? '' : 'S'}`,
    address: 'lab.matewere.dev',
  })
}
