import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button, Select } from '@components/ui'
import { rootModel } from '@models'
import { AircraftSize, type Route } from '@types'
import { getAircraftSizeName } from '@utils'

interface CreateAircraftProps {
  route: Route
}

const sizeOptions = Object.values(AircraftSize).map(size => ({
  value: size,
  label: getAircraftSizeName(size),
}))

export const CreateAircraft = observer(({ route }: CreateAircraftProps) => {
  const [selectedType, setSelectedType] = useState<AircraftSize>(AircraftSize.small)

  const handleCreate = () => {
    rootModel.aircraft.createAircraft(route, selectedType)
    setSelectedType(AircraftSize.small)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Купить самолет
        </label>
        <Select<AircraftSize>
          value={selectedType}
          onChange={setSelectedType}
          options={sizeOptions}
        />
      </div>

      <Button onClick={handleCreate}>Создать самолет</Button>
    </div>
  )
})
