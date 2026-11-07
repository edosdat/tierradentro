import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {formaterDate, tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {ImageSanity} from '@/components/ImageSanity'
import {TexteRiche} from '@/components/TexteRiche'
import {Conteneur} from '@/components/Section'
import {actualite, slugsActualites} from '@/sanity/lib/requetes'

export async function generateStaticParams() {
  const slugs = await slugsActualites()
  return (slugs.length ? slugs : ['__aucune__']).map((slug) => ({slug}))
}

export async function generateMetadata({params}: PageProps<'/[locale]/actualites/[slug]'>): Promise<Metadata> {
  const [{slug}, locale] = await Promise.all([params, getLocale()])
  const a = await actualite(slug)
  return a ? {title: tr(a.titre, locale), description: tr(a.resume, locale)} : {}
}

export default async function PageActualite({params}: PageProps<'/[locale]/actualites/[slug]'>) {
  const {slug} = await params
  const [a, t, locale] = await Promise.all([actualite(slug), getTranslations('actualites'), getLocale()])
  if (!a) notFound()
  return (
    <>
      <EnTete />
      <main id="contenu">
        <Conteneur className="max-w-4xl py-[clamp(48px,7vw,110px)]">
          <p className="mb-6 text-sm">
            <Link href="/actualites" className="underline-offset-4 hover:underline">
              ← {t('titre')}
            </Link>
          </p>
          <p className="text-gris">{formaterDate(a.date, locale, {day: 'numeric', month: 'long', year: 'numeric'})}</p>
          <h1 className="titre-display mt-2 text-[clamp(2.6rem,6vw,5rem)] [text-wrap:balance]">{tr(a.titre, locale)}</h1>
          <p className="mt-6 text-xl leading-relaxed">{tr(a.resume, locale)}</p>
          {a.image?.asset ? (
            <div className="my-10">
              <ImageSanity image={a.image} largeur={1200} hauteur={750} tailles="(min-width: 896px) 896px, 100vw" className="w-full" prioritaire avecCredit />
            </div>
          ) : null}
          <TexteRiche valeur={tr(a.contenu, locale)} />
        </Conteneur>
      </main>
    </>
  )
}
