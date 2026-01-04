import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import USChinaSimulation from './USChinaSimulation';

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/US-China" element={<USChinaSimulation />} />
      </Routes>
    </>
  )
}

export default App
