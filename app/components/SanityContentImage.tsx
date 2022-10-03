/* eslint-disable jsx-a11y/alt-text */
import type {DetailedHTMLProps} from 'react'
import React from 'react'
import urlBuilder from '@sanity/image-url'
import {getImageDimensions} from '@sanity/asset-utils'
import type {SanityImageSource} from '@sanity/asset-utils'
import type {PortableTextComponentProps} from '@portabletext/react'

import {projectDetails} from '~/sanity/config'

type SanityImageAssetWithAlt = SanityImageSource & {alt?: string}
export type SanityImageAsset = {value: SanityImageSource}

// A component for show images 800px wide in Portable Text
export default function SanityContentImage(
  props: PortableTextComponentProps<SanityImageAssetWithAlt>
) {
  const {value} = props
  const {width, height} = getImageDimensions(value)
  const src = urlBuilder(projectDetails())
    .image(value)
    .width(props?.isInline ? 100 : 800)
    .fit('max')
    .auto('format')
    .url()
  const style = {
    aspectRatio: Math.round((width / height) * 100) / 100,
  }
  const imageProps: DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > = {
    src,
    alt: value?.alt || ``,
    style,
    loading: 'lazy',
  }

  if (props?.isInline) {
    return (
      <span className="not-prose">
        <img className="inline-block h-4 w-auto" {...imageProps} />
      </span>
    )
  }

  return <img className="block h-auto w-full" {...imageProps} />
}
