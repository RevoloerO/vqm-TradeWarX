import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import USChinaSimulation from './USChinaSimulation';

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/vqm-TradeWarX/" element={<HomePage />} />
        <Route path="/vqm-TradeWarX/US-China" element={<USChinaSimulation />} />
      </Routes>
    </>
  )
}

export default App
