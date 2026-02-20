import React from 'react'
import { Link } from 'react-router-dom'
import { rootStore } from '../stores'

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-slate-700">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <div className="text-xl font-bold text-white">Flight Game</div>
        </div>

        <h1 className="text-xl font-bold text-white">
          {rootStore.finance.formattedBalance}
        </h1>
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
        <button
          onClick={rootStore.selection.selectChangelog}
          className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
          title="Изменения в игре"
        >
          <span className="text-sm">Изменения</span>
        </button>

        <label className="flex items-center space-x-2 text-white cursor-pointer">
          <input
            type="checkbox"
            checked={rootStore.viewSettings.showRoutes}
            onChange={rootStore.viewSettings.toggleRoutes}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm">Показать маршруты</span>
        </label>
      </div>
    </header>
  )
}
