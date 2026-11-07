import type {Metadata} from 'next'
import {getLocale, getTranslations} from 'next-intl/server'
import {formaterDate, tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {TexteRiche} from '@/components/TexteRiche'
import {Conteneur, EnTetePage, TeteSection} from '@/components/Section'
import {association} from '@/sanity/lib/requetes'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('association')
  return {title: t('titre')}
}

export default async function PageAssociation() {
  const [t, tc, locale, a] = await Promise.all([getTranslations('association'), getTranslations('commun'), getLocale(), association()])
  const aCompleter = <span className="italic text-gris">{t('aCompleter')}</span>
  const identite: [string, React.ReactNode][] = [
    [t('nomLegal'), a?.nomLegal ?? 'Tierradentro'],
    [t('forme'), a?.forme ?? 'Association loi 1901'],
    [t('siret'), a?.siret ?? aCompleter],
    [t('licence'), a?.licence ?? aCompleter],
    [t('tva'), a?.tva ?? aCompleter],
    [t('siege'), a?.siege ? <span className="whitespace-pre-line">{a.siege}</span> : aCompleter],
  ]
  return (
    <>
      <EnTete />
      <main id="contenu">
        <EnTetePage titre={t('titre')} />
        <Conteneur className="grid gap-x-[clamp(24px,5vw,80px)] gap-y-16 py-[clamp(48px,7vw,110px)] lg:grid-cols-[7fr_5fr]">
          <div className="min-w-0 space-y-16">
            <section aria-labelledby="mission">
              <TeteSection id="mission" titre={t('mission')} />
              <TexteRiche valeur={tr(a?.mission, locale)?.map((b) => stripAValider(b))} className="max-w-3xl" />
            </section>
            {a?.valeurs?.length ? (
              <section aria-labelledby="valeurs">
                <TeteSection id="valeurs" titre={t('valeurs')} />
                <ul className="grid gap-8 sm:grid-cols-2">
                  {a.valeurs.map((v) => (
                    <li key={v._key} className="border-t-2 border-jacaranda pt-4">
                      <h3 className="titre-display text-2xl">{tr(v.titre, locale)}</h3>
                      {v.texte ? <p className="mt-2 text-gris">{tr(v.texte, locale)}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {a?.bureau?.length ? (
              <section aria-labelledby="equipe">
                <TeteSection id="equipe" titre={t('equipe')} />
                <ul className="grid gap-x-8 border-t border-nuit sm:grid-cols-2">
                  {a.bureau.map((m) => (
                    <li key={m._key} className="border-b border-nuit/15 py-4">
                      <strong className="block text-lg">{m.nom}</strong>
                      <span className="text-gris">{tr(m.role, locale)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-12">
            <section aria-labelledby="identite" className="bg-sable-2 p-6 sm:p-8">
              <h2 id="identite" className="titre-display mb-4 text-3xl">
                {t('identite')}
              </h2>
              <dl>
                {identite.map(([k, v]) => (
                  <div key={k} className="border-b border-nuit/15 py-3 last:border-0">
                    <dt className="text-sm text-gris">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section aria-labelledby="rapports">
              <h2 id="rapports" className="titre-display mb-4 text-3xl">
                {t('rapports')}
              </h2>
              {a?.rapports?.length ? (
                <ul className="border-t border-nuit">
                  {a.rapports.map((d) => (
                    <li key={d._key} className="flex flex-wrap items-center justify-between gap-3 border-b border-nuit/15 py-3">
                      <span>
                        <strong className="block">{tr(d.libelle, locale)}</strong>
                        {d.miseAJour ? <span className="text-sm text-gris">{tc('misAJour', {date: formaterDate(d.miseAJour, locale, {day: 'numeric', month: 'long', year: 'numeric'})})}</span> : null}
                      </span>
                      {d.url ? (
                        <a href={`${d.url}?dl=`} className="font-semibold underline underline-offset-4">
                          {tc('telecharger')}
                        </a>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gris">{t('aucunRapport')}</p>
              )}
            </section>
          </aside>
        </Conteneur>
      </main>
    </>
  )
}

// Les textes provisoires commencent par « [À VALIDER] » dans le Studio : on n'affiche pas ce repère.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripAValider(bloc: any) {
  if (bloc?._type !== 'block' || !bloc.children?.[0]?.text) return bloc
  const [premier, ...reste] = bloc.children
  return {...bloc, children: [{...premier, text: premier.text.replace(/^\[À VALIDER\]\s*/, '')}, ...reste]}
}
