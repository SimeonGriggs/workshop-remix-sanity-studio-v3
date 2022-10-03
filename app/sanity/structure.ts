import type {StructureResolver, DefaultDocumentNodeResolver} from 'sanity/desk'
import Iframe from 'sanity-plugin-iframe-pane'
import type {SanityDocumentLike} from 'sanity'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentTypeListItem('product').title('Products'),
      S.divider(),
      S.documentTypeListItem('category').title('Categories'),
    ])

function createPreviewUrl(doc: SanityDocumentLike) {
  return doc?.slug?.current
    ? `http://localhost:3000/${doc?.slug?.current}`
    : `http://localhost:3000`
}

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  switch (schemaType) {
    case `product`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .title('Preview')
          .options({
            url: (doc: SanityDocumentLike) => createPreviewUrl(doc),
            reload: {
              revision: true,
              button: true,
            },
          }),
      ])
    default:
      return S.document().views([S.view.form()])
  }
}
