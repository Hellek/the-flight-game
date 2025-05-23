import React from 'react'

import { AppLogo } from './AppLogo'
import { Balance } from './Balance'

export const HeaderLeft: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <AppLogo />
      <Balance />
    </div>
  )
}
