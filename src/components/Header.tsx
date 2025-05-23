import React from 'react'

import { HeaderLeft } from './header/HeaderLeft'
import { RouteToggle } from './header/RouteToggle'

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-slate-700">
      <HeaderLeft />
      <RouteToggle />
    </header>
  )
}
