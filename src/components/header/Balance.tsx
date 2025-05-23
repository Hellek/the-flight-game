import React from 'react'
import { observer } from 'mobx-react-lite'

import { rootStore } from '../../stores'

export const Balance: React.FC = observer(() => {
  return (
    <h1 className="text-xl font-bold text-white">
      {rootStore.finance.formattedBalance}
    </h1>
  )
})
