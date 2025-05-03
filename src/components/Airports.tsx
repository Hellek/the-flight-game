import React from 'react';
import { observer } from 'mobx-react-lite';
import { Airport } from './Airport';
import { rootStore } from '../stores/RootStore';

export const Airports: React.FC = observer(() => {
  return (
    <>
      {rootStore.airportStore.airports.map((airport) => (
        <Airport
          key={airport.id}
          airport={airport}
        />
      ))}
    </>
  );
});
