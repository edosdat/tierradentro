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
}

// Image Sanity : formats modernes (AVIF/WebP) choisis par le CDN, plusieurs tailles, texte alternatif traduit.
export async function ImageSanity({image, largeur, hauteur, tailles = '100vw', className = '', prioritaire = false, avecCredit = false}: Props) {
  if (!image?.asset) return null
  const locale = await getLocale()
  const largeurs = [320, 480, 640, 800, 1080, 1440, 1920].filter((l) => l <= largeur * 2)
  const src = (l: number) => urlImage(image).width(l).height(Math.round((l * hauteur) / largeur)).url()
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
