import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Heading } from '@components/ui';
import { createWidget } from '@core/di';
import { HeaderModelProvider, useHeaderModel } from './model';

const HeaderView = observer(function HeaderView() {
  const { formattedBalance, selectChangelog, showRoutes, toggleRoutes } = useHeaderModel();

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-slate-700">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <div className="text-xl font-bold text-white">Flight Game</div>
        </div>

        <Heading level={1}>{formattedBalance}</Heading>
        <nav className="flex items-center space-x-4 ml-6">
          <Link
            to="/"
            className="text-white hover:text-blue-300 transition-colors"
          >
            Игра
          </Link>
          <Link
            to="/aircrafts"
            className="text-white hover:text-blue-300 transition-colors"
          >
            Самолеты
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
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
