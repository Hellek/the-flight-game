import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Header } from '@layout/Header'
import { AircraftsPage, GamePage } from '@pages'

export const App = () => {
  return (
    <Router>
      <div className="h-screen select-none flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/aircrafts" element={<AircraftsPage />} />
        </Routes>
      </div>
    </Router>
  )
}
