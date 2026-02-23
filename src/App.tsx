import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from '@components/Layout';
import { DIProvider } from '@core/di';
import { AircraftsPage, GamePage } from '@pages';
import { HeaderWidget } from '@widgets/HeaderWidget';

export const App = () => {
  return (
    <DIProvider>
      <Router>
        <Layout>
          <HeaderWidget />
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/aircrafts" element={<AircraftsPage />} />
          </Routes>
        </Layout>
      </Router>
    </DIProvider>
  );
};
