import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {formaterDate} from '@/lib/traduction'
import type {Concert} from '@/sanity/lib/requetes'

const lieu = (c: Concert) => (/^\d/.test(c.departement) ? `${c.ville} (${c.departement})` : `${c.ville}, ${c.departement}`)

async function ActionBillet({c}: {c: Concert}) {
  const t = await getTranslations('concert')
  if (c.statut === 'annule') return <span className="font-bold uppercase tracking-wider text-magenta-encre">{t('annule')}</span>
  if (c.statut === 'complet') return <span className="font-bold uppercase tracking-wider">{t('complet')}</span>
  if (c.billetterie)
    return (
      <a href={c.billetterie} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4 hover:text-ciel-encre">
        {t('billetterie')}
      </a>
    )
  return <span className="text-gris">{t('billetterieBientot')}</span>
}

// Une date présentée comme un billet (accueil).
export async function Billet({c}: {c: Concert}) {
  const locale = await getLocale()
  const annule = c.statut === 'annule'
  return (
    <li className="relative grid grid-rows-[auto_1fr_auto] border border-nuit/15 bg-[#FBF8F3] transition-transform duration-500 hover:-translate-y-1">
      <div className="flex items-baseline gap-3 border-b border-dashed border-nuit/30 px-5 pt-5 pb-3">
        <span className={`titre-display text-6xl leading-none ${annule ? 'line-through decoration-2' : ''}`}>{formaterDate(c.date, locale, {day: 'numeric'})}</span>
        <span className="text-sm font-bold uppercase tracking-wider">
          {formaterDate(c.date, locale, {month: 'short', year: 'numeric'})}
          <small className="block text-sm font-medium normal-case tracking-normal text-gris">
            {formaterDate(c.date, locale, {weekday: 'long'})}
            {c.heure ? ` · ${c.heure}` : ''}
          </small>
        </span>
      </div>
      <div className="px-5 py-4">
        <strong className="block text-lg">{c.salle}</strong>
        <span className="text-gris">{lieu(c)}</span>
        {c.projet ? (
          <p className="mt-3 text-sm">
            <Link href={`/projets/${c.projet.slug}`} className="hover:underline">
              {c.projet.titre}
            </Link>
          </p>
        ) : null}
      </div>
      <div className="flex justify-end bg-sable-2 px-5 py-3 text-sm">
        <ActionBillet c={c} />
      </div>
    </li>
  )
}

// Une date en ligne (agenda, fiche projet, archives).
export async function LigneConcert({c, avecProjet = true, compacte = false}: {c: Concert; avecProjet?: boolean; compacte?: boolean}) {
  const locale = await getLocale()
  return (
    <li data-projet={c.projet?.slug} className={`grid gap-x-6 gap-y-1 border-b border-nuit/15 sm:grid-cols-[15rem_1fr_auto] sm:items-center ${compacte ? 'py-3' : 'py-5'}`}>
      <p className={`font-semibold first-letter:uppercase ${c.statut === 'annule' ? 'line-through' : ''}`}>
        <time dateTime={c.date}>{formaterDate(c.date, locale, {weekday: compacte ? undefined : 'long', day: 'numeric', month: 'long', year: 'numeric'})}</time>
        {c.heure ? <span className="font-normal text-gris"> · {c.heure}</span> : null}
      </p>
      <p>
        <strong className="font-semibold">{c.salle}</strong>
        <span className="text-gris"> · {lieu(c)}</span>
        {avecProjet && c.projet ? (
          <span className="block text-sm">
            <Link href={`/projets/${c.projet.slug}`} className="hover:underline">
              {c.projet.titre}
            </Link>
          </span>
        ) : null}
      </p>
      {compacte ? null : (
        <p className="text-sm">
          <ActionBillet c={c} />
        </p>
      )}
    </li>
  )
}
