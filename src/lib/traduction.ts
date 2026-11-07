import type {Locale} from '@/i18n/routing'

export type Traduit<T = string> = {fr?: T; en?: T; es?: T} | null | undefined

/** Valeur dans la langue demandée, sinon en français (repli automatique). */
export function tr<T>(champ: Traduit<T>, locale: Locale | string): T | undefined {
  if (!champ) return undefined
  const valeur = champ[locale as Locale]
  const vide = valeur === undefined || valeur === null || valeur === '' || (Array.isArray(valeur) && valeur.length === 0)
  const choisie = vide ? champ.fr : valeur
  // Les repères de relecture du Studio (« [À VALIDER] », « [À CONFIRMER] ») ne s'affichent pas sur le site.
  return (typeof choisie === 'string' ? choisie.replace(/^\[À (VALIDER|CONFIRMER)\]\s*/, '') : choisie) as T | undefined
}

/** Date AAAA-MM-JJ formatée sans décalage de fuseau horaire. */
export function formaterDate(iso: string, locale: string, options: Intl.DateTimeFormatOptions) {
  const [a, m, j] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, {...options, timeZone: 'UTC'}).format(new Date(Date.UTC(a, m - 1, j)))
}

export const aujourdhuiIso = () =>
  new Intl.DateTimeFormat('en-CA', {timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date())
