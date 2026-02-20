import { useState } from 'react'
import { AircraftsList, AircraftViewer, AircraftViewerSelector } from '../components/aircraft-viewer'
import { Heading } from '../components/ui'

export const AircraftsPage = () => {
  const [selectedModelName, setSelectedModelName] = useState<string>(Object.keys(AircraftsList)[0])

  return (
    <div className="grow bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-8">
          <Heading level={2}>Модель</Heading>
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
