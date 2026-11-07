import {hasLocale} from 'next-intl'
import {getRequestConfig} from 'next-intl/server'
import {locale as localeRacine} from 'next/root-params'
import {routing} from './routing'
import fr from '../../messages/fr.json'

type Messages = {[cle: string]: string | Messages}

// Repli automatique : toute phrase absente en anglais ou en espagnol s'affiche en français.
function fusionner(base: Messages, traduction: Messages): Messages {
  const resultat: Messages = {...base}
  for (const [cle, valeur] of Object.entries(traduction)) {
    const deBase = base[cle]
    resultat[cle] =
      typeof valeur === 'object' && typeof deBase === 'object' ? fusionner(deBase, valeur) : valeur
  }
  return resultat
}

export default getRequestConfig(async ({locale}) => {
  const demande = locale ?? (await localeRacine())
  const choisie = hasLocale(routing.locales, demande) ? demande : routing.defaultLocale
  const traduction: Messages = choisie === 'fr' ? {} : (await import(`../../messages/${choisie}.json`)).default
  return {locale: choisie, messages: fusionner(fr as Messages, traduction)}
})
