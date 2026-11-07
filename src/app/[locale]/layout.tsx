import type {Metadata} from 'next'
import localFont from 'next/font/local'
import {notFound} from 'next/navigation'
import {locale as localeRacine} from 'next/root-params'
import {hasLocale, NextIntlClientProvider} from 'next-intl'
import {getTranslations} from 'next-intl/server'
import {routing} from '@/i18n/routing'
import {PiedDePage} from '@/components/PiedDePage'
import {SITE_URL, alternates} from '@/lib/seo'
import '../globals.css'

// Polices auto-hébergées : aucun appel à Google Fonts.
const fraunces = localFont({
  src: [
    {path: '../../fonts/fraunces-latin-full-normal.woff2', style: 'normal', weight: '100 900'},
    {path: '../../fonts/fraunces-latin-full-italic.woff2', style: 'italic', weight: '100 900'},
  ],
  variable: '--font-fraunces',
  display: 'swap',
})
const interTight = localFont({
  src: [
    {path: '../../fonts/inter-tight-latin-wght-normal.woff2', style: 'normal', weight: '100 900'},
    {path: '../../fonts/inter-tight-latin-wght-italic.woff2', style: 'italic', weight: '100 900'},
  ],
  variable: '--font-inter-tight',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}))
}

export async function generateMetadata(): Promise<Metadata> {
  const [t, racine] = await Promise.all([getTranslations('meta'), localeRacine()])
  const locale = racine ?? routing.defaultLocale
  return {
    metadataBase: new URL(SITE_URL),
    title: {default: t('titre'), template: `%s · ${t('suffixe')}`},
    description: t('description'),
    alternates: alternates(locale),
    openGraph: {type: 'website', siteName: 'Tierradentro', title: t('titre'), description: t('description'), url: `/${locale}`, images: [{url: '/images/og-tierradentro.jpg', width: 1200, height: 630, alt: 'Tierradentro'}]},
    twitter: {card: 'summary_large_image'},
  }
}

export default async function LayoutSite({children}: LayoutProps<'/[locale]'>) {
  const locale = await localeRacine()
  if (!hasLocale(routing.locales, locale)) notFound()
  return (
    <html lang={locale} className={`${fraunces.variable} ${interTight.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <NextIntlClientProvider>
          {children}
          <PiedDePage />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
