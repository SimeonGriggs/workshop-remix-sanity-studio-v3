import type {PropsWithChildren} from 'react'
import React from 'react'
import urlBuilder from '@sanity/image-url'
import {getImageDimensions} from '@sanity/asset-utils'
import type {SanityImageSource} from '@sanity/asset-utils'
import type {PortableTextComponentProps} from '@portabletext/react'

import {projectDetails} from '~/sanity/config'

type SanityImageAssetWithAlt = SanityImageSource & {alt?: string}
export type SanityImageAsset = {value: SanityImageSource}

type WrapperProps = PropsWithChildren & {
  isInline: boolean
}

function Wrapper(props: WrapperProps) {
  const {isInline, children} = props

  return isInline ? <span className="not-prose">{children}</span> : <>{children}</>
}

export default function SanityImage(
  props: PortableTextComponentProps<SanityImageAssetWithAlt> | SanityImageAsset
) {
  const {value, className} = props
  const {width, height} = getImageDimensions(value)

  return (
    <Wrapper isInline={props?.isInline}>
      <img
        className={`${
          className ?? `${props?.isInline ? `inline-block h-4 w-auto` : `block h-auto w-full`}`
        }`}
        src={urlBuilder(projectDetails())
          .image(value)
          .width(props?.isInline ? 100 : 800)
          .fit('max')
          .auto('format')
          .url()}
        alt={value?.alt || ''}
        loading="lazy"
        style={{
          // Avoid jumping around with aspect-ratio CSS property
          aspectRatio: Math.round((width / height) * 100) / 100,
        }}
      />
    </Wrapper>
  )
}
