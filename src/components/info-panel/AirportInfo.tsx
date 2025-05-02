import React from 'react';
import { Airport as AirportType } from '../../types/types';
import { InfoSection } from './InfoSection';

interface AirportInfoProps {
  airport: AirportType;
}

export const AirportInfo: React.FC<AirportInfoProps> = ({ airport }) => (
  <div className="space-y-2">
    <InfoSection title={airport.name}>
      <div className="space-y-1">
        <div>
          ID: {airport.id}
        </div>
        <div>
          Координаты: ({Math.round(airport.position.x)}, {Math.round(airport.position.y)})
        </div>
      </div>
    </InfoSection>
  </div>
);
