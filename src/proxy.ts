import createMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'

// Redirige « / » vers la langue du visiteur (français par défaut) et gère les préfixes /fr, /en, /es.
export default createMiddleware(routing)

export const config = {
  // Tout sauf le Studio, les routes d'API, les fichiers internes de Next et les fichiers avec extension.
  matcher: ['/((?!studio|api|_next|_vercel|.*\\..*).*)'],
}
