import { useState } from 'react';
import Navbar from './components/Navbar';
import StockPage from './components/StockPage';
import CorrelationHeatmap from './components/CorrelationHeatmap';

function App() {
  const [route, setRoute] = useState('stock');

  return (
    <>
      <Navbar />
      {route === 'stock' && <StockPage />}
      {route === 'heatmap' && <CorrelationHeatmap />}
    </>
  );
}

export default App;
