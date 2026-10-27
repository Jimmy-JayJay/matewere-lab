import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans, Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'
import { SITE } from '@/lib/experiments'
import './globals.css'

const heading = Plus_Jakarta_Sans({ variable: '--font-heading', subsets: ['latin'], weight: ['500', '700'] })
const sans = IBM_Plex_Sans({ variable: '--font-sans', subsets: ['latin'], weight: ['400', '500'] })
const mono = IBM_Plex_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '500'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: '%s | matewere.dev lab' },
  description: SITE.description,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${heading.variable} ${sans.variable} ${mono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <header className="border-b">
          <nav className="mx-auto flex max-w-4xl items-baseline justify-between px-4 py-5 sm:px-6">
            <Link href="/" className="font-heading text-lg font-bold text-foreground no-underline">
              matewere<span className="text-primary">/lab</span>
            </Link>
            <a href="https://matewere.dev" className="font-mono text-sm">
              matewere.dev
            </a>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">{children}</main>
      </body>
    </html>
  )
}
