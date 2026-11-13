import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {HerosAccueil} from '@/components/HerosAccueil'
import {Billet} from '@/components/Concerts'
import {CarteProjet, Statut} from '@/components/Projets'
import {Conteneur, Kicker, LienFleche, TeteSection} from '@/components/Section'
import {VideoLite} from '@/components/VideoLite'
import {ImageSanity} from '@/components/ImageSanity'
import {jsonLd} from '@/lib/seo'
import {evenement, organisation} from '@/lib/donnees-structurees'
import {chiffresActivite, concertsAVenir, partenaires, projet, projets, projetsPro, reglages} from '@/sanity/lib/requetes'

export default async function Accueil() {
  const [t, tp, locale, regl, dates, liste, chiffres, pro, parts] = await Promise.all([
    getTranslations('accueil'),
    getTranslations('pro'),
    getLocale(),
    reglages(),
    concertsAVenir(),
    projets(),
    chiffresActivite(),
    projetsPro(),
    partenaires(),
  ])
  const enTournee = liste.filter((p) => p.statut === 'en-tournee').length
  const principaux = liste.filter((p) => p.statut !== 'archive').slice(0, 4)
  const autres = liste.filter((p) => p.statut !== 'archive').slice(4)
  const une = liste[0] ? await projet(liste[0].slug) : null
  const accroche = tr(regl?.accroche, locale) ?? t('accroche')

  return (
    <>
      <EnTete surHeros />
      <main id="contenu">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd([organisation(regl?.reseaux?.map((r) => r.url)), ...dates.slice(0, 6).map((c) => evenement(c, locale))])}
        />
        <HerosAccueil accroche={accroche} video={regl?.videoFond} />

        {/* Présentation et preuve d'activité */}
        <section id="suite" aria-labelledby="titre-intro" className="py-[clamp(64px,9vw,140px)]">
          <Conteneur className="grid gap-x-[clamp(24px,5vw,80px)] gap-y-6 md:grid-cols-[4fr_8fr]">
            <div>
              <Kicker>
                <span id="titre-intro">{t('introKicker')}</span>
              </Kicker>
              <Link href="/association">
                <LienFleche>{t('introLien')}</LienFleche>
              </Link>
            </div>
            <p className="titre-display text-[clamp(1.7rem,3.3vw,3rem)] leading-[1.12] [text-wrap:pretty]">{tr(regl?.presentation, locale) ?? t('introTexte')}</p>
            {chiffres.dates > 0 ? (
              <dl className="grid grid-cols-2 border-t border-nuit sm:grid-cols-3 md:col-start-2">
                <div className="pt-4 pr-4">
                  <dt className="sr-only">{t('chiffreDates', {annee: chiffres.depuis ?? ''})}</dt>
                  <dd className="titre-display text-[clamp(2.6rem,5vw,4.6rem)] leading-none">{chiffres.dates}</dd>
                  <dd className="text-sm text-gris">{t('chiffreDates', {annee: chiffres.depuis ?? ''})}</dd>
                </div>
                <div className="pt-4 pr-4">
                  <dt className="sr-only">{t('chiffreDepartements')}</dt>
                  <dd className="titre-display text-[clamp(2.6rem,5vw,4.6rem)] leading-none">{chiffres.departements}</dd>
                  <dd className="text-sm text-gris">
                    {t('chiffreDepartements')}
                    {chiffres.pays.length ? ` ${t('chiffrePays', {pays: chiffres.pays.join(', ')})}` : ''}
                  </dd>
                </div>
                <div className="pt-4 pr-4">
                  <dt className="sr-only">{t('chiffreProjets')}</dt>
                  <dd className="titre-display text-[clamp(2.6rem,5vw,4.6rem)] leading-none">{enTournee}</dd>
                  <dd className="text-sm text-gris">{t('chiffreProjets')}</dd>
                </div>
              </dl>
            ) : null}
          </Conteneur>
        </section>

        {/* Projets */}
        <section aria-labelledby="titre-projets" className="pb-[clamp(64px,9vw,140px)]">
          <Conteneur>
            <TeteSection
              id="titre-projets"
              kicker={t('nosProjetsKicker')}
              titre={t('nosProjets')}
              action={
                <Link href="/projets">
                  <LienFleche>{t('tousLesProjets')}</LienFleche>
                </Link>
              }
            />
            <ul className="grid gap-5 md:grid-cols-2">
              {principaux.map((p) => (
                <li key={p._id} className="grid">
                  <CarteProjet p={p} />
                </li>
              ))}
            </ul>
            {autres.length ? (
              <ul className="mt-5">
                {autres.map((p) => (
                  <li key={p._id}>
                    <Link href={`/projets/${p.slug}`} className="flex flex-wrap items-center justify-between gap-4 border-y border-nuit/20 py-5 hover:bg-sable-2/60">
                      <span>
                        <span className="titre-display block text-[clamp(1.4rem,2.6vw,2.2rem)]">{p.titre}</span>
                        {p.accroche ? <span className="text-gris">{tr(p.accroche, locale)}</span> : null}
                      </span>
                      <Statut statut={p.statut} className="text-magenta-encre" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </Conteneur>
        </section>

        {/* Prochaines dates */}
        <section aria-labelledby="titre-dates" className="pb-[clamp(64px,9vw,140px)]">
          <Conteneur>
            <TeteSection
              id="titre-dates"
              titre={t('prochainesDates')}
              action={
                <Link href="/agenda">
                  <LienFleche>{t('agendaComplet')}</LienFleche>
                </Link>
              }
            />
            {dates.length ? (
              <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {dates.slice(0, 6).map((c) => (
                  <Billet key={c._id} c={c} />
                ))}
              </ol>
            ) : (
              <p className="text-gris">{t('aucuneDate')}</p>
            )}
          </Conteneur>
        </section>

        {/* Projet à la une */}
        {une ? (
          <section aria-labelledby="titre-une" className="sur-nuit bg-nuit py-[clamp(64px,9vw,140px)] text-sable">
            <Conteneur className="grid items-start gap-[clamp(24px,4vw,64px)] lg:grid-cols-[7fr_5fr]">
              <div>
                <Kicker>{t('aLaUne')}</Kicker>
                <h2 id="titre-une" className="titre-display mb-6 text-[clamp(3.2rem,9vw,8.6rem)] leading-[0.86]">
                  {une.titre}
                </h2>
                {une.sousTitre || une.accroche ? (
                  <p className="mb-8 max-w-2xl text-lg text-sable/85">{tr(une.sousTitre, locale) ?? tr(une.accroche, locale)}</p>
                ) : null}
                {une.distribution?.length ? (
                  <ul className="mb-8 grid gap-x-8 sm:grid-cols-2">
                    {une.distribution.map((m) => (
                      <li key={m._key} className="border-t border-sable/20 py-3">
                        {m.personne?.slug ? (
                          <Link href={`/artistes/${m.personne.slug}`} className="block font-semibold underline decoration-sable/30 underline-offset-4 hover:decoration-current">
                            {m.personne.nom}
                          </Link>
                        ) : (
                          <strong className="block font-semibold">{m.personne?.nom}</strong>
                        )}
                        <span className="text-[15px] text-sable/70">{tr(m.role, locale) ?? tr(m.personne?.instruments, locale)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {une.discographie?.length ? (
                  <p className="mb-8 text-sable/85">
                    <span className="font-semibold">{t('discographie')} : </span>
                    {une.discographie
                      .filter((a) => a.dateSortie || a.annee)
                      .map((a) => `${a.titre} (${a.dateSortie?.slice(0, 4) ?? a.annee})`)
                      .join(' · ')}
                  </p>
                ) : null}
                <Link href={`/projets/${une.slug}`} className="hover:text-turquoise">
                  <LienFleche>{t('voirLeProjet')}</LienFleche>
                </Link>
              </div>
              <div>
                <div
                  className={`relative grid place-items-center overflow-hidden ${une.imagePrincipale?.asset ? '' : 'aspect-[4/5]'}`}
                  style={{background: 'radial-gradient(90% 70% at 30% 25%, rgba(210,31,208,.35), transparent 60%), radial-gradient(80% 60% at 75% 85%, rgba(63,201,214,.3), transparent 60%), #1E2440'}}
                >
                  {une.imagePrincipale?.asset ? (
                    <ImageSanity image={une.imagePrincipale} largeur={800} hauteur={800} entiere tailles="(min-width: 1024px) 45vw, 100vw" className="h-auto w-full" avecCredit />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/images/colibri-aquarelle.webp" alt="" width={793} height={777} className="h-auto w-[70%]" />
                  )}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border border-sable/30 p-5">
                  <div>
                    <strong className="titre-display block text-2xl">{t('votreProjet')}</strong>
                    <span className="text-[15px] text-sable/75">{t('votreProjetTexte')}</span>
                  </div>
                  <Link href="/contact" className="hover:text-turquoise">
                    <LienFleche>{t('proposerUnProjet')}</LienFleche>
                  </Link>
                </div>
              </div>
            </Conteneur>
          </section>
        ) : null}

        {/* Vidéo à la une */}
        {regl?.videoUne?.url ? (
          <section aria-label={t('videoUne')} className="sur-nuit bg-nuit pb-[clamp(64px,9vw,140px)] text-sable">
            <Conteneur>
              <Kicker>{t('videoUne')}</Kicker>
              <VideoLite url={regl.videoUne.url} titre={regl.videoUne.titre} legende={tr(regl.videoUne.legende, locale)} libelleLire={(await getTranslations('commun'))('lireVideo')} />
            </Conteneur>
          </section>
        ) : null}

        {/* Espace pro */}
        <section aria-labelledby="titre-pro" className="py-[clamp(64px,9vw,140px)]">
          <Conteneur className="grid gap-[clamp(24px,5vw,80px)] lg:grid-cols-[4fr_8fr]">
            <div>
              <Kicker>{t('proKicker')}</Kicker>
              <h2 id="titre-pro" className="titre-display mb-5 text-[clamp(2.4rem,5vw,4.4rem)] [text-wrap:balance]">
                {t('proTitre')}
              </h2>
              <p className="mb-6 text-gris">{t('proTexte')}</p>
              <Link href="/espace-pro">
                <LienFleche>{t('proLien')}</LienFleche>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-[15px]">
                <caption className="sr-only">{tp('documents')}</caption>
                <thead>
                  <tr className="border-b border-nuit text-left text-xs uppercase tracking-[0.1em] text-gris">
                    <th scope="col" className="py-3 pr-3 font-semibold">{(await getTranslations('concert'))('projet')}</th>
                    <th scope="col" className="py-3 pr-3 font-semibold">{tp('type.fiche-technique')}</th>
                    <th scope="col" className="py-3 pr-3 font-semibold">{tp('type.dossier-de-presse')}</th>
                    <th scope="col" className="py-3 font-semibold">{tp('photosHD')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pro.map((p) => {
                    const doc = (type: string) => p.documentsPro?.find((d) => d.type === type)
                    const cellule = (type: string) => {
                      const d = doc(type)
                      return d?.url ? (
                        <a href={`${d.url}?dl=`} className="font-semibold text-ciel-encre underline underline-offset-4">
                          PDF
                        </a>
                      ) : (
                        <span className="text-gris">—</span>
                      )
                    }
                    return (
                      <tr key={p._id} className="border-b border-nuit/15 align-top">
                        <th scope="row" className="py-3 pr-3 text-left font-semibold">
                          <Link href={`/espace-pro#${p.slug}`} className="hover:underline">
                            {p.titre}
                          </Link>
                        </th>
                        <td className="py-3 pr-3">{cellule('fiche-technique')}</td>
                        <td className="py-3 pr-3">{cellule('dossier-de-presse')}</td>
                        <td className="py-3">
                          {p.galerie?.length ? (
                            <Link href={`/espace-pro#${p.slug}`} className="font-semibold text-ciel-encre underline underline-offset-4">
                              {p.galerie.length}
                            </Link>
                          ) : (
                            <span className="text-gris">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Conteneur>
        </section>

        {/* Partenaires : masqué tant qu'aucun logo n'est saisi */}
        {parts.length ? (
          <section aria-labelledby="titre-partenaires" className="border-t border-nuit/15 py-16">
            <Conteneur>
              <Kicker>
                <span id="titre-partenaires">{t('partenaires')}</span>
              </Kicker>
              <ul className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-8">
                {parts.map((p) => (
                  <li key={p._id}>
                    {p.lien ? (
                      <a href={p.lien} target="_blank" rel="noopener noreferrer">
                        <ImageSanity image={{...p.logo, alt: {fr: p.logo.alt}}} largeur={200} hauteur={64} tailles="170px" entiere className="h-auto max-h-16 w-auto max-w-[170px] object-contain" />
                      </a>
                    ) : (
                      <ImageSanity image={{...p.logo, alt: {fr: p.logo.alt}}} largeur={200} hauteur={64} tailles="170px" entiere className="h-auto max-h-16 w-auto max-w-[170px] object-contain" />
                    )}
                  </li>
                ))}
              </ul>
            </Conteneur>
          </section>
        ) : null}
      </main>
    </>
  )
}
