'use client'

import {useLocale, useTranslations} from 'next-intl'
import {Link, usePathname} from '@/i18n/navigation'
import {routing} from '@/i18n/routing'

const noms = {fr: 'Français', en: 'English', es: 'Español'} as const

// Change de langue en restant sur la même page.
export function SelecteurLangue({className = ''}: {className?: string}) {
  const locale = useLocale()
  const chemin = usePathname()
  const t = useTranslations('nav')
  return (
    <nav aria-label={t('langue')} className={`flex border border-current/35 text-sm font-bold ${className}`}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={chemin}
          locale={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          title={noms[l]}
          className={`px-2.5 py-1.5 uppercase transition-colors ${l === locale ? 'bg-sable text-nuit' : 'hover:bg-sable/15'}`}
        >
          {l}
        </Link>
      ))}
    </nav>
  )
}
