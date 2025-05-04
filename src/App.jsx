import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import USChinaSimulation from './USChinaSimulation';

function App() {
  const [count, setCount] = useState(0)

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
