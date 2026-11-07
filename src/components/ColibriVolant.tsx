'use client'

import Image from 'next/image'
import {useRef, useState} from 'react'

// Le colibri de l'accueil : quand on le touche, il bat des ailes et s'envole ailleurs dans le ciel.
// Avec « moins d'animations » demandé par l'appareil, il change de place sans voler.
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
    // Position de départ (sans le déplacement en cours) dans la zone du ciel.
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
    // On tire plusieurs destinations au hasard et on garde celle qui gêne le moins la lecture,
    // en préférant un vrai déplacement.
    let meilleure = {x: departX + position.x, y: departY + position.y, score: Infinity}
    for (let essai = 0; essai < 40; essai++) {
      const x = -oiseau.width * 0.15 + Math.random() * (maxX + oiseau.width * 0.15)
      const y = 70 + Math.random() * (maxY - 70)
      const distance = Math.hypot(x - (departX + position.x), y - (departY + position.y))
      const score = recouvrement(x, y) + (distance < zone.width * 0.2 ? 1e9 : 0)
      if (score < meilleure.score) meilleure = {x, y, score}
    }
    const {x, y} = meilleure
    setVersLaGauche(x - departX < position.x)
    setPosition({x: x - departX, y: y - departY})
    setEnVol(!matchMedia('(prefers-reduced-motion: reduce)').matches)
  }

  return (
    <button
      ref={bouton}
      type="button"
      onClick={sEnvoler}
      aria-label={libelle}
      title={libelle}
      onTransitionEnd={() => setEnVol(false)}
      style={{transform: `translate3d(${position.x}px, ${position.y}px, 0)`}}
      className={`absolute z-20 cursor-pointer border-0 bg-transparent p-0 transition-transform duration-[1400ms] ease-[cubic-bezier(.45,.05,.3,1)] focus-visible:outline-offset-8 motion-reduce:transition-none ${className}`}
    >
      <span className={`block transition-transform duration-300 ${versLaGauche ? '-scale-x-100' : ''}`}>
        <span className={`block ${enVol ? 'colibri-vole' : 'colibri-flotte'}`}>
          <Image src="/images/colibri-aquarelle.webp" alt="" width={793} height={777} priority sizes="(min-width: 1024px) 34vw, 42vw" className="h-auto w-full" draggable={false} />
        </span>
      </span>
    </button>
  )
}
