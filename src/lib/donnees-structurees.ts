import type {Concert, ProjetComplet} from '@/sanity/lib/requetes'
import {SITE_URL} from './seo'
import {tr} from './traduction'

// Données structurées schema.org : elles permettent à Google d'afficher les concerts
// directement dans ses résultats (date, lieu, billetterie).

export const organisation = (reseaux: string[] = []) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organisation`,
  name: 'Tierradentro',
  url: SITE_URL,
  logo: `${SITE_URL}/images/og-tierradentro.jpg`,
  description: 'Association de production de spectacles vivants, Toulouse.',
  address: {'@type': 'PostalAddress', addressLocality: 'Toulouse', addressCountry: 'FR'},
  ...(reseaux.length ? {sameAs: reseaux} : {}),
})

const estFrance = (departement: string) => /^(\d{2,3}|2[AB])$/.test(departement)

export function evenement(c: Concert, locale: string) {
  const debut = c.heure ? `${c.date}T${c.heure}:00` : c.date
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: c.projet ? `${c.projet.titre} · ${c.salle}` : c.salle,
    startDate: debut,
    eventStatus: c.statut === 'annule' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: c.salle,
      address: {
        '@type': 'PostalAddress',
        addressLocality: c.ville,
        ...(estFrance(c.departement) ? {addressRegion: c.departement, addressCountry: 'FR'} : {addressCountry: c.departement}),
      },
    },
    ...(c.projet ? {performer: {'@type': 'PerformingGroup', name: c.projet.titre, url: `${SITE_URL}/${locale}/projets/${c.projet.slug}`}} : {}),
    organizer: {'@id': `${SITE_URL}/#organisation`, '@type': 'Organization', name: 'Tierradentro', url: SITE_URL},
    image: `${SITE_URL}/images/og-tierradentro.jpg`,
    ...(c.billetterie
      ? {offers: {'@type': 'Offer', url: c.billetterie, availability: c.statut === 'complet' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'}}
      : {}),
  }
}

export function groupe(p: ProjetComplet, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': p.discographie?.length ? 'MusicGroup' : 'PerformingGroup',
    name: p.titre,
    url: `${SITE_URL}/${locale}/projets/${p.slug}`,
    description: tr(p.accroche, locale),
    ...(p.distribution?.length
      ? {
          member: p.distribution.map((m) => ({
            '@type': 'OrganizationRole',
            member: {'@type': 'Person', name: m.personne?.nom, ...(m.personne?.slug ? {url: `${SITE_URL}/${locale}/artistes/${m.personne.slug}`} : {})},
            roleName: tr(m.role, locale) ?? tr(m.personne?.instruments, locale),
          })),
        }
      : {}),
    ...(p.discographie?.length
      ? {album: p.discographie.map((a) => ({'@type': 'MusicAlbum', name: a.titre, ...(a.dateSortie ? {datePublished: a.dateSortie} : {})}))}
      : {}),
  }
}
