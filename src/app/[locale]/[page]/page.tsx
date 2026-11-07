import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getLocale} from 'next-intl/server'
import {tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {TexteRiche} from '@/components/TexteRiche'
import {Conteneur} from '@/components/Section'
import {page, slugsPages} from '@/sanity/lib/requetes'

// Pages simples gérées dans le Studio : mentions légales, confidentialité, crédits…
export async function generateStaticParams() {
  const slugs = await slugsPages()
  return (slugs.length ? slugs : ['__aucune__']).map((p) => ({page: p}))
}

export async function generateMetadata({params}: PageProps<'/[locale]/[page]'>): Promise<Metadata> {
  const [{page: slug}, locale] = await Promise.all([params, getLocale()])
  const p = await page(slug)
  return p ? {title: tr(p.titre, locale)} : {}
}

export default async function PageSimple({params}: PageProps<'/[locale]/[page]'>) {
  const {page: slug} = await params
  const [p, locale] = await Promise.all([page(slug), getLocale()])
  if (!p) notFound()
  return (
    <>
      <EnTete />
      <main id="contenu">
        <Conteneur className="max-w-4xl py-[clamp(48px,7vw,110px)]">
          <h1 className="titre-display mb-8 text-[clamp(2.6rem,6vw,5rem)]">{tr(p.titre, locale)}</h1>
          <TexteRiche valeur={tr(p.contenu, locale)} />
        </Conteneur>
      </main>
    </>
  )
}
