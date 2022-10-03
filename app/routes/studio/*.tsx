import type {LinksFunction, MetaFunction} from '@remix-run/node'
import {ClientOnly} from 'remix-utils'
import {Studio} from 'sanity'

import {config} from '~/sanity/config'

import styles from '~/styles/studio.css'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Sanity Studio',
  viewport: 'width=device-width,initial-scale=1',
})

export default function StudioPage() {
  return <ClientOnly>{() => <Studio config={config} />}</ClientOnly>
}
