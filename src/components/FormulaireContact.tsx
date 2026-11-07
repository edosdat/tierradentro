'use client'

import Script from 'next/script'
import {useActionState} from 'react'
import {useTranslations} from 'next-intl'
import {envoyerMessage, type EtatFormulaire} from '@/app/[locale]/contact/actions'

const champ = 'w-full border border-nuit/40 bg-white px-3 py-3 text-base focus:border-nuit'
const erreur = 'border-magenta-encre bg-[#FBEFFB]'

export function FormulaireContact({objetParDefaut}: {objetParDefaut?: string}) {
  const t = useTranslations('contact')
  const [etat, action, enCours] = useActionState<EtatFormulaire, FormData>(envoyerMessage, {etat: 'initial'})
  const cleTurnstile = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const en = (nom: keyof NonNullable<EtatFormulaire['champs']>) => (etat.champs?.[nom] ? erreur : '')

  if (etat.etat === 'succes') {
    return (
      <p role="status" className="border-l-4 border-turquoise-encre bg-white p-5 text-lg">
        {t('succes')}
      </p>
    )
  }

  return (
    <form action={action} noValidate className="space-y-5">
      {etat.etat !== 'initial' ? (
        <p role="alert" className="border-l-4 border-magenta-encre bg-white p-4">
          {t(etat.etat === 'erreurChamps' ? 'erreurChamps' : etat.etat === 'trop' ? 'trop' : etat.etat === 'indisponible' ? 'indisponible' : 'erreurEnvoi')}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className="mb-1 block font-semibold">
            {t('nom')} <span className="text-sm font-normal text-gris">({t('requis')})</span>
          </label>
          <input id="nom" name="nom" required autoComplete="name" aria-invalid={!!etat.champs?.nom} className={`${champ} ${en('nom')}`} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">
            {t('email')} <span className="text-sm font-normal text-gris">({t('requis')})</span>
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" aria-invalid={!!etat.champs?.email} className={`${champ} ${en('email')}`} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="structure" className="mb-1 block font-semibold">
            {t('structure')}
          </label>
          <input id="structure" name="structure" autoComplete="organization" className={champ} />
        </div>
        <div>
          <label htmlFor="objet" className="mb-1 block font-semibold">
            {t('objet')}
          </label>
          <select id="objet" name="objet" defaultValue={objetParDefaut ?? 'programmation'} className={`${champ} ${en('objet')}`}>
            {(['programmation', 'presse', 'proposition', 'autre'] as const).map((o) => (
              <option key={o} value={o}>
                {t(`objets.${o}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block font-semibold">
          {t('message')} <span className="text-sm font-normal text-gris">({t('requis')})</span>
        </label>
        <textarea id="message" name="message" required rows={7} aria-invalid={!!etat.champs?.message} className={`${champ} ${en('message')}`} />
      </div>

      {/* Champ piège pour les robots, invisible pour les personnes */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="site">Site</label>
        <input id="site" name="site" tabIndex={-1} autoComplete="off" />
      </div>

      {cleTurnstile ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={cleTurnstile} data-language="auto" />
        </>
      ) : null}

      <p className="text-sm text-gris">{t('rgpd')}</p>
      <button type="submit" disabled={enCours} className="bg-nuit px-6 py-3 font-semibold text-sable hover:bg-ciel-encre disabled:opacity-60">
        {enCours ? t('envoi') : t('envoyer')}
      </button>
    </form>
  )
}
