import {PortableText, type PortableTextComponents} from 'next-sanity'
import type {Bloc} from '@/sanity/lib/requetes'

// Rendu du texte mis en forme saisi dans le Studio : aucun HTML brut n'est interprété.
const composants: PortableTextComponents = {
  block: {
    // L'« intertitre » du Studio suit directement le titre de la page : c'est un titre de niveau 2.
    h3: ({children}) => <h2 className="titre-display mt-10 mb-3 text-3xl">{children}</h2>,
    blockquote: ({children}) => <blockquote className="titre-display my-8 border-l-2 border-jacaranda pl-6 text-2xl italic">{children}</blockquote>,
    normal: ({children}) => <p className="my-4">{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>,
    number: ({children}) => <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>,
  },
  marks: {
    link: ({value, children}) => {
      const href: string = value?.href ?? ''
      const externe = /^https?:\/\//.test(href)
      return (
        <a href={href} className="underline underline-offset-4 hover:text-magenta-encre" {...(externe ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
          {children}
        </a>
      )
    },
  },
}

export function TexteRiche({valeur, className = ''}: {valeur?: Bloc; className?: string}) {
  if (!valeur?.length) return null
  return (
    <div className={`text-lg leading-relaxed ${className}`}>
      <PortableText value={valeur} components={composants} />
    </div>
  )
}
