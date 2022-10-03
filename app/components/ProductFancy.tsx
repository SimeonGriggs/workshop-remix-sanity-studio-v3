import type {ProductDocument} from '~/sanity/types/Product'
import SanityContent from './SanityContent'
import SanityImage from './SanityImage'

export default function ProductFancy(props: ProductDocument) {
  const {title, price, content, images, category} = props
  const [heroImage, ...remainingImages] = images ?? []

  return (
    <>
      <section className="relative flex justify-end overflow-hidden pt-48 pb-12 pr-12 md:pt-96">
        <div className="relative z-10 w-1/2 flex-col gap-4 rounded-lg bg-white/80 p-6 shadow md:w-1/4">
          {category?.title ? (
            <span className="text-sm font-medium text-gray-700">{category.title}</span>
          ) : null}
          <h1 className="mb-2 text-3xl font-medium leading-10">
            {title} <br />{' '}
            {price
              ? new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price)
              : null}
          </h1>
          <button
            className="mr-auto rounded bg-green-900 p-4 px-8 text-lg text-green-50 transition-colors duration-100 hover:bg-green-700"
            type="button"
          >
            Add to cart
          </button>
        </div>
        {heroImage ? (
          <SanityImage value={heroImage} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
      </section>
      {content && content?.length > 0 ? (
        <article className="mx-auto my-6 max-w-3xl p-4 md:my-12 md:p-8">
          <SanityContent value={content} />
        </article>
      ) : null}
      {remainingImages && remainingImages.length > 0 ? (
        <div className="flex flex-col bg-green-900 p-4 md:p-8">
          {remainingImages.map((image, imageIndex) => (
            <SanityImage
              key={image._key}
              value={image}
              className={[
                `w-3/5`,
                imageIndex > 0 ? `-translate-y-12 md:-translate-y-24` : ``,
                imageIndex % 2 === 0 ? `` : `ml-auto`,
              ].join(` `)}
            />
          ))}
        </div>
      ) : null}
    </>
  )
}
