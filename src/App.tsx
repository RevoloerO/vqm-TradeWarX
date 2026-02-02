import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import USChinaSimulation from './USChinaSimulation';
import HistoricalAnalysis from './HistoricalAnalysis';
import MultiPolarSimulation from './MultiPolarSimulation';

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/US-China" element={<USChinaSimulation />} />
        <Route path="/historical" element={<HistoricalAnalysis />} />
        <Route path="/multipolar" element={<MultiPolarSimulation />} />
      </Routes>
    </>
  )
}

export default App
