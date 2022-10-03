import type {LinksFunction, LoaderFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import groq from 'groq'

import Layout from '~/components/Layout'
import ProductStub from '~/components/ProductStub'
import {client} from '~/sanity/client'
import type {ProductDocument} from '~/sanity/types/Product'

import styles from '~/styles/app.css'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const loader: LoaderFunction = async () => {
  const products = await client.fetch(groq`*[_type == "product"]{
    _id,
    title,
    slug,
    images,
    price,
    compareAtPrice,
    "onSale": price < compareAtPrice,
    category->{ title }
  }`)

  return {products}
}

export default function Index() {
  const {products} = useLoaderData<{products: ProductDocument[]}>()

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-4 md:pt-8">
        {products.length > 0 ? (
          <ul className="container mx-auto grid grid-cols-2 gap-4 py-12 px-4 md:grid-cols-3 md:gap-8 md:py-20 md:px-8 md:text-lg">
            {products.map((product) => (
              <li key={product._id}>
                <ProductStub {...product} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Layout>
  )
}
