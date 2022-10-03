import SanityClient from '@sanity/client'

import {projectDetails} from './config'

export const client = new SanityClient({
  ...projectDetails(),
  useCdn: process.env.NODE_ENV === 'production',
})

export const clientAuthenticated = new SanityClient({
  ...projectDetails(),
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_WRITE_TOKEN,
})
