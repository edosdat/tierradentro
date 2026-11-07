'use client'

import {useEffect, useRef, useState} from 'react'
import {useTranslations} from 'next-intl'
import {Link} from '@/i18n/navigation'
import {rubriques} from './liens'
import {SelecteurLangue} from './SelecteurLangue'

export function MenuMobile() {
  const t = useTranslations('nav')
  const [ouvert, setOuvert] = useState(false)
  const bouton = useRef<HTMLButtonElement>(null)

  // Fermer avec la touche Échap (et au clic sur un lien, plus bas).
  useEffect(() => {
    if (!ouvert) return
    const echap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOuvert(false)
        bouton.current?.focus()
      }
    }
    document.addEventListener('keydown', echap)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', echap)
      document.body.style.overflow = ''
    }
  }, [ouvert])

  return (
    <div className="lg:hidden">
      <button
        ref={bouton}
        type="button"
        aria-expanded={ouvert}
        aria-controls="menu-mobile"
        onClick={() => setOuvert((o) => !o)}
        className="border border-current/50 px-3 py-2 text-sm font-semibold"
      >
        {ouvert ? t('fermer') : t('menu')}
      </button>
      <div
        id="menu-mobile"
        hidden={!ouvert}
        className="sur-nuit fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-nuit px-4 pb-10 pt-6 text-sable"
      >
        <nav aria-label={t('principale')}>
          <ul className="flex flex-col">
            {rubriques.map((r) => (
              <li key={r.cle} className="border-b border-sable/15">
                <Link href={r.href} onClick={() => setOuvert(false)} className="titre-display block py-4 text-4xl">
                  {t(r.cle)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/espace-pro" onClick={() => setOuvert(false)} className="bg-turquoise px-4 py-3 font-bold text-nuit">
            {t('espacePro')}
          </Link>
          <SelecteurLangue />
        </div>
      </div>
    </div>
  )
}
