import type { Metadata } from 'next'
import { Playground } from './playground'

export const metadata: Metadata = {
  title: 'Nimby',
  description: 'The matewere.dev cloud mascot, rebuilt in code: every mood, size and theme, frame by frame.',
}

export default function NimbyPage() {
  return (
    <article>
      <header className="max-w-2xl">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Experiment · working</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Nimby</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The cloud that lives on matewere.dev, rebuilt as one SVG component that draws any moment from a clock. The
          same file animates on the website and renders frame-exact in the portfolio reel.
        </p>
      </header>
      <div className="mt-12">
        <Playground />
      </div>
    </article>
  )
}
