import React from 'react';
import { observer } from 'mobx-react-lite';
import { Aircraft } from './Aircraft';
import { rootStore } from '../stores/RootStore';

export const Aircrafts: React.FC = observer(() => {
  return (
    <>
      {rootStore.aircraftStore.aircrafts.map((aircraft) => (
        <Aircraft
          key={aircraft.id}
          aircraft={aircraft}
        />
      ))}
    </>
  );
});
