import { AircraftsList } from '@components/aircraft-viewer/aircraftsList'
import { Select } from '@components/ui'

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
