import React from 'react';
import { useNavigate } from 'react-router-dom'; // Added import for useNavigate
import './HomePageBanner.css';

const HomePageBanner: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="homepage-banner">
      <div className="banner-left">
        <img src={"images/TradeWarX-logo-nobg.png"} alt="Trade War X Logo" className="banner-logo" />
        <button onClick={() => { navigate('/vqm-TradeWarX/US-China') }}>US-China Simulation</button> {/* Added button */}
      </div>
      <div className="banner-right scrollable-content"> {/* Replaced inline styles with class */}
        <h1 className="banner-title">Trade War X</h1> {/* Moved title here */}
        <h2 className="banner-subtitle">US-China Trade War Game Theory Simulator</h2> {/* Added subtitle */}
        <p className="banner-description">
          Trade War X is an interactive web-based simulation platform that applies <span className="banner-highlight">game theory</span> to analyze and visualize strategic scenarios of the ongoing <span className="banner-highlight">US-China trade war</span>. Users can dynamically explore various <span className="banner-highlight">trade strategies</span>, examine <span className="banner-highlight">payoffs</span>, and understand <span className="banner-highlight">equilibrium outcomes</span>, offering deep insights into <span className="banner-highlight">international economic conflicts</span> through an engaging and educational experience.
        </p>
        <ul className="banner-features">
          <li><span className="banner-highlight">Interactive payoff matrices</span> and strategic scenario simulations.</li>
          <li>Real-time <span className="banner-highlight">Nash Equilibrium</span> and <span className="banner-highlight">Pareto Optimal</span> visualizations.</li>
          <li>Educational resources covering fundamental <span className="banner-highlight">game theory concepts</span>.</li>
          <li>Scenario customization to analyze <span className="banner-highlight">real-world trade policy decisions</span>.</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePageBanner;
