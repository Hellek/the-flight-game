import { observer } from 'mobx-react-lite';
import { createWidget } from '@core/di';
import { AircraftView } from './components/AircraftView';
import { AircraftsModelProvider, useAircraftsModel } from './model';

const AircraftsView = observer(function AircraftsView() {
  const {
    aircrafts,
    getAircraftPosition,
    getAircraftRotation,
    selectedAircraft,
    selectAircraft,
  } = useAircraftsModel();

  return (
    <>
      {aircrafts.map(aircraft => (
        <AircraftView
          key={aircraft.id}
          aircraft={aircraft}
          getPosition={getAircraftPosition}
          getRotation={getAircraftRotation}
          isSelected={selectedAircraft?.id === aircraft.id}
          onSelect={selectAircraft}
        />
      ))}
    </>
  );
});

export const AircraftsWidget = createWidget(AircraftsModelProvider, AircraftsView);
