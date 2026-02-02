import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData as ChartJsData,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import {
  multipolarScenarios,
  ThreePlayerScenario,
  ThreePlayerPayoff,
  MultiDimensionalPayoff,
  CoalitionStability,
  calculateUtility,
  defaultWeights,
  isNashEquilibrium3P,
  isParetoOptimal3P,
} from './data/multipolarScenarios';
import './css/MultiPolarSimulation.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MultiPolarSimulation: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ThreePlayerScenario>(multipolarScenarios[0]);
  const [usaStrategy, setUsaStrategy] = useState<string>(multipolarScenarios[0].strategies.usa[0].key);
  const [bricsStrategy, setBricsStrategy] = useState<string>(multipolarScenarios[0].strategies.brics[0].key);
  const [euStrategy, setEuStrategy] = useState<string>(multipolarScenarios[0].strategies.eu[0].key);
  const [coalitionStability, setCoalitionStability] = useState<CoalitionStability>(multipolarScenarios[0].initialStability);
  const [currentPayoff, setCurrentPayoff] = useState<ThreePlayerPayoff | null>(null);

  // Update payoff when strategies change
  useEffect(() => {
    const payoff = selectedScenario.payoffMatrix[usaStrategy]?.[bricsStrategy]?.[euStrategy];
    if (payoff) {
      setCurrentPayoff(payoff);
      updateCoalitionStability(payoff);
    }
  }, [selectedScenario, usaStrategy, bricsStrategy, euStrategy]);

  const updateCoalitionStability = (payoff: ThreePlayerPayoff) => {
    // Calculate BRICS unity based on payoff outcomes
    const bricsEconomicImpact = payoff.brics.economic;
    const bricsSecurityImpact = payoff.brics.security;

    // Unity decreases with negative outcomes
    let unityChange = 0;
    if (bricsEconomicImpact < -3) unityChange -= 10;
    if (bricsSecurityImpact < -3) unityChange -= 5;
    if (bricsEconomicImpact > 5) unityChange += 5;

    // EU alignment shifts based on relative benefits
    const usaUtility = calculateUtility(payoff.usa, defaultWeights.usa);
    const bricsUtility = calculateUtility(payoff.brics, defaultWeights.brics);

    let alignmentShift = 0;
    if (usaUtility > bricsUtility + 5) alignmentShift = 10;
    else if (bricsUtility > usaUtility + 5) alignmentShift = -10;

    setCoalitionStability(prev => ({
      bricsUnity: Math.max(0, Math.min(100, prev.bricsUnity + unityChange)),
      euAlignment: Math.max(-100, Math.min(100, prev.euAlignment + alignmentShift)),
      fragmentation: {
        india: Math.max(0, Math.min(100, prev.fragmentation.india + (bricsEconomicImpact < 0 ? 5 : -3))),
        brazil: Math.max(0, Math.min(100, prev.fragmentation.brazil + (bricsEconomicImpact < -2 ? 3 : -2))),
        russia: Math.max(0, Math.min(100, prev.fragmentation.russia + (bricsSecurityImpact < 0 ? 2 : -1))),
        southAfrica: Math.max(0, Math.min(100, prev.fragmentation.southAfrica + (bricsEconomicImpact < -1 ? 4 : -2)))
      }
    }));
  };

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = multipolarScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setUsaStrategy(scenario.strategies.usa[0].key);
      setBricsStrategy(scenario.strategies.brics[0].key);
      setEuStrategy(scenario.strategies.eu[0].key);
      setCoalitionStability(scenario.initialStability);
    }
  };

  const isNash = currentPayoff ? isNashEquilibrium3P(selectedScenario, usaStrategy, bricsStrategy, euStrategy) : false;
  const isPareto = currentPayoff ? isParetoOptimal3P(selectedScenario, usaStrategy, bricsStrategy, euStrategy) : false;

  return (
    <div className="multipolar-simulation">
      <header className="simulation-header">
        <h1>Multipolar Trade War Simulation</h1>
        <p className="subtitle">Three-Player Game Theory Analysis: USA vs BRICS vs EU</p>
      </header>

      {/* Scenario Selection */}
      <section className="scenario-selection">
        <h2>Select Real-World Scenario</h2>
        <div className="scenario-cards">
          {multipolarScenarios.map(scenario => (
            <div
              key={scenario.id}
              className={`scenario-card ${selectedScenario.id === scenario.id ? 'active' : ''}`}
              onClick={() => handleScenarioChange(scenario.id)}
            >
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
            </div>
          ))}
        </div>
        <div className="scenario-context">
          <h3>Context</h3>
          <p>{selectedScenario.context}</p>
        </div>
      </section>

      {/* Strategy Selection */}
      <section className="strategy-selection">
        <div className="player-strategy usa-strategies">
          <h3>🇺🇸 USA Strategy</h3>
          {selectedScenario.strategies.usa.map(strategy => (
            <div
              key={strategy.key}
              className={`strategy-option ${usaStrategy === strategy.key ? 'selected' : ''}`}
              onClick={() => setUsaStrategy(strategy.key)}
            >
              <strong>{strategy.label}</strong>
              <p>{strategy.description}</p>
            </div>
          ))}
        </div>

        <div className="player-strategy brics-strategies">
          <h3>🌐 BRICS Strategy</h3>
          {selectedScenario.strategies.brics.map(strategy => (
            <div
              key={strategy.key}
              className={`strategy-option ${bricsStrategy === strategy.key ? 'selected' : ''}`}
              onClick={() => setBricsStrategy(strategy.key)}
            >
              <strong>{strategy.label}</strong>
              <p>{strategy.description}</p>
            </div>
          ))}
        </div>

        <div className="player-strategy eu-strategies">
          <h3>🇪🇺 EU Strategy</h3>
          {selectedScenario.strategies.eu.map(strategy => (
            <div
              key={strategy.key}
              className={`strategy-option ${euStrategy === strategy.key ? 'selected' : ''}`}
              onClick={() => setEuStrategy(strategy.key)}
            >
              <strong>{strategy.label}</strong>
              <p>{strategy.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coalition Stability Dashboard */}
      <section className="coalition-stability">
        <h2>Coalition Stability Metrics</h2>
        <div className="stability-grid">
          <div className="stability-meter">
            <h4>BRICS Unity</h4>
            <div className="meter-bar">
              <div
                className="meter-fill brics-unity"
                style={{ width: `${coalitionStability.bricsUnity}%` }}
              />
            </div>
            <span className="meter-value">{coalitionStability.bricsUnity}%</span>
            <p className="meter-label">
              {coalitionStability.bricsUnity > 70 ? 'Strong Coalition' :
               coalitionStability.bricsUnity > 40 ? 'Moderate Cohesion' : 'Fragmentation Risk'}
            </p>
          </div>

          <div className="stability-meter">
            <h4>EU Alignment</h4>
            <div className="alignment-scale">
              <span className="scale-label left">BRICS</span>
              <div className="meter-bar alignment">
                <div
                  className="meter-fill eu-alignment"
                  style={{
                    left: `${(coalitionStability.euAlignment + 100) / 2}%`,
                    width: '4px'
                  }}
                />
              </div>
              <span className="scale-label right">USA</span>
            </div>
            <span className="meter-value">
              {coalitionStability.euAlignment > 30 ? 'US-Leaning' :
               coalitionStability.euAlignment < -30 ? 'China-Leaning' : 'Neutral'}
            </span>
          </div>

          <div className="fragmentation-risks">
            <h4>BRICS Fragmentation Risk</h4>
            <div className="fragmentation-list">
              <div className="frag-item">
                <span>🇮🇳 India:</span>
                <div className="frag-bar">
                  <div className="frag-fill" style={{ width: `${coalitionStability.fragmentation.india}%` }} />
                </div>
                <span>{coalitionStability.fragmentation.india}%</span>
              </div>
              <div className="frag-item">
                <span>🇧🇷 Brazil:</span>
                <div className="frag-bar">
                  <div className="frag-fill" style={{ width: `${coalitionStability.fragmentation.brazil}%` }} />
                </div>
                <span>{coalitionStability.fragmentation.brazil}%</span>
              </div>
              <div className="frag-item">
                <span>🇷🇺 Russia:</span>
                <div className="frag-bar">
                  <div className="frag-fill" style={{ width: `${coalitionStability.fragmentation.russia}%` }} />
                </div>
                <span>{coalitionStability.fragmentation.russia}%</span>
              </div>
              <div className="frag-item">
                <span>🇿🇦 South Africa:</span>
                <div className="frag-bar">
                  <div className="frag-fill" style={{ width: `${coalitionStability.fragmentation.southAfrica}%` }} />
                </div>
                <span>{coalitionStability.fragmentation.southAfrica}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payoff Display */}
      {currentPayoff && (
        <section className="payoff-results">
          <h2>Multi-Dimensional Payoffs</h2>
          <div className="payoff-grid">
            <PayoffCard player="USA" payoff={currentPayoff.usa} weights={defaultWeights.usa} />
            <PayoffCard player="BRICS" payoff={currentPayoff.brics} weights={defaultWeights.brics} />
            <PayoffCard player="EU" payoff={currentPayoff.eu} weights={defaultWeights.eu} />
          </div>

          {/* Game Theory Analysis */}
          <div className="game-theory-badges">
            {isNash && (
              <div className="badge nash-badge">
                <strong>⚖️ Nash Equilibrium</strong>
                <p>No player can improve their outcome by unilaterally changing strategy</p>
              </div>
            )}
            {isPareto && (
              <div className="badge pareto-badge">
                <strong>🎯 Pareto Optimal</strong>
                <p>Cannot improve one player without hurting another</p>
              </div>
            )}
            {!isNash && !isPareto && (
              <div className="badge unstable-badge">
                <strong>⚠️ Unstable Equilibrium</strong>
                <p>Players have incentive to deviate from current strategies</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Visualization */}
      {currentPayoff && (
        <section className="visualization-section">
          <h2>Comparative Analysis</h2>
          <div className="charts-grid">
            <div className="chart-container">
              <h3>Dimensional Breakdown</h3>
              <Bar data={generateBarChartData(currentPayoff)} options={barChartOptions} />
            </div>
            <div className="chart-container">
              <h3>Strategic Profile</h3>
              <Radar data={generateRadarData(currentPayoff)} options={radarChartOptions} />
            </div>
          </div>
        </section>
      )}

      {/* Strategic Insights */}
      <section className="strategic-insights">
        <h2>Strategic Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>EU as Swing Voter</h4>
            <p>
              With EU alignment at {coalitionStability.euAlignment.toFixed(0)}, Europe's choice
              determines the balance of power. {coalitionStability.euAlignment > 30
                ? 'Currently leaning toward Western alliance.'
                : coalitionStability.euAlignment < -30
                ? 'Currently hedging toward BRICS cooperation.'
                : 'Maintaining strategic neutrality between both blocs.'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Coalition Stability</h4>
            <p>
              BRICS unity at {coalitionStability.bricsUnity}% indicates {
                coalitionStability.bricsUnity > 70 ? 'strong internal cohesion despite diverse interests.' :
                coalitionStability.bricsUnity > 40 ? 'moderate coordination with potential friction points.' :
                'significant fragmentation risk, especially from India and Brazil.'}
            </p>
          </div>
          <div className="insight-card">
            <h4>Winner Analysis</h4>
            {currentPayoff && (
              <p>
                {getWinnerAnalysis(currentPayoff)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Glossary */}
      <section className="glossary-section">
        <h2>Key Concepts</h2>
        <div className="glossary-grid">
          <div className="glossary-item">
            <strong>Nash Equilibrium (3-Player):</strong>
            <p>A strategy combination where no player can improve their payoff by unilaterally changing their strategy, given others' choices.</p>
          </div>
          <div className="glossary-item">
            <strong>Pareto Optimality:</strong>
            <p>An outcome where improving one player's position requires making another worse off.</p>
          </div>
          <div className="glossary-item">
            <strong>Coalition Stability:</strong>
            <p>Measures internal cohesion of BRICS alliance and likelihood of fragmentation under strategic pressure.</p>
          </div>
          <div className="glossary-item">
            <strong>Swing Voter:</strong>
            <p>EU acts as the decisive third player whose alignment determines which bloc achieves dominance.</p>
          </div>
          <div className="glossary-item">
            <strong>Multi-Dimensional Payoff:</strong>
            <p>Outcomes measured across 5 dimensions: Economic, Security, Technology, Resources, Diplomatic influence.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper component for displaying payoffs
const PayoffCard: React.FC<{
  player: string;
  payoff: MultiDimensionalPayoff;
  weights: { economic: number; security: number; technology: number; resources: number; diplomatic: number };
}> = ({ player, payoff, weights }) => {
  const utility = calculateUtility(payoff, weights);
  const dimensions = [
    { label: 'Economic', value: payoff.economic, icon: '💰' },
    { label: 'Security', value: payoff.security, icon: '🛡️' },
    { label: 'Technology', value: payoff.technology, icon: '💻' },
    { label: 'Resources', value: payoff.resources, icon: '⚡' },
    { label: 'Diplomatic', value: payoff.diplomatic, icon: '🤝' }
  ];

  return (
    <div className={`payoff-card ${player.toLowerCase()}-card`}>
      <h3>{player}</h3>
      <div className="utility-score">
        <span className="utility-label">Overall Utility:</span>
        <span className={`utility-value ${utility >= 0 ? 'positive' : 'negative'}`}>
          {utility.toFixed(2)}
        </span>
      </div>
      <div className="dimensions-list">
        {dimensions.map(dim => (
          <div key={dim.label} className="dimension-row">
            <span className="dimension-icon">{dim.icon}</span>
            <span className="dimension-label">{dim.label}:</span>
            <div className="dimension-bar">
              <div
                className={`dimension-fill ${dim.value >= 0 ? 'positive' : 'negative'}`}
                style={{
                  width: `${Math.abs(dim.value) * 10}%`,
                  marginLeft: dim.value < 0 ? `${100 - Math.abs(dim.value) * 10}%` : '0'
                }}
              />
            </div>
            <span className={`dimension-value ${dim.value >= 0 ? 'positive' : 'negative'}`}>
              {dim.value > 0 ? '+' : ''}{dim.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Chart data generation
const generateBarChartData = (payoff: ThreePlayerPayoff): ChartJsData<'bar'> => {
  return {
    labels: ['Economic', 'Security', 'Technology', 'Resources', 'Diplomatic'],
    datasets: [
      {
        label: 'USA',
        data: [payoff.usa.economic, payoff.usa.security, payoff.usa.technology, payoff.usa.resources, payoff.usa.diplomatic],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'BRICS',
        data: [payoff.brics.economic, payoff.brics.security, payoff.brics.technology, payoff.brics.resources, payoff.brics.diplomatic],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: 'EU',
        data: [payoff.eu.economic, payoff.eu.security, payoff.eu.technology, payoff.eu.resources, payoff.eu.diplomatic],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      }
    ]
  };
};

const generateRadarData = (payoff: ThreePlayerPayoff): ChartJsData<'radar'> => {
  return {
    labels: ['Economic', 'Security', 'Technology', 'Resources', 'Diplomatic'],
    datasets: [
      {
        label: 'USA',
        data: [payoff.usa.economic, payoff.usa.security, payoff.usa.technology, payoff.usa.resources, payoff.usa.diplomatic],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'BRICS',
        data: [payoff.brics.economic, payoff.brics.security, payoff.brics.technology, payoff.brics.resources, payoff.brics.diplomatic],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2
      },
      {
        label: 'EU',
        data: [payoff.eu.economic, payoff.eu.security, payoff.eu.technology, payoff.eu.resources, payoff.eu.diplomatic],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      }
    ]
  };
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      min: -10,
      max: 10
    }
  },
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
};

const radarChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      beginAtZero: true,
      min: -10,
      max: 10
    }
  },
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
};

const getWinnerAnalysis = (payoff: ThreePlayerPayoff): string => {
  const utilities = {
    usa: calculateUtility(payoff.usa, defaultWeights.usa),
    brics: calculateUtility(payoff.brics, defaultWeights.brics),
    eu: calculateUtility(payoff.eu, defaultWeights.eu)
  };

  const winner = Object.entries(utilities).reduce((a, b) => a[1] > b[1] ? a : b);
  const loser = Object.entries(utilities).reduce((a, b) => a[1] < b[1] ? a : b);

  return `${winner[0].toUpperCase()} achieves the highest overall utility (${winner[1].toFixed(2)}), while ${loser[0].toUpperCase()} suffers most (${loser[1].toFixed(2)}). The ${Math.abs(utilities.usa - utilities.brics) < 2 ? 'closely matched' : 'divergent'} outcomes suggest ${Math.abs(utilities.usa - utilities.brics) < 2 ? 'a near-stalemate with potential for negotiation.' : 'clear strategic advantage for one bloc.'}`;
};

export default MultiPolarSimulation;
