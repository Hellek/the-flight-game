import { Pause, Play } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@components/ui';
import { createWidget } from '@core/di';
import { PauseModelProvider, usePauseModel } from './model';

const PauseView = observer(function PauseView() {
  const { isPaused, togglePause } = usePauseModel();

  return (
    <Button
      variant="icon"
      onClick={togglePause}
      aria-label={isPaused ? 'Продолжить' : 'Пауза'}
      title={isPaused ? 'Продолжить' : 'Пауза'}
      className="rounded-lg bg-white shadow-lg"
    >
      {isPaused ? (
        <Play className="size-5 text-slate-500" />
      ) : (
        <Pause className="size-5 text-slate-500" />
      )}
    </Button>
  );
});

export const PauseWidget = createWidget(PauseModelProvider, PauseView);
