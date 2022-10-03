import React from 'react'
import {PortableText} from '@portabletext/react'

import SanityContentImage from './SanityContentImage'

type ContentProps = {
  value: any[]
}

const components = {
  types: {
    image: SanityContentImage,
  },
}

export default function SanityContent(props: ContentProps) {
  const {value} = props

  return (
    <div className="prose prose-lg prose-a:text-green-600 md:prose-xl">
      <PortableText value={value} components={components} />
    </div>
  )
}
