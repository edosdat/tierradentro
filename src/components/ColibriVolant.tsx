'use client'

import Image from 'next/image'
import {useRef, useState, type CSSProperties} from 'react'

// Le colibri de l'accueil. Comme un vrai colibri (50 à 80 battements par seconde), l'aile n'est
// qu'un voile flou pendant le vol : on la découpe dans l'aquarelle et on la fait battre autour de
// l'épaule, en plusieurs copies décalées et floutées, pendant que le corps reste stable.
// Au toucher, il s'envole vers un autre endroit du ciel, sans se poser sur le texte.

// Contour de l'aile supérieure, en % de l'image (aquarelle de Ludo Deny, 793 × 777).
const AILE = [[17, 1], [46, 6], [58, 15], [66, 26], [67, 34], [62, 40], [52, 45], [42, 45], [32, 40], [23, 30], [16, 17], [13, 5]]
const EPAULE = '63% 37%'
const decoupeAile = `polygon(${AILE.map(([x, y]) => `${x}% ${y}%`).join(', ')})`
// Le corps sans l'aile (masque SVG : tout sauf l'aile, légèrement réduite pour éviter un liseré).
const masqueCorps = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path fill='white' fill-rule='evenodd' d='M0 0H100V100H0Z M${AILE.map(([x, y]) => `${x + (x < 40 ? 0.6 : -0.4)} ${y + 0.5}`).join(' L')}Z'/></svg>`,
)}")`

const image = (props: {priority?: boolean; style?: CSSProperties; className?: string}) => (
  <Image
    src="/images/colibri-aquarelle.webp"
    alt=""
    width={793}
    height={777}
    sizes="(min-width: 1024px) 34vw, 42vw"
    draggable={false}
    {...props}
    className={`h-auto w-full select-none ${props.className ?? ''}`}
  />
)

// Copie 0 : l'aile nette. Copies 1 et 2 : traînées floues, visibles seulement en vol.
const traineeAile = (i: number, enVol: boolean) =>
  i === 0 ? '' : !enVol ? 'opacity-0' : i === 1 ? 'opacity-45 blur-[2px]' : 'opacity-25 blur-[5px]'

// Pointe du bec dans l'aquarelle (en fraction de l'image).
const BEC = {x: 0.946, y: 0.284}
const ECHELLE_BUTINAGE = 0.55
const DUREE_APPROCHE = 1200
const DUREE_BUTINAGE = 1700

