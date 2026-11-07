'use client'

import {useState} from 'react'

export function BoutonCopier({texte, libelle, libelleCopie}: {texte: string; libelle: string; libelleCopie: string}) {
  const [copie, setCopie] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texte)
          setCopie(true)
          setTimeout(() => setCopie(false), 2500)
        } catch {
          /* le texte reste sélectionnable à la main */
        }
      }}
      className="border border-nuit px-3 py-2 text-sm font-semibold hover:bg-nuit hover:text-sable"
    >
      <span aria-live="polite">{copie ? libelleCopie : libelle}</span>
    </button>
  )
}
