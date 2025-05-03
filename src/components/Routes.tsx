import React from 'react';
import { observer } from 'mobx-react-lite';
import { Route } from './Route';
import { rootStore } from '../stores/RootStore';

export const Routes: React.FC = observer(() => {
  return (
    <>
      {rootStore.routeStore.routes.map((route) => {
        const departure = rootStore.airportStore.getAirportById(route.departureId);
        const arrival = rootStore.airportStore.getAirportById(route.arrivalId);

        if (!departure || !arrival) return null;

        return (
          <Route
            key={route.id}
            departure={departure}
            arrival={arrival}
          />
        );
      })}
    </>
  );
});
