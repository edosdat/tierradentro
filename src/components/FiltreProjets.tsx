'use client'

import {useId, useState, type ReactNode} from 'react'

// Filtre par projet : la liste est rendue côté serveur, le filtre masque simplement les lignes
// (attribut data-projet). Sans JavaScript, toutes les lignes restent visibles.
export function FiltreProjets({
  options,
  libelle,
  tous,
  children,
}: {
  options: {slug: string; titre: string}[]
  libelle: string
  tous: string
  children: ReactNode
}) {
  const [choix, setChoix] = useState('')
  const id = useId()
  const portee = `filtre-${id.replace(/[^a-z0-9]/gi, '')}`
  return (
    <div>
      {options.length > 1 ? (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label htmlFor={id} className="text-sm font-semibold">
            {libelle}
          </label>
          <select id={id} value={choix} onChange={(e) => setChoix(e.target.value)} className="border border-nuit bg-transparent px-3 py-2 text-[15px]">
            <option value="">{tous}</option>
            {options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.titre}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {choix ? (
        <style>{`#${portee} [data-projet]:not([data-projet="${choix.replace(/[^a-z0-9-]/g, '')}"]){display:none}`}</style>
      ) : null}
      <div id={portee} aria-live="polite">
        {children}
      </div>
    </div>
  )
}
