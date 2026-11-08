'use client'

import Image from 'next/image'
import {useEffect, useRef, useState, type CSSProperties} from 'react'

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
// Durées des vols (ms) : lentes, pour qu'on ait le temps de le suivre.
const DUREE_APPROCHE = 2200
const DUREE_BUTINAGE = 1800
const DUREE_DEPART = 2600
const RETOUR_APRES = 3500
const DUREE_RETOUR = 3000

export function ColibriVolant({libelle, className = ''}: {libelle: string; className?: string}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const minuteries = useRef<number[]>([])
  const [etat, setEtat] = useState({x: 0, y: 0, echelle: 1, versLaGauche: false, duree: DUREE_DEPART})
  // Comme un vrai colibri, il bat des ailes en permanence ; on s'arrête seulement quand il n'est plus à l'écran
  // (économie de batterie) ou si l'appareil demande moins d'animations.
  const [battement, setBattement] = useState(false)

  useEffect(() => {
    const b = bouton.current
    if (!b || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const obs = new IntersectionObserver(([e]) => setBattement(e.isIntersecting))
    obs.observe(b)
    return () => {
      obs.disconnect()
      minuteries.current.forEach(clearTimeout)
    }
  }, [])

  const apres = (ms: number, fn: () => void) => minuteries.current.push(window.setTimeout(fn, ms))
  const annuler = () => {
    minuteries.current.forEach(clearTimeout)
    minuteries.current = []
  }

  // Repères : la zone du ciel, la taille de l'oiseau (sans échelle), sa place d'origine dans la page
  // (indépendante du vol en cours) et sa position visible actuelle.
  function mesurer() {
    const b = bouton.current
    const ciel = b?.closest('section')
    if (!b || !ciel) return null
    const zone = ciel.getBoundingClientRect()
    const visible = b.getBoundingClientRect()
    return {
      ciel,
      zone,
      largeur: b.offsetWidth,
      hauteur: b.offsetHeight,
      origineX: b.offsetLeft,
      origineY: b.offsetTop,
      iciX: visible.left - zone.left,
      iciY: visible.top - zone.top,
      iciL: visible.width,
      iciH: visible.height,
    }
  }

  // Une destination libre et entièrement visible, qui ne recouvre ni le titre ni le texte.
  function placeLibre(m: NonNullable<ReturnType<typeof mesurer>>) {
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
    // Ni hors des bords, ni sous la barre de menu (76 px), ni sous le bas de l'écran.
    const marge = 8
    const maxX = Math.max(marge, m.zone.width - m.largeur - marge)
    const minY = 96
    const basVisible = Math.min(m.zone.height * 0.72, window.innerHeight - m.zone.top)
    const maxY = Math.max(minY, basVisible - m.hauteur)
    let meilleure = {x: m.iciX, y: m.iciY, score: Infinity}
    for (let essai = 0; essai < 40; essai++) {
      const x = marge + Math.random() * (maxX - marge)
      const y = minY + Math.random() * (maxY - minY)
      const score = recouvrement(x, y) + (Math.hypot(x - m.iciX, y - m.iciY) < m.zone.width * 0.2 ? 1e9 : 0)
      if (score < meilleure.score) meilleure = {x, y, score}
    }
    return meilleure
  }

  function repartir() {
    const m = mesurer()
    if (!m) return
    const cible = placeLibre(m)
    setEtat({x: cible.x - m.origineX, y: cible.y - m.origineY, echelle: 1, versLaGauche: cible.x < m.iciX, duree: DUREE_DEPART})
    apres(DUREE_DEPART + RETOUR_APRES, rentrer)
  }

  // Il revient à sa place de départ, à droite du titre.
  function rentrer() {
    const m = mesurer()
    setEtat({x: 0, y: 0, echelle: 1, versLaGauche: m ? m.origineX < m.iciX : false, duree: DUREE_RETOUR})
  }

  function sEnvoler() {
    annuler()
    const m = mesurer()
    if (!m) return
    const fleurs = [...m.ciel.querySelectorAll<HTMLElement>('[data-fleur]')]
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !fleurs.length) return repartir()

    // 1. Il vole jusqu'au « i » ou au « o » final et y pose le bec.
    const choisie = fleurs[Math.floor(Math.random() * fleurs.length)]
    const fleur = choisie.getBoundingClientRect()
    // Le point du « i », ou le haut de la boucle du « o ».
    const hauteurVisee = choisie.textContent === 'i' ? 0.3 : 0.5
    const lettre = {x: fleur.left - m.zone.left + fleur.width / 2, y: fleur.top - m.zone.top + fleur.height * hauteurVisee}
    // Il se tourne vers la lettre : le bec est à droite de l'image, ou à gauche s'il est retourné.
    const versLaGauche = lettre.x < m.iciX + m.iciL / 2
    const becX = (versLaGauche ? 1 - BEC.x : BEC.x) * m.largeur * ECHELLE_BUTINAGE
    const becY = BEC.y * m.hauteur * ECHELLE_BUTINAGE
    const x = lettre.x - becX + (versLaGauche ? 2 : -2)
    const y = lettre.y - becY
    setEtat({x: x - m.origineX, y: y - m.origineY, echelle: ECHELLE_BUTINAGE, versLaGauche, duree: DUREE_APPROCHE})
    // 2. Il butine sur place, 3. repart vers un coin libre du ciel, 4. puis revient à sa place.
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
        <span className={`relative block ${battement ? 'colibri-sustentation' : 'colibri-flotte'}`}>
          {/* Corps (sans l'aile) */}
          {image({priority: true, style: {maskImage: masqueCorps, WebkitMaskImage: masqueCorps, maskSize: '100% 100%', WebkitMaskSize: '100% 100%'}})}
          {/* Aile nette, puis deux traînées floues qui apparaissent pendant le vol */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`absolute inset-0 ${battement ? 'aile-bat' : ''} ${traineeAile(i, battement)}`}
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
