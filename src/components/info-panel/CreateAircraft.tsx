import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'

import { rootStore } from '../../stores'
import { AircraftSize, Route } from '../../types'
import { getAircraftSizeName } from '../../utils'

interface CreateAircraftProps {
  route: Route
}

export const CreateAircraft: React.FC<CreateAircraftProps> = observer(({ route }) => {
  const [selectedType, setSelectedType] = useState<AircraftSize>(AircraftSize.small)

  const handleCreate = () => {
    rootStore.aircraftStore.createAircraft(route, selectedType)
    setSelectedType(AircraftSize.small)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Купить самолет
        </label>
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as AircraftSize)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(AircraftSize).map(size => (
            <option key={size} value={size}>
              {getAircraftSizeName(size)}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreate}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Создать самолет
      </button>
    </div>
  )
})
