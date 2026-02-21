import type { City } from '@services';

interface CityInfoProps {
  city: City;
}

export const CityInfo = ({ city }: CityInfoProps) => (
  <>
    <div className="flex justify-between text-sm text-slate-600">
      <span>Название:</span>
      <span className="font-medium">{city.name}</span>
    </div>

    <div className="flex justify-between text-sm text-slate-600">
      <span>Код аэропорта:</span>
      <span className="font-medium">{city.iata}</span>
    </div>
  </>
);
