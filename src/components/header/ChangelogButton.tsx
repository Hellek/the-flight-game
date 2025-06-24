import React from 'react'
import { observer } from 'mobx-react-lite'

import { rootStore } from '../../stores'

const ChangelogIcon = () => {
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
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

export const ChangelogButton: React.FC = observer(() => {
  const handleClick = () => {
    rootStore.selection.selectChangelog()
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
      title="Изменения в игре"
    >
      <ChangelogIcon />
      <span className="text-sm">Изменения</span>
    </button>
  )
})
