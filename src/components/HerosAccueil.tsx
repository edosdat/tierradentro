import {getTranslations} from 'next-intl/server'
import {VideoFond} from './VideoFond'
import {ColibriVolant} from './ColibriVolant'

// Héros de l'accueil : crépuscule sur le salar, jacaranda, colibri aquarelle de Ludo Deny.
// Décor en CSS et SVG légers ; le texte reste sur des aplats de couleur unie (contraste vérifié).
const montagnes =
  'M0 60 L0 44 L80 38 L150 42 L230 26 L300 33 L380 18 L450 30 L520 27 L600 40 L700 22 L780 10 L850 24 L930 32 L1010 21 L1090 29 L1180 14 L1260 28 L1350 36 L1440 26 L1520 33 L1600 30 L1600 60 Z'
const montagnesProches = 'M0 60 L0 50 L120 46 L240 50 L330 42 L460 48 L590 43 L720 51 L860 45 L980 49 L1110 42 L1250 48 L1390 44 L1500 50 L1600 47 L1600 60 Z'

function Montagnes({className}: {className: string}) {
  return (
    <svg className={className} viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden="true">
      <path d={montagnes} fill="#3B3570" />
      <path d={montagnesProches} fill="#26254F" />
    </svg>
  )
}

function Jacaranda() {
  const fleurs: [number, number, number, string][] = [
    [220, 172, 9, '#9B7BD9'], [232, 186, 7, '#9B7BD9'], [210, 190, 8, '#9B7BD9'], [224, 204, 6, '#9B7BD9'], [240, 168, 6, '#9B7BD9'],
    [428, 216, 8, '#B79CE8'], [416, 230, 6, '#B79CE8'], [440, 232, 7, '#B79CE8'], [428, 248, 5, '#B79CE8'],
    [268, 238, 7, '#8A68D0'], [280, 252, 6, '#8A68D0'], [258, 254, 5, '#8A68D0'],
    [520, 184, 8, '#A889E2'], [532, 198, 6, '#A889E2'], [508, 200, 7, '#A889E2'], [522, 214, 5, '#A889E2'],
    [290, 26, 7, '#9B7BD9'], [278, 38, 5, '#9B7BD9'], [350, 78, 5, '#9B7BD9'], [470, 60, 6, '#9B7BD9'],
  ]
  return (
    <svg className="absolute top-[76px] -right-8 -z-10 w-[min(40vw,540px)] opacity-95 max-lg:w-[70vw] max-lg:opacity-70" viewBox="0 0 600 300" aria-hidden="true">
      <g fill="none" stroke="#0E1020" strokeLinecap="round">
        <path d="M610 -10 C520 40 470 70 380 92 C320 106 270 128 220 170" strokeWidth="7" />
        <path d="M455 72 C430 120 420 160 428 214" strokeWidth="4" />
        <path d="M380 92 C350 60 330 40 290 26" strokeWidth="3.5" />
        <path d="M300 116 C270 150 262 190 268 236" strokeWidth="3" />
        <path d="M540 30 C560 90 548 140 520 182" strokeWidth="3.5" />
      </g>
      {fleurs.map(([x, y, r, c], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={c} />
      ))}
    </svg>
  )
}

export async function HerosAccueil({accroche, video}: {accroche: string; video?: {url?: string; cadrage?: number}}) {
  const t = await getTranslations('accueil')
  return (
    <section aria-labelledby="titre-accueil" className="sur-nuit relative isolate flex min-h-[max(640px,min(100svh,960px))] flex-col overflow-clip text-sable">
      <div className="absolute inset-x-0 top-0 bottom-[24%] -z-30 bg-[linear-gradient(180deg,#0D1020_0%,#14182B_22%,#1C2D57_52%,#284A84_76%,#5F67B8_90%,#C9A9E3_98%,#EBD7EE_100%)]" />
      <div className="etoiles absolute inset-x-0 top-0 bottom-1/2 -z-20 opacity-55" />
      <Montagnes className="absolute inset-x-0 bottom-[24%] -z-20 h-[7%] w-full" />
      <div className="absolute inset-x-0 top-[76%] bottom-0 -z-30 overflow-hidden bg-[linear-gradient(180deg,#E2CDEB_0%,#9A8ACF_18%,#4C5E9C_55%,#1E2A52_100%)]">
        <div className="absolute inset-0 bg-[url('/images/salar-croute.svg')] bg-cover bg-top opacity-55 mix-blend-screen" />
      </div>
      <Montagnes className="absolute inset-x-0 top-[76%] -z-20 h-[7%] w-full -scale-y-100 opacity-45 blur-[2px]" />
      <Jacaranda />

      {video?.url ? (
        <>
          {/* La vidéo recouvre le décor quand elle démarre ; le voile garde le texte lisible. */}
          {/* Fond uni sous la vidéo, puis la vidéo légèrement dézoomée : elle n'occupe pas toute la hauteur
              (on voit plus large) et ses bords haut et bas se fondent dans la nuit. */}
          <div aria-hidden="true" className="absolute inset-0 -z-[15] bg-[linear-gradient(180deg,#0D1020,#14182B_40%,#1C2D57)]" />
          <VideoFond
            src={video.url}
            cadrage={video.cadrage}
            className="absolute inset-x-0 top-[7%] h-[86%] w-full [mask-image:linear-gradient(180deg,transparent,black_14%,black_86%,transparent)] max-lg:top-[13%] max-lg:h-[62%]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-[5] bg-[linear-gradient(90deg,rgba(13,16,32,.82)_0%,rgba(13,16,32,.55)_45%,rgba(13,16,32,.25)_100%),linear-gradient(180deg,rgba(13,16,32,.55)_0%,transparent_30%,transparent_70%,rgba(13,16,32,.7)_100%)]" />
          {/* Sur téléphone, le texte occupe toute la largeur : voile plus uniforme. */}
          <div aria-hidden="true" className="absolute inset-0 -z-[5] bg-[rgba(13,16,32,.45)] lg:hidden" />
        </>
      ) : null}

      <ColibriVolant
        libelle={t('colibri')}
        className="right-[8%] top-[22%] w-[min(34vw,460px)] max-lg:right-[-4%] max-lg:top-[78px] max-lg:w-[42vw]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 content-center px-4 pt-28 pb-[31vh] sm:px-8 max-lg:pb-[30vh]">
        <h1 id="titre-accueil" data-texte-heros className="titre-display w-fit text-[clamp(3rem,11vw,11rem)] leading-[0.9] whitespace-nowrap">
          {/* Le colibri vient butiner le « i » ou le « o » final (data-fleur). */}
          T<span data-fleur>i</span>erradentr<span data-fleur>o</span>
        </h1>
        <div data-texte-heros className="mt-8 max-w-xl">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-turquoise">{t('surtitre')}</p>
          <p className="text-lg leading-relaxed text-sable/92 sm:text-xl">{accroche}</p>
        </div>
      </div>
      <a href="#suite" className="absolute bottom-6 left-4 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-sable/85 sm:left-8">
        <span className="h-9 w-px bg-current" aria-hidden="true" />
        {t('decouvrir')}
      </a>
    </section>
  )
}
