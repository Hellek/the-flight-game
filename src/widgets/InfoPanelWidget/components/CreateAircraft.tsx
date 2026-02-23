import { useState } from 'react';
import { Button, Select } from '@components/ui';
import { AircraftSize, type Route } from '@services';
import { getAircraftSizeName } from './utils';

interface CreateAircraftProps {
  route: Route;
  onCreate: (route: Route, type: AircraftSize) => void;
}

const sizeOptions = Object.values(AircraftSize).map(size => ({
  value: size,
  label: getAircraftSizeName(size),
}));

export function CreateAircraft({ route, onCreate }: CreateAircraftProps) {
  const [selectedType, setSelectedType] = useState<AircraftSize>(AircraftSize.small);

  const handleCreate = () => {
    onCreate(route, selectedType);
    setSelectedType(AircraftSize.small);
  };

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
  );
}
