import type {Metadata} from 'next'
import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {formaterDate, tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {ImageSanity} from '@/components/ImageSanity'
import {Conteneur, EnTetePage, LienFleche} from '@/components/Section'
import {actualites} from '@/sanity/lib/requetes'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('actualites')
  return {title: t('titre'), description: t('intro')}
}

export default async function PageActualites() {
  const [t, locale, liste] = await Promise.all([getTranslations('actualites'), getLocale(), actualites()])
  return (
    <>
      <EnTete />
      <main id="contenu">
        <EnTetePage titre={t('titre')} intro={t('intro')} />
        <Conteneur className="py-[clamp(48px,7vw,110px)]">
          {liste.length ? (
            <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
              {liste.map((a) => (
                <li key={a._id}>
                  <Link href={`/actualites/${a.slug}`} className="group block">
                    {a.image?.asset ? (
                      <ImageSanity image={a.image} largeur={640} hauteur={420} tailles="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" className="mb-4 aspect-[3/2] w-full object-cover" />
                    ) : null}
                    <p className="text-sm text-gris">{formaterDate(a.date, locale, {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                    <h2 className="titre-display mt-1 text-3xl [text-wrap:balance] group-hover:underline">{tr(a.titre, locale)}</h2>
                    <p className="mt-2 text-gris">{tr(a.resume, locale)}</p>
                    <p className="mt-3">
                      <LienFleche>{t('lire')}</LienFleche>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gris">{t('aucune')}</p>
          )}
        </Conteneur>
      </main>
    </>
  )
}
