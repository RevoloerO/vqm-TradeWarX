import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OutcomeCharts from './OutcomeCharts';

// Constants
const strategyOptions = ['Aggressive', 'Moderate', 'Passive'];
const scenarioOptions = ["Tech Decoupling", "Rare Earth Embargo", "Global Alliance Expansion"];
const glossaryTerms = [
    { term: 'Nash Equilibrium', definition: 'A situation where no player can benefit by changing strategies unilaterally.' },
    { term: 'Pareto Optimality', definition: 'An outcome where no player can be made better off without making another worse off.' },
    { term: 'Game Theory', definition: 'The study of mathematical models of strategic interactions among rational agents.' }
];

// Component
function USChinaSimulation() {
    const navigate = useNavigate();
    const [scenario, setScenario] = useState(null);
    const [usStrategy, setUsStrategy] = useState(null);
    const [chinaStrategy, setChinaStrategy] = useState(null);
    const [payoffMatrix, setPayoffMatrix] = useState([]);
    const [scenarioContext, setScenarioContext] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [chartData, setChartData] = useState(null);

    // Utility Functions
    const generatePayoffMatrix = (scenario) => examplePayoffMatrix;
    const isNashEquilibrium = (matrix, row, col) => false; // Placeholder logic
    const isParetoOptimal = (matrix, row, col) => false; // Placeholder logic

    const updateMatrixCell = (rowIndex, colIndex, role, value) => {
        setPayoffMatrix((prevMatrix) => {
            const updatedMatrix = [...prevMatrix];
            updatedMatrix[rowIndex][colIndex] = {
                ...updatedMatrix[rowIndex][colIndex],
                [role]: value
            };
            return updatedMatrix;
        });
    };

    const prepareChartData = (matrix, selections) => {
        const { usStrategy, chinaStrategy } = selections;
        return {
            labels: ['US Payoff', 'China Payoff'],
            datasets: [
                {
                    label: 'Payoff Summary',
                    data: [
                        matrix[usStrategy]?.[chinaStrategy]?.us || 0,
                        matrix[usStrategy]?.[chinaStrategy]?.china || 0
                    ],
                    backgroundColor: ['#4caf50', '#2196f3']
                }
            ]
        };
    };

    const loadScenarioPayoffMatrix = (selectedScenario) => {
        switch (selectedScenario) {
            case "Tech Decoupling":
                return [
                    [{ us: 3, china: 2 }, { us: 1, china: 1 }, { us: 0, china: 3 }],
                    [{ us: 2, china: 3 }, { us: 1, china: 1 }, { us: 3, china: 0 }],
                    [{ us: 1, china: 1 }, { us: 2, china: 2 }, { us: 0, china: 0 }]
                ];
            case "Rare Earth Embargo":
                return [
                    [{ us: 2, china: 1 }, { us: 3, china: 0 }, { us: 1, china: 2 }],
                    [{ us: 0, china: 3 }, { us: 1, china: 1 }, { us: 2, china: 2 }],
                    [{ us: 1, china: 2 }, { us: 0, china: 3 }, { us: 3, china: 0 }]
                ];
            case "Global Alliance Expansion":
                return [
                    [{ us: 1, china: 1 }, { us: 2, china: 2 }, { us: 3, china: 0 }],
                    [{ us: 2, china: 2 }, { us: 1, china: 1 }, { us: 0, china: 3 }],
                    [{ us: 3, china: 0 }, { us: 1, china: 1 }, { us: 2, china: 2 }]
                ];
            default:
                return [];
        }
    };

    const loadScenarioContext = (selectedScenario) => {
        switch (selectedScenario) {
            case "Tech Decoupling":
                return "A scenario where the U.S. and China decouple their technology sectors.";
            case "Rare Earth Embargo":
                return "A scenario where China imposes an embargo on rare earth exports.";
            case "Global Alliance Expansion":
                return "A scenario where the U.S. and China compete for global alliances.";
            default:
                return "";
        }
    };

    // Render Functions
    const renderScenarioSelector = () => (
        <div className="card">
            <h3>Select Scenario</h3>
            <select
                className="dropdown"
                value={scenario || ''}
                onChange={(e) => setScenario(e.target.value)}
            >
                <option value="" disabled>Select Scenario</option>
                {scenarioOptions.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {scenarioContext && <div className="context"><p>{scenarioContext}</p></div>}
        </div>
    );

    const renderStrategySelector = () => (
        <div className="card">
            <h3>Select Strategies</h3>
            <div className="strategy-group">
                <div>
                    <h4>U.S. Strategy</h4>
                    {strategyOptions.map((option) => (
                        <button
                            key={option}
                            className={`strategy-button ${usStrategy === option ? 'selected' : ''}`}
                            onClick={() => setUsStrategy(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div>
                    <h4>China Strategy</h4>
                    {strategyOptions.map((option) => (
                        <button
                            key={option}
                            className={`strategy-button ${chinaStrategy === option ? 'selected' : ''}`}
                            onClick={() => setChinaStrategy(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMatrix = (matrix) => (
        <div className="card">
            <h3>Payoff Matrix</h3>
            <table className="matrix-table">
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`matrix-cell ${
                                        isNashEquilibrium(matrix, rowIndex, colIndex) ? 'nash' : ''
                                    } ${
                                        isParetoOptimal(matrix, rowIndex, colIndex) ? 'pareto' : ''
                                    }`}
                                    onClick={() => handleStrategySelection(rowIndex, colIndex)}
                                >
                                    US: {cell.us}, China: {cell.china}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderEditableMatrix = (matrix) => (
        <div className="card">
            <h3>Edit Payoff Matrix</h3>
            <table className="matrix-table">
                <tbody>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex}>
                                    <div>
                                        <label>US:</label>
                                        <input
                                            type="number"
                                            value={cell.us}
                                            onChange={(e) =>
                                                updateMatrixCell(rowIndex, colIndex, 'us', parseInt(e.target.value, 10))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label>China:</label>
                                        <input
                                            type="number"
                                            value={cell.china}
                                            onChange={(e) =>
                                                updateMatrixCell(rowIndex, colIndex, 'china', parseInt(e.target.value, 10))
                                            }
                                        />
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderGlossaryPanel = () => (
        <div className="card">
            <h3>Glossary</h3>
            <ul>
                {glossaryTerms.map((entry, index) => (
                    <li key={index}>
                        <strong>{entry.term}:</strong> {entry.definition}
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderRecommendations = () => (
        <div className="card">
            <h3>Recommendations</h3>
            <ul>
                {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
            </ul>
        </div>
    );

    // Effects
    useEffect(() => {
        if (scenario) {
            const matrix = loadScenarioPayoffMatrix(scenario);
            setPayoffMatrix(matrix);
            const context = loadScenarioContext(scenario);
            setScenarioContext(context);
        }
    }, [scenario]);

    useEffect(() => {
        if (usStrategy && chinaStrategy) {
            const matrix = generatePayoffMatrix({ usStrategy, chinaStrategy });
            setPayoffMatrix(matrix);
        }
    }, [usStrategy, chinaStrategy]);

    useEffect(() => {
        if (payoffMatrix.length && usStrategy !== null && chinaStrategy !== null) {
            const data = prepareChartData(payoffMatrix, { usStrategy, chinaStrategy });
            setChartData(data);
        }
    }, [payoffMatrix, usStrategy, chinaStrategy]);

    useEffect(() => {
        if (usStrategy && chinaStrategy) {
            const newRecommendations = [];
            if (usStrategy === 'Aggressive' && chinaStrategy === 'Passive') {
                newRecommendations.push('The U.S. may dominate in the short term, but risks long-term retaliation.');
            }
            if (usStrategy === 'Moderate' && chinaStrategy === 'Moderate') {
                newRecommendations.push('Both nations may achieve balanced outcomes with minimal conflict.');
            }
            if (usStrategy === 'Passive' && chinaStrategy === 'Aggressive') {
                newRecommendations.push('China may gain an upper hand, but risks overextension.');
            }
            setRecommendations(newRecommendations);
        }
    }, [usStrategy, chinaStrategy]);

    // Main Render
    return (
        <div className="container">
            <header className="header">
                <h1>US-China Simulation</h1>
                <button className="home-button" onClick={() => navigate('/vqm-TradeWarX/')}>Home</button>
            </header>
            <main className="main-content">
                {renderScenarioSelector()}
                {renderStrategySelector()}
                {renderMatrix(payoffMatrix)}
                {renderEditableMatrix(payoffMatrix)}
                {payoffMatrix ? <OutcomeCharts matrix={payoffMatrix} selections={{ us: usStrategy, china: chinaStrategy }} /> : null}
                {renderGlossaryPanel()}
                {renderRecommendations()}
            </main>
        </div>
    );
}

export default USChinaSimulation;