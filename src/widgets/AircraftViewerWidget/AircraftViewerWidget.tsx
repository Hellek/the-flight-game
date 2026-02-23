import { observer } from 'mobx-react-lite';
import { Heading } from '@components/ui';
import { createWidget } from '@core/di';
import { AircraftViewerCanvas } from './components/AircraftViewerCanvas';
import { AircraftViewerSelector } from './components/AircraftViewerSelector';
import { AircraftViewerWidgetModelProvider, useAircraftViewerWidgetModel } from './model';

const AircraftViewerWidgetView = observer(function AircraftViewerWidgetView() {
  const { selectedModelName, setSelectedModelName, modelNames, currentModel } =
    useAircraftViewerWidgetModel();

  if (!currentModel) return null;

  return (
    <>
      <div className="mb-8 flex items-center gap-6">
        <Heading level={2}>Модель</Heading>
        <AircraftViewerSelector
          modelNames={modelNames}
          selectedModelName={selectedModelName}
          onModelChange={setSelectedModelName}
        />
      </div>
      <AircraftViewerCanvas
        model={currentModel}
        className="mt-8"
      />
    </>
  );
});

export const AircraftViewerWidget = createWidget(
  AircraftViewerWidgetModelProvider,
  AircraftViewerWidgetView,
);
