import React from 'react';
import { Airport as AirportType } from '../types/types';
import { Airport } from './Airport';

interface AirportsProps {
  airports: AirportType[];
  onAirportClick?: (airport: AirportType) => void;
  selectedAirport?: AirportType | null;
}

export const Airports: React.FC<AirportsProps> = ({
  airports,
  onAirportClick,
  selectedAirport
}) => {
  return (
    <>
      {airports.map((airport) => (
        <Airport
          key={airport.id}
          airport={airport}
          onClick={onAirportClick}
          isSelected={selectedAirport?.id === airport.id}
        />
      ))}
    </>
  );
};
