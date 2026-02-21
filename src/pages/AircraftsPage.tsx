import { AircraftViewerWidget } from '@widgets/AircraftViewerWidget';

export const AircraftsPage = () => {
  return (
    <div className="grow bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <AircraftViewerWidget />
      </div>
    </div>
  );
};
