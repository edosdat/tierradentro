import {getTranslations} from 'next-intl/server'
import {Link} from '@/i18n/navigation'
import {MenuMobile} from './MenuMobile'
import {SelecteurLangue} from './SelecteurLangue'
import {rubriques} from './liens'

// En-tête sombre. Sur l'accueil, il se pose sur le héros (fond transparent).
export async function EnTete({surHeros = false}: {surHeros?: boolean}) {
  const t = await getTranslations('nav')
  return (
    <header className={`sur-nuit z-30 text-sable ${surHeros ? 'absolute inset-x-0 top-0' : 'relative bg-nuit'}`}>
      <a href="#contenu" className="absolute -top-16 left-2 z-50 bg-sable px-3 py-2 text-nuit focus:top-2">
        {t('allerAuContenu')}
      </a>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-6 px-4 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="Tierradentro">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-tierradentro.svg" alt="Tierradentro" width={180} height={36} className="h-8 w-auto invert" />
        </Link>
        <nav aria-label={t('principale')} className="ml-auto hidden lg:block">
          <ul className="flex gap-6 text-[15px] font-medium">
            {rubriques.map((r) => (
              <li key={r.cle}>
                <Link href={r.href} className="opacity-90 underline-offset-[6px] hover:underline hover:opacity-100">
                  {t(r.cle)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SelecteurLangue className="hidden lg:flex" />
        <Link href="/espace-pro" className="hidden bg-turquoise px-4 py-2.5 text-sm font-bold text-nuit hover:bg-sable lg:inline-block">
          {t('espacePro')}
        </Link>
        <div className="ml-auto lg:hidden">
          <MenuMobile />
        </div>
      </div>
    </header>
  )
}
