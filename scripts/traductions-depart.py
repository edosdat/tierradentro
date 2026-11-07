"""Ajoute les traductions EN/ES du contenu de départ dans Sanity (le français n'est jamais modifié).
Chaque champ n'est rempli que s'il est encore vide : une traduction saisie dans le Studio n'est pas écrasée."""
import json, subprocess, urllib.parse

API = 'https://cnmla0ea.api.sanity.io/v2021-06-07'
def curl(args):
    r = subprocess.run(['curl', '-sS', '-H', 'Authorization: Bearer proxy-injected'] + args, capture_output=True, text=True)
    return json.loads(r.stdout)
def query(q):
    return curl([f'{API}/data/query/production?query=' + urllib.parse.quote(q)])['result']

# Phrase française → (anglais, espagnol)
T = {
  "Quartet franco-argentin de world music": ("Franco-Argentine world music quartet", "Cuarteto franco-argentino de músicas del mundo"),
  "[À VALIDER] Chant en espagnol, poétique et engagé, bouzouki grec, guitare flamenca et oud, percussions afro-latines. Le quartet tourne avec El infinito y un amor, son album sorti en janvier 2024.":
    ("[À VALIDER] Poetic, committed songs in Spanish, Greek bouzouki, flamenco guitar and oud, Afro-Latin percussion. The quartet is touring with El infinito y un amor, its album released in January 2024.",
     "[À VALIDER] Canto en español, poético y comprometido, buzuki griego, guitarra flamenca y oud, percusiones afrolatinas. El cuarteto está de gira con El infinito y un amor, su disco publicado en enero de 2024."),
  "[À VALIDER] Le parcours d'un corps de femme, de la naissance à l'émancipation, entre musique et danse.":
    ("[À VALIDER] The journey of a woman's body, from birth to emancipation, through music and dance.",
     "[À VALIDER] El recorrido de un cuerpo de mujer, del nacimiento a la emancipación, entre música y danza."),
  "Tout public": ("All ages", "Todos los públicos"),
  "Création 2023": ("Created in 2023", "Creación 2023"),
  "[À VALIDER] Un répertoire consacré aux voix de femmes d'Amérique latine, avec Jean-Luc Amestoy à l'accordéon.":
    ("[À VALIDER] A repertoire devoted to the voices of Latin American women, with Jean-Luc Amestoy on accordion.",
     "[À VALIDER] Un repertorio dedicado a las voces de mujeres de América Latina, con Jean-Luc Amestoy al acordeón."),
  "Nouveau projet en préparation. Plus d'informations prochainement.": ("New project in preparation. More information soon.", "Nuevo proyecto en preparación. Más información próximamente."),
  "[À CONFIRMER] Création présentée au festival Rio Loco, à Toulouse, en 2025.": ("[À CONFIRMER] A new creation presented at the Rio Loco festival in Toulouse in 2025.", "[À CONFIRMER] Creación presentada en el festival Rio Loco, en Toulouse, en 2025."),
  "Clip officiel": ("Official video", "Videoclip oficial"),
  "Clip officiel 2023": ("Official video, 2023", "Videoclip oficial 2023"),
  "2023": ("2023", "2023"),
  "Cuarteto Tafi, clip officiel": ("Cuarteto Tafi, official video", "Cuarteto Tafi, videoclip oficial"),
  "Fiche technique son": ("Sound technical rider", "Ficha técnica de sonido"),
  "Plan de scène": ("Stage plot", "Plano de escena"),
  "Dossier de presse 2024": ("2024 press kit", "Dossier de prensa 2024"),
  "piano": ("piano", "piano"), "percussions, chœurs": ("percussion, backing vocals", "percusiones, coros"),
  "accordéon": ("accordion", "acordeón"), "danse": ("dance", "danza"), "chant, textes": ("vocals, lyrics", "voz, letras"),
  "bouzouki, chœurs": ("bouzouki, backing vocals", "buzuki, coros"), "guitare, oud": ("guitar, oud", "guitarra, oud"),
  "[À VALIDER] Une association qui accompagne des artistes de la création à la tournée, avec des spectacles prêts à partir et des dossiers techniques à jour.":
    ("[À VALIDER] A non-profit that supports artists from creation to touring, with shows ready to travel and up-to-date technical riders.",
     "[À VALIDER] Una asociación que acompaña a artistas desde la creación hasta la gira, con espectáculos listos para viajar y fichas técnicas al día."),
  "[À VALIDER] Tierradentro est une association toulousaine de production de spectacles vivants. Elle accompagne des projets artistiques de la création à la tournée.":
    ("[À VALIDER] Tierradentro is a non-profit live performance production company based in Toulouse, France. It supports artistic projects from creation to touring.",
     "[À VALIDER] Tierradentro es una asociación de producción de artes escénicas con sede en Toulouse (Francia). Acompaña proyectos artísticos desde la creación hasta la gira."),
  # pages
  "Mentions légales": ("Legal notice", "Aviso legal"),
  "Politique de confidentialité": ("Privacy policy", "Política de privacidad"),
  "Crédits": ("Credits", "Créditos"),
  "Éditeur du site": ("Publisher", "Editor del sitio"),
  "Tierradentro, association loi 1901. Siège : [À COMPLÉTER]. SIRET : [À COMPLÉTER]. Licence d'entrepreneur de spectacles : [À COMPLÉTER].":
    ("Tierradentro, non-profit association under the French law of 1901. Registered office: [À COMPLÉTER]. SIRET: [À COMPLÉTER]. Performing arts licence: [À COMPLÉTER].",
     "Tierradentro, asociación sin ánimo de lucro (ley francesa de 1901). Sede: [À COMPLÉTER]. SIRET: [À COMPLÉTER]. Licencia de empresario de espectáculos: [À COMPLÉTER]."),
  "Directeur ou directrice de la publication : [À COMPLÉTER]. Contact : voir la page Contact.":
    ("Publication director: [À COMPLÉTER]. Contact: see the Contact page.", "Director o directora de la publicación: [À COMPLÉTER]. Contacto: ver la página Contacto."),
  "Hébergement": ("Hosting", "Alojamiento"),
  "Site hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).":
    ("Website hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States (vercel.com).",
     "Sitio alojado por Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos (vercel.com)."),
  "Contenus gérés avec Sanity (sanity.io) ; les données sont stockées dans l'Union européenne.":
    ("Content managed with Sanity (sanity.io); data is stored in the European Union.", "Contenidos gestionados con Sanity (sanity.io); los datos se almacenan en la Unión Europea."),
  "Propriété intellectuelle": ("Intellectual property", "Propiedad intelectual"),
  "Les textes, photos, vidéos et illustrations de ce site appartiennent à leurs auteurs. Toute reproduction demande leur accord, sauf les photos de l'Espace pro, libres de droits pour la promotion des projets avec mention du crédit.":
    ("The texts, photos, videos and illustrations on this website belong to their authors. Any reproduction requires their permission, except for the photos in the venues & press area, which are free to use to promote the projects with photo credit.",
     "Los textos, fotos, vídeos e ilustraciones de este sitio pertenecen a sus autores. Toda reproducción requiere su autorización, salvo las fotos del espacio pro, libres de derechos para la promoción de los proyectos citando el crédito."),
  "Ce que nous collectons": ("What we collect", "Qué datos recogemos"),
  "Le formulaire de contact transmet votre nom, votre e-mail, votre structure et votre message par e-mail à l'équipe de Tierradentro. Ces données ne sont pas enregistrées sur le site et ne sont transmises à personne d'autre. Elles servent uniquement à vous répondre.":
    ("The contact form sends your name, email address, organisation and message by email to the Tierradentro team. This data is not stored on the website and is not shared with anyone else. It is only used to reply to you.",
     "El formulario de contacto envía tu nombre, tu correo electrónico, tu organización y tu mensaje por correo al equipo de Tierradentro. Estos datos no se guardan en el sitio ni se comparten con nadie más. Solo sirven para responderte."),
  "Cookies": ("Cookies", "Cookies"),
  "Le site dépose un seul cookie, technique, qui retient la langue choisie. Il n'utilise ni cookie publicitaire ni outil de suivi. Les vidéos YouTube ne sont chargées, depuis youtube-nocookie.com, que si vous cliquez pour les lire.":
    ("The website sets a single technical cookie that remembers the language you chose. It uses no advertising cookies and no tracking tools. YouTube videos are only loaded, from youtube-nocookie.com, if you click to play them.",
     "El sitio solo deposita una cookie técnica que recuerda el idioma elegido. No utiliza cookies publicitarias ni herramientas de seguimiento. Los vídeos de YouTube solo se cargan, desde youtube-nocookie.com, si haces clic para verlos."),
  "Vos droits": ("Your rights", "Tus derechos"),
  "Conformément au RGPD, vous pouvez demander l'accès, la rectification ou la suppression des données vous concernant en écrivant à l'association (page Contact). Vous pouvez aussi saisir la CNIL (cnil.fr).":
    ("Under the GDPR, you can ask to access, correct or delete your personal data by writing to the association (Contact page). You can also contact the French data protection authority, the CNIL (cnil.fr).",
     "De acuerdo con el RGPD, puedes solicitar el acceso, la rectificación o la supresión de tus datos escribiendo a la asociación (página Contacto). También puedes dirigirte a la CNIL, la autoridad francesa de protección de datos (cnil.fr)."),
  "Illustration du colibri : Ludo Deny.": ("Hummingbird illustration: Ludo Deny.", "Ilustración del colibrí: Ludo Deny."),
  "Polices : Fraunces (Undercase Type) et Inter Tight (Rasmus Andersson), sous licence SIL Open Font License.":
    ("Typefaces: Fraunces (Undercase Type) and Inter Tight (Rasmus Andersson), under the SIL Open Font License.", "Tipografías: Fraunces (Undercase Type) e Inter Tight (Rasmus Andersson), con licencia SIL Open Font License."),
  "Photos : le nom de chaque photographe est indiqué avec la photo.": ("Photos: each photographer's name is shown with the photo.", "Fotos: el nombre de cada fotógrafo figura junto a la foto."),
  "Conception et réalisation du site : [À COMPLÉTER].": ("Website design and development: [À COMPLÉTER].", "Diseño y desarrollo del sitio: [À COMPLÉTER]."),
}

