import type {Metadata} from 'next'
import {metaPage} from '@/lib/seo'
import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {formaterDate, tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {BoutonCopier} from '@/components/BoutonCopier'
import {ImageSanity} from '@/components/ImageSanity'
import {Statut} from '@/components/Projets'
import {Conteneur, EnTetePage, Kicker} from '@/components/Section'
import {urlImage} from '@/sanity/lib/image'
import {projetsPro} from '@/sanity/lib/requetes'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('pro')
  return metaPage({titre: t('titre'), description: t('intro'), chemin: '/espace-pro'})
}

const taille = (octets?: number) => (octets ? `${Math.max(1, Math.round(octets / 1024 / 102.4) / 10)} Mo` : '')

export default async function EspacePro() {
  const [t, tc, locale, liste] = await Promise.all([getTranslations('pro'), getTranslations('commun'), getLocale(), projetsPro()])
  return (
    <>
      <EnTete />
      <main id="contenu">
        <EnTetePage titre={t('titre')} intro={t('intro')} />
        <Conteneur className="py-[clamp(48px,7vw,110px)]">
          {liste.length > 1 ? (
            <nav aria-label={t('titre')} className="mb-12 flex flex-wrap gap-3">
              {liste.map((p) => (
                <a key={p._id} href={`#${p.slug}`} className="border border-nuit px-3 py-2 text-sm font-semibold hover:bg-nuit hover:text-sable">
                  {p.titre}
                </a>
              ))}
            </nav>
          ) : null}

          <div className="space-y-[clamp(56px,8vw,120px)]">
            {liste.map((p) => {
              const court = tr(p.texteCourt, locale)
              const long = tr(p.texteLong, locale)
              return (
                <section key={p._id} id={p.slug} aria-labelledby={`titre-${p.slug}`} className="scroll-mt-8 border-t-2 border-nuit pt-8">
                  <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <Statut statut={p.statut} />
                      <h2 id={`titre-${p.slug}`} className="titre-display mt-3 text-[clamp(2.2rem,5vw,4.2rem)]">
                        <Link href={`/projets/${p.slug}`} className="hover:underline">
                          {p.titre}
                        </Link>
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
                    <div>
                      <Kicker>{t('documents')}</Kicker>
                      {p.documentsPro?.length ? (
                        <ul className="border-t border-nuit">
                          {p.documentsPro.map((d) => (
                            <li key={d._key} className="flex flex-wrap items-center justify-between gap-3 border-b border-nuit/15 py-4">
                              <span>
                                <strong className="block">{tr(d.libelle, locale) ?? t(`type.${d.type}` as 'type.autre')}</strong>
                                {d.miseAJour ? (
                                  <span className="text-sm text-gris">{tc('misAJour', {date: formaterDate(d.miseAJour, locale, {day: 'numeric', month: 'long', year: 'numeric'})})}</span>
                                ) : null}
                              </span>
                              {d.url ? (
                                <a href={`${d.url}?dl=`} className="bg-nuit px-4 py-2 text-sm font-semibold text-sable hover:bg-ciel-encre">
                                  {tc('telecharger')} · PDF {taille(d.taille)}
                                </a>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gris">{t('aucunDocument')}</p>
                      )}

                      {p.contactDiffusion?.nom ? (
                        <div className="mt-8 bg-sable-2 p-5 text-[15px]">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gris">{t('contact')}</p>
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
                    </div>

                    <div className="min-w-0 space-y-8">
                      {court ? (
                        <div>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <Kicker className="mb-0">{t('texteCourt')}</Kicker>
                            <BoutonCopier texte={court} libelle={t('copier')} libelleCopie={t('copie')} />
                          </div>
                          <p className="whitespace-pre-line border-l-2 border-jacaranda pl-4">{court}</p>
                        </div>
                      ) : null}
                      {long ? (
                        <div>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <Kicker className="mb-0">{t('texteLong')}</Kicker>
                            <BoutonCopier texte={long} libelle={t('copier')} libelleCopie={t('copie')} />
                          </div>
                          <p className="whitespace-pre-line border-l-2 border-jacaranda pl-4">{long}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {p.galerie?.length ? (
                    <div className="mt-10">
                      <Kicker>{t('photosHD')}</Kicker>
                      <p className="mb-4 text-sm text-gris">{t('photosNote')}</p>
                      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        {p.galerie.map((img) => (
                          <li key={img._key}>
                            <ImageSanity image={img} largeur={400} hauteur={300} tailles="(min-width: 768px) 22vw, 45vw" className="aspect-[4/3] w-full object-cover" />
                            <p className="mt-1 flex justify-between gap-2 text-xs">
                              <span className="text-gris">{img.credit}</span>
                              <a href={`${urlImage(img).url()}&dl=`} className="font-semibold underline underline-offset-2">
                                {tc('telecharger')}
                              </a>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              )
            })}
          </div>
        </Conteneur>
      </main>
    </>
  )
}
