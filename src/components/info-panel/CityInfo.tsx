import React from 'react'

import { City as CityType } from '../../types'

interface CityInfoProps {
  city: CityType;
}

export const CityInfo: React.FC<CityInfoProps> = ({ city }) => (
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
)
