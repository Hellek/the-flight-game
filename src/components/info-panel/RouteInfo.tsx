import React from 'react';
import { Airport as AirportType } from '../../types/types';
import { InfoSection } from './InfoSection';

interface RouteInfoProps {
  departure: AirportType;
  arrival: AirportType;
}

export const RouteInfo: React.FC<RouteInfoProps> = ({ departure, arrival }) => {
  const distance = Math.sqrt(
    Math.pow(arrival.position.x - departure.position.x, 2) +
    Math.pow(arrival.position.y - departure.position.y, 2)
  );

  return (
    <div className="space-y-4">
      <InfoSection title="Отправление">
        <div>
          {departure.name}
        </div>
      </InfoSection>

      <InfoSection title="Прибытие">
        <div>
          {arrival.name}
        </div>
      </InfoSection>

      <div className="pt-2 border-t border-slate-200">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Расстояние:</span>
          <span className="font-medium">{Math.round(distance)} км</span>
        </div>
      </div>
    </div>
  );
};
