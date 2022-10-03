import type {ActionFunction, LinksFunction, LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useActionData, useLoaderData} from '@remix-run/react'
import groq from 'groq'

import Layout from '~/components/Layout'
import ProductStandard from '~/components/ProductStandard'
import ProductFancy from '~/components/ProductFancy'
import {client, clientAuthenticated} from '~/sanity/client'
import type {ProductDocument} from '~/sanity/types/Product'

import styles from '~/styles/app.css'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const action: ActionFunction = async ({request}) => {
  const body = await request.formData()
  const _id = String(body.get('_id'))

  if (!_id) {
    return json({message: 'no document id'})
  }

  const update = await clientAuthenticated
    .patch(_id)
    .dec({stockLevel: 1})
    .commit()
    .then((res) => res)
    .catch((err) => {
      console.error(err)
      return err
    })

  return json(update)
}

export const loader: LoaderFunction = async ({params}) => {
  const {slug} = params
  const product = await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{ 
      _id,
      title,
      price,
      compareAtPrice,
      stockLevel,
      images,
      content[_type != "image"],
      category->{title, slug},
    }`,
    {slug}
  )

  if (!product) {
    return new Response('Not found', {status: 404})
  }

  return json({product})
}

export default function Product() {
  const {product} = useLoaderData<{product?: ProductDocument}>()

  return (
    <Layout>
      {product?.price && product.price > 999 ? (
        <ProductFancy {...product} />
      ) : (
        <ProductStandard {...product} />
      )}
    </Layout>
  )
}
