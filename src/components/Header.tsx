import React from 'react'

import { HeaderLeft } from './header/HeaderLeft'
import { RouteToggle } from './header/RouteToggle'
import { ChangelogButton } from './header/ChangelogButton'

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-slate-700">
      <HeaderLeft />
      <div className="flex items-center space-x-4">
        <ChangelogButton />
        <RouteToggle />
      </div>
    </header>
  )
}
