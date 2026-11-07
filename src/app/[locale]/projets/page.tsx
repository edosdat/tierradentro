import type {Metadata} from 'next'
import {metaPage} from '@/lib/seo'
import {getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {EnTete} from '@/components/EnTete'
import {CarteProjet} from '@/components/Projets'
import {Conteneur, EnTetePage, LienFleche} from '@/components/Section'
import {projets} from '@/sanity/lib/requetes'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projets')
  return metaPage({titre: t('titre'), description: t('intro'), chemin: '/projets'})
}

export default async function PageProjets() {
  const [t, liste] = await Promise.all([getTranslations('projets'), projets()])
  return (
    <>
      <EnTete />
      <main id="contenu">
        <EnTetePage titre={t('titre')} intro={t('intro')} />
        <Conteneur className="py-[clamp(48px,7vw,110px)]">
          <ul className="grid gap-5 md:grid-cols-2">
            {liste.map((p) => (
              <li key={p._id} className="grid">
                <CarteProjet p={p} niveau={2} />
              </li>
            ))}
            <li className="grid">
              <Link href="/contact" className="flex min-h-[340px] flex-col justify-between border border-dashed border-nuit/45 p-6 hover:bg-sable-2/60 sm:p-9">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/colibri.svg" alt="" className="h-14 w-auto self-start" />
                <div>
                  <h2 className="titre-display block text-[clamp(2rem,3.4vw,3rem)]">{t('rejoindre')}</h2>
                  <p className="mt-3 max-w-md text-gris">{t('rejoindreTexte')}</p>
                </div>
                <span className="self-start">
                  <LienFleche>{(await getTranslations('accueil'))('proposerUnProjet')}</LienFleche>
                </span>
              </Link>
            </li>
          </ul>
        </Conteneur>
      </main>
    </>
  )
}
