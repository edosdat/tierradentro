import type {Metadata} from 'next'
import {metaPage} from '@/lib/seo'
import {getLocale, getTranslations} from 'next-intl/server'
import {formaterDate, tr} from '@/lib/traduction'
import {EnTete} from '@/components/EnTete'
import {FiltreProjets} from '@/components/FiltreProjets'
import {Conteneur, EnTetePage} from '@/components/Section'
import {presse} from '@/sanity/lib/requetes'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('presse')
  return metaPage({titre: t('titre'), description: t('intro'), chemin: '/presse'})
}

export default async function PagePresse() {
  const [t, ta, tc, locale, articles] = await Promise.all([getTranslations('presse'), getTranslations('agenda'), getTranslations('commun'), getLocale(), presse()])
  const options = [...new Map(articles.flatMap((a) => a.projets ?? []).map((p) => [p.slug, p])).values()]
  return (
    <>
      <EnTete />
      <main id="contenu">
        <EnTetePage titre={t('titre')} intro={t('intro')} />
        <Conteneur className="py-[clamp(48px,7vw,110px)]">
          {articles.length ? (
            <FiltreProjets options={options} libelle={ta('filtrer')} tous={ta('tousProjets')}>
              <ul className="grid gap-x-8 border-t border-nuit md:grid-cols-2">
                {articles.map((a) => (
                  // Un article lié à plusieurs projets reste visible pour chacun d'eux.
                  <li key={a._id} data-projet={a.projets?.[0]?.slug} className="border-b border-nuit/15 py-6">
                    <p className="text-sm text-gris">
                      <strong className="font-semibold text-nuit">{a.media}</strong> · {formaterDate(a.date, locale, {day: 'numeric', month: 'long', year: 'numeric'})}
                      {a.projets?.length ? ` · ${a.projets.map((p) => p.titre).join(', ')}` : ''}
                    </p>
                    <h2 className="titre-display mt-2 text-2xl [text-wrap:balance]">{a.titre}</h2>
                    {a.extrait ? <p className="mt-2 text-gris">« {tr(a.extrait, locale)} »</p> : null}
                    {a.lien ? (
                      <a href={a.lien} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold underline underline-offset-4">
                        {t('lire')} <span className="sr-only">{tc('lienExterne')}</span>
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            </FiltreProjets>
          ) : (
            <p className="text-gris">{t('aucun')}</p>
          )}
        </Conteneur>
      </main>
    </>
  )
}
