import { Link } from 'react-router-dom'
import { Button, Checkbox, Heading } from '../components/ui'
import { rootStore } from '../stores'

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-slate-700">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <div className="text-xl font-bold text-white">Flight Game</div>
        </div>

        <Heading level={1}>{rootStore.finance.formattedBalance}</Heading>
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
          onClick={rootStore.selection.selectChangelog}
          title="Изменения в игре"
        >
          <span className="text-sm">Изменения</span>
        </Button>

        <Checkbox
          checked={rootStore.viewSettings.showRoutes}
          onChange={rootStore.viewSettings.toggleRoutes}
          label="Показать маршруты"
          className="text-white"
        />
      </div>
    </header>
  )
}
