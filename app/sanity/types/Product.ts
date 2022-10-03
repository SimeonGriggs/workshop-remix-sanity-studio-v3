import type {SanityImageAsset} from '@sanity/asset-utils'
import type {Block, Span} from 'sanity'

export type ProductDocument = {
  _id: string
  title?: string
  slug?: {
    current?: string
  }
  content?: Block<Span>[]
  images?: SanityImageAsset &
    {
      _key: string
    }[]
  category?: {
    title?: string
    slug?: {
      current?: string
    }
  }
  price?: number
  compareAtPrice?: number
  stockLevel?: number
  onSale?: boolean
}
