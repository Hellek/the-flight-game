import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox } from '@components/ui';
import { createWidget } from '@core/di';
import { useFullscreen } from './hooks/useFullscreen';
import { HeaderModelProvider, useHeaderModel } from './model';

const FullscreenIcon = ({ isFullscreen }: { isFullscreen: boolean }) =>
  isFullscreen ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );

const HeaderView = observer(function HeaderView() {
  const { selectChangelog, showRoutes, toggleRoutes } = useHeaderModel();
  const { isFullscreen, toggle, supported } = useFullscreen();

  return (
    <header className="flex items-center justify-between bg-slate-700 p-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <div className="text-xl font-bold text-white">Flight Game</div>
        </div>

        <nav className="ml-6 flex items-center space-x-4">
          <Link
            to="/"
            className="
              text-white transition-colors
              hover:text-blue-300
            "
          >
            Игра
          </Link>
          <Link
            to="/aircrafts"
            className="
              text-white transition-colors
              hover:text-blue-300
            "
          >
            Самолеты
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {supported && (
          <Button
            variant="ghost"
            onClick={toggle}
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
            className="p-2 text-white"
          >
            <FullscreenIcon isFullscreen={isFullscreen} />
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={selectChangelog}
          title="Изменения в игре"
        >
          <span className="text-sm">Изменения</span>
        </Button>

        <Checkbox
          checked={showRoutes}
          onChange={toggleRoutes}
          label="Показать маршруты"
          className="text-white"
        />
      </div>
    </header>
  );
});

export const HeaderWidget = createWidget(HeaderModelProvider, HeaderView);
