// The lab index. Each experiment is a folder in src/app/<slug>/ plus one entry here; nothing else
// to register. Newest first. Status says how finished it is, so nobody mistakes a sketch for a
// product.

export const SITE = {
  url: 'https://lab.matewere.dev',
  title: 'matewere.dev lab',
  description: 'Experiments, prototypes and half-finished ideas by Jimmy Matewere. Published early, kept small.',
}

export type Experiment = {
  slug: string
  title: string
  summary: string
  date: string // ISO date started
  status: 'sketch' | 'working' | 'done' | 'abandoned'
  tags: string[]
}

export const EXPERIMENTS: Experiment[] = [
  {
    slug: 'nimby',
    title: 'Nimby',
    summary: 'The matewere.dev cloud mascot rebuilt in code: every mood, size and theme, frame by frame.',
    date: '2026-10-27',
    status: 'working',
    tags: ['animation', 'svg', 'remotion'],
  },
]
