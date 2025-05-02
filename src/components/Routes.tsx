import React from 'react';
import type { Airport } from '../types/types';
import { Route } from './Route';

interface RoutesProps {
  airports: Airport[];
  onRouteClick?: (departure: Airport, arrival: Airport) => void;
  selectedRoute?: {
    departure: Airport;
    arrival: Airport;
  } | null;
}

export const Routes: React.FC<RoutesProps> = ({
  airports,
  onRouteClick,
  selectedRoute
}) => {
  return (
    <>
      {airports.map((airport1, index) => {
        return airports.slice(index + 1).map((airport2) => (
          <Route
            key={`${airport1.id}-${airport2.id}`}
            departure={airport1}
            arrival={airport2}
            onClick={onRouteClick}
            isSelected={
              selectedRoute?.departure.id === airport1.id &&
              selectedRoute?.arrival.id === airport2.id
            }
          />
        ));
      })}
    </>
  );
};
