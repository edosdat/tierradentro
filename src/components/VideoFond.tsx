'use client'

import {useEffect, useRef, useState} from 'react'

// Vidéo de fond sans son, en boucle, comme sur la guest list.
// Elle ne démarre pas si la personne a demandé moins d'animations ou si sa connexion est en mode économie de données.
export function VideoFond({src, cadrage = 50}: {src: string; cadrage?: number}) {
  const video = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const moinsAnimations = matchMedia('(prefers-reduced-motion: reduce)').matches
    const economie = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection?.saveData
    if (moinsAnimations || economie) return
    const v = video.current
    if (!v) return
    v.src = src
    v.play()
      .then(() => setVisible(true))
      .catch(() => setVisible(false)) // lecture refusée par le navigateur : on garde le décor
  }, [src])

  return (
    <video
      ref={video}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      style={{objectPosition: `50% ${cadrage}%`}}
      className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
