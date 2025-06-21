import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { GamePage, AircraftsPage } from './pages'

const App = () => {
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

export default App
