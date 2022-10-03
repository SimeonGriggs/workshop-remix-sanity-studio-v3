import React from 'react'
import {MenuIcon, SearchIcon, UserIcon, TrolleyIcon} from '@sanity/icons'
import {Link} from '@remix-run/react'

export default function Header() {
  return (
    <div className="fixed top-0 z-50 flex h-12 w-screen items-center bg-green-900/95 text-green-50 backdrop-blur-sm md:h-20">
      <div className="container mx-auto grid grid-cols-5">
        <ul className="col-span-2 hidden items-center justify-start gap-4 px-4 md:flex md:px-8">
          <li>Shop</li>
          <li>Inspiration</li>
          <li>Learn</li>
        </ul>
        <div className="leading-0 col-span-2 flex items-center px-4 text-center text-sm uppercase tracking-tight md:col-span-1 md:justify-center md:px-8 md:text-lg lg:text-xl">
          <Link to="/" className="whitespace-nowrap hover:text-white">
            Hose & Hammer
          </Link>
        </div>
        <ul className="col-span-3 flex items-center justify-end gap-4 px-4 md:col-span-2 md:px-8">
          <li className="flex items-center gap-1">
            <span className="text-3xl">
              <SearchIcon />
            </span>
            Search
          </li>
          <li className="flex items-center gap-1">
            <span className="text-3xl">
              <UserIcon />
            </span>
            <span className="sr-only">My Account</span>
          </li>
          <li className="flex items-center gap-1">
            <span className="text-3xl">
              <TrolleyIcon />
            </span>
            <span className="sr-only">Cart</span>
          </li>
          <li className="flex items-center gap-1 md:hidden">
            <span className="text-3xl">
              <MenuIcon />
            </span>
            <span className="sr-only">Menu</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
