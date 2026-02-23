import { observer } from 'mobx-react-lite';
import { Button, Select } from '@components/ui';
import { createWidget } from '@core/di';
import type { AircraftSize } from '@services';
import { CreateAircraftModelProvider, useCreateAircraftModel } from './model';

const CreateAircraftView = observer(function CreateAircraftView() {
  const { selectedType, setSelectedType, sizeOptions, handleCreate } = useCreateAircraftModel();

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
});

export const CreateAircraftWidget = createWidget(CreateAircraftModelProvider, CreateAircraftView);
