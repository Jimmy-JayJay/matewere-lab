import type { MetadataRoute } from 'next'
import { EXPERIMENTS, SITE } from '@/lib/experiments'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url }, ...EXPERIMENTS.map((e) => ({ url: `${SITE.url}/${e.slug}`, lastModified: e.date }))]
}