manquantes = set()
def tradu(fr, i):
    if fr not in T:
        manquantes.add(fr); return None
    return T[fr][i]

def blocs(fr_blocs, i):
    out = []
    for b in fr_blocs or []:
        nb = json.loads(json.dumps(b))
        for c in nb.get('children', []):
            t = tradu(c.get('text', ''), i)
            if t is None: return None
            c['text'] = t
        out.append(nb)
    return out

d = query('''{
 "projets": *[_type=="projet"]{_id, sousTitre, accroche, public, "videos": videos[]{_key, legende}, "docs": documentsPro[]{_key, libelle}},
 "personnes": *[_type=="personne"]{_id, instruments},
 "reglages": *[_id=="reglages"][0]{accroche, "legende": videoUne.legende},
 "association": *[_id=="association"][0]{mission},
 "pages": *[_type=="page"]{_id, titre, contenu}}''')

mutations = []
def champ(id_, chemin, valeur_fr, est_blocs=False, existant=None):
    s = {}
    for i, lang in enumerate(['en', 'es']):
        if existant and existant.get(lang): continue  # déjà traduit dans le Studio
        v = blocs(valeur_fr, i) if est_blocs else (tradu(valeur_fr, i) if valeur_fr else None)
        if v: s[f'{chemin}.{lang}'] = v
    if s: mutations.append({'patch': {'id': id_, 'set': s}})

