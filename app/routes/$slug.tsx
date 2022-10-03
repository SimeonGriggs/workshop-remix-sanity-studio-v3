import type {LinksFunction, LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import Layout from '~/components/Layout'
import ProductStandard from '~/components/ProductStandard'
import type {ProductDocument} from '~/sanity/types/Product'

import styles from '~/styles/app.css'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const loader: LoaderFunction = async ({params}) => {
  const product = {}

  if (!product) {
    return new Response('Not found', {status: 404})
  }

  return json({product})
}

export default function Product() {
  const {product} = useLoaderData<{product?: ProductDocument}>()

  return (
    <Layout>
      <ProductStandard {...product} />
    </Layout>
  )
}
