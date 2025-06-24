import React, { useState } from 'react'

import { AircraftViewer, AircraftViewerSelector } from '../components/aircraft-viewer'
import { AircraftsList } from '../components/aircraft-viewer/aircraftsList'

export const AircraftsPage: React.FC = () => {
  const [selectedModelName, setSelectedModelName] = useState<string>(Object.keys(AircraftsList)[0])

  return (
    <div className="grow bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <h1 className="text-4xl font-bold">Модель</h1>
          <AircraftViewerSelector
            selectedModelName={selectedModelName}
            onModelChange={setSelectedModelName}
          />
        </div>

        <div className="mt-8">
          <AircraftViewer model={AircraftsList[selectedModelName]} />
        </div>
      </div>
    </div>
  )
}
