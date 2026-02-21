import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DIProvider } from '@core/di/ContainerContext';
import { AircraftsPage, GamePage } from '@pages';
import { HeaderWidget } from '@widgets/HeaderWidget';

export const App = () => {
  return (
    <DIProvider>
      <Router>
        <div className="h-screen select-none flex flex-col">
          <HeaderWidget />
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/aircrafts" element={<AircraftsPage />} />
          </Routes>
        </div>
      </Router>
    </DIProvider>
  );
};
