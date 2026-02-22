import { AircraftViewerWidget } from '@widgets/AircraftViewerWidget';

export const AircraftsPage = () => {
  return (
    <div className="grow bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <AircraftViewerWidget />
      </div>
    </div>
  );
};
