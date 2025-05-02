import { observer } from 'mobx-react-lite';
import { Game } from './components/Game';

const App = observer(() => {
  return (
    <div className="min-h-screen select-none">
      <Game />
    </div>
  );
});

export default App;
