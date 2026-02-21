import { Select } from '@components/ui';

interface AircraftViewerSelectorProps {
  modelNames: string[];
  selectedModelName: string;
  onModelChange: (name: string) => void;
}

const options = (names: string[]) => names.map(name => ({ value: name, label: name }));

export function AircraftViewerSelector({
  modelNames,
  selectedModelName,
  onModelChange,
}: AircraftViewerSelectorProps) {
  return (
    <Select
      id="aircraft-model"
      value={selectedModelName}
      onChange={onModelChange}
      options={options(modelNames)}
      variant="dark"
      aria-label="Модель самолета"
    />
  );
}
