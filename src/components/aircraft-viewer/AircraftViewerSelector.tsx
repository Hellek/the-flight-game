import { Select } from '../ui'
import { AircraftsList } from './aircraftsList'

interface AircraftViewerSelectorProps {
  selectedModelName: string
  onModelChange: (modelName: string) => void
}

const options = Object.keys(AircraftsList).map(name => ({ value: name, label: name }))

export const AircraftViewerSelector = ({
  selectedModelName,
  onModelChange,
}: AircraftViewerSelectorProps) => {
  return (
    <Select
      id="aircraft-model"
      value={selectedModelName}
      onChange={onModelChange}
      options={options}
      variant="dark"
      aria-label="Модель самолета"
    />
  )
}
