// Mise en page racine du Studio, séparée de celle du site.
export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body style={{margin: 0}}>{children}</body>
    </html>
  )
}
