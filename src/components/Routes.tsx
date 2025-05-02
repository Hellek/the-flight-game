import React from 'react';
import { Airport as AirportType } from '../types/types';
import { Route } from './Route';

interface RoutesProps {
  airports: AirportType[];
  onRouteClick?: (departure: AirportType, arrival: AirportType) => void;
}

export const Routes: React.FC<RoutesProps> = ({ airports, onRouteClick }) => {
  return (
    <>
      {airports.map((airport1, index) => {
        return airports.slice(index + 1).map((airport2) => (
          <Route
            key={`${airport1.id}-${airport2.id}`}
            departure={airport1}
            arrival={airport2}
            onClick={onRouteClick}
          />
        ));
      })}
    </>
  );
};
