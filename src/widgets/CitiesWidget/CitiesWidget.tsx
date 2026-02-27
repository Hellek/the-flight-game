import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { CityWidget } from '@widgets/CityWidget/CityWidget';
import { CitiesModelProvider, useCitiesModel } from './model';

const CitiesView = observer(function CitiesView() {
  const { cities, globeInitialRotation } = useCitiesModel();

  return (
    <group rotation={globeInitialRotation}>
      {cities.map((city, index) => (
        <CityWidget
          key={city.iata ?? index}
          city={city}
        />
      ))}
    </group>
  );
});

export const CitiesWidget = createWidget(CitiesModelProvider, CitiesView);
