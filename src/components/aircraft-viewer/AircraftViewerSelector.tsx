import React from 'react'
import { AircraftsList } from './aircraftsList'

interface AircraftViewerSelectorProps {
  selectedModelName: string
  onModelChange: (modelName: string) => void
}

export const AircraftViewerSelector: React.FC<AircraftViewerSelectorProps> = ({
  selectedModelName,
  onModelChange,
}) => {
  return (
    <select
      id="aircraft-model"
      value={selectedModelName}
      onChange={e => onModelChange(e.target.value)}
      className="w-full max-w-xs px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {Object.entries(AircraftsList).map(([name]) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  )
}
