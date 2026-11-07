import Image from 'next/image'
import {Suspense} from 'react'
import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {routing} from '@/i18n/routing'
import {prochainesDates} from '@/sanity/lib/requetes'

// Page d'accueil provisoire (phase 1) : elle vérifie la chaîne complète,
// du Studio jusqu'à l'affichage des prochaines dates. La vraie page arrive en phase 2.

function formaterDate(iso: string, locale: string) {
  const [a, m, j] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(
    new Date(Date.UTC(a, m - 1, j)),
  )
}

async function ListeDates() {
  const [dates, t, locale] = await Promise.all([prochainesDates(), getTranslations(), getLocale()])
  if (dates === null) return <p className="text-gris">{t('accueil.sanityNonConfigure')}</p>
  if (dates.length === 0) return <p className="text-gris">{t('accueil.aucuneDate')}</p>
  return (
    <ol className="border-t border-nuit">
      {dates.map((d) => (
        <li key={d._id} className="grid gap-x-6 gap-y-1 border-b border-nuit/15 py-5 sm:grid-cols-[16rem_1fr_auto] sm:items-center">
          <p className="font-semibold first-letter:uppercase">
            <time dateTime={d.date}>{formaterDate(d.date, locale)}</time>
            {d.heure ? <span className="font-normal text-gris"> · {d.heure}</span> : null}
          </p>
          <p>
            <strong className="block font-semibold">{d.salle}</strong>
            <span className="text-gris">
              {d.ville} ({d.departement}){d.projet ? ` · ${d.projet.titre}` : ''}
            </span>
          </p>
          <p className="text-sm font-semibold">
            {d.statut === 'annule' ? (
              <span className="text-magenta-encre">{t('concert.annule')}</span>
            ) : d.statut === 'complet' ? (
              <span>{t('concert.complet')}</span>
            ) : d.billetterie ? (
              <a className="inline-block border border-nuit px-3 py-2 hover:bg-nuit hover:text-sable" href={d.billetterie} target="_blank" rel="noopener noreferrer">
                {t('concert.billetterie')}
              </a>
            ) : null}
          </p>
        </li>
      ))}
    </ol>
  )
}

export default async function Accueil() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()])
  return (
    <>
      <a href="#contenu" className="absolute -top-16 left-2 z-50 bg-nuit px-3 py-2 text-sable focus:top-2">
        {t('nav.allerAuContenu')}
      </a>

      <header className="sur-nuit relative overflow-hidden bg-[linear-gradient(180deg,#0D1020_0%,#14182B_25%,#1C2D57_60%,#284A84_85%,#5F67B8_100%)] text-sable">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 sm:px-8">
          <Image src="/images/logo-tierradentro.svg" alt="Tierradentro" width={220} height={44} className="h-8 w-auto invert" priority />
          <nav aria-label={t('nav.langue')} className="flex border border-sable/40 text-sm font-bold">
            {routing.locales.map((l) => (
              <Link key={l} href="/" locale={l} aria-current={l === locale ? 'true' : undefined} className={`px-2.5 py-1.5 uppercase ${l === locale ? 'bg-sable text-nuit' : ''}`}>
                {l}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 pb-20 pt-10 sm:px-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="titre-display text-[clamp(4rem,13vw,11rem)] font-normal">
              <span className="block">Tierra</span>
              <span className="block pl-[0.9em] italic font-light text-[#F1D9F5]">adentro</span>
            </h1>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.16em] text-turquoise">{t('accueil.surtitre')}</p>
            <p className="mt-3 max-w-xl text-lg text-sable/90">{t('accueil.accroche')}</p>
            <p className="mt-6 text-sm text-sable/75">{t('accueil.chantier')}</p>
          </div>
          <Image src="/images/colibri-aquarelle.webp" alt="" width={793} height={777} className="mx-auto w-[min(70vw,420px)]" priority />
        </div>
      </header>

      <main id="contenu" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        <h2 className="titre-display mb-8 text-5xl sm:text-6xl">{t('accueil.prochainesDates')}</h2>
        <Suspense fallback={<p className="text-gris">…</p>}>
          <ListeDates />
        </Suspense>
      </main>

      <footer className="sur-nuit bg-nuit px-4 py-8 text-sm text-sable/75 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-6 gap-y-2">
          <span>{t('pied.droits')}</span>
          <span>{t('pied.credit', {nom: 'Ludo Deny'})}</span>
        </div>
      </footer>
    </>
  )
}
