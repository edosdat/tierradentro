import Image from 'next/image'
import {getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {EnTete} from '@/components/EnTete'
import {Conteneur, LienFleche} from '@/components/Section'

export default async function Introuvable() {
  const t = await getTranslations('introuvable')
  return (
    <>
      <EnTete />
      <main id="contenu" className="sur-nuit bg-[linear-gradient(180deg,#14182B_0%,#1C2D57_60%,#284A84_100%)] text-sable">
        <Conteneur className="grid items-center gap-10 py-20 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="titre-display text-8xl opacity-60">404</p>
            <h1 className="titre-display mt-4 text-[clamp(2.6rem,6vw,5rem)]">{t('titre')}</h1>
            <p className="mt-4 max-w-lg text-lg text-sable/85">{t('texte')}</p>
            <Link href="/" className="mt-8 inline-block hover:text-turquoise">
              <LienFleche>{t('retour')}</LienFleche>
            </Link>
          </div>
          <Image src="/images/colibri-aquarelle.webp" alt="" width={793} height={777} className="colibri-flotte mx-auto w-[min(70vw,400px)]" />
        </Conteneur>
      </main>
    </>
  )
}
