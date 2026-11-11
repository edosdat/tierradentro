import type {MetadataRoute} from 'next'
import {routing} from '@/i18n/routing'
import {SITE_URL} from '@/lib/seo'
import {slugsActualites, slugsArtistes, slugsPages, slugsProjets} from '@/sanity/lib/requetes'

// Plan du site pour les moteurs de recherche, avec les trois langues de chaque page.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projets, actualites, pages, artistes] = await Promise.all([slugsProjets(), slugsActualites(), slugsPages(), slugsArtistes()])
  const chemins = [
    '',
    '/association',
    '/projets',
    '/agenda',
    '/espace-pro',
    '/presse',
    '/actualites',
    '/contact',
    ...projets.map((s) => `/projets/${s}`),
    ...artistes.map((s) => `/artistes/${s}`),
    ...actualites.map((s) => `/actualites/${s}`),
    ...pages.map((s) => `/${s}`),
  ]
  return chemins.flatMap((chemin) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${chemin}`,
      changeFrequency: chemin === '' || chemin === '/agenda' ? ('weekly' as const) : ('monthly' as const),
      priority: chemin === '' ? 1 : chemin === '/agenda' || chemin.startsWith('/projets') ? 0.8 : 0.5,
      alternates: {languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${chemin}`]))},
    })),
  )
}
