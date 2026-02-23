import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { CityView } from './components/CityView';
import { CitiesModelProvider, useCitiesModel } from './model';

const CitiesView = observer(function CitiesView() {
  const { cities, selectCity, selectedCity, globeInitialRotation } = useCitiesModel();

  return (
    <group rotation={globeInitialRotation}>
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
