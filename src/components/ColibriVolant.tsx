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

export function ColibriVolant({libelle, className = ''}: {libelle: string; className?: string}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({x: 0, y: 0})
  const [versLaGauche, setVersLaGauche] = useState(false)
  const [enVol, setEnVol] = useState(false)

  function sEnvoler() {
    const b = bouton.current
    const ciel = b?.closest('section')
    if (!b || !ciel) return
    const zone = ciel.getBoundingClientRect()
    const oiseau = b.getBoundingClientRect()
    const departX = oiseau.left - zone.left - position.x
    const departY = oiseau.top - zone.top - position.y
    // Zones à ne pas recouvrir : le titre et le texte d'introduction (marqués data-texte-heros).
    const textes = [...ciel.querySelectorAll('[data-texte-heros]')].map((el) => {
      const r = el.getBoundingClientRect()
      return {g: r.left - zone.left, h: r.top - zone.top, d: r.right - zone.left, b: r.bottom - zone.top}
    })
    const recouvrement = (x: number, y: number) =>
      textes.reduce((total, t) => {
        const l = Math.max(0, Math.min(x + oiseau.width * 0.85, t.d) - Math.max(x + oiseau.width * 0.15, t.g))
        const h = Math.max(0, Math.min(y + oiseau.height * 0.85, t.b) - Math.max(y + oiseau.height * 0.15, t.h))
        return total + l * h
      }, 0)
    const maxX = zone.width - oiseau.width * 0.85
    const maxY = Math.max(70, zone.height * 0.68 - oiseau.height)
    let meilleure = {x: departX + position.x, y: departY + position.y, score: Infinity}
    for (let essai = 0; essai < 40; essai++) {
      const x = -oiseau.width * 0.15 + Math.random() * (maxX + oiseau.width * 0.15)
      const y = 70 + Math.random() * (maxY - 70)
      const distance = Math.hypot(x - (departX + position.x), y - (departY + position.y))
      const score = recouvrement(x, y) + (distance < zone.width * 0.2 ? 1e9 : 0)
      if (score < meilleure.score) meilleure = {x, y, score}
    }
    setVersLaGauche(meilleure.x - departX < position.x)
    setPosition({x: meilleure.x - departX, y: meilleure.y - departY})
    setEnVol(!matchMedia('(prefers-reduced-motion: reduce)').matches)
  }

  return (
    <button
      ref={bouton}
      type="button"
      onClick={sEnvoler}
      aria-label={libelle}
      title={libelle}
      // Il continue de battre des ailes un instant après s'être posé, puis plane.
      onTransitionEnd={(e) => e.target === e.currentTarget && setTimeout(() => setEnVol(false), 500)}
      style={{transform: `translate3d(${position.x}px, ${position.y}px, 0)`}}
      className={`absolute z-20 cursor-pointer border-0 bg-transparent p-0 transition-transform duration-[1400ms] ease-[cubic-bezier(.45,.05,.3,1)] focus-visible:outline-offset-8 motion-reduce:transition-none ${className}`}
    >
      <span className={`block transition-transform duration-300 ${versLaGauche ? '-scale-x-100' : ''}`}>
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
