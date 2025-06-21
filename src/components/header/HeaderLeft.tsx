import React from 'react'
import { Link } from 'react-router-dom'

import { AppLogo } from './AppLogo'
import { Balance } from './Balance'

export const HeaderLeft: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <AppLogo />
      <Balance />
      <nav className="flex items-center space-x-4 ml-6">
        <Link
          to="/"
          className="text-white hover:text-blue-300 transition-colors"
        >
          Игра
        </Link>
        <Link
          to="/aircrafts"
          className="text-white hover:text-blue-300 transition-colors"
        >
          Самолеты
        </Link>
      </nav>
    </div>
  )
}
