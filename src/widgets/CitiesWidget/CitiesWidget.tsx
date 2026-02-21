import { observer } from 'mobx-react-lite';
import { GLOBE_ROTATION } from '@constants';
import { createWidget } from '@core/di';
import { CityView } from './components/CityView';
import { CitiesModelProvider, useCitiesModel } from './model';

const CitiesView = observer(function CitiesView() {
  const { cities, selectCity, selectedCity } = useCitiesModel();

  return (
    <group rotation={[GLOBE_ROTATION.X, GLOBE_ROTATION.Y, GLOBE_ROTATION.Z]}>
      {cities.map((city, index) => (
        <CityView
          key={city.iata ?? index}
          city={city}
          onSelect={selectCity}
          selectedCity={selectedCity}
        />
      ))}
    </group>
  );
});

export const CitiesWidget = createWidget(CitiesModelProvider, CitiesView);
