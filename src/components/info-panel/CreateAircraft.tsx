import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AircraftSize } from '../../types/types';
import { rootStore } from '../../stores/RootStore';

interface CreateAircraftProps {
  routeId: string;
}

export const CreateAircraft: React.FC<CreateAircraftProps> = observer(({ routeId }) => {
  const [selectedType, setSelectedType] = useState<AircraftSize>(1);

  const handleCreate = () => {
    rootStore.aircraftStore.createAircraft(routeId, selectedType);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Тип самолета
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(Number(e.target.value) as AircraftSize)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={1}>Маленький (1)</option>
          <option value={2}>Средний (2)</option>
          <option value={3}>Большой (3)</option>
          <option value={4}>Очень большой (4)</option>
          <option value={5}>Гигантский (5)</option>
        </select>
      </div>

      <button
        onClick={handleCreate}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Создать самолет
      </button>
    </div>
  );
});
