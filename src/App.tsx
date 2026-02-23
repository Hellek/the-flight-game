import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { DIProvider } from '@core/di';
import { AircraftsPage, GamePage } from '@pages';
import { InfoPanelWidget } from '@widgets/InfoPanelWidget';

export const App = () => {
  return (
    <DIProvider>
      <Router>
        <Layout>
          <InfoPanelWidget />
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/aircrafts" element={<AircraftsPage />} />
          </Routes>
        </Layout>
      </Router>
    </DIProvider>
  );
};
