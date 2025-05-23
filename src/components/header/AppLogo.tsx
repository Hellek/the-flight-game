import React from 'react'

const AppIcon = () => {
  return (
    <svg
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  )
}

export const AppLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <AppIcon />
      </div>
      <div className="text-xl font-bold text-white">Flight Game</div>
    </div>
  )
}
