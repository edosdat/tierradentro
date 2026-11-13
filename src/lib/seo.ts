import type {Metadata} from 'next'
import {getLocale} from 'next-intl/server'
import {routing} from '@/i18n/routing'

// Adresse publique du site (à changer quand le nom de domaine sera branché).
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://tierradentro.fr').replace(/\/$/, '')

const ogLocale = {fr: 'fr_FR', en: 'en_GB', es: 'es_ES'} as const

/** Liens vers la même page dans chaque langue (balises hreflang) et adresse canonique. */
export function alternates(locale: string, chemin = '') {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `/${l}${chemin}`
  languages['x-default'] = `/${routing.defaultLocale}${chemin}`
  return {canonical: `/${locale}${chemin}`, languages}
}

/** Métadonnées complètes d'une page : titre, description, langues, partage sur les réseaux. */
export async function metaPage({titre, description, chemin = '', image}: {titre?: string; description?: string; chemin?: string; image?: string}): Promise<Metadata> {
  const locale = await getLocale()
  return {
    ...(titre ? {title: titre} : {}),
    ...(description ? {description} : {}),
    alternates: alternates(locale, chemin),
    openGraph: {
      type: 'website',
      siteName: 'Tierradentro',
      locale: ogLocale[locale as keyof typeof ogLocale],
      url: `/${locale}${chemin}`,
      ...(titre ? {title: titre} : {}),
      ...(description ? {description} : {}),
      images: [{url: image ?? '/images/og-tierradentro.jpg', width: 1200, height: 630, alt: titre ?? 'Tierradentro'}],
    },
    twitter: {card: 'summary_large_image'},
  }
}

/** Script JSON-LD (données structurées pour les moteurs de recherche), protégé contre l'injection. */
export const jsonLd = (donnees: unknown) => ({__html: JSON.stringify(donnees).replace(/</g, '\\u003c')})
