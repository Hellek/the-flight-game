import React from 'react';
import { Airport as AirportType } from '../types/types';
import { Airport } from './Airport';

interface AirportsProps {
  airports: AirportType[];
  onAirportClick?: (airport: AirportType) => void;
}

export const Airports: React.FC<AirportsProps> = ({ airports, onAirportClick }) => {
  return (
    <>
      {airports.map((airport) => (
        <Airport
          key={airport.id}
          airport={airport}
          onClick={onAirportClick}
        />
      ))}
    </>
  );
};
