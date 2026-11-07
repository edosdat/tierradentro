// Extrait l'identifiant d'une vidéo YouTube depuis les formes d'adresse courantes :
// youtube.com/watch?v=…, youtu.be/…, youtube.com/shorts/…, youtube.com/embed/…, youtube-nocookie.com/embed/…
const ID = /^[A-Za-z0-9_-]{11}$/

export function idYoutube(adresse: string | undefined | null): string | null {
  if (!adresse) return null
  let url: URL
  try {
    url = new URL(adresse.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  const hote = url.hostname.replace(/^www\.|^m\./, '')
  let id: string | null = null
  if (hote === 'youtu.be') id = url.pathname.slice(1).split('/')[0]
  else if (hote === 'youtube.com' || hote === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v')
    else {
      const [, type, valeur] = url.pathname.split('/')
      if (type === 'embed' || type === 'shorts' || type === 'live') id = valeur
    }
  }
  return id && ID.test(id) ? id : null
}

export const miniatureYoutube = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
