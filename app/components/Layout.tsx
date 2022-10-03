import type {PropsWithChildren} from 'react'
import Header from './Header'

export default function Layout(props: PropsWithChildren) {
  const {children} = props

  return (
    <>
      <Header />

      {children}

      {/* <footer className="rounded bg-green-100 p-6 text-center shadow-inner md:mt-12 md:p-12">
        <a href="/studio" className="font-medium text-green-600 underline">
          Log in to Sanity Studio v3
        </a>
      </footer> */}
    </>
  )
}
