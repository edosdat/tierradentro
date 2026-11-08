import type {Metadata} from 'next'
import {metaPage} from '@/lib/seo'
import {getTranslations} from 'next-intl/server'
import {EnTete} from '@/components/EnTete'
import {LigneConcert} from '@/components/Concerts'
import {FiltreProjets} from '@/components/FiltreProjets'
import {Conteneur, EnTetePage, TeteSection} from '@/components/Section'
import {concertsAVenir, concertsPasses, type Concert} from '@/sanity/lib/requetes'
import {jsonLd} from '@/lib/seo'
import {evenement} from '@/lib/donnees-structurees'
import {getLocale} from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('agenda')
  return metaPage({titre: t('titre'), description: t('intro'), chemin: '/agenda'})
}

const projetsDe = (liste: Concert[]) =>
  [...new Map(liste.filter((c) => c.projet).map((c) => [c.projet!.slug, {slug: c.projet!.slug, titre: c.projet!.titre}])).values()]

export default async function PageAgenda() {
  const [t, aVenir, passes, locale] = await Promise.all([getTranslations('agenda'), concertsAVenir(), concertsPasses(), getLocale()])
  const parAnnee = Map.groupBy(passes, (c) => c.date.slice(0, 4))
  return (
    <>
      <EnTete />
      <main id="contenu">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(aVenir.map((c) => evenement(c, locale)))} />
        <EnTetePage titre={t('titre')} intro={t('intro')} />
        <Conteneur className="py-[clamp(48px,7vw,110px)]">
          <section aria-labelledby="a-venir">
            <TeteSection id="a-venir" titre={t('aVenir')} />
            <FiltreProjets options={projetsDe(aVenir)} libelle={t('filtrer')} tous={t('tousProjets')}>
              <ol className="border-t border-nuit">
                {aVenir.map((c) => (
                  <LigneConcert key={c._id} c={c} />
                ))}
              </ol>
            </FiltreProjets>
          </section>

          <section aria-labelledby="archives" className="mt-[clamp(64px,9vw,140px)]">
            <TeteSection id="archives" titre={t('archives')} />
            <p className="-mt-6 mb-8 text-gris">{t('archivesIntro')}</p>
            <FiltreProjets options={projetsDe(passes)} libelle={t('filtrer')} tous={t('tousProjets')}>
              <div className="border-t border-nuit">
                {[...parAnnee.entries()].map(([annee, liste], i) => (
                  <details key={annee} open={i === 0} className="group border-b border-nuit/20">
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 py-5">
                      <span className="titre-display text-4xl">{annee}</span>
                      <span className="text-gris">
                        <span data-compte="">{t('nbDates', {n: liste.length})}</span>
                        {[...Map.groupBy(liste, (c) => c.projet?.slug ?? '').entries()].map(([slug, l]) =>
                          slug ? (
                            <span key={slug} data-compte={slug}>
                              {t('nbDates', {n: l.length})}
                            </span>
                          ) : null,
                        )}{' '}
                        <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-180">↓</span>
                      </span>
                    </summary>
                    <ol className="mb-6 border-t border-nuit/15">
                      {liste.map((c) => (
                        <LigneConcert key={c._id} c={c} compacte />
                      ))}
                    </ol>
                  </details>
                ))}
              </div>
            </FiltreProjets>
          </section>
        </Conteneur>
      </main>
    </>
  )
}
