import {Link} from '@remix-run/react'
import React from 'react'

import type {ProductDocument} from '~/sanity/types/Product'
import SanityImage from './SanityImage'

export default function ProductStub(props: ProductDocument) {
  const {title, price, compareAtPrice, onSale, images = [], slug, category} = props
  const [firstImage] = images

  return (
    <article className="relative">
      <Link to={slug?.current ? `/${slug.current}` : `#`} className="group">
        {firstImage ? (
          <SanityImage
            value={firstImage}
            className="aspect-video w-full rounded-lg object-cover transition-transform duration-100 ease-in-out group-hover:scale-105"
          />
        ) : (
          <div className="aspect-video w-full rounded-lg bg-gray-50 object-cover" />
        )}
        <span className="flex flex-col gap-1 py-4">
          <span className="text-gray-500">
            {category?.title ? category.title : `{{category.title}}`}
          </span>
          <span className="font-medium text-green-900 transition-colors duration-200 ease-in-out group-hover:text-green-400">
            {title || `{{title}}`}
          </span>
          <span className="text-green-700">
            {price ? (
              <>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(price)}

                {compareAtPrice ? (
                  <del className="ml-2 text-gray-400">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(compareAtPrice)}
                  </del>
                ) : null}
              </>
            ) : (
              `{{price}}`
            )}
          </span>
        </span>
      </Link>

      {onSale ? (
        <div className="absolute right-0 top-3 rotate-45 rounded bg-red-500 px-4 pt-3 pb-2 text-center leading-none text-white">
          Sale
        </div>
      ) : null}
    </article>
  )
}
