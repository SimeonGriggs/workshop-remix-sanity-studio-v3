import type {Rule} from 'sanity'
import {defineType, defineField} from 'sanity'
import {TrolleyIcon, ComposeIcon, TagIcon, ImageIcon} from '@sanity/icons'

export default defineType({
  name: 'product',
  title: 'Product',
  icon: TrolleyIcon,
  type: 'document',
  groups: [
    {name: 'details', title: 'Details', icon: TagIcon},
    {name: 'images', title: 'Images', icon: ImageIcon},
    {name: 'editorial', title: 'Editorial', icon: ComposeIcon},
  ],
  fieldsets: [{name: 'pricing', options: {columns: 3}}],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: ['details', 'editorial'],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      group: ['editorial'],
      readOnly: ({document}) => !document?.title,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at price',
      type: 'number',
      group: ['details'],
      fieldset: 'pricing',
      validation: (rule) =>
        rule.custom((value, context) => {
          const {document} = context

          if (document?.price && value && document.price > value) {
            return 'Compare at price must be greater than price'
          }

          return true
        }),
    }),
    defineField({
      name: 'price',
      type: 'number',
      group: ['details'],
      fieldset: 'pricing',
    }),
    defineField({
      name: 'stockLevel',
      type: 'number',
      group: ['details'],
      fieldset: 'pricing',
    }),
    defineField({
      name: 'content',
      type: 'array' as const,
      of: [{type: 'block', of: [{type: 'image'}]}, {type: 'image'}],
      group: ['editorial'],
    }),
    defineField({
      name: 'images',
      type: 'array' as const,
      of: [{type: 'image', validation: (rule) => rule.required()}],
      group: ['images'],
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'category'}],
      group: ['details'],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      images: 'images',
    },
    prepare: (selection: {[key: string]: any}) => {
      const {title, subtitle, images} = selection

      return {
        title,
        subtitle,
        media: images?.length ? images[0] : TrolleyIcon,
      }
    },
  },
})
