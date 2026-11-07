'use client'

import {useState} from 'react'
import {idYoutube, miniatureYoutube} from '@/lib/youtube'

// Vidéo YouTube « légère » : seule la miniature s'affiche.
// Le lecteur youtube-nocookie.com n'est chargé qu'au clic : aucun cookie avant la lecture.
export function VideoLite({url, titre, legende, libelleLire}: {url: string; titre: string; legende?: string; libelleLire: string}) {
  const [lecture, setLecture] = useState(false)
  const id = idYoutube(url)
  if (!id) return null
  return (
    <figure className="m-0">
      <div className="relative aspect-video overflow-hidden bg-nuit-2">
        {lecture ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={titre}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setLecture(true)} className="group absolute inset-0 grid cursor-pointer place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={miniatureYoutube(id)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100" />
            <span className="absolute inset-0 bg-gradient-to-t from-nuit/70 to-transparent" />
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-sable shadow-lg transition-transform group-hover:scale-105">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#14182B" /></svg>
            </span>
            <span className="sr-only">{`${libelleLire} : ${titre}`}</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3">
        <span className="titre-display text-2xl italic">{titre}</span>
        {legende ? <span className="text-sm opacity-75">{legende}</span> : null}
      </figcaption>
    </figure>
  )
}
