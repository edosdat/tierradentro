import type {StructureResolver} from 'sanity/structure'

const aujourdhui = () => new Date().toISOString().slice(0, 10)

// Organisation du Studio : intitulés métier, dates de concert en premier.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenus')
    .items([
      S.listItem()
        .title('Dates de concert')
        .id('dates')
        .child(
          S.list()
            .title('Dates de concert')
            .items([
              S.listItem()
                .title('À venir')
                .id('a-venir')
                .child(
                  S.documentList()
                    .title('Dates à venir')
                    .schemaType('concert')
                    .filter('_type == "concert" && date >= $aujourdhui')
                    .params({aujourdhui: aujourdhui()})
                    .defaultOrdering([{field: 'date', direction: 'asc'}])
                    .initialValueTemplates([S.initialValueTemplateItem('concert')]),
                ),
              S.listItem()
                .title('Passées (archives)')
                .id('passees')
                .child(
                  S.documentList()
                    .title('Dates passées')
                    .schemaType('concert')
                    .filter('_type == "concert" && date < $aujourdhui')
                    .params({aujourdhui: aujourdhui()})
                    .defaultOrdering([{field: 'date', direction: 'desc'}]),
                ),
              S.divider(),
              S.listItem()
                .title('Toutes les dates')
                .id('toutes')
                .child(S.documentTypeList('concert').title('Toutes les dates').defaultOrdering([{field: 'date', direction: 'desc'}])),
            ]),
        ),
      S.documentTypeListItem('projet').title('Projets'),
      S.documentTypeListItem('personne').title('Personnes'),
      S.divider(),
      S.documentTypeListItem('presse').title('Presse'),
      S.documentTypeListItem('actualite').title('Actualités'),
      S.documentTypeListItem('partenaire').title('Partenaires'),
      S.documentTypeListItem('page').title('Pages'),
      S.divider(),
      S.listItem().title('L\'association').id('association').child(S.document().schemaType('association').documentId('association').title('L\'association')),
      S.listItem().title('Réglages du site').id('reglages').child(S.document().schemaType('reglages').documentId('reglages').title('Réglages du site')),
    ])
