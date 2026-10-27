import Link from 'next/link'
import { EXPERIMENTS } from '@/lib/experiments'

export default function Home() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Lab</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Experiments and prototypes, published early. Some will grow into projects on{' '}
          <a href="https://matewere.dev/work">matewere.dev</a>, most will stay small.
        </p>
      </section>

      <ul className="mt-12 divide-y border-y">
        {EXPERIMENTS.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/${e.slug}`}
              className="grid gap-1 py-4 text-foreground no-underline sm:grid-cols-[7rem_1fr_auto] sm:gap-6"
            >
              <span className="font-mono text-sm text-muted-foreground">{e.date}</span>
              <span>
                <span className="font-medium">{e.title}</span>
                <span className="block text-sm text-muted-foreground">{e.summary}</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground uppercase">{e.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
