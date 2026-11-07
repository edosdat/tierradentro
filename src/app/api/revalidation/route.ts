import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

// Appelé par Sanity à chaque publication (webhook signé avec SANITY_REVALIDATE_SECRET).
// Vide le cache du contenu : la modification apparaît sur le site en quelques secondes.
export async function POST(requete: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({message: 'Secret de revalidation non configuré'}, {status: 500})
  try {
    const {isValidSignature, body} = await parseBody<{_type?: string}>(requete, secret, true)
    if (!isValidSignature) return NextResponse.json({message: 'Signature invalide'}, {status: 401})
    revalidateTag('sanity', {expire: 0})
    return NextResponse.json({revalide: true, type: body?._type ?? null})
  } catch {
    return NextResponse.json({message: 'Requête invalide'}, {status: 400})
  }
}
