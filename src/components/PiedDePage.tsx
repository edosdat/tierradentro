import {getLocale, getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {tr} from '@/lib/traduction'
import {association, reglages} from '@/sanity/lib/requetes'
import {Conteneur} from './Section'
import {rubriques} from './liens'

export async function PiedDePage() {
  const [t, tn, locale, asso, regl] = await Promise.all([getTranslations('pied'), getTranslations('nav'), getLocale(), association(), reglages()])
  const ta = await getTranslations('association')
  const aCompleter = <span className="italic opacity-70">{ta('aCompleter')}</span>
  return (
    <footer className="sur-nuit overflow-hidden bg-nuit text-sable">
      <p aria-hidden="true" className="titre-display -mb-4 -translate-y-[0.12em] whitespace-nowrap text-[clamp(4rem,18vw,17rem)] leading-[0.8] text-sable/[0.07]">
        Tierradentro
      </p>
      <Conteneur className="pb-8">
        <div className="grid gap-10 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-tierradentro.svg" alt="Tierradentro" width={180} height={36} className="mb-4 h-8 w-auto invert" />
            <p className="text-sable/85">{t('association')}</p>
            {regl?.reseaux?.length ? (
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {regl.reseaux.map((r) => (
                  <li key={r._key}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      {r.libelle}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-sable/65">{t('identite')}</h2>
            <ul className="space-y-1 text-sable/85">
              <li>{asso?.forme ?? 'Association loi 1901'}</li>
              <li>{ta('siret')} : {asso?.siret ?? aCompleter}</li>
              <li>{ta('licence')} : {asso?.licence ?? aCompleter}</li>
              <li>{ta('siege')} : {asso?.siege ?? aCompleter}</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-sable/65">{t('contacts')}</h2>
            <ul className="space-y-1 text-sable/85">
              {regl?.contacts?.length
                ? regl.contacts.map((c) => (
                    <li key={c._key ?? c.nom}>
                      {tr(c.role, locale)} : {c.nom}
                      {c.telephone ? ` · ${c.telephone}` : ''}
                    </li>
                  ))
                : null}
              <li>
                <Link href="/contact" className="underline-offset-4 hover:underline">
                  {tn('contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-sable/65">{t('leSite')}</h2>
            <ul className="space-y-1">
              {rubriques.map((r) => (
                <li key={r.cle}>
                  <Link href={r.href} className="underline-offset-4 hover:underline">
                    {tn(r.cle)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/espace-pro" className="underline-offset-4 hover:underline">
                  {tn('espacePro')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-sable/20 pt-5 text-[13px] text-sable/75">
          <Link href="/mentions-legales" className="hover:underline">{t('mentions')}</Link>
          <Link href="/confidentialite" className="hover:underline">{t('confidentialite')}</Link>
          <Link href="/credits" className="hover:underline">{t('credits')}</Link>
          <span>{t('credit', {nom: regl?.creditIllustration ?? 'Ludo Deny'})}</span>
          <span>{t('droits')}</span>
        </div>
      </Conteneur>
    </footer>
  )
}
