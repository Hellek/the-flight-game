import { Game } from './components/Game'
import { Header } from './components/Header'

const App = () => {
  return (
    <div className="h-screen select-none flex flex-col">
      <Header />
      <Game />
    </div>
  )
}

export default App
