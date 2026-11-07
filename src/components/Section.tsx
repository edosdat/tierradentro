import type {ReactNode} from 'react'

export const Kicker = ({children, className = ''}: {children: ReactNode; className?: string}) => (
  <p className={`mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] opacity-75 ${className}`}>{children}</p>
)

export function TeteSection({kicker, titre, id, action}: {kicker?: ReactNode; titre: ReactNode; id?: string; action?: ReactNode}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-12">
      <div>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h2 id={id} className="titre-display text-[clamp(2.6rem,6vw,5.2rem)] [text-wrap:balance]">
          {titre}
        </h2>
      </div>
      {action}
    </div>
  )
}

export const Conteneur = ({children, className = ''}: {children: ReactNode; className?: string}) => (
  <div className={`mx-auto w-full max-w-[1440px] px-4 sm:px-8 ${className}`}>{children}</div>
)

// Bandeau sombre en haut des pages intérieures.
export function EnTetePage({kicker, titre, intro}: {kicker?: ReactNode; titre: ReactNode; intro?: ReactNode}) {
  return (
    <div className="sur-nuit relative overflow-hidden bg-[linear-gradient(180deg,#14182B_0%,#1C2D57_70%,#284A84_100%)] text-sable">
      <Conteneur className="relative pt-14 pb-16 sm:pt-20 sm:pb-24">
        {kicker ? <Kicker className="text-turquoise opacity-100">{kicker}</Kicker> : null}
        <h1 className="titre-display max-w-5xl text-[clamp(3rem,9vw,7.5rem)] [text-wrap:balance]">{titre}</h1>
        {intro ? <p className="mt-6 max-w-2xl text-lg text-sable/90">{intro}</p> : null}
      </Conteneur>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/colibri.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-14 h-72 w-auto opacity-[0.07] invert" />
    </div>
  )
}

export const LienFleche = ({children}: {children: ReactNode}) => (
  <span className="inline-flex items-center gap-2 border-b border-current pb-0.5 font-semibold">
    {children} <span aria-hidden="true">→</span>
  </span>
)
