import {Form, useActionData} from '@remix-run/react'
import type {ProductDocument} from '~/sanity/types/Product'
import SanityContent from './SanityContent'
import SanityImage from './SanityImage'

export default function ProductStandard(props: ProductDocument) {
  const {_id, title, price, content, images, category, compareAtPrice, stockLevel} = props
  const [heroImage, ...remainingImages] = images ?? [null, null, null]
  const actionData = useActionData()

  return (
    <>
      <section className="grid grid-cols-1 pt-12 md:grid-cols-2 md:pt-20">
        <div className="flex flex-col md:p-12">
          {heroImage ? (
            <SanityImage
              className="aspect-video w-full rounded-lg bg-gray-50 object-cover"
              value={heroImage}
            />
          ) : (
            <div className="aspect-video w-full rounded-lg bg-gray-50 object-cover" />
          )}
          {remainingImages && remainingImages.length > 0 ? (
            <div className="flex items-center justify-center gap-4 p-4 md:p-8">
              {[heroImage, ...remainingImages].map((image) =>
                image ? (
                  <SanityImage key={image._key} value={image} className="h-20 w-20 object-cover" />
                ) : (
                  <div className="h-20 w-20 bg-gray-50" />
                )
              )}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 p-6 md:p-12">
          <span className="text-sm font-medium text-gray-700">
            {category?.title ? category.title : `{{category.title}}`}
          </span>

          <h1 className="mb-2 text-3xl font-medium leading-10">
            {title ?? `{{title}}`} <br />{' '}
            <span className="text-green-700">
              {price
                ? new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price)
                : `{{price}}`}

              {compareAtPrice ? (
                <del className="ml-2 text-green-600">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(compareAtPrice)}
                </del>
              ) : null}
            </span>
          </h1>

          <Form method="post" className="mb-8 flex items-center justify-start gap-4">
            <button
              disabled={!price || !_id}
              className="mr-auto rounded bg-green-900 p-4 px-8 text-lg text-green-50 transition-colors duration-100 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
              name="_id"
              value={_id}
              type="submit"
            >
              Add to cart
            </button>
            {stockLevel ? (
              <>
                <div className="flex-1 text-left text-lg">
                  {actionData?.stockLevel ?? stockLevel} remaining
                </div>
              </>
            ) : (
              <div className="flex-1 text-left text-lg">Out of stock</div>
            )}
          </Form>

          {content && content?.length > 0 ? (
            <SanityContent value={content} />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="h-4 animate-pulse bg-gray-50" />
              <div className="h-4 animate-pulse bg-gray-50" />
              <div className="h-4 animate-pulse bg-gray-50" />
              <div className="h-4 w-4/5 animate-pulse bg-gray-50" />
            </div>
          )}
        </div>
      </section>
    </>
  )
}
