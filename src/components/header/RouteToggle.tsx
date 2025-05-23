import React from 'react'
import { observer } from 'mobx-react-lite'

import { rootStore } from '../../stores'

const RouteIcon = () => {
  return (
    <svg
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  )
}

export const RouteToggle: React.FC = observer(() => {
  const { viewSettings } = rootStore

  return (
    <label className="flex items-center space-x-2 text-white cursor-pointer">
      <input
        type="checkbox"
        checked={viewSettings.showRoutes}
        onChange={() => viewSettings.toggleRoutes()}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <RouteIcon />
      <span className="text-sm">Показать маршруты</span>
    </label>
  )
})