for p in d['projets']:
    for k in ['sousTitre', 'accroche', 'public']:
        if p.get(k): champ(p['_id'], k, p[k].get('fr'), existant=p[k])
    for v in p.get('videos') or []:
        if v.get('legende'): champ(p['_id'], f'videos[_key=="{v["_key"]}"].legende', v['legende'].get('fr'), existant=v['legende'])
    for doc in p.get('docs') or []:
        if doc.get('libelle'): champ(p['_id'], f'documentsPro[_key=="{doc["_key"]}"].libelle', doc['libelle'].get('fr'), existant=doc['libelle'])
for pe in d['personnes']:
    champ(pe['_id'], 'instruments', pe['instruments'].get('fr'), existant=pe['instruments'])
r = d['reglages']
champ('reglages', 'accroche', r['accroche'].get('fr'), existant=r['accroche'])
if r.get('legende'): champ('reglages', 'videoUne.legende', r['legende'].get('fr'), existant=r['legende'])
a = d['association']
champ('association', 'mission', a['mission'].get('fr'), est_blocs=True, existant=a['mission'])
for pg in d['pages']:
    champ(pg['_id'], 'titre', pg['titre'].get('fr'), existant=pg['titre'])
    champ(pg['_id'], 'contenu', pg['contenu'].get('fr'), est_blocs=True, existant=pg['contenu'])

if manquantes:
    print('Phrases sans traduction (laissées en français) :'); [print(' -', m[:90]) for m in manquantes]
res = curl(['-X', 'POST', '-H', 'Content-Type: application/json', '--data', json.dumps({'mutations': mutations}), f'{API}/data/mutate/production'])
print(len(mutations), 'documents mis à jour', res.get('error', ''))
