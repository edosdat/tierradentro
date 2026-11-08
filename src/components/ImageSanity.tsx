import {getLocale} from 'next-intl/server'
import {tr} from '@/lib/traduction'
import {urlImage} from '@/sanity/lib/image'
import type {ImageSanity as TypeImage} from '@/sanity/lib/requetes'

type Props = {
  image: TypeImage | undefined
  /** Largeur × hauteur du cadrage (le point focal choisi dans le Studio est respecté). */
  largeur: number
  hauteur: number
  tailles?: string
  className?: string
  prioritaire?: boolean
  avecCredit?: boolean
  /** Logo : image entière, sans recadrage, à ses propres proportions (largeur = hauteur × ratio). */
  entiere?: boolean
}

// Image Sanity : formats modernes (AVIF/WebP) choisis par le CDN, plusieurs tailles, texte alternatif traduit.
export async function ImageSanity({image, largeur: largeurDemandee, hauteur, tailles = '100vw', className = '', prioritaire = false, avecCredit = false, entiere = false}: Props) {
  if (!image?.asset) return null
  const locale = await getLocale()
  // Logo entier : les dimensions d'origine sont inscrites dans la référence (image-<id>-<largeur>x<hauteur>-<format>).
  const [, l0, h0] = image.asset._ref.match(/-(\d+)x(\d+)-/) ?? []
  const largeur = entiere && l0 && h0 ? Math.round((hauteur * Number(l0)) / Number(h0)) : largeurDemandee
  const largeurs = [320, 480, 640, 800, 1080, 1440, 1920].filter((l) => l <= largeur * 2)
  const src = (l: number) =>
    entiere ? urlImage(image).width(l).fit('max').url() : urlImage(image).width(l).height(Math.round((l * hauteur) / largeur)).url()
  const alt = tr(image.alt, locale) ?? ''
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src(largeur)}
      srcSet={largeurs.map((l) => `${src(l)} ${l}w`).join(', ')}
      sizes={tailles}
      width={largeur}
      height={hauteur}
      alt={alt}
      loading={prioritaire ? 'eager' : 'lazy'}
      fetchPriority={prioritaire ? 'high' : undefined}
      decoding="async"
      className={className}
    />
  )
  if (!avecCredit || !image.credit) return img
  return (
    <figure className="relative">
      {img}
      <figcaption className="absolute bottom-2 right-2 bg-nuit/70 px-2 py-0.5 text-xs text-sable">{image.credit}</figcaption>
    </figure>
  )
}
