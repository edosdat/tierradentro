import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {tr, formaterDate} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {LigneConcert} from '@/components/Concerts'
import {couleurProjet, Statut} from '@/components/Projets'
import {Conteneur, Kicker, LienFleche} from '@/components/Section'
import {ImageSanity} from '@/components/ImageSanity'
import {TexteRiche} from '@/components/TexteRiche'
import {VideoLite} from '@/components/VideoLite'
import {projet, slugsProjets} from '@/sanity/lib/requetes'

export async function generateStaticParams() {
  const slugs = await slugsProjets()
  return (slugs.length ? slugs : ['__aucun__']).map((slug) => ({slug}))
}

export async function generateMetadata({params}: PageProps<'/[locale]/projets/[slug]'>): Promise<Metadata> {
  const [{slug}, locale] = await Promise.all([params, getLocale()])
  const p = await projet(slug)
  if (!p) return {}
  return {title: p.titre, description: tr(p.accroche, locale)}
}

const H2 = ({children, id}: {children: React.ReactNode; id: string}) => (
  <h2 id={id} className="titre-display mb-6 text-[clamp(2rem,4vw,3.2rem)]">
    {children}
  </h2>
)

export default async function PageProjet({params}: PageProps<'/[locale]/projets/[slug]'>) {
  const {slug} = await params
  const [p, t, tc, locale] = await Promise.all([projet(slug), getTranslations('projets'), getTranslations('commun'), getLocale()])
  if (!p) notFound()
  const c = couleurProjet(p.couleur)
  const infos = [
    [t('duree'), p.duree],
    [t('public'), tr(p.public, locale)],
    [t('jauge'), tr(p.jauge, locale)],
  ].filter(([, v]) => v) as [string, string][]

  return (
    <>
      <EnTete />
      <main id="contenu">
        <section className={`${c.fond} ${c.texte} ${c.sombre ? 'sur-nuit' : ''} relative overflow-hidden`}>
          <Conteneur className="grid gap-10 pt-14 pb-16 sm:pt-20 lg:grid-cols-[7fr_5fr] lg:items-end">
            <div>
              <p className="mb-5 text-sm">
                <Link href="/projets" className="underline-offset-4 hover:underline">
                  ← {t('titre')}
                </Link>
              </p>
              <Statut statut={p.statut} />
              <h1 className="titre-display mt-5 text-[clamp(3rem,8vw,7rem)] leading-[0.92] [text-wrap:balance]">{p.titre}</h1>
              {p.sousTitre ? <p className="mt-4 text-xl">{tr(p.sousTitre, locale)}</p> : null}
              {p.accroche ? <p className="mt-6 max-w-2xl text-lg leading-relaxed">{tr(p.accroche, locale)}</p> : null}
            </div>
            {p.imagePrincipale?.asset ? (
              <ImageSanity image={p.imagePrincipale} largeur={720} hauteur={900} tailles="(min-width: 1024px) 40vw, 100vw" className="w-full object-cover" prioritaire avecCredit />
            ) : null}
          </Conteneur>
        </section>

        <Conteneur className="grid gap-x-[clamp(24px,5vw,80px)] gap-y-16 py-[clamp(48px,7vw,110px)] lg:grid-cols-[8fr_4fr]">
          <div className="min-w-0 space-y-16">
            {p.presentation ? <TexteRiche valeur={tr(p.presentation, locale)} className="max-w-3xl" /> : null}

            <section aria-labelledby="dates">
              <H2 id="dates">{t('dates')}</H2>
              {p.dates.length ? (
                <ol className="border-t border-nuit">
                  {p.dates.map((d) => (
                    <LigneConcert key={d._id} c={d} avecProjet={false} />
                  ))}
                </ol>
              ) : (
                <p className="text-gris">{t('aucuneDate')}</p>
              )}
            </section>

            {p.videos?.length ? (
              <section aria-labelledby="videos">
                <H2 id="videos">{t('videos')}</H2>
                <ul className="grid gap-8 sm:grid-cols-2">
                  {p.videos.map((v) => (
                    <li key={v._key}>
                      <VideoLite url={v.url} titre={v.titre} legende={tr(v.legende, locale)} libelleLire={tc('lireVideo')} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {p.galerie?.length ? (
              <section aria-labelledby="photos">
                <H2 id="photos">{t('photos')}</H2>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {p.galerie.map((img) => (
                    <li key={img._key}>
                      <ImageSanity image={img} largeur={600} hauteur={600} tailles="(min-width: 768px) 25vw, 50vw" className="aspect-square w-full object-cover" avecCredit />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {p.discographie?.length ? (
              <section aria-labelledby="disco">
                <H2 id="disco">{t('discographie')}</H2>
                <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {p.discographie.map((a) => (
                    <li key={a._key}>
                      {a.pochette?.asset ? (
                        <div className="mb-3 aspect-square">
                          <ImageSanity image={a.pochette} largeur={480} hauteur={480} tailles="(min-width: 1280px) 20vw, 45vw" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        // Pas encore de pochette : un aplat aux couleurs du colibri.
                        <div aria-hidden="true" className="mb-3 grid aspect-square place-items-center bg-[linear-gradient(135deg,#9B7BD9,#2E7BB5)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/images/colibri.svg" alt="" className="h-1/3 w-auto opacity-30 invert" />
                        </div>
                      )}
                      <h3 className="titre-display text-2xl">{a.titre}</h3>
                      <p className="text-sm text-gris">
                        {[a.dateSortie ? formaterDate(a.dateSortie, locale, {day: 'numeric', month: 'long', year: 'numeric'}) : a.annee, a.nombreTitres ? t('titres', {n: a.nombreTitres}) : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                      <p className="mt-2 flex flex-wrap gap-x-4 text-sm">
                        {a.ecoute?.map((l) => (
                          <a key={l._key} href={l.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                            {l.libelle}
                          </a>
                        ))}
                        {a.paroles ? (
                          <a href={`${a.paroles}?dl=`} className="font-semibold underline underline-offset-4">
                            {t('paroles')}
                          </a>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {p.presse.length ? (
              <section aria-labelledby="presse">
                <H2 id="presse">{t('presse')}</H2>
                <ul className="border-t border-nuit">
                  {p.presse.map((a) => (
                    <li key={a._id} className="border-b border-nuit/15 py-4">
                      <p className="text-sm text-gris">
                        {a.media} · {formaterDate(a.date, locale, {day: 'numeric', month: 'long', year: 'numeric'})}
                      </p>
                      {a.lien ? (
                        <a href={a.lien} target="_blank" rel="noopener noreferrer" className="titre-display text-xl hover:underline">
                          {a.titre}
                        </a>
                      ) : (
                        <span className="titre-display text-xl">{a.titre}</span>
                      )}
                      {a.extrait ? <p className="mt-1 text-gris">« {tr(a.extrait, locale)} »</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-10 lg:sticky lg:top-8 lg:self-start">
            {infos.length ? (
              <dl className="border-t border-nuit">
                {infos.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-nuit/15 py-3">
                    <dt className="text-gris">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {p.distribution?.length ? (
              <section aria-labelledby="distribution">
                <Kicker>
                  <span id="distribution">{t('distribution')}</span>
                </Kicker>
                <ul className="border-t border-nuit">
                  {p.distribution.map((m) => (
                    <li key={m._key} className="flex justify-between gap-4 border-b border-nuit/15 py-3">
                      <span className="font-semibold">{m.personne?.nom}</span>
                      <span className="text-right text-gris">{tr(m.role, locale) ?? tr(m.personne?.instruments, locale)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="sur-nuit bg-nuit p-6 text-sable">
              <h2 className="titre-display text-2xl">{t('pro')}</h2>
              <p className="mt-2 text-[15px] text-sable/80">{t('proTexte')}</p>
              <Link href={`/espace-pro#${p.slug}`} className="mt-4 inline-block hover:text-turquoise">
                <LienFleche>{(await getTranslations('nav'))('espacePro')}</LienFleche>
              </Link>
              {p.contactDiffusion?.nom ? (
                <div className="mt-6 border-t border-sable/20 pt-4 text-[15px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sable/65">{t('contactDiffusion')}</p>
                  <p className="font-semibold">{p.contactDiffusion.nom}</p>
                  {p.contactDiffusion.structure ? <p>{p.contactDiffusion.structure}</p> : null}
                  {p.contactDiffusion.telephone ? <p>{p.contactDiffusion.telephone}</p> : null}
                  {p.contactDiffusion.email ? (
                    <a href={`mailto:${p.contactDiffusion.email}`} className="underline underline-offset-4">
                      {p.contactDiffusion.email}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </section>
          </aside>
        </Conteneur>
      </main>
    </>
  )
}
