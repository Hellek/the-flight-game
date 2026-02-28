import { Link } from 'react-router-dom';
import { Maximize, Minimize } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox } from '@components/ui';
import { createWidget } from '@core/di';
import { useFullscreen } from './hooks/useFullscreen';
import { MainMenuModelProvider, useMainMenuModel } from './model';

const MainMenuView = observer(function MainMenuView() {
  const { selectChangelog, routesVisible, toggleRoutesVisible } = useMainMenuModel();
  const { isFullscreen, toggle, supported } = useFullscreen();

  return (
    <nav className="flex flex-col gap-6" aria-label="Главное меню">
      <section className="flex flex-col gap-2">
        <span className="
          text-xs font-medium tracking-wide text-slate-400 uppercase
        ">Разделы</span>
        <div className="flex flex-col gap-1">
          <Link
            to="/"
            className="
              rounded-md px-3 py-2 text-left text-slate-700 transition-colors
              hover:bg-slate-100 hover:text-slate-900
            "
          >
            Игра
          </Link>
          <Link
            to="/aircrafts"
            className="
              rounded-md px-3 py-2 text-left text-slate-700 transition-colors
              hover:bg-slate-100 hover:text-slate-900
            "
          >
            Самолеты
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <span className="
          text-xs font-medium tracking-wide text-slate-400 uppercase
        ">Настройки</span>
        <div className="flex flex-col gap-2">
          {supported && (
            <Button
              variant="ghost"
              onClick={toggle}
              title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
              className="
                justify-start px-3 py-2 text-slate-700
                hover:bg-slate-100 hover:text-slate-900
              "
            >
              <span className="flex items-center gap-2">
                {isFullscreen ? (
                  <Minimize className="size-[18px]" aria-hidden />
                ) : (
                  <Maximize className="size-[18px]" aria-hidden />
                )}
                <span className="text-sm">{isFullscreen ? 'Выйти с полного экрана' : 'На весь экран'}</span>
              </span>
            </Button>
          )}
          <div className="px-3 py-2">
            <Checkbox
              checked={routesVisible}
              onChange={toggleRoutesVisible}
              label="Показать маршруты"
              className="text-slate-700"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <span className="
          text-xs font-medium tracking-wide text-slate-400 uppercase
        ">Информация</span>
        <Button
          variant="ghost"
          onClick={selectChangelog}
          title="Изменения в игре"
          className="
            justify-start px-3 py-2 text-slate-700
            hover:bg-slate-100 hover:text-slate-900
          "
        >
          <span className="text-sm">Изменения</span>
        </Button>
      </section>
    </nav>
  );
});

export const MainMenuWidget = createWidget(MainMenuModelProvider, MainMenuView);
