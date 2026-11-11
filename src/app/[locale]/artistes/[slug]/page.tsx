import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {jsonLd, metaPage, SITE_URL} from '@/lib/seo'
import {tr} from '@/lib/traduction'
import {urlImage} from '@/sanity/lib/image'
import {artiste, slugsArtistes} from '@/sanity/lib/requetes'
import {EnTete} from '@/components/EnTete'
import {Conteneur, Kicker, LienFleche} from '@/components/Section'
import {ImageSanity} from '@/components/ImageSanity'
import {CarteProjet} from '@/components/Projets'

// Page d'un artiste : on y arrive depuis la distribution d'un projet.
// Tierradentro produit des projets : la page met en avant les projets où joue l'artiste,
// sans contact ni bouton de programmation propres à l'artiste.

export async function generateStaticParams() {
  const slugs = await slugsArtistes()
  return (slugs.length ? slugs : ['__aucun__']).map((slug) => ({slug}))
}

export async function generateMetadata({params}: PageProps<'/[locale]/artistes/[slug]'>): Promise<Metadata> {
  const [{slug}, locale] = await Promise.all([params, getLocale()])
  const [a, t] = await Promise.all([artiste(slug), getTranslations('artiste')])
  if (!a) return {}
  const instruments = tr(a.instruments, locale)
  return metaPage({
    titre: a.nom,
    description: instruments ? t('description', {nom: a.nom, instruments}) : undefined,
    chemin: `/artistes/${slug}`,
    image: a.photo?.asset ? urlImage(a.photo).width(1200).height(630).url() : undefined,
  })
}

export default async function PageArtiste({params}: PageProps<'/[locale]/artistes/[slug]'>) {
  const {slug} = await params
  const [a, t, tp, locale] = await Promise.all([artiste(slug), getTranslations('artiste'), getTranslations('projets'), getLocale()])
  if (!a) notFound()
  const instruments = tr(a.instruments, locale)
  const bio = tr(a.bio, locale)

  return (
    <>
      <EnTete />
      <main id="contenu">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: a.nom,
            url: `${SITE_URL}/${locale}/artistes/${a.slug}`,
            ...(instruments ? {jobTitle: instruments} : {}),
            ...(a.photo?.asset ? {image: urlImage(a.photo).width(800).url()} : {}),
            memberOf: a.projets.map((p) => ({'@type': 'PerformingGroup', name: p.titre, url: `${SITE_URL}/${locale}/projets/${p.slug}`})),
          })}
        />
        <section className="sur-nuit relative overflow-hidden bg-[linear-gradient(180deg,#14182B_0%,#1C2D57_70%,#284A84_100%)] text-sable">
          <Conteneur className="grid gap-10 pt-14 pb-16 sm:pt-20 md:grid-cols-[5fr_7fr] md:items-end">
            {a.photo?.asset ? (
              <ImageSanity image={a.photo} largeur={600} hauteur={600} tailles="(min-width: 768px) 40vw, 100vw" className="aspect-square w-full max-w-md bg-sable/10 object-cover" prioritaire avecCredit />
            ) : null}
            <div className="md:pb-4">
              <p className="mb-5 text-sm">
                <Link href="/projets" className="underline-offset-4 hover:underline">
                  ← {tp('titre')}
                </Link>
              </p>
              <h1 className="titre-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] [text-wrap:balance]">{a.nom}</h1>
              {instruments ? <p className="mt-4 text-xl text-sable/90">{instruments}</p> : null}
            </div>
          </Conteneur>
        </section>

        <Conteneur className="grid gap-x-[clamp(24px,5vw,80px)] gap-y-16 py-[clamp(48px,7vw,110px)] lg:grid-cols-[7fr_5fr]">
          {bio ? (
            <section aria-labelledby="biographie" className="min-w-0">
              <Kicker>
                <span id="biographie">{t('biographie')}</span>
              </Kicker>
              <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
                {bio
                  .split(/\n\s*\n/)
                  .map((para) => para.replace(/\s*\n\s*/g, ' ').trim())
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
            </section>
          ) : null}

          {a.projets.length ? (
            <section aria-labelledby="projets-artiste" className={bio ? '' : 'lg:col-span-2'}>
              <Kicker>
                <span id="projets-artiste">{t('joueDans')}</span>
              </Kicker>
              <ul className="grid gap-4">
                {a.projets.map((p) => (
                  <li key={p._id}>
                    <CarteProjet p={p} grande={false} />
                    {tr(p.role, locale) ? <p className="mt-2 text-sm text-gris">{tr(p.role, locale)}</p> : null}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[15px] text-gris">{t('programmer')}</p>
              <Link href="/espace-pro" className="mt-3 inline-block">
                <LienFleche>{(await getTranslations('nav'))('espacePro')}</LienFleche>
              </Link>
            </section>
          ) : null}
        </Conteneur>
      </main>
    </>
  )
}
