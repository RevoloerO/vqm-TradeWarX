import React from 'react';
import './css/HomePage.css'; // Import the dedicated CSS file
import { useNavigate } from 'react-router-dom';

// Icon component remains the same
const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="arrow-right-icon"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// Checkmark icon for the features list
const CheckmarkIcon = () => (
    <svg className="checkmark-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// Main HomePage Component
function HomePage() {
    const navigate = useNavigate();
  // Navigation logic placeholder
  const handleNavigate = () => {
    console.log("Navigating to US-China Simulation...");
    navigate('/vqm-TradeWarX/US-China')
  };

  const features = [
    "Interactive payoff matrices and strategic scenario simulations.",
    "Real-time Nash Equilibrium and Pareto Optimal visualizations.",
    "Educational resources covering fundamental game theory concepts.",
    "Scenario customization to analyze real-world trade policy decisions.",
  ];

  return (
    <div className="homepage-body">
      <div className="homepage-container">
        <div className="main-content-wrapper">
          {/* Decorative background shapes */}
          <div className="blob-1"></div>
          <div className="blob-2"></div>
          <div className="blob-3"></div>

          <div className="card">
            <div className="card-grid">

              {/* Left Section: Logo and CTA */}
              <div className="card-left">
                <div className="logo-container">
                
                  <img
                    src={"images/TradeWarX-logo-nobg.png"}
                    alt="Trade War X Logo"
                    className="logo-image"
                    onError={(e) => { e.target.onerror = null; e.target.src="images/TradeWarX-logo-nobg.png"; }}
                  />
                </div>
                <h2 className="card-left-title">
                  Begin the Simulation
                </h2>
                <p className="card-left-subtitle">
                  Step into the world of strategic trade and diplomacy.
                </p>
                <button
                  onClick={handleNavigate}
                  className="cta-button"
                >
                  Launch US-China Simulation
                  <ArrowRightIcon />
                </button>
              </div>

              {/* Right Section: Content */}
              <div className="card-right">
                <h1 className="main-title">
                  Trade War <span className="title-accent">X</span>
                </h1>
                <h2 className="main-subtitle">
                  A Game Theory Simulator for the US-China Trade War
                </h2>
                <p className="description">
                  Trade War X is an interactive platform applying{' '}
                  <span className="description-highlight">game theory</span> to visualize the strategic scenarios of the{' '}
                  <span className="description-highlight">US-China trade war</span>. Explore strategies, payoffs, and equilibrium outcomes in an engaging, educational experience.
                </p>
                <div className="features-section">
                  <h3 className="features-title">Key Features:</h3>
                  <ul className="features-list">
                    {features.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <CheckmarkIcon />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
