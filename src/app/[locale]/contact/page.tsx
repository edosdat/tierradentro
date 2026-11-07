import type {Metadata} from 'next'
import {getLocale, getTranslations} from 'next-intl/server'
import {tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {FormulaireContact} from '@/components/FormulaireContact'
import {Conteneur, EnTetePage} from '@/components/Section'
import {association, reglages} from '@/sanity/lib/requetes'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact')
  return {title: t('titre'), description: t('intro')}
}

export default async function PageContact() {
  const [t, locale, regl, asso] = await Promise.all([getTranslations('contact'), getLocale(), reglages(), association()])
  return (
    <>
      <EnTete />
      <main id="contenu">
        <EnTetePage titre={t('titre')} intro={t('intro')} />
        <Conteneur className="grid gap-x-[clamp(24px,5vw,80px)] gap-y-14 py-[clamp(48px,7vw,110px)] lg:grid-cols-[5fr_7fr]">
          <section aria-labelledby="interlocuteurs">
            <h2 id="interlocuteurs" className="titre-display mb-6 text-4xl">
              {t('contacts')}
            </h2>
            {regl?.contacts?.length ? (
              <ul className="border-t border-nuit">
                {regl.contacts.map((c) => (
                  <li key={c._key ?? c.nom} className="border-b border-nuit/15 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gris">{tr(c.role, locale)}</p>
                    <p className="text-lg font-semibold">{c.nom}</p>
                    {c.structure ? <p>{c.structure}</p> : null}
                    {c.telephone ? (
                      <p>
                        <a href={`tel:${c.telephone.replace(/\s/g, '')}`} className="underline-offset-4 hover:underline">
                          {c.telephone}
                        </a>
                      </p>
                    ) : null}
                    {c.email ? (
                      <p>
                        <a href={`mailto:${c.email}`} className="underline underline-offset-4">
                          {c.email}
                        </a>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gris">{t('contactsVides')}</p>
            )}
            {asso?.siege ? <p className="mt-8 whitespace-pre-line text-gris">{asso.siege}</p> : null}
          </section>
          <section aria-labelledby="formulaire">
            <h2 id="formulaire" className="titre-display mb-6 text-4xl">
              {t('formulaire')}
            </h2>
            <FormulaireContact />
          </section>
        </Conteneur>
      </main>
    </>
  )
}
