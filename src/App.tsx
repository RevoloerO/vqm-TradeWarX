import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import USChinaSimulation from './USChinaSimulation';
import HistoricalAnalysis from './HistoricalAnalysis';

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/US-China" element={<USChinaSimulation />} />
        <Route path="/historical" element={<HistoricalAnalysis />} />
      </Routes>
    </>
  )
}

export default App