export function ColibriVolant({libelle, className = ''}: {libelle: string; className?: string}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const minuteries = useRef<number[]>([])
  const [etat, setEtat] = useState({x: 0, y: 0, echelle: 1, versLaGauche: false, duree: 1400})
  const [enVol, setEnVol] = useState(false)

  const apres = (ms: number, fn: () => void) => minuteries.current.push(window.setTimeout(fn, ms))

  // Mesures communes : la zone du ciel, la taille de l'oiseau sans échelle, sa position de départ (sans déplacement).
  function mesurer() {
    const b = bouton.current
    const ciel = b?.closest('section')
    if (!b || !ciel) return null
    const zone = ciel.getBoundingClientRect()
    const largeur = b.offsetWidth
    const hauteur = b.offsetHeight
    const r = b.getBoundingClientRect()
    return {ciel, zone, largeur, hauteur, origineX: r.left - zone.left - etat.x, origineY: r.top - zone.top - etat.y}
  }

  // Une destination libre dans le ciel, qui ne recouvre pas le titre ni le texte.
  function placeLibre(m: NonNullable<ReturnType<typeof mesurer>>, depuis: {x: number; y: number}) {
    const textes = [...m.ciel.querySelectorAll('[data-texte-heros]')].map((el) => {
      const r = el.getBoundingClientRect()
      return {g: r.left - m.zone.left, h: r.top - m.zone.top, d: r.right - m.zone.left, b: r.bottom - m.zone.top}
    })
    const recouvrement = (x: number, y: number) =>
      textes.reduce((total, t) => {
        const l = Math.max(0, Math.min(x + m.largeur * 0.85, t.d) - Math.max(x + m.largeur * 0.15, t.g))
        const h = Math.max(0, Math.min(y + m.hauteur * 0.85, t.b) - Math.max(y + m.hauteur * 0.15, t.h))
        return total + l * h
      }, 0)
    const maxX = m.zone.width - m.largeur * 0.85
    // Jamais sous la barre de menu (76 px), pour qu'on puisse toujours le toucher.
    const minY = 96
    const maxY = Math.max(minY, m.zone.height * 0.68 - m.hauteur)
    let meilleure = {x: depuis.x, y: depuis.y, score: Infinity}
    for (let essai = 0; essai < 40; essai++) {
      const x = -m.largeur * 0.15 + Math.random() * (maxX + m.largeur * 0.15)
      const y = minY + Math.random() * (maxY - minY)
      const score = recouvrement(x, y) + (Math.hypot(x - depuis.x, y - depuis.y) < m.zone.width * 0.2 ? 1e9 : 0)
      if (score < meilleure.score) meilleure = {x, y, score}
    }
    return meilleure
  }

  function repartir() {
    const m = mesurer()
    if (!m) return
    const ici = {x: m.origineX + etat.x, y: m.origineY + etat.y}
    const cible = placeLibre(m, ici)
    setEnVol(true)
    setEtat({x: cible.x - m.origineX, y: cible.y - m.origineY, echelle: 1, versLaGauche: cible.x < ici.x, duree: 1400})
    apres(1400 + 500, () => setEnVol(false))
  }

  function sEnvoler() {
    minuteries.current.forEach(clearTimeout)
    minuteries.current = []
    const m = mesurer()
    if (!m) return
    const moinsAnimations = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fleurs = [...m.ciel.querySelectorAll<HTMLElement>('[data-fleur]')]
    if (moinsAnimations || !fleurs.length) return repartir()

    // 1. Il vole jusqu'au « i » ou au « o » final et y pose le bec.
    const choisie = fleurs[Math.floor(Math.random() * fleurs.length)]
    const fleur = choisie.getBoundingClientRect()
    // Le point du « i », ou le haut de la boucle du « o ».
    const hauteurVisee = choisie.textContent === 'i' ? 0.3 : 0.5
    const lettre = {x: fleur.left - m.zone.left + fleur.width / 2, y: fleur.top - m.zone.top + fleur.height * hauteurVisee}
    const ici = {x: m.origineX + etat.x + m.largeur / 2, y: m.origineY + etat.y + m.hauteur / 2}
    // Il se tourne vers la lettre : le bec est à droite de l'image, ou à gauche s'il est retourné.
    const versLaGauche = lettre.x < ici.x
    const becX = (versLaGauche ? 1 - BEC.x : BEC.x) * m.largeur * ECHELLE_BUTINAGE
    const becY = BEC.y * m.hauteur * ECHELLE_BUTINAGE
    const x = lettre.x - becX + (versLaGauche ? 2 : -2)
    const y = lettre.y - becY
    setEnVol(true)
    setEtat({x: x - m.origineX, y: y - m.origineY, echelle: ECHELLE_BUTINAGE, versLaGauche, duree: DUREE_APPROCHE})
    // 2. Il butine sur place en battant des ailes, 3. puis repart vers un coin libre du ciel.
    apres(DUREE_APPROCHE + DUREE_BUTINAGE, repartir)
  }

  return (
    <button
      ref={bouton}
      type="button"
      onClick={sEnvoler}
      aria-label={libelle}
      title={libelle}
      style={{
        transform: `translate3d(${etat.x}px, ${etat.y}px, 0) scale(${etat.echelle})`,
        transformOrigin: '0 0',
        transitionDuration: `${etat.duree}ms`,
      }}
      className={`absolute z-20 cursor-pointer border-0 bg-transparent p-0 transition-transform ease-[cubic-bezier(.45,.05,.3,1)] focus-visible:outline-offset-8 motion-reduce:transition-none ${className}`}
    >
      <span className={`block transition-transform duration-300 ${etat.versLaGauche ? '-scale-x-100' : ''}`}>
        <span className={`relative block ${enVol ? 'colibri-sustentation' : 'colibri-flotte'}`}>
          {/* Corps (sans l'aile) */}
          {image({priority: true, style: {maskImage: masqueCorps, WebkitMaskImage: masqueCorps, maskSize: '100% 100%', WebkitMaskSize: '100% 100%'}})}
          {/* Aile nette, puis deux traînées floues qui apparaissent pendant le vol */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute inset-0 ${enVol ? 'aile-bat' : ''} ${traineeAile(i, enVol)}`}
              style={{clipPath: decoupeAile, transformOrigin: EPAULE, animationDelay: `${-i * 0.016}s`}}
            >
              {image({})}
            </span>
          ))}
        </span>
      </span>
    </button>
  )
}
