import { Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@components/ui';
import { createWidget } from '@core/di';
import { SelectedEntityType } from '@services';
import { AircraftInfoWidget } from '@widgets/AircraftInfoWidget';
import { MainMenuWidget } from '@widgets/MainMenuWidget';
import { PauseWidget } from '@widgets/PauseWidget';
import { RouteInfoWidget } from '@widgets/RouteInfoWidget';
import { ChangelogInfo } from './components/ChangelogInfo';
import { CityInfo } from './components/CityInfo';
import { InfoPanelModal } from './components/InfoPanelModal';
import { InfoPanelModelProvider, useInfoPanelModel } from './model';
import { InfoPanelInnerTypeKey } from './model/InfoPanelModel';

const InfoPanelView = observer(function InfoPanelView() {
  const { panelTitle, panelTypeKey, selectedEntity, openMainMenu, close } = useInfoPanelModel();

  let content = null;
  if (panelTypeKey === InfoPanelInnerTypeKey.mainMenu) content = <MainMenuWidget />;
  else if (selectedEntity?.type === SelectedEntityType.city) content = <CityInfo city={selectedEntity.data} />;
  else if (selectedEntity?.type === SelectedEntityType.aircraft) {
    content = <AircraftInfoWidget aircraft={selectedEntity.data} />;
  } else if (selectedEntity?.type === SelectedEntityType.route) {
    content = <RouteInfoWidget route={selectedEntity.data} />;
  } else if (selectedEntity?.type === SelectedEntityType.changelog) content = <ChangelogInfo />;

  return (
    <div className="absolute top-4 right-4 z-10 flex items-start gap-2">
      <PauseWidget />
      {panelTypeKey ? (
        <InfoPanelModal
          title={panelTitle}
          onClose={close}
        >
          {content}
        </InfoPanelModal>
      ) : (
        <Button
          variant="icon"
          onClick={openMainMenu}
          aria-label="Меню"
          className="rounded-lg bg-white shadow-lg"
        >
          <Settings className="size-5 text-slate-500" />
        </Button>
      )}
    </div>
  );
});

export const InfoPanelWidget = createWidget(InfoPanelModelProvider, InfoPanelView);
