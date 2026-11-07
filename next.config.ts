import type {NextConfig} from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const dev = process.env.NODE_ENV === 'development'

// Politique de sécurité du site public : seules les sources dont le site a besoin sont autorisées.
// Les pages restant statiques (rapides), les scripts en ligne de Next.js imposent 'unsafe-inline'.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io https://challenges.cloudflare.com",
  'frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com',
  "media-src 'self' https://cdn.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')

const entetesCommuns = [
  {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'},
  {key: 'X-Frame-Options', value: 'DENY'},
  {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'},
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      // Site public : politique stricte.
      {source: '/((?!studio|_next/static|_next/image).*)', headers: [...entetesCommuns, {key: 'Content-Security-Policy', value: csp}]},
      // Studio : l'authentification est gérée par Sanity ; il ne peut pas être affiché dans un cadre.
      {source: '/studio/:chemin*', headers: [...entetesCommuns, {key: 'Content-Security-Policy', value: "frame-ancestors 'none'"}]},
    ]
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default withNextIntl(nextConfig)
